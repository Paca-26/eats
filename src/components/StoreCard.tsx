import { Star, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StoreCardProps {
  name: string;
  category: string;
  rating: number;
  deliveryTime: string;
  zone: string;
  featured?: boolean;
  image: string;
}

const StoreCard = ({ name, category, rating, deliveryTime, zone, featured, image }: StoreCardProps) => {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-border">
      <div className="relative h-40 overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        {featured && (
          <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground border-0 text-xs">
            ⭐ Destaque
          </Badge>
        )}
      </div>
      <div className="p-4 space-y-2">
        <h3 className="font-display text-lg font-semibold text-card-foreground">{name}</h3>
        <p className="text-sm text-muted-foreground font-body">{category}</p>
        <div className="flex items-center justify-between text-sm font-body">
          <div className="flex items-center gap-1 text-accent">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-medium">{rating}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>{deliveryTime}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{zone}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
