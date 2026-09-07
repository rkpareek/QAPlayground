import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShoppingBag, 
  ArrowRight, 
  Bug, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Truck, 
  RotateCcw, 
  Star, 
  Sliders, 
  Layers, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { 
    products, 
    setCurrentPage, 
    viewProduct, 
    addToCart, 
    isBugMode, 
    openQADrawerToTab,
    foundBugCodes 
  } = useApp();

  const featuredProducts = products.filter((p) => p.isFeatured || p.id === 'prod-3');

  const categories = [
    { name: 'Audio', icon: '🎧', desc: 'Earbuds, Headphones & DACs', count: 2 },
    { name: 'Wearables', icon: '⌚', desc: 'Smartwatches & Fitness Rings', count: 1 },
    { name: 'Accessories', icon: '⌨️', desc: 'Keyboards, Docks & Hubs', count: 4 },
    { name: 'Smart Home', icon: '💡', desc: 'Ambient Lighting & Hubs', count: 1 },
    { name: 'Laptops', icon: '💻', desc: 'Ultra-thin flagships', count: 1 }
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 rounded-3xl mx-2 sm:mx-6 mt-4 shadow-xl">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-semibold">
              <Bug className="w-3.5 h-3.5 text-rose-400" />
              <span>Interactive QA Testing Ground • 15 Hidden Defects</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              Next-Gen Tech, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-rose-300 to-amber-200">
                Built for Software Testers
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
              Explore a fully functional e-commerce web application intentionally seeded with real-world functional, UI, validation, and boundary bugs. Practice exploratory testing, log Jira tickets, and verify fixes.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setCurrentPage('products');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-2"
                id="hero-explore-catalog-btn"
              >
                <span>Explore Products</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => openQADrawerToTab('bugs')}
                className="px-5 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all flex items-center gap-2"
                id="hero-open-qa-hub-btn"
              >
                <Bug className="w-4 h-4 text-rose-400" />
                <span>Open QA Bug Tracker ({foundBugCodes.length}/15)</span>
              </button>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 text-left">
              <div>
                <div className="text-2xl font-black text-white">15</div>
                <div className="text-xs text-slate-400 font-medium">Target Defects</div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-300">5</div>
                <div className="text-xs text-slate-400 font-medium">Core Test Modules</div>
              </div>
              <div>
                <div className="text-2xl font-black text-emerald-300">1-Click</div>
                <div className="text-xs text-slate-400 font-medium">Jira / MD Export</div>
              </div>
            </div>
          </div>

          {/* Hero Featured Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="bg-slate-800/80 border border-slate-700 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  Featured Product Focus
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-300">
                  Popular
                </span>
              </div>

              <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-slate-900">
                <img
                  src={products[0].image}
                  alt={products[0].name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>

              <h3 className="text-lg font-bold text-white mb-1">
                {products[0].name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-2 mb-4">
                {products[0].description}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <div>
                  <span className="text-xs text-slate-400 block">Price</span>
                  <span className="text-xl font-extrabold text-white">${products[0].price}</span>
                </div>
                <button
                  onClick={() => viewProduct(products[0].id)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Guarantee Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Fast Global Delivery</h4>
              <p className="text-[11px] text-slate-500">Free shipping on orders over $150</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">2-Year QA Guarantee</h4>
              <p className="text-[11px] text-slate-500">Comprehensive hardware warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">30-Day Easy Returns</h4>
              <p className="text-[11px] text-slate-500">No hassle return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <Bug className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">Built-in Bug Tracker</h4>
              <p className="text-[11px] text-slate-500">Test boundary values & UI glitches</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Browse top categories or search for specific hardware specs
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentPage('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => {
                setCurrentPage('products');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all text-left group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">{cat.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Featured Hardware & Tech
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Top Rated
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              High-performance gear curated for developers, engineers, and creators.
            </p>
          </div>

          <button
            onClick={() => {
              setCurrentPage('products');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
          >
            Browse All ({products.length})
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredProducts.map((product) => {
            // Deliberate BUG-13 on Product #3: "Noise-Cancelling Pro Headphones"
            const isBuggyCard3 = isBugMode && product.id === 'prod-3';

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all flex flex-col overflow-hidden group"
              >
                {/* Product Image */}
                <div 
                  className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                  onClick={() => viewProduct(product.id)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-white/90 text-slate-800 shadow-xs backdrop-blur-xs">
                      {product.category}
                    </span>
                  </div>

                  {product.originalPrice && (
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-600 text-white shadow-xs">
                      SAVE ${(product.originalPrice - product.price).toFixed(0)}
                    </span>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    {/* Stars */}
                    <div className="flex items-center gap-1.5 text-xs text-amber-500">
                      <div className="flex items-center">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="ml-1 font-bold text-slate-800">{product.rating}</span>
                      </div>
                      <span className="text-slate-400">({product.reviewCount})</span>
                    </div>

                    {/* Product Name */}
                    <h3 
                      onClick={() => viewProduct(product.id)}
                      className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                    >
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Pricing & CTA Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Button with deliberate BUG-13 UI defect on product #3 when in Bug Mode */}
                    {isBuggyCard3 ? (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="w-16 h-8 text-[9px] px-1 py-0.5 rounded bg-indigo-600 text-white flex items-center gap-0.5 overflow-hidden leading-2.5 font-bold shadow-xs hover:bg-indigo-500"
                        title="Add to Cart (Notice UI text wrapping and icon collision!)"
                        id={`add-to-cart-${product.id}`}
                      >
                        <ShoppingBag className="w-3 h-3 shrink-0" />
                        <span className="break-all whitespace-normal">Add to Cart</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => addToCart(product, 1)}
                        className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
                        id={`add-to-cart-${product.id}`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tester Training Challenge Callout Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-900 rounded-3xl p-8 sm:p-10 text-white border border-indigo-700/30 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              <Bug className="w-3.5 h-3.5" />
              <span>QA Tester Assignment</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to find all 15 intentional defects?
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Test coupon codes, search bar clear behavior, numeric price sorting, quantity validation boundaries, password visibility toggles, floating point precision, and email whitespace rules.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => openQADrawerToTab('bugs')}
                className="px-5 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-all flex items-center gap-2"
              >
                <Bug className="w-4 h-4" />
                <span>Open Bug Checklist ({foundBugCodes.length}/15)</span>
              </button>

              <button
                onClick={() => openQADrawerToTab('guide')}
                className="px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
              >
                Read Testing Guide
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
