import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  Tag, 
  ShieldCheck, 
  Truck, 
  Bug,
  Info,
  CheckCircle2,
  X
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart, 
    setCurrentPage, 
    viewProduct,
    appliedPromo,
    promoDiscountPercent,
    promoDiscountDollar,
    applyPromoCode,
    removePromoCode,
    isBugMode,
    openQADrawerToTab
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ msg: string; isError: boolean } | null>(null);

  // Stored cached subtotal for BUG-08 (stale subtotal when last item deleted)
  const [staleSubtotal, setStaleSubtotal] = useState<number | null>(null);

  // Calculate Subtotal
  const rawSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleRemoveItem = (productId: string) => {
    if (isBugMode && cart.length === 1) {
      // BUG-08: Stale subtotal bug! Cache the current subtotal so it doesn't drop to 0!
      setStaleSubtotal(rawSubtotal);
    } else {
      setStaleSubtotal(null);
    }
    removeFromCart(productId);
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyPromoCode(couponInput);
    setCouponFeedback({
      msg: res.message,
      isError: !res.success
    });
  };

  // Calculations
  const displaySubtotal = (cart.length === 0 && isBugMode && staleSubtotal !== null) 
    ? staleSubtotal 
    : rawSubtotal;

  const totalDiscount = (displaySubtotal * promoDiscountPercent) / 100 + promoDiscountDollar;
  const discountedSubtotal = Math.max(0, displaySubtotal - totalDiscount);

  // BUG-07: Floating point precision math in tax calculation when in Bug Mode!
  const rawTax = discountedSubtotal * 0.0825;
  const formattedTaxString = (isBugMode && rawTax > 0)
    ? String(rawTax) // BUG-07: Unrounded floating point e.g. "14.849999999999998"
    : rawTax.toFixed(2);

  const shippingCost = (appliedPromo === 'FREESHIP' || discountedSubtotal > 150 || displaySubtotal === 0) ? 0 : 9.99;
  const grandTotal = discountedSubtotal + rawTax + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & QA Bug Targets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-7 h-7 text-indigo-600" />
            Shopping Cart ({cart.reduce((a, b) => a + b.quantity, 0)} items)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review items, apply promo codes, and proceed to secure checkout.
          </p>
        </div>

        <button
          onClick={() => openQADrawerToTab('bugs')}
          className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-2"
        >
          <Bug className="w-4 h-4 text-rose-600" />
          <span>Target Bugs: BUG-06 (Promo Stacking), BUG-07 (Float Tax), BUG-08 (Stale Delete)</span>
        </button>
      </div>

      {/* Main Grid: Cart Items Table + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mx-auto text-indigo-600">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our catalog to add precision tech devices to your cart.
              </p>
              <button
                onClick={() => setCurrentPage('products')}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                id="cart-browse-btn"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="divide-y divide-slate-100">
                {cart.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedColor || 'default'}`}
                    className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
                  >
                    {/* Item Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-200 cursor-pointer"
                        onClick={() => viewProduct(item.product.id)}
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                          {item.product.category}
                        </span>
                        <h4
                          onClick={() => viewProduct(item.product.id)}
                          className="font-bold text-sm text-slate-900 hover:text-indigo-600 cursor-pointer"
                        >
                          {item.product.name}
                        </h4>
                        {item.selectedColor && (
                          <p className="text-xs text-slate-500">Color: {item.selectedColor}</p>
                        )}
                        <p className="text-xs font-bold text-slate-800 sm:hidden">
                          ${item.product.price} each
                        </p>
                      </div>
                    </div>

                    {/* Quantity Stepper & Price */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                      <div className="flex items-center border border-slate-300 rounded-xl bg-white p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                          aria-label="Decrease Quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateCartQuantity(item.product.id, parseInt(e.target.value, 10) || 0)}
                          className="w-10 text-center font-bold text-xs text-slate-900 focus:outline-hidden"
                          title="Quantity input (allows negative numbers in bug mode!)"
                        />
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                          aria-label="Increase Quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right min-w-[70px]">
                        <span className="font-extrabold text-sm text-slate-900 block">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 hidden sm:block">
                          ${item.product.price} / unit
                        </span>
                      </div>

                      {/* Remove Button (BUG-08 trigger on last item) */}
                      <button
                        onClick={() => handleRemoveItem(item.product.id)}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Remove from Cart (Notice BUG-08 if this is the last item!)"
                        id={`remove-cart-item-${item.product.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Table Footer */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center text-xs">
                <button
                  onClick={() => clearCart()}
                  className="text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear Entire Cart
                </button>

                <button
                  onClick={() => setCurrentPage('products')}
                  className="text-indigo-600 hover:text-indigo-700 font-bold"
                >
                  + Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Order Summary & Coupon */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            {/* Price Calculations (BUG-07: Floating Point Tax Artifact) */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900">${displaySubtotal.toFixed(2)}</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount {promoDiscountPercent > 0 ? `(${promoDiscountPercent}%)` : ''}</span>
                  <span>-${totalDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  Estimated Tax (8.25%)
                  <span className="text-[10px] text-slate-400" title="Notice unrounded floating point bug!">(8.25%)</span>
                </span>
                {/* BUG-07 unrounded tax */}
                <span className="font-mono font-semibold text-slate-900 text-[11px]">
                  ${formattedTaxString}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span>Estimated Shipping</span>
                <span className="font-bold text-slate-900">
                  {shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>

              <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-extrabold text-slate-900 block">Total Due</span>
                  <span className="text-[10px] text-slate-400">Includes all taxes and discounts</span>
                </div>
                <span className="text-xl font-black text-slate-900">
                  ${Math.max(0, grandTotal).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Promo Code Box (BUG-06: Case-sensitive & Stacks infinitely!) */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Have a Promo Code?
              </label>

              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SAVE20, FREESHIP"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                  id="promo-code-input"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition-colors shrink-0 shadow-xs"
                  id="apply-promo-btn"
                >
                  Apply
                </button>
              </form>

              {couponFeedback && (
                <div className={`p-2 rounded-lg text-xs flex items-center justify-between ${
                  couponFeedback.isError ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  <span>{couponFeedback.msg}</span>
                  <button onClick={() => setCouponFeedback(null)}>
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {appliedPromo && (
                <div className="flex items-center justify-between p-2 bg-indigo-50 rounded-xl border border-indigo-200 text-xs text-indigo-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Applied: <strong>{appliedPromo}</strong></span>
                  </div>
                  <button
                    onClick={() => {
                      removePromoCode();
                      setCouponFeedback(null);
                    }}
                    className="text-rose-600 hover:text-rose-800 font-bold"
                  >
                    Remove
                  </button>
                </div>
              )}

              <p className="text-[10px] text-slate-400">
                Try promo code <code className="font-bold text-slate-700">SAVE20</code>. Test case-sensitivity and multiple clicks!
              </p>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => setCurrentPage('checkout')}
              disabled={displaySubtotal <= 0 && cart.length === 0}
              className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              id="proceed-to-checkout-btn"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
