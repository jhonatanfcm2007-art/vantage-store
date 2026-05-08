// FAQ minimalista con accordion
'use client';
import { useState } from 'react';

const faqs = [
  {
    q: '¿El reloj es resistente al agua?',
    a: 'Sí. Cuenta con una resistencia de 3 ATM, lo que lo hace apto para salpicaduras, lluvia y lavado de manos. No se recomienda sumergirlo completamente.',
  },
  {
    q: '¿Cómo ajusto la correa?',
    a: 'La correa de acero inoxidable incluye una herramienta de ajuste sin costo adicional. En menos de 2 minutos podrás adaptarla exactamente a tu muñeca.',
  },
  {
    q: '¿Cuánto tiempo tarda el envío?',
    a: 'Los pedidos se despachan dentro de 24 horas hábiles. El tiempo de entrega es de 2 a 5 días hábiles dependiendo de tu ciudad.',
  },
  {
    q: '¿Qué incluye la garantía de 2 años?',
    a: 'Cubre defectos de fabricación en el movimiento de cuarzo y la caja. No incluye daños por impactos, agua a presión o uso indebido.',
  },
  {
    q: '¿Puedo devolverlo si no me gusta?',
    a: 'Tienes 30 días calendario desde la recepción para solicitar un cambio o devolución sin necesidad de justificar el motivo, siempre que el reloj esté sin uso.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="contacto" className="py-24 md:py-36 bg-[#060606]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-16 text-center">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--ice)] mb-4">
              Todo lo que necesitas saber
            </p>
            <h2 className="brand-serif text-4xl md:text-5xl text-white">
              Preguntas <em>Frecuentes</em>
            </h2>
          </div>

          {/* Accordion */}
          <div className="divide-y divide-white/5">
            {faqs.map((faq, i) => (
              <div key={i}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full py-6 flex items-center justify-between text-left gap-6 group"
                >
                  <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                    {faq.q}
                  </span>
                  <span className={`text-white/30 text-xl transition-transform duration-300 ${open === i ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {open === i && (
                  <div className="pb-6">
                    <p className="text-sm text-white/40 leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
