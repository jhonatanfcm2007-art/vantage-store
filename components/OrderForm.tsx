'use client';

import { useState } from 'react';
import { X, Loader2, CheckCircle2 } from 'lucide-react';
import { ShopifyProduct, formatPrice } from '@/lib/shopify';

interface OrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: ShopifyProduct;
}

export default function OrderForm({ isOpen, onClose, product }: OrderFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    city: '',
    department: '',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aquí llamaremos a nuestra API de Next.js que se conecta con Shopify Admin
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          productId: product?.id,
          variantId: product?.variants.edges[0]?.node.id,
          price: product?.variants.edges[0]?.node.price.amount || '99000',
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        alert('Hubo un error al procesar el pedido. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-[#0A0A0A] border border-white/10 p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        {success ? (
          <div className="text-center py-12 animate-in zoom-in duration-500">
            <CheckCircle2 className="mx-auto text-[#C9A84C] mb-6" size={64} />
            <h2 className="brand-serif text-3xl text-white mb-4">¡Pedido Recibido!</h2>
            <p className="text-white/60 mb-8">Gracias por confiar en VANTAGE. Nos pondremos en contacto contigo pronto para confirmar la entrega.</p>
            <button 
              onClick={onClose}
              className="w-full py-4 bg-white text-black text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-[#C9A84C] transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase text-[#8FB8CC] mb-2">Checkout Contra Entrega</p>
              <h2 className="brand-serif text-3xl text-white">Finalizar Pedido</h2>
              <div className="mt-4 p-4 bg-white/5 border border-white/5 flex justify-between items-center">
                <span className="text-white/60 text-sm">{product?.title || 'Reloj VANTAGE'}</span>
                <span className="text-white font-medium">{formatPrice(product?.variants.edges[0]?.node.price.amount || '99000')}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-widest uppercase text-white/40">Nombre</label>
                  <input 
                    required
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Ej: Juan"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:border-[#C9A84C] outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-widest uppercase text-white/40">Apellido</label>
                  <input 
                    required
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Ej: Pérez"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:border-[#C9A84C] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-widest uppercase text-white/40">Teléfono / WhatsApp</label>
                <input 
                  required
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="300 123 4567"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:border-[#C9A84C] outline-none transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] tracking-widest uppercase text-white/40">Dirección Completa</label>
                <input 
                  required
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle 123 #45-67, Apto 101"
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:border-[#C9A84C] outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-widest uppercase text-white/40">Ciudad</label>
                  <input 
                    required
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ej: Bogotá"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:border-[#C9A84C] outline-none transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] tracking-widest uppercase text-white/40">Departamento</label>
                  <input 
                    required
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="Ej: Cundinamarca"
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-white text-sm focus:border-[#C9A84C] outline-none transition-colors"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 bg-[#C9A84C] text-black text-[11px] tracking-[0.25em] uppercase font-bold hover:bg-[#E8C97A] transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Procesando...
                  </>
                ) : (
                  'Confirmar Pedido — Pago en Casa'
                )}
              </button>
              
              <p className="text-[9px] text-center text-white/30 tracking-widest uppercase mt-4">
                Pagos 100% seguros · Envío gratis incluido
              </p>
            </form>
          </>
        )}
      </div>
      <style jsx>{`
        .brand-serif { font-family: 'Cormorant Garamond', serif; }
      `}</style>
    </div>
  );
}
