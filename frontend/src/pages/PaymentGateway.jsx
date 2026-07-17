import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, CreditCard } from 'lucide-react';
import api from '../store/api.js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Stripe Card Input component
const StripeForm = ({ amount, orderId, onSuccess, onFailure }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardError, setCardError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    setCardError(null);

    try {
      // 1. Get Client Secret from backend
      const { data } = await api.post('/payment/process', { amount: Number(amount) });
      const clientSecret = data.client_secret;

      if (data.isMock) {
        // Handle mock secret scenario
        setTimeout(async () => {
          try {
            await api.put(`/orders/${orderId}/pay`, {
              id: `MOCK-STRIPE-${Date.now().toString().slice(-6)}`,
              status: 'success'
            });
            onSuccess();
          } catch (err) {
            setCardError('Mock payment succeeded but database sync failed.');
            onFailure();
          } finally {
            setIsProcessing(false);
          }
        }, 1500);
        return;
      }

      // 2. Confirm Payment Intent with Card Element
      const cardElement = elements.getElement(CardElement);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Valued Customer',
          },
        },
      });

      if (result.error) {
        setCardError(result.error.message);
        setIsProcessing(false);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          // Send payment confirmation back to server
          await api.put(`/orders/${orderId}/pay`, {
            id: result.paymentIntent.id,
            status: 'success'
          });
          // Call webhook directly for simulated local environment
          try {
            await api.post('/payment/webhook', {
              type: 'payment_intent.succeeded',
              data: {
                object: {
                  id: result.paymentIntent.id,
                  amount: Number(amount),
                  metadata: { orderId }
                }
              }
            });
          } catch (e) {
            console.log('Local webhook trigger skipped or failed:', e);
          }
          onSuccess();
        }
      }
    } catch (error) {
      setCardError(error.response?.data?.message || 'Payment processing failed.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.02)'
      }}>
        <CardElement options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#09090B',
              '::placeholder': {
                color: '#A1A1AA',
              },
            },
            invalid: {
              color: '#EF4444',
            },
          },
        }} />
      </div>

      {cardError && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#EF4444', fontSize: '0.8rem', fontWeight: 600 }}>
          <AlertCircle size={16} />
          {cardError}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        style={{
          width: '100%',
          padding: '1.1rem',
          background: '#09090B',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '0.75rem',
          fontSize: '0.85rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing Transaction...
          </>
        ) : (
          <>
            <CreditCard size={16} />
            Pay Now (Rs. {Number(amount).toLocaleString('en-NP')})
          </>
        )}
      </button>
    </form>
  );
};

