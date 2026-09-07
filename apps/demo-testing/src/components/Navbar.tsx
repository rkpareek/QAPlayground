import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  Bug, 
  User as UserIcon, 
  Search, 
  CheckCircle2, 
  Menu, 
  X, 
  Sliders, 
  BookOpen, 
  Mail, 
  Package, 
  ShieldCheck, 
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { PageType } from '../types';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    cart, 
    user, 
    logout, 
    isBugMode, 
    setIsBugMode,
    foundBugCodes, 
    knownBugs,
    setIsQADrawerOpen,
    openQADrawerToTab
  } = useApp();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const foundCount = foundBugCodes.length;
  const totalBugs = knownBugs.length;
  const progressPercent = Math.round((foundCount / totalBugs) * 100);

  const navLinks: { label: string; page: PageType; icon?: React.ReactNode }[] = [
    { label: 'Shop', page: 'products' },
    { label: 'QA Dashboard', page: 'qa-dashboard', icon: <Bug className="w-4 h-4 text-rose-500" /> },
    { label: 'Testing Articles', page: 'blog', icon: <BookOpen className="w-4 h-4 text-indigo-500" /> },
    { label: 'Contact QA Lab', page: 'contact' }
  ];

  const handleNav = (page: PageType) => {
    setCurrentPage(page);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top QA Alert Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              QA Sandbox
            </span>
            <span className="text-slate-300 hidden sm:inline">
              Practice finding & reporting real software defects.
            </span>
            <span className="text-slate-400">
              Mode: <strong className={isBugMode ? 'text-amber-400' : 'text-emerald-400'}>{isBugMode ? 'Buggy (Target)' : 'Fixed (Verified)'}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Toggle Buggy vs Fixed */}
            <button
              onClick={() => setIsBugMode(!isBugMode)}
              className="text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors flex items-center gap-1.5"
              title="Toggle between buggy test version and resolved version to compare behaviors"
            >
              <Sliders className="w-3 h-3 text-cyan-400" />
              <span>Switch to {isBugMode ? 'Fixed Mode' : 'Buggy Mode'}</span>
            </button>

            {/* QA Inspector Open Button */}
            <button
              onClick={() => openQADrawerToTab('bugs')}
              className="text-[11px] px-2.5 py-0.5 rounded-full font-semibold bg-rose-600 hover:bg-rose-500 text-white transition-all shadow-xs flex items-center gap-1.5 animate-pulse"
            >
              <Bug className="w-3 h-3" />
              <span>Bug Tracker ({foundCount}/{totalBugs})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden"
              id="brand-logo-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Bug className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 tracking-tight flex items-center gap-1">
                  BugCraft <span className="text-xs px-1.5 py-0.5 font-bold uppercase rounded bg-indigo-50 text-indigo-700 border border-indigo-200">QA</span>
                </span>
                <span className="text-[11px] text-slate-500 block leading-3 font-medium">
                  Tester Training Playground
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => handleNav('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                currentPage === 'home'
                  ? 'text-indigo-600 bg-indigo-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              id="nav-home-link"
            >
              Home
            </button>

            {navLinks.map((link) => {
              const isActive = currentPage === link.page;
              return (
                <button
                  key={link.page}
                  onClick={() => handleNav(link.page)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                  id={`nav-${link.page}-link`}
                >
                  {link.icon}
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Action Icons: QA Progress, Cart, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick QA Progress Pill */}
            <button
              onClick={() => openQADrawerToTab('bugs')}
              className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors"
              title="Open QA Bug Tracker"
              id="qa-score-pill"
            >
              <div className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin-slow hidden" />
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-slate-700">
                {foundCount}/{totalBugs} Bugs Found
              </span>
              <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => handleNav('cart')}
              className={`relative p-2.5 rounded-xl border transition-all ${
                currentPage === 'cart'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
              aria-label="View Shopping Cart"
              id="nav-cart-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-indigo-600 text-white font-bold text-xs rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* User Account / Auth Button */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors focus:outline-hidden"
                  id="user-menu-btn"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-slate-300"
                  />
                  <span className="text-xs font-semibold text-slate-800 hidden sm:inline max-w-[100px] truncate">
                    {user.name}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        handleNav('profile');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      id="dropdown-profile-btn"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      My Profile
                    </button>

                    <button
                      onClick={() => {
                        handleNav('orders');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      id="dropdown-orders-btn"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      Order History
                    </button>

                    <button
                      onClick={() => {
                        handleNav('qa-dashboard');
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      id="dropdown-qa-btn"
                    >
                      <Bug className="w-4 h-4 text-rose-500" />
                      QA Reports Dashboard
                    </button>

                    <div className="border-t border-slate-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setIsUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                      id="dropdown-logout-btn"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => handleNav('login')}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-xs"
                id="nav-login-btn"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 md:hidden hover:bg-slate-50"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
              currentPage === 'home' ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          {navLinks.map((link) => (
            <button
              key={link.page}
              onClick={() => handleNav(link.page)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                currentPage === link.page ? 'bg-indigo-50 text-indigo-600 font-semibold' : 'text-slate-700'
              }`}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                openQADrawerToTab('bugs');
                setIsMobileMenuOpen(false);
              }}
              className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200 flex items-center justify-between"
            >
              <span className="flex items-center gap-1.5">
                <Bug className="w-4 h-4 text-rose-600" />
                Open QA Bug Tracker
              </span>
              <span>{foundCount}/{totalBugs} Found</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
