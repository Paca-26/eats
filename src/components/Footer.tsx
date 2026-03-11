import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import logoMo from "@/assets/logo-mo-alimenta.jpg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Sobre */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoMo} alt="Mmm" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-display text-xl font-bold">Mmm</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm font-body">
              O Shopping Digital Alimentar de Angola. Supermercados, talhos, peixarias e restaurantes num só lugar.
            </p>
          </div>

          {/* Explorar */}
          <div>
            <h4 className="font-display font-semibold mb-4">Explorar</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70 font-body">
              <li><Link to="/categorias" className="hover:text-accent transition-colors">Categorias</Link></li>
              <li><Link to="/pesquisar" className="hover:text-accent transition-colors">Lojas</Link></li>
              <li><Link to="/promocoes" className="hover:text-accent transition-colors">Promoções</Link></li>
            </ul>
          </div>

          {/* Suporte */}
          <div>
            <h4 className="font-display font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70 font-body">
              <li><Link to="/ajuda" className="hover:text-accent transition-colors">Ajuda</Link></li>
              <li><Link to="/contacto" className="hover:text-accent transition-colors">Contacto</Link></li>
              <li><Link to="/termos" className="hover:text-accent transition-colors">Termos</Link></li>
              <li><Link to="/privacidade" className="hover:text-accent transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          {/* Contactos */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contactos</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70 font-body">
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <a href="mailto:geral@mmm.ao" className="hover:text-accent transition-colors">geral@mmm.ao</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <a href="tel:+244923456789" className="hover:text-accent transition-colors">+244 923 456 789</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <a href="https://wa.me/244923456789" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">WhatsApp</a>
              </li>
            </ul>
          </div>

          {/* Morada & Horário */}
          <div>
            <h4 className="font-display font-semibold mb-4">Onde Estamos</h4>
            <ul className="space-y-3 text-sm text-primary-foreground/70 font-body">
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>Rua da Missão, nº 45<br />Ingombota, Luanda — Angola</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <span>Seg – Sex: 08h – 20h<br />Sáb: 09h – 18h</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-sm text-primary-foreground/50 font-body">
          © 2026 Mmm. Todos os direitos reservados. Logística por K.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