const PaymentGateway = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const method = searchParams.get('method') || 'eSewa';
  const orderId = searchParams.get('orderId') || '';
  const amount = searchParams.get('amount') || '0';

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');
  const [stripePromise, setStripePromise] = useState(null);

  const isStripe = method.toLowerCase().includes('stripe');

  useEffect(() => {
    if (isStripe) {
      api.get('/payment/stripeapi')
        .then(({ data }) => {
          if (data && data.stripeApiKey) {
            setStripePromise(loadStripe(data.stripeApiKey));
          }
        })
        .catch(err => console.error('Failed to load Stripe key:', err));
    }
  }, [isStripe]);

  // Styles based on payment method
  const theme = {
    bgColor: isStripe ? 'radial-gradient(135deg, #4F46E5 0%, #3B82F6 100%)' : method === 'eSewa' ? '#60BB46' : method === 'Khalti' ? '#5C2D91' : '#ED1C24',
    textColor: '#FFFFFF',
    logoText: isStripe ? 'Stripe Checkout' : method,
    accentColor: isStripe ? '#3730A3' : method === 'eSewa' ? '#4E9E34' : method === 'Khalti' ? '#4C247B' : '#C7151C'
  };

  const handleSimulateSuccess = async () => {
    setLoading(true);
    setStatusMsg('Verifying credentials & processing payment transaction...');
    
    // Simulate API delay
    setTimeout(async () => {
      try {
        const transactionId = `${method.toUpperCase()}-${Date.now().toString().slice(-6)}`;
        await api.put(`/orders/${orderId}/pay`, {
          id: transactionId,
          status: 'success'
        });
        
        setSuccess(true);
        setStatusMsg('Payment approved successfully! Redirecting you to ThapaMart...');
        
        setTimeout(() => {
          navigate(`/order-success?id=${orderId}&payment=success`);
        }, 2000);
      } catch (err) {
        setFailed(true);
        setStatusMsg(err.response?.data?.message || 'Payment approval request rejected by merchant server.');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const handleSimulateFailure = () => {
    setLoading(true);
    setStatusMsg('Cancelling transaction...');
    setTimeout(() => {
      navigate(`/order-failed?id=${orderId}`);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(to bottom right, #F3F4F6, #E5E7EB)', padding: '1.5rem' }}>
      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '2rem',
        overflow: 'hidden',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.7)'
      }}>
        
        {/* Gateway Header */}
        <div style={{ background: theme.bgColor, color: theme.textColor, padding: '3rem 2rem', textAlign: 'center', position: 'relative' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, letterSpacing: '0.05em', margin: 0, textTransform: 'uppercase' }}>
            {theme.logoText}
          </h2>
          <p style={{ fontSize: '0.75rem', opacity: 0.9, marginTop: '0.5rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 700 }}>
            Secure Sandbox Payment Portal
          </p>
        </div>

        {/* Transaction Info */}
        <div style={{ padding: '2.5rem' }}>
          <div style={{ background: 'rgba(243, 244, 246, 0.6)', border: '1px solid #E5E7EB', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#71717A', fontWeight: 600 }}>Merchant</span>
              <span style={{ fontSize: '0.75rem', color: '#09090B', fontWeight: 800 }}>ThapaMart Pvt. Ltd.</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E5E7EB', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#71717A', fontWeight: 600 }}>Order Ref</span>
              <span style={{ fontSize: '0.75rem', color: '#09090B', fontFamily: 'monospace', fontWeight: 700 }}>{orderId}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: '#71717A', fontWeight: 600 }}>Amount Due</span>
              <span style={{ fontSize: '1.35rem', color: '#09090B', fontWeight: 900 }}>Rs. {Number(amount).toLocaleString('en-NP')}</span>
            </div>
          </div>

          {/* Render Stripe Form or Simulate Buttons */}
          {isStripe ? (
            stripePromise ? (
              <Elements stripe={stripePromise}>
                <StripeForm
                  amount={amount}
                  orderId={orderId}
                  onSuccess={() => {
                    setSuccess(true);
                    setStatusMsg('Stripe payment approved! Redirecting...');
                    setTimeout(() => navigate(`/order-success?id=${orderId}&payment=success`), 2000);
                  }}
                  onFailure={() => {
                    setFailed(true);
                  }}
                />
              </Elements>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '2rem 0' }}>
                <Loader2 size={32} className="animate-spin" style={{ color: '#3B82F6' }} />
                <p style={{ fontSize: '0.8rem', color: '#52525B', fontWeight: 600 }}>Initializing secure Stripe Elements...</p>
              </div>
            )
          ) : (
            <>
              {/* Dynamic Status Display */}
              {loading && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', margin: '1.5rem 0', textAlign: 'center' }}>
                  <Loader2 size={32} className="animate-spin" style={{ color: theme.bgColor }} />
                  <p style={{ fontSize: '0.8rem', color: '#52525B', fontWeight: 600 }}>{statusMsg}</p>
                </div>
              )}

              {success && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', margin: '1.5rem 0', textAlign: 'center' }}>
                  <CheckCircle2 size={40} style={{ color: '#10B981' }} />
                  <p style={{ fontSize: '0.85rem', color: '#065F46', fontWeight: 700 }}>{statusMsg}</p>
                </div>
              )}

              {failed && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', margin: '1.5rem 0', textAlign: 'center' }}>
                  <AlertCircle size={40} style={{ color: '#EF4444' }} />
                  <p style={{ fontSize: '0.85rem', color: '#991B1B', fontWeight: 700 }}>{statusMsg}</p>
                </div>
              )}

              {/* Interactive controls */}
              {!loading && !success && !failed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <button
                    onClick={handleSimulateSuccess}
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      background: theme.bgColor,
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: `0 4px 12px rgba(0, 0, 0, 0.05)`
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = theme.accentColor}
                    onMouseLeave={e => e.currentTarget.style.background = theme.bgColor}
                  >
                    Simulate Successful Payment
                  </button>

                  <button
                    onClick={handleSimulateFailure}
                    style={{
                      width: '100%',
                      padding: '1.1rem',
                      background: '#FFFFFF',
                      color: '#71717A',
                      border: '1px solid #E5E7EB',
                      borderRadius: '0.75rem',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#09090B'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#FFFFFF'; e.currentTarget.style.color = '#71717A'; }}
                  >
                    Cancel / Simulate Fail
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Security Badge */}
        <div style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          <ShieldCheck size={16} style={{ color: '#10B981' }} />
          <span style={{ fontSize: '0.7rem', color: '#71717A', fontWeight: 600, letterSpacing: '0.02em' }}>
            Secure SSL Sandbox Transaction
          </span>
        </div>

      </div>
    </div>
  );
};

export default PaymentGateway;
