// Sección de características con efecto reveal
export default function Features() {
  const features = [
    {
      number: '01',
      title: 'Esfera Árabe Azul Glaciar',
      description:
        'Los numerales árabes grabados sobre una esfera azul glaciar crean un contraste visual único. Inspirado en piezas de colección disponibles sólo para los más exigentes.',
    },
    {
      number: '02',
      title: 'Acero Inoxidable 316L',
      description:
        'La correa y la caja están fabricadas en acero quirúrgico de grado 316L, el mismo utilizado en joyería de alta gama. Resistente a arañazos, corrosión y al paso del tiempo.',
    },
    {
      number: '03',
      title: 'Movimiento de Cuarzo Preciso',
      description:
        'Motor de cuarzo japonés con precisión de ±15 segundos al mes. Fiabilidad comprobada en cada condición del entorno.',
    },
    {
      number: '04',
      title: 'Función Luminosa Nocturna',
      description:
        'Manecillas y marcadores con revestimiento luminoso SuperLuminova. Leer la hora a oscuras es parte de la experiencia VANTAGE.',
    },
  ];

  return (
    <section id="colección" className="py-24 md:py-36 bg-[#060606]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--ice)] mb-4">
              Ingeniería & Diseño
            </p>
            <h2 className="brand-serif text-4xl md:text-6xl text-white">
              Por qué
              <br />
              <em>VANTAGE</em>
            </h2>
          </div>
          <p className="text-sm text-white/40 max-w-xs leading-relaxed">
            Cada detalle ha sido seleccionado con un único criterio: que nada esté de más y nada falte.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5">
          {features.map((f) => (
            <div
              key={f.number}
              className="group p-10 bg-[#060606] hover:bg-[#0E0E0E] transition-colors duration-500"
            >
              <span className="brand-serif text-6xl text-white/5 group-hover:text-white/10 transition-colors duration-500 block mb-6">
                {f.number}
              </span>
              <h3 className="brand-serif text-xl text-white mb-4">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
