import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  AlertCircle,
  Bug,
  Download,
  Package,
  ShoppingBag
} from 'lucide-react';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { 
    cart, 
    user, 
    appliedPromo, 
    promoDiscountPercent, 
    promoDiscountDollar, 
    placeOrder, 
    setCurrentPage, 
    isBugMode, 
    openQADrawerToTab,
    showToast 
  } = useApp();

  // Form State
  const [fullName, setFullName] = useState(user?.name || 'Taylor Tester');
  const [email, setEmail] = useState(user?.email || 'tester@testcraft.io');
  const [street, setStreet] = useState(user?.shippingAddress?.street || '742 Evergreen Terrace');
  const [city, setCity] = useState(user?.shippingAddress?.city || 'Springfield');
  const [stateVal, setStateVal] = useState(user?.shippingAddress?.state || 'OR');
  const [zipCode, setZipCode] = useState(user?.shippingAddress?.zipCode || '97477');
  
  // Payment State (BUG-10 on cardExpiry)
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardExpiry, setCardExpiry] = useState('01/20'); // Intentionally default expired for easy QA test
  const [cardCvv, setCardCvv] = useState('123');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Success Confirmation Modal State
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = (subtotal * promoDiscountPercent) / 100 + promoDiscountDollar;
  const discountedSubtotal = Math.max(0, subtotal - discount);
  const tax = discountedSubtotal * 0.0825;
  const shipping = (appliedPromo === 'FREESHIP' || discountedSubtotal > 150) ? 0 : 9.99;
  const grandTotal = discountedSubtotal + tax + shipping;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentError(null);

    // Form field checks
    if (!fullName || !street || !city || !stateVal || !zipCode) {
      setPaymentError('Please fill out all required shipping address fields.');
      return;
    }

    if (!cardNumber || !cardExpiry || !cardCvv) {
      setPaymentError('Please complete all credit card payment fields.');
      return;
    }

    // Expiry date validation
    // BUG-10: In Bug Mode, only regex format is checked, allowing past dates like 01/20!
    const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!expiryRegex.test(cardExpiry.trim())) {
      setPaymentError('Please enter card expiry in valid MM/YY format.');
      return;
    }

    if (!isBugMode) {
      // Fixed Mode: Check if expired
      const [monthStr, yearStr] = cardExpiry.split('/');
      const month = parseInt(monthStr, 10);
      const year = 2000 + parseInt(yearStr, 10);
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;

      if (year < currentYear || (year === currentYear && month < currentMonth)) {
        setPaymentError('This credit card has expired. Please provide a valid expiration date.');
        return;
      }
    }

    // Place order
    const order = placeOrder(
      {
        fullName,
        street,
        city,
        state: stateVal,
        zip: zipCode
      },
      `Credit Card ending in •••• ${cardNumber.slice(-4) || '4242'}`
    );

    setPlacedOrder(order);
  };

  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 text-center space-y-6 animate-in zoom-in-95 duration-200">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Thank you for your order!
          </h1>
          <p className="text-xs text-slate-500">
            Order ID: <strong className="font-mono text-slate-800">{placedOrder.id}</strong>
          </p>
        </div>

        {/* Order Details Receipt Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 text-left space-y-4 shadow-sm text-xs">
          <div className="flex justify-between border-b border-slate-100 pb-3">
            <div>
              <span className="text-slate-500 block">Deliver to:</span>
              <strong className="text-slate-900">{placedOrder.shippingAddress.fullName}</strong>
              <p className="text-slate-600">{placedOrder.shippingAddress.street}, {placedOrder.shippingAddress.city}, {placedOrder.shippingAddress.state} {placedOrder.shippingAddress.zip}</p>
            </div>
            <div className="text-right">
              <span className="text-slate-500 block">Payment Method:</span>
              <strong className="text-slate-900">{placedOrder.paymentMethod}</strong>
              <p className="text-emerald-600 font-semibold">Status: Processing</p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-2">
            <span className="font-bold text-slate-700 block">Order Items:</span>
            {placedOrder.items.map((it, idx) => (
              <div key={idx} className="flex justify-between items-center py-1">
                <div className="flex items-center gap-2">
                  <img src={it.image} alt={it.productName} className="w-8 h-8 rounded-lg object-cover" />
                  <span>{it.productName} x {it.quantity}</span>
                </div>
                <span className="font-bold text-slate-900">${(it.price * it.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 space-y-1">
            <div className="flex justify-between text-slate-500">
              <span>Subtotal</span>
              <span>${placedOrder.subtotal.toFixed(2)}</span>
            </div>
            {placedOrder.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-${placedOrder.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-500">
              <span>Tax (8.25%)</span>
              <span>${placedOrder.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Shipping</span>
              <span>{placedOrder.shipping === 0 ? 'FREE' : `$${placedOrder.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Paid</span>
              <span>${placedOrder.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setCurrentPage('orders')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
          >
            View in Order History
          </button>
          <button
            onClick={() => setCurrentPage('products')}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Return to Store
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Target Bug Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <button
            onClick={() => setCurrentPage('cart')}
            className="text-xs font-medium text-slate-500 hover:text-indigo-600 flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Cart
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Checkout & Order Payment
          </h1>
        </div>

        <button
          onClick={() => openQADrawerToTab('bugs')}
          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-2"
        >
          <Bug className="w-4 h-4 text-rose-600" />
          <span>Target Bug on this Page: BUG-10 (Accepts Expired Expiry Dates)</span>
        </button>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Shipping + Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* Shipping Address Box */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-indigo-600" />
              1. Shipping Address
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    value={stateVal}
                    onChange={(e) => setStateVal(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Zip Code *
                  </label>
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method Box (BUG-10) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-indigo-600" />
              2. Payment Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">
                  Card Number (16 digits) *
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="4242 4242 4242 4242"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm"
                  id="checkout-card-number-input"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Expiry (MM/YY) *
                </label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  placeholder="MM/YY (Try 01/20)"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm"
                  id="checkout-card-expiry-input"
                />
                <span className="text-[10px] text-slate-400 block mt-1">
                  Tip: Test with an expired date like "01/20" (BUG-10)
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  CVV (3 digits) *
                </label>
                <input
                  type="password"
                  maxLength={4}
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  placeholder="123"
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm"
                  id="checkout-card-cvv-input"
                />
              </div>
            </div>

            {paymentError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              Review & Pay
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items ({cart.length})</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Promo Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Tax (8.25%)</span>
                <span className="font-bold text-slate-900">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="font-bold text-slate-900">
                  {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-extrabold text-slate-900">Grand Total</span>
                <span className="text-xl font-black text-slate-900">
                  ${grandTotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              id="place-order-submit-btn"
            >
              <Lock className="w-4 h-4" />
              <span>Complete Order (${grandTotal.toFixed(2)})</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Encrypted QA Sandbox Transaction</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
