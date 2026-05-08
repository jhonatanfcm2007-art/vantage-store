'use client';

import { useState } from 'react';

const reviews = [
  {
    name: 'Santiago M.',
    city: 'Bogotá',
    rating: 5,
    text: 'Lo compré sin mucha expectativa y quedé sorprendido. La calidad del acero y el peso del reloj se sienten premium. La esfera árabe azul es simplemente única.',
    date: 'Hace 2 semanas',
  },
  {
    name: 'Andrés P.',
    city: 'Medellín',
    rating: 5,
    text: 'Me lo pongo todos los días. La gente en el trabajo siempre me pregunta dónde lo conseguí. Fácil el mejor accesorio que tengo.',
    date: 'Hace 1 mes',
  },
  {
    name: 'Camilo R.',
    city: 'Cali',
    rating: 5,
    text: 'El envío llegó súper rápido y el empaque era de primer nivel. El reloj exactamente como las fotos. 100% recomendado.',
    date: 'Hace 3 semanas',
  },
];

export default function Reviews() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 md:py-36 bg-[#030303]">
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)] mb-4">
            Testimonios
          </p>
          <h2 className="brand-serif text-4xl md:text-5xl text-white">
            Lo que dicen
            <br />
            <em>quienes lo usan</em>
          </h2>
        </div>

        {/* Stars rating summary */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[var(--gold)] text-xl">★</span>
            ))}
          </div>
          <span className="text-2xl text-white brand-serif">4.9</span>
          <span className="text-xs text-white/30 tracking-widest uppercase">(127 reseñas)</span>
        </div>

        {/* Review Cards */}
        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="p-8 bg-[#030303] hover:bg-[#0a0a0a] transition-colors duration-500 flex flex-col gap-6"
            >
              <div className="flex gap-0.5">
                {[...Array(r.rating)].map((_, j) => (
                  <span key={j} className="text-[var(--gold)] text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-white/60 leading-relaxed flex-1">&ldquo;{r.text}&rdquo;</p>
              <div>
                <p className="text-sm text-white font-medium">{r.name}</p>
                <p className="text-[10px] text-white/25 tracking-widest uppercase">{r.city} · {r.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
