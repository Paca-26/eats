import logoMo from "@/assets/logo-mo-alimenta.jpg";

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logoMo} alt="Mo Alimenta" className="h-10 w-10 rounded-full object-cover" />
              <span className="font-display text-xl font-bold">Mo Alimenta</span>
            </div>
            <p className="text-primary-foreground/70 text-sm font-body">
              O Shopping Digital Alimentar de Angola. Supermercados, talhos, peixarias e restaurantes num só lugar.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Explorar</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70 font-body">
              <li className="hover:text-accent cursor-pointer transition-colors">Categorias</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Lojas</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Restaurantes</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Promoções</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Para Lojas</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70 font-body">
              <li className="hover:text-accent cursor-pointer transition-colors">Vender na Plataforma</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Painel do Vendedor</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Comissões</li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Suporte</h4>
            <ul className="space-y-2 text-sm text-primary-foreground/70 font-body">
              <li className="hover:text-accent cursor-pointer transition-colors">Ajuda</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Contacto</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Termos</li>
              <li className="hover:text-accent cursor-pointer transition-colors">Privacidade</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-sm text-primary-foreground/50 font-body">
          © 2026 Mo Alimenta. Todos os direitos reservados. Logística por K.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
