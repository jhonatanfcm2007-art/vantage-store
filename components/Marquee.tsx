// Marquee de texto con branding
export default function Marquee() {
  const items = [
    'Diseño Sin Compromiso',
    '★',
    'Movimiento de Cuarzo Suizo',
    '★',
    'Entrega a Todo Colombia',
    '★',
    'Garantía 2 Años',
    '★',
    'Relojería Premium',
    '★',
    'Domina el Tiempo',
    '★',
  ];

  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden py-4 border-y border-white/5 bg-[#0A0A0A]">
      <div className="marquee-inner flex gap-12 whitespace-nowrap" style={{ width: 'max-content' }}>
        {doubled.map((item, i) => (
          <span
            key={i}
            className={`text-[10px] tracking-[0.3em] uppercase ${
              item === '★' ? 'text-[var(--gold)]' : 'text-white/25'
            }`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
