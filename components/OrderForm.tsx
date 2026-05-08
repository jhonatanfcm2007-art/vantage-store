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
      const response = await fetch('https://formspree.io/f/mnjwbwng', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          ...formData,
          producto: product?.title || 'Reloj VANTAGE',
          precio: formatPrice(product?.variants?.edges?.[0]?.node?.price?.amount || '990000'),
          variantId: product?.variants?.edges?.[0]?.node?.id,
          tipo: 'PEDIDO CONTRA ENTREGA'
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        alert('Hubo un error al enviar el pedido. Por favor intenta de nuevo.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Revisa tu internet.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(4px)' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '32rem', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', overflowY: 'auto', maxHeight: '90vh' }}>
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = '#FFF'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          <X size={24} />
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <CheckCircle2 size={64} style={{ color: '#C9A84C', margin: '0 auto 1.5rem' }} />
            <h2 className="brand-serif" style={{ fontSize: '1.875rem', color: '#FFF', marginBottom: '1rem' }}>¡Pedido Recibido!</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '2rem' }}>Gracias por confiar en VANTAGE. Nos pondremos en contacto contigo pronto para confirmar la entrega.</p>
            <button 
              onClick={onClose}
              style={{ width: '100%', padding: '1rem', background: '#FFF', color: '#000', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 'bold', border: 'none', cursor: 'pointer', transition: 'background 0.3s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#C9A84C'}
              onMouseLeave={e => e.currentTarget.style.background = '#FFF'}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: '#8FB8CC', marginBottom: '0.5rem' }}>Checkout Contra Entrega</p>
              <h2 className="brand-serif" style={{ fontSize: '1.875rem', color: '#FFF' }}>Finalizar Pedido</h2>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem' }}>{product?.title || 'Reloj VANTAGE'}</span>
                <span style={{ color: '#FFF', fontWeight: 500 }}>{formatPrice(product?.variants?.edges?.[0]?.node?.price?.amount || '99000')}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Nombre</label>
                  <input 
                    required name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Ej: Juan"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem', color: '#FFF', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Apellido</label>
                  <input 
                    required name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Ej: Pérez"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem', color: '#FFF', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Teléfono / WhatsApp</label>
                <input 
                  required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="300 123 4567"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem', color: '#FFF', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Dirección Completa</label>
                <input 
                  required name="address" value={formData.address} onChange={handleChange} placeholder="Calle 123 #45-67, Apto 101"
                  style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem', color: '#FFF', fontSize: '0.875rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Ciudad</label>
                  <input 
                    required name="city" value={formData.city} onChange={handleChange} placeholder="Ej: Bogotá"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem', color: '#FFF', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                  <label style={{ fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)' }}>Departamento</label>
                  <input 
                    required name="department" value={formData.department} onChange={handleChange} placeholder="Ej: Cundinamarca"
                    style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem', color: '#FFF', fontSize: '0.875rem', outline: 'none' }}
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={loading}
                style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', background: '#C9A84C', color: '#000', fontSize: '11px', letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 'bold', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', transition: 'background 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#E8C97A'}
                onMouseLeave={e => e.currentTarget.style.background = '#C9A84C'}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} /> {/* Replace animation with simple icon for now to avoid external dependencies */}
                    Procesando...
                  </>
                ) : (
                  'Confirmar Pedido — Pago en Casa'
                )}
              </button>
              
              <p style={{ fontSize: '9px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '1rem' }}>
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
