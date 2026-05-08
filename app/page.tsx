'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShopifyProduct, getAllProducts, createCart, formatPrice } from '@/lib/shopify';
import OrderForm from '@/components/OrderForm';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  black: '#040404',
  darkA: '#0A0A0A',
  darkB: '#111111',
  darkC: '#181818',
  border: 'rgba(255,255,255,0.07)',
  gold: '#C9A84C',
  goldLight: '#E8C97A',
  ice: '#8FB8CC',
  text: '#E8E8E8',
  muted: '#707070',
  serif: "'Cormorant Garamond', Georgia, serif",
  sans: "'Inter', -apple-system, sans-serif",
};

// ─── DATA ────────────────────────────────────────────────────────────────────
const features = [
  { n: '01', title: 'Esfera Árabe Azul Glaciar', body: 'Numerales árabes grabados sobre una esfera azul hielo. Inspirado en piezas de colección exclusivas de Medio Oriente.' },
  { n: '02', title: 'Acero Inoxidable 316L', body: 'Calidad quirúrgica. El mismo grado de acero utilizado en joyería de alta gama. Resistente a la corrosión y el tiempo.' },
  { n: '03', title: 'Movimiento de Cuarzo', body: 'Precisión de ±15 segundos al mes. Fiabilidad en cada condición. Siempre exacto, siempre contigo.' },
  { n: '04', title: 'Luminosa Nocturna', body: 'SuperLuminova en manecillas y marcadores. Ver la hora en la oscuridad es parte de la experiencia.' },
];

const reviews = [
  { name: 'Santiago M.', city: 'Bogotá', text: 'La calidad del acero y el peso se sienten absolutamente premium. La esfera árabe azul es única. Literalmente todo el mundo me pregunta dónde lo compré.', date: 'Hace 2 semanas' },
  { name: 'Andrés P.', city: 'Medellín', text: 'Mejor accesorio que he tenido. Me lo pongo con todo. El reloj llega con un empaque de primer nivel, perfecto para regalo.', date: 'Hace 1 mes' },
  { name: 'Camilo R.', city: 'Cali', text: 'Exactamente como las fotos, incluso mejor en persona. El envío fue increíblemente rápido. 100% recomendado sin dudar.', date: 'Hace 3 semanas' },
];

