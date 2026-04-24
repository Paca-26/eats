import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, Truck } from "lucide-react";
import { sendNotification, notifyAdmins } from "@/lib/notifications";

const sb = supabase as any;

type Message = {
  id: string;
  order_id: string;
  sender_id: string;
  sender_role: "admin" | "logistics";
  message: string;
  created_at: string;
};

interface LogisticsChatProps {
  orderId: string;
  currentUserId: string;
  currentUserRole: "admin" | "logistics";
  /** When admin is writing, target courier id to notify */
  logisticsId?: string | null;
}

const roleLabel: Record<string, string> = {
  admin: "Admin",
  logistics: "Transportador",
};

const roleColor: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800",
  logistics: "bg-blue-100 text-blue-800",
};

const LogisticsChat = ({
  orderId,
  currentUserId,
  currentUserRole,
  logisticsId,
}: LogisticsChatProps) => {
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
        .from("logistics_messages")
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
      .channel(`logistics-messages-${orderId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "logistics_messages", filter: `order_id=eq.${orderId}` },
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
    const { error } = await sb.from("logistics_messages").insert({
      order_id: orderId,
      sender_id: currentUserId,
      sender_role: currentUserRole,
      message: trimmed,
    });
    if (!error) {
      setText("");
      const senderLabel = roleLabel[currentUserRole] || "Utilizador";
      const title = `Nova mensagem de logística`;
      const body = `${senderLabel}: ${trimmed.slice(0, 80)}`;
      try {
        if (currentUserRole === "admin" && logisticsId) {
          await sendNotification({ userId: logisticsId, title, message: body, type: "logistics_message", orderId });
        } else if (currentUserRole === "logistics") {
          await notifyAdmins({ title, message: body, type: "logistics_message", orderId });
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
        <Truck className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">Chat privado Admin ⇄ Transportador</span>
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

export default LogisticsChat;
