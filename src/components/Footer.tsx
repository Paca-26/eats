import { Link } from "react-router-dom";
import logoMo from "@/assets/logo-mo-alimenta.jpg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoMo} alt="Mmm" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-display text-xl font-bold">Mmm</span>
            </Link>
            <p className="text-primary-foreground/70 text-sm font-body">
              O Shopping Digital Alimentar de Angola. Supermercados, talhos, peixarias e restaurantes num só lugar.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Explorar</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70 font-body">
              <li><Link to="/categorias" className="hover:text-accent transition-colors">Categorias</Link></li>
              <li><Link to="/pesquisar" className="hover:text-accent transition-colors">Lojas</Link></li>
              <li><Link to="/categoria/restaurantes" className="hover:text-accent transition-colors">Restaurantes</Link></li>
              <li><Link to="/promocoes" className="hover:text-accent transition-colors">Promoções</Link></li>
            </ul>
          </div>


          <div>
            <h4 className="font-display font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70 font-body">
              <li><Link to="/ajuda" className="hover:text-accent transition-colors">Ajuda</Link></li>
              <li><Link to="/contacto" className="hover:text-accent transition-colors">Contacto</Link></li>
              <li><Link to="/termos" className="hover:text-accent transition-colors">Termos</Link></li>
              <li><Link to="/privacidade" className="hover:text-accent transition-colors">Privacidade</Link></li>
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