const faqs = [
  { q: '¿El reloj es resistente al agua?', a: 'Sí. Resistencia de 3 ATM, apto para salpicaduras, lluvia y lavado de manos. No recomendamos sumergirlo.' },
  { q: '¿Cómo ajusto la correa a mi muñeca?', a: 'Incluye herramienta de ajuste sin costo adicional. En menos de 2 minutos queda perfecta.' },
  { q: '¿Cuánto tarda el envío?', a: 'Despacho en 24 horas hábiles. Entrega de 2 a 5 días dependiendo de tu ciudad en Colombia.' },
  { q: '¿Qué cubre la garantía de 2 años?', a: 'Defectos de fabricación en el movimiento y la caja. No incluye daños por impactos o uso inadecuado.' },
  { q: '¿Puedo devolver el reloj si no me convence?', a: '30 días para cambio o devolución total sin preguntas, siempre que el producto esté sin uso.' },
];

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function Navbar({ scrolled }: { scrolled: boolean }) {
  const [menu, setMenu] = useState(false);
  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: scrolled || menu ? 'rgba(4,4,4,0.97)' : 'transparent',
        backdropFilter: scrolled || menu ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? `1px solid ${T.border}` : '1px solid transparent',
        transition: 'all 0.5s ease',
      }}>
        <nav style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1.5rem', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <span style={{ fontFamily: T.serif, fontSize: '1.4rem', letterSpacing: '0.4em', color: T.text, fontWeight: 300 }}>VANTAGE</span>

          {/* Desktop links */}
          <div style={{ display: 'flex', gap: '2.5rem', '@media(max-width:768px)': { display: 'none' } } as React.CSSProperties}>
            <style>{`@media(max-width:768px){.nav-links{display:none!important}}`}</style>
            <div className="nav-links" style={{ display: 'flex', gap: '2.5rem' }}>
              {['Colección', 'Características', 'Reseñas'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted, textDecoration: 'none', transition: 'color 0.3s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = T.text)}
                  onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>{item}</a>
              ))}
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="nav-links" style={{ display: 'flex' }}>
            <a href="#comprar" style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.gold, border: `1px solid rgba(201,168,76,0.4)`, padding: '0.6rem 1.5rem', textDecoration: 'none', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = T.gold; e.currentTarget.style.color = '#000'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = T.gold; }}>Comprar</a>
          </div>

          {/* Hamburger - mobile only */}
          <button onClick={() => setMenu(!menu)} className="nav-burger"
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '8px', display: 'none', flexDirection: 'column', gap: '5px' }}>
            <span style={{ display: 'block', width: 22, height: 1, background: T.text, transition: 'all 0.3s', transform: menu ? 'rotate(45deg) translateY(6px)' : 'none' }} />
            <span style={{ display: 'block', width: 22, height: 1, background: T.text, transition: 'all 0.3s', opacity: menu ? 0 : 1 }} />
            <span style={{ display: 'block', width: 22, height: 1, background: T.text, transition: 'all 0.3s', transform: menu ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
          </button>
        </nav>

        {/* Mobile Menu Drawer */}
        {menu && (
          <div style={{ background: 'rgba(4,4,4,0.98)', borderTop: `1px solid ${T.border}`, padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {['Colección', 'Características', 'Reseñas'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMenu(false)}
                style={{ fontSize: '1.1rem', letterSpacing: '0.1em', color: T.muted, textDecoration: 'none', fontFamily: T.serif }}>
                {item}
              </a>
            ))}
            <a href="#comprar" onClick={() => setMenu(false)}
              style={{ marginTop: '1rem', background: T.gold, color: '#000', padding: '1rem', textAlign: 'center', textDecoration: 'none', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>
              Comprar Ahora
            </a>
          </div>
        )}
      </header>
      <style>{`@media(max-width:768px){.nav-links{display:none!important}.nav-burger{display:flex!important}}`}</style>
    </>
  );
}

function Hero({ product }: { product?: ShopifyProduct }) {
  const images = product?.images.edges.map(({ node }) => node) || [];
  const variants = product?.variants.edges.map(({ node }) => node) || [];
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [loading, setLoading] = useState(false);

  const priceAmount = selectedVariant?.price.amount || product?.priceRange.minVariantPrice.amount || '99000';
  const priceCurrency = selectedVariant?.price.currencyCode || 'COP';
  const displayPrice = formatPrice(priceAmount, priceCurrency);
  const heroImage = images[0]?.url;
  const productTitle = product?.title || 'Rolex President Arabé Blue';

  const handleBuy = async () => {
    // Abrimos el formulario de contra entrega en lugar de ir a Shopify
    (window as any).openOrderForm();
  };
  return (
    <section id="hero-section" style={{
      minHeight: '100vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
      background: T.black,
    }}>
      {/* LEFT: Image */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#070707', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Glow behind watch */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(143,184,204,0.12) 0%, transparent 70%)',
          animation: 'float 8s ease-in-out infinite',
        }} />
        <div style={{ position: 'relative', width: '85%', maxWidth: 520, animation: 'float 8s ease-in-out infinite' }}>
          <Image
            src={heroImage || '/hero-watch.png'}
            alt={productTitle + ' — VANTAGE'}
            width={600}
            height={600}
            style={{ width: '100%', height: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.8))' }}
            priority
          />
        </div>
        {/* Bottom edge fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: `linear-gradient(transparent, ${T.black})` }} />
      </div>

      {/* RIGHT: Copy */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '6rem 5rem', borderLeft: `1px solid ${T.border}` }}>
        {/* Tag */}
        <div className="anim-fade-up" style={{ marginBottom: '2rem' }}>
          <span style={{
            fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase',
            color: T.ice, border: `1px solid rgba(143,184,204,0.3)`, padding: '0.4rem 1rem',
          }}>
            Edición Especial · Arabe Blue
          </span>
        </div>

        <h1 className="serif anim-fade-up d1" style={{ fontSize: '4rem', lineHeight: 1.08, color: T.text, fontWeight: 400, marginBottom: '1.5rem' }}>
          Domina<br />el Tiempo.
        </h1>

        {/* Accent line */}
        <div className="anim-fade-up d2" style={{ width: 48, height: 1, background: `linear-gradient(90deg, ${T.gold}, transparent)`, marginBottom: '2rem' }} />

        {/* Description */}
        <p className="anim-fade-up d2" style={{ fontSize: '0.9rem', color: T.muted, lineHeight: 1.8, maxWidth: 360, marginBottom: '2.5rem' }}>
          No es solo un reloj. Es una declaración de carácter. Acero 316L, esfera árabe azul glaciar, 
          movimiento de cuarzo suizo. Diseñado para el hombre que sabe exactamente hacia dónde va.
        </p>

        {/* Price */}
        <div className="anim-fade-up d3" style={{ marginBottom: '2.5rem' }}>
          <span style={{ fontFamily: T.serif, fontSize: '2.8rem', color: T.text, letterSpacing: '-0.02em' }}>
            {displayPrice}
          </span>
          <span style={{ fontSize: '0.7rem', color: T.muted, marginLeft: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            COP · Envío Gratis
          </span>
        </div>

        {/* CTA Buttons */}
        <div id="comprar" className="anim-fade-up d3 cta-row" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => (window as any).openOrderForm()}
            style={{
              background: T.text, color: T.black, border: 'none',
              padding: '1rem 2.5rem', fontSize: '0.65rem', letterSpacing: '0.25em',
              textTransform: 'uppercase', cursor: 'pointer', fontWeight: 500,
              fontFamily: T.sans, transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = T.goldLight; }}
            onMouseLeave={e => { e.currentTarget.style.background = T.text; }}
          >
            Comprar Ahora
          </button>
          <button
            onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'transparent', color: T.muted, border: `1px solid ${T.border}`,
              padding: '1rem 2rem', fontSize: '0.65rem', letterSpacing: '0.25em',
              textTransform: 'uppercase', cursor: 'pointer', fontFamily: T.sans, transition: 'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = T.text; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.muted; }}
          >
            Ver Detalles
          </button>
        </div>

        {/* Trust row */}
        <div className="anim-fade-up d4" style={{ display: 'flex', gap: '2rem', marginTop: '3rem', paddingTop: '2rem', borderTop: `1px solid ${T.border}` }}>
          {[{ v: '⚡', l: 'Cuarzo Suizo' }, { v: '3ATM', l: 'Resistencia' }, { v: '2Y', l: 'Garantía' }].map(item => (
            <div key={item.l} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: T.serif, fontSize: '1.1rem', color: T.text }}>{item.v}</div>
              <div style={{ fontSize: '0.6rem', color: T.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{item.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          #hero-section { grid-template-columns: 1fr !important; min-height: auto !important; }
          #hero-section > div:first-child { min-height: 55vw; }
          #hero-section > div:last-child { padding: 2.5rem 1.5rem !important; border-left: none !important; border-top: 1px solid rgba(255,255,255,0.07); }
          #hero-section h1 { font-size: 2.6rem !important; }
          #hero-section .cta-row { flex-direction: column !important; }
          #hero-section .cta-row button { width: 100% !important; }
        }
      `}</style>
    </section>
  );
}

function MarqueeBar() {
  const items = ['Diseño Sin Compromiso', '✦', 'Cuarzo Suizo', '✦', 'Envío a Todo Colombia', '✦', 'Garantía 2 Años', '✦', 'Relojería Premium', '✦', 'Domina el Tiempo', '✦'];
  const all = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', padding: '1.25rem 0', borderTop: `1px solid ${T.border}`, borderBottom: `1px solid ${T.border}`, background: '#070707' }}>
      <div style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap', animation: 'marquee 22s linear infinite', width: 'max-content' }}>
        {all.map((item, i) => (
          <span key={i} style={{
            fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase',
            color: item === '✦' ? T.gold : T.muted,
          }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

function Features() {
  return (
    <section id="features" style={{ background: '#060606', padding: '8rem 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
        {/* Header */}
        <div style={{ marginBottom: '5rem' }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: T.ice, marginBottom: '1.5rem' }}>
            Ingeniería & Diseño
          </p>
          <h2 className="serif" style={{ fontSize: '3.5rem', color: T.text, fontWeight: 400, lineHeight: 1.1 }}>
            Por qué <em>VANTAGE</em>
          </h2>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: T.border }}>
          {features.map((f) => (
            <div key={f.n}
              style={{ background: '#060606', padding: '3.5rem', transition: 'background 0.4s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0E0E0E')}
              onMouseLeave={e => (e.currentTarget.style.background = '#060606')}
            >
              <div className="serif" style={{ fontSize: '4rem', color: 'rgba(255,255,255,0.04)', marginBottom: '1.5rem', lineHeight: 1 }}>
                {f.n}
              </div>
              <h3 className="serif" style={{ fontSize: '1.3rem', color: T.text, marginBottom: '1rem', fontWeight: 400 }}>{f.title}</h3>
              <p style={{ fontSize: '0.85rem', color: T.muted, lineHeight: 1.8 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          #features { padding: 4rem 0 !important; }
          #features h2 { font-size: 2.5rem !important; }
          #features > div > div:last-child { grid-template-columns: 1fr !important; }
          #features > div > div:last-child > div { padding: 2rem !important; }
        }
      `}</style>
    </section>
  );
}

function Reviews() {
  return (
    <section id="reseñas" style={{ background: T.black, padding: '8rem 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: T.gold, marginBottom: '1.5rem' }}>Testimonios Reales</p>
          <h2 className="serif" style={{ fontSize: '3.5rem', color: T.text, fontWeight: 400 }}>
            Lo que dicen <em>quienes lo usan</em>
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', gap: '4px' }}>
              {'★★★★★'.split('').map((s, i) => <span key={i} style={{ color: T.gold, fontSize: '1.2rem' }}>{s}</span>)}
            </div>
            <span className="serif" style={{ fontSize: '1.8rem', color: T.text }}>4.9</span>
            <span style={{ fontSize: '0.65rem', color: T.muted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>(127 reseñas)</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: T.border }}>
          {reviews.map((r, i) => (
            <div key={i} style={{ background: T.black, padding: '3rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', transition: 'background 0.4s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#0A0A0A')}
              onMouseLeave={e => (e.currentTarget.style.background = T.black)}>
              <div style={{ display: 'flex', gap: '3px' }}>{'★★★★★'.split('').map((s, j) => <span key={j} style={{ color: T.gold, fontSize: '0.9rem' }}>{s}</span>)}</div>
              <p style={{ fontSize: '0.88rem', color: 'rgba(232,232,232,0.6)', lineHeight: 1.85, flex: 1 }}>&ldquo;{r.text}&rdquo;</p>
              <div>
                <p style={{ fontSize: '0.88rem', color: T.text, fontWeight: 400 }}>{r.name}</p>
                <p style={{ fontSize: '0.6rem', color: T.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginTop: '0.25rem' }}>{r.city} · {r.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @media(max-width:768px){
          #reseñas { padding: 4rem 0 !important; }
          #reseñas h2 { font-size: 2.2rem !important; }
          #reseñas > div > div:last-child { grid-template-columns: 1fr !important; }
          #reseñas > div > div:last-child > div { padding: 2rem !important; }
        }
      `}</style>
    </section>
  );
}

function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section style={{ background: '#060606', padding: '8rem 0' }}>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: T.ice, marginBottom: '1.5rem' }}>Todo lo que necesitas saber</p>
          <h2 className="serif" style={{ fontSize: '3rem', color: T.text, fontWeight: 400 }}>Preguntas <em>Frecuentes</em></h2>
        </div>
        <div>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{
                width: '100%', padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', gap: '1.5rem',
              }}>
                <span style={{ fontSize: '0.9rem', color: open === i ? T.text : T.muted, transition: 'color 0.3s', fontFamily: T.sans }}>
                  {faq.q}
                </span>
                <span style={{ color: T.gold, fontSize: '1.5rem', transition: 'transform 0.3s', transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)', flexShrink: 0 }}>+</span>
              </button>
              {open === i && (
                <div style={{ paddingBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.85rem', color: T.muted, lineHeight: 1.8 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTABanner({ product }: { product?: ShopifyProduct }) {
  const priceAmount = product?.priceRange.minVariantPrice.amount || '99000';
  const displayPrice = formatPrice(priceAmount, 'COP');
  return (
    <section style={{
      background: `linear-gradient(135deg, #0C0C0C 0%, #141414 50%, #0C0C0C 100%)`,
      borderTop: `1px solid ${T.border}`, padding: '8rem 2rem', textAlign: 'center',
    }}>
      <p style={{ fontSize: '0.6rem', letterSpacing: '0.4em', textTransform: 'uppercase', color: T.ice, marginBottom: '2rem' }}>Oferta por Tiempo Limitado</p>
      <h2 className="serif" style={{ fontSize: '3.5rem', color: T.text, marginBottom: '1.5rem', fontWeight: 400 }}>
        ¿Listo para Dominarlo?
      </h2>
      <p style={{ fontSize: '0.9rem', color: T.muted, marginBottom: '3rem', maxWidth: 480, margin: '0 auto 3rem' }}>
        Únete a los más de 300 hombres que ya llevan VANTAGE en su muñeca. Envío gratis en todo Colombia.
      </p>
      <button
        onClick={() => (window as any).openOrderForm()}
        style={{
          background: `linear-gradient(135deg, ${T.gold}, ${T.goldLight}, ${T.gold})`,
          backgroundSize: '200% auto',
          color: '#000', border: 'none', padding: '1.25rem 4rem',
          fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase',
          cursor: 'pointer', fontWeight: 600, fontFamily: T.sans, transition: 'all 0.4s',
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundPosition = 'right center'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundPosition = 'left center'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        Comprar Ahora — {displayPrice}
      </button>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: T.black, borderTop: `1px solid ${T.border}`, padding: '2.5rem 2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <span className="serif" style={{ fontSize: '1.2rem', letterSpacing: '0.4em', color: 'rgba(232,232,232,0.3)' }}>VANTAGE</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['Privacidad', 'Devoluciones', 'Envíos'].map(item => (
            <a key={item} href="#" style={{ fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.muted, textDecoration: 'none', transition: 'color 0.3s' }}
              onMouseEnter={e => (e.currentTarget.style.color = T.text)}
              onMouseLeave={e => (e.currentTarget.style.color = T.muted)}>
              {item}
            </a>
          ))}
        </div>
        <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.15)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          © {new Date().getFullYear()} VANTAGE Store
        </p>
      </div>
    </footer>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Page() {
  const [scrolled, setScrolled] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    (window as any).openOrderForm = () => setIsFormOpen(true);
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn, { passive: true });
    getAllProducts().then(products => {
      if (products.length > 0) setProduct(products[0]);
    });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div style={{ background: T.black, minHeight: '100vh' }}>
      <Navbar scrolled={scrolled} />
      <Hero product={product} />
      <MarqueeBar />
      <Features />
      <Reviews />
      <FAQ />
      <CTABanner product={product} />
      <Footer />

      <OrderForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        product={product}
      />
    </div>
  );
}
