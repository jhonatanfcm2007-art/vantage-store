export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 bg-[#030303]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="brand-serif text-xl tracking-[0.4em] text-white/40">VANTAGE</span>

        <div className="flex gap-8">
          {['Privacidad', 'Devoluciones', 'Envíos', 'Términos'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-[10px] tracking-[0.2em] uppercase text-white/20 hover:text-white/60 transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        <p className="text-[10px] text-white/15 tracking-widest uppercase">
          © {new Date().getFullYear()} Vantage Store
        </p>
      </div>
    </footer>
  );
}
