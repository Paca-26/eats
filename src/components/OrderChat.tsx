import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, MessageCircle } from "lucide-react";
import { sendNotification, notifyAdmins } from "@/lib/notifications";

const sb = supabase as any;

type Message = {
  id: string;
  order_id: string;
  sender_id: string;
  sender_role: string;
  message: string;
  created_at: string;
};

interface OrderChatProps {
  orderId: string;
  currentUserId: string;
  currentUserRole: "client" | "store" | "admin";
  /** Optional context for sending notifications when sender writes */
  customerId?: string;
  storeOwnerId?: string;
  storeName?: string;
}

const roleLabel: Record<string, string> = {
  client: "Cliente",
  store: "Loja",
  admin: "Admin",
};

const roleColor: Record<string, string> = {
  client: "bg-emerald-100 text-emerald-800",
  store: "bg-amber-100 text-amber-800",
  admin: "bg-purple-100 text-purple-800",
};

const OrderChat = ({
  orderId,
  currentUserId,
  currentUserRole,
  customerId,
  storeOwnerId,
  storeName,
}: OrderChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const { data, error } = await sb
        .from("order_messages")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });
      if (!cancelled) {
        if (!error && data) setMessages(data as Message[]);
        setLoading(false);
      }
    };
    load();

    const channel = sb
      .channel(`order-messages-${orderId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "order_messages", filter: `order_id=eq.${orderId}` },
        (payload: { new: Message }) => {
          setMessages((prev) =>
            prev.some((m) => m.id === payload.new.id) ? prev : [...prev, payload.new]
          );
        }
      )
      .subscribe();

    return () => {
      cancelled = true;
      sb.removeChannel(channel);
    };
  }, [orderId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [messages.length]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setSending(true);
    const { error } = await sb.from("order_messages").insert({
      order_id: orderId,
      sender_id: currentUserId,
      sender_role: currentUserRole,
      message: trimmed,
    });
    if (!error) {
      setText("");
      // Fire notifications to other parties
      const senderLabel = roleLabel[currentUserRole] || "Utilizador";
      const title = `Nova mensagem em encomenda`;
      const body = `${senderLabel}${storeName ? ` (${storeName})` : ""}: ${trimmed.slice(0, 80)}`;
      try {
        if (currentUserRole === "client") {
          if (storeOwnerId) await sendNotification({ userId: storeOwnerId, title, message: body, type: "order_message", orderId });
          await notifyAdmins({ title, message: body, type: "order_message", orderId });
        } else if (currentUserRole === "store") {
          if (customerId) await sendNotification({ userId: customerId, title, message: body, type: "order_message", orderId });
          await notifyAdmins({ title, message: body, type: "order_message", orderId });
        } else if (currentUserRole === "admin") {
          if (customerId) await sendNotification({ userId: customerId, title, message: body, type: "order_message", orderId });
          if (storeOwnerId) await sendNotification({ userId: storeOwnerId, title, message: body, type: "order_message", orderId });
        }
      } catch (err) {
        console.error("Notify error", err);
      }
    }
    setSending(false);
  };

  return (
    <div className="border border-border rounded-xl bg-background flex flex-col overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        <MessageCircle className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">Conversa da encomenda</span>
      </div>
      <div className="max-h-64 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-4">
            Sem mensagens. Inicie a conversa abaixo.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.sender_id === currentUserId;
            return (
              <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-lg px-3 py-2 ${mine ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${roleColor[m.sender_role] || "bg-gray-100 text-gray-700"}`}>
                      {roleLabel[m.sender_role] || m.sender_role}
                    </span>
                    <span className={`text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {new Date(m.created_at).toLocaleString("pt-PT", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap break-words">{m.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
      <form onSubmit={handleSend} className="flex gap-2 p-2 border-t border-border bg-muted/20">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva uma mensagem..."
          disabled={sending}
          maxLength={500}
        />
        <Button type="submit" size="sm" disabled={sending || !text.trim()}>
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  );
};

export default OrderChat;
