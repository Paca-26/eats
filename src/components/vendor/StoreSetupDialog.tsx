import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X, MapPin } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ImageUpload from "./ImageUpload";

interface StoreSetupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  userId: string;
}

const StoreSetupDialog = ({ open, onOpenChange, onCreated, userId }: StoreSetupDialogProps) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error("Insira o nome da loja"); return; }
    if (!address.trim()) { toast.error("Insira a localização"); return; }

    setSaving(true);
    const { error } = await supabase.from("stores").insert({
      name: name.trim(),
      address: address.trim(),
      phone: phone.trim() || null,
      description: description.trim() || null,
      logo_url: logoUrl || null,
      cover_url: coverUrl || null,
      owner_id: userId,
    });

    setSaving(false);
    if (error) {
      toast.error("Erro ao criar loja: " + error.message);
      return;
    }

    toast.success("Loja criada com sucesso!");
    onCreated();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Criar Loja</DialogTitle>
          <DialogDescription className="font-body text-sm">Preencha os dados da sua loja.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-body font-medium text-muted-foreground block mb-1.5">Foto de capa</label>
            <ImageUpload bucket="store-images" folder={userId} currentUrl={coverUrl} onUploaded={setCoverUrl} aspectRatio="wide" />
          </div>

          <div>
            <label className="text-xs font-body font-medium text-muted-foreground block mb-1.5">Logo da loja</label>
            <ImageUpload bucket="store-images" folder={userId} currentUrl={logoUrl} onUploaded={setLogoUrl} aspectRatio="square" />
          </div>

          <div>
            <label className="text-xs font-body font-medium text-muted-foreground block mb-1.5">Nome da Loja *</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Restaurante Sabor Angolano" className="rounded-xl font-body" maxLength={100} />
          </div>

          <div>
            <label className="text-xs font-body font-medium text-muted-foreground block mb-1.5">Localização *</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Ex: Rua Principal, Maianga, Luanda" className="rounded-xl font-body pl-9" maxLength={200} />
            </div>
          </div>

          <div>
            <label className="text-xs font-body font-medium text-muted-foreground block mb-1.5">Telefone</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+244 9XX XXX XXX" className="rounded-xl font-body" />
          </div>

          <div>
            <label className="text-xs font-body font-medium text-muted-foreground block mb-1.5">Descrição (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva a sua loja..."
              className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-body ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[72px] resize-none"
              maxLength={300}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 rounded-xl h-11 font-body gap-2">
              <X className="h-4 w-4" /> Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="flex-1 rounded-xl h-11 font-body gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Save className="h-4 w-4" /> {saving ? "Criando..." : "Criar Loja"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StoreSetupDialog;
