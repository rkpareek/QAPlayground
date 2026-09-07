import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User as UserIcon, 
  Package, 
  MapPin, 
  Shield, 
  Edit3, 
  Check, 
  FileText, 
  ExternalLink, 
  Bug, 
  Sliders,
  CheckCircle2,
  Calendar,
  CreditCard,
  X
} from 'lucide-react';
import { Order } from '../types';

export const ProfilePage: React.FC = () => {
  const { user, updateUser, orders, isBugMode, openQADrawerToTab, showToast, setCurrentPage } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  
  // Profile Editor State
  const [nameInput, setNameInput] = useState(user?.name || 'Taylor Tester');
  const [phoneInput, setPhoneInput] = useState(user?.phone || '+1 (555) 234-5678');
  
  // Avatar selection (BUG-12: local state vs persistent root store)
  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80'
  ];
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || avatarOptions[0]);

  // Order Filter State (BUG-15 on "Delivered")
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isBugMode) {
      // BUG-12: Only updates name & phone in root context, intentionally skips committing selectedAvatar!
      updateUser({ name: nameInput, phone: phoneInput });
      showToast('Profile updated successfully! (Check if avatar persists after navigating away!)', 'success');
    } else {
      // Fixed: Persists everything
      updateUser({ name: nameInput, phone: phoneInput, avatar: selectedAvatar });
      showToast('Profile updated successfully with avatar saved!', 'success');
    }
  };

  // Filter orders (BUG-15: Case sensitivity glitch on "Delivered")
  const filteredOrders = orders.filter((order) => {
    if (orderStatusFilter === 'All') return true;

    if (isBugMode) {
      // BUG-15: Strict equality `order.status === orderStatusFilter`.
      // Preloaded orders have lowercase or mixed, and when filtering by "Delivered", it fails!
      return order.status === orderStatusFilter;
    } else {
      // Fixed: Case insensitive
      return order.status.toLowerCase() === orderStatusFilter.toLowerCase();
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Target Bug Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Account Management & Orders
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Logged in as <strong className="text-slate-800">{user?.email}</strong> ({user?.role})
          </p>
        </div>

        <button
          onClick={() => openQADrawerToTab('bugs')}
          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-2"
        >
          <Bug className="w-4 h-4 text-rose-600" />
          <span>Target Bugs: BUG-12 (Avatar Persistence), BUG-15 (Order Status Case Filter)</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          id="tab-profile-settings-btn"
        >
          <UserIcon className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
          id="tab-profile-orders-btn"
        >
          <Package className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* User Profile Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 text-center space-y-4 shadow-xs">
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={selectedAvatar}
                alt={user?.name}
                className="w-full h-full rounded-2xl object-cover border-2 border-indigo-500/30 shadow-md"
              />
              <span className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-600 text-white uppercase shadow-xs">
                {user?.role}
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">{user?.name}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-400">Member Since:</span>
                <span className="font-semibold">{user?.memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Orders:</span>
                <span className="font-semibold text-indigo-600">{orders.length} orders</span>
              </div>
            </div>
          </div>

          {/* Edit Form (BUG-12: Avatar Selection) */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              Edit Profile & Avatar
            </h3>

            <form onSubmit={handleProfileSave} className="space-y-5 text-xs">
              {/* Avatar Selector (BUG-12) */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 uppercase tracking-wider">
                  Choose Profile Avatar
                </label>
                <div className="flex flex-wrap gap-3">
                  {avatarOptions.map((opt, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => setSelectedAvatar(opt)}
                      className={`w-14 h-14 rounded-2xl overflow-hidden border-2 transition-all ${
                        selectedAvatar === opt
                          ? 'border-indigo-600 ring-2 ring-indigo-500/20 scale-105 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img src={opt} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Tip: Select a new avatar, click Save, then navigate to Products page and back (BUG-12).
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    id="profile-name-input"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    id="profile-phone-input"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-colors"
                  id="save-profile-btn"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: ORDER HISTORY (BUG-15) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Status Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">Filter Status:</span>
              {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderStatusFilter(status)}
                  className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                    orderStatusFilter === status
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  id={`filter-order-${status.toLowerCase()}`}
                >
                  {status}
                </button>
              ))}
            </div>

            <span className="text-slate-400">
              Showing {filteredOrders.length} of {orders.length} orders
            </span>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No orders found matching "{orderStatusFilter}"</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Tip: Notice BUG-15 if filtering by "Delivered" when delivered orders actually exist!
              </p>
              <button
                onClick={() => setOrderStatusFilter('All')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500"
              >
                Reset Filter to All
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-slate-900">{ord.id}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {ord.date}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        ord.status.toLowerCase() === 'delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status.toLowerCase() === 'shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.status}
                      </span>
                      <button
                        onClick={() => setSelectedOrderForInvoice(ord)}
                        className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View Receipt</span>
                      </button>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 border border-slate-100">
                        <img src={it.image} alt={it.productName} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-slate-900 line-clamp-1">{it.productName}</h5>
                          <p className="text-slate-500">Qty: {it.quantity} × ${it.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-2 text-xs">
                    <span className="text-slate-500">{ord.paymentMethod}</span>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Order Total</span>
                      <span className="text-base font-black text-slate-900">${ord.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Receipt / Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-base">Invoice Receipt</h4>
                <p className="text-slate-400 font-mono text-[11px]">{selectedOrderForInvoice.id}</p>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-slate-600">
                <span>Date:</span>
                <span className="font-semibold text-slate-900">{selectedOrderForInvoice.date}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Payment:</span>
                <span className="font-semibold text-slate-900">{selectedOrderForInvoice.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Recipient:</span>
                <span className="font-semibold text-slate-900">{selectedOrderForInvoice.shippingAddress.fullName}</span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 border-t border-b border-slate-100 py-2 space-y-1">
              {selectedOrderForInvoice.items.map((it, idx) => (
                <div key={idx} className="flex justify-between pt-1">
                  <span>{it.productName} (x{it.quantity})</span>
                  <span className="font-bold">${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-right">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span>${selectedOrderForInvoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Tax (8.25%)</span>
                <span>${selectedOrderForInvoice.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 pt-2">
                <span>Total</span>
                <span>${selectedOrderForInvoice.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  showToast('Receipt printed successfully.', 'info');
                  setSelectedOrderForInvoice(null);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-xs hover:bg-indigo-500"
              >
                Close & Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
