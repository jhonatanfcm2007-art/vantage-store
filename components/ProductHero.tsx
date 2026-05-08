'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ShopifyProduct, formatPrice, createCart } from '@/lib/shopify';

interface ProductHeroProps {
  product: ShopifyProduct;
}

export default function ProductHero({ product }: ProductHeroProps) {
  const images = product.images.edges.map(({ node }) => node);
  const variants = product.variants.edges.map(({ node }) => node);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  const [loading, setLoading] = useState(false);

  const price = formatPrice(
    selectedVariant?.price.amount || product.priceRange.minVariantPrice.amount,
    selectedVariant?.price.currencyCode || 'COP'
  );

  const handleBuy = async () => {
    if (!selectedVariant) return;
    setLoading(true);
    try {
      const cart = await createCart(selectedVariant.id, 1);
      window.location.href = cart.checkoutUrl;
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-[72px] flex flex-col lg:flex-row">
      {/* Image Panel */}
      <div className="flex-1 relative bg-[#0C0C0C] overflow-hidden">
        {/* Main image */}
        <div className="relative w-full h-[60vh] lg:h-full min-h-[400px]">
          {images.length > 0 ? (
            <Image
              src={images[selectedImage]?.url || ''}
              alt={images[selectedImage]?.altText || product.title}
              fill
              className="object-cover transition-all duration-700"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
              <span className="brand-serif text-4xl text-white/10">VANTAGE</span>
            </div>
          )}
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-6 left-6 flex gap-2">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`w-12 h-12 overflow-hidden border-2 transition-all ${
                  selectedImage === i ? 'border-white' : 'border-white/20 opacity-50'
                }`}
              >
                <Image src={img.url} alt="" width={48} height={48} className="object-cover w-full h-full" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="w-full lg:w-[480px] flex flex-col justify-center px-8 md:px-14 py-14 bg-[#030303]">
        {/* Brand tag */}
        <div className="mb-8">
          <span className="tag-badge">Edición Especial</span>
        </div>

        {/* Title */}
        <h1 className="brand-serif text-4xl md:text-5xl leading-tight text-white mb-4 animate-fade-up">
          {product.title}
        </h1>

        {/* Accent line */}
        <div className="w-12 h-px bg-[var(--ice)] mb-6" />

        {/* Price */}
        <p className="text-3xl font-light tracking-wider text-white mb-8 animate-fade-up delay-100">
          {price}
        </p>

        {/* Description */}
        <p className="text-sm text-white/50 leading-relaxed mb-10 animate-fade-up delay-200 font-light">
          {product.description || 'Cronógrafo de lujo con esfera árabe azul glaciar. Acero inoxidable premium, bisel giratorio unidireccional, movimiento de cuarzo suizo. Diseñado para los que dominan el tiempo.'}
        </p>

        {/* Variants */}
        {variants.length > 1 && (
          <div className="mb-8 animate-fade-up delay-200">
            <p className="text-[10px] tracking-[0.2em] uppercase text-white/30 mb-3">Variante</p>
            <div className="flex flex-wrap gap-2">
              {variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  disabled={!v.availableForSale}
                  className={`px-4 py-2 text-[11px] tracking-widest uppercase border transition-all ${
                    selectedVariant?.id === v.id
                      ? 'border-white text-white'
                      : 'border-white/20 text-white/40 hover:border-white/50'
                  } ${!v.availableForSale ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <div className="flex flex-col gap-3 animate-fade-up delay-300">
          <button
            onClick={handleBuy}
            disabled={loading || !product.availableForSale}
            className="btn-primary w-full py-4 text-[11px]"
          >
            <span>{loading ? 'Procesando...' : product.availableForSale ? 'Comprar Ahora' : 'Agotado'}</span>
          </button>

          <p className="text-center text-[10px] text-white/25 tracking-widest uppercase mt-2">
            Envío gratis · 30 días de garantía · Pago seguro
          </p>
        </div>

        {/* Trust indicators */}
        <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-3 gap-4 text-center animate-fade delay-400">
          {[
            { label: 'Cuarzo Suizo', sub: 'Movimiento' },
            { label: '3 ATM', sub: 'Resistencia' },
            { label: '2 Años', sub: 'Garantía' },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-[13px] text-white/90 brand-serif">{item.label}</p>
              <p className="text-[9px] text-white/30 tracking-[0.2em] uppercase mt-1">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
