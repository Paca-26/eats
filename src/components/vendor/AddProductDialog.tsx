import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, X } from "lucide-react";
import { toast } from "sonner";

export interface Product {
  name: string;
  price: string;
  category: string;
  stock: number;
  active: boolean;
  description?: string;
}

interface AddProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (product: Product) => void;
  editProduct?: Product | null;
}

const categories = ["Pratos", "Bebidas", "Entradas", "Sobremesas", "Acompanhamentos"];

const AddProductDialog = ({ open, onOpenChange, onAdd, editProduct }: AddProductDialogProps) => {
  const [name, setName] = useState(editProduct?.name || "");
  const [price, setPrice] = useState(editProduct?.price?.replace(/[^\d]/g, "") || "");
  const [category, setCategory] = useState(editProduct?.category || "Pratos");
  const [stock, setStock] = useState(editProduct?.stock?.toString() || "0");
  const [description, setDescription] = useState(editProduct?.description || "");

  const resetForm = () => {
    setName("");
    setPrice("");
    setCategory("Pratos");
    setStock("0");
    setDescription("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Insira o nome do produto");
      return;
    }
    if (!price.trim() || isNaN(Number(price))) {
      toast.error("Insira um preço válido");
      return;
    }

    const formattedPrice = `${Number(price).toLocaleString("pt-AO")} Kz`;

    onAdd({
      name: name.trim(),
      price: formattedPrice,
      category,
      stock: parseInt(stock) || 0,
      active: true,
      description: description.trim(),
    });

    toast.success(editProduct ? "Produto atualizado!" : "Produto adicionado com sucesso!");
    resetForm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="rounded-2xl max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {editProduct ? "Editar Produto" : "Novo Produto"}
          </DialogTitle>
          <DialogDescription className="font-body text-sm">
            {editProduct ? "Atualize os dados do produto." : "Preencha os dados para adicionar um novo produto."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="text-xs font-body font-medium text-muted-foreground block mb-1.5">Nome do Produto *</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Frango Grelhado"
              className="rounded-xl font-body"
              maxLength={100}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-body font-medium text-muted-foreground block mb-1.5">Preço (Kz) *</label>
              <Input
                value={price}
                onChange={(e) => setPrice(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="2500"
                className="rounded-xl font-body"
                inputMode="numeric"
              />
            </div>
            <div>
              <label className="text-xs font-body font-medium text-muted-foreground block mb-1.5">Stock</label>
              <Input
                value={stock}
                onChange={(e) => setStock(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="0"
                className="rounded-xl font-body"
                inputMode="numeric"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-body font-medium text-muted-foreground block mb-1.5">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all ${
                    category === cat
                      ? "bg-accent text-accent-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-body font-medium text-muted-foreground block mb-1.5">Descrição (opcional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição do produto..."
              className="flex w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-body ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[72px] resize-none"
              maxLength={300}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => { resetForm(); onOpenChange(false); }}
              className="flex-1 rounded-xl h-11 font-body gap-2"
            >
              <X className="h-4 w-4" /> Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 rounded-xl h-11 font-body gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white"
            >
              <Save className="h-4 w-4" /> {editProduct ? "Guardar" : "Adicionar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
