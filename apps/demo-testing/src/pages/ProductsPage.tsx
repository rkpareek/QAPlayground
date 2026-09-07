import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  X, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Star, 
  ShoppingBag, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  RotateCcw,
  Sparkles,
  Info,
  Bug
} from 'lucide-react';
import { Product } from '../types';

export const ProductsPage: React.FC = () => {
  const { products, viewProduct, addToCart, isBugMode, openQADrawerToTab } = useApp();

  // Search & Filter State
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(1500);
  const [currentPageNum, setCurrentPageNum] = useState<number>(1);
  const itemsPerPage = 4;

  const categories = ['All', 'Audio', 'Wearables', 'Accessories', 'Smart Home', 'Laptops'];

  // Handle Search Input Change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchInput(val);
    setActiveQuery(val);
    setCurrentPageNum(1);
  };

  // Handle Search Clear Button (BUG-02: In Bug Mode, only clears input text without resetting activeQuery!)
  const handleClearSearch = () => {
    if (isBugMode) {
      // BUG-02: Desync: input text becomes empty, but activeQuery stays stuck!
      setSearchInput('');
    } else {
      // Fixed: Resets both
      setSearchInput('');
      setActiveQuery('');
      setCurrentPageNum(1);
    }
  };

  // Filter and Sort Products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
      const matchesQuery = 
        activeQuery === '' ||
        product.name.toLowerCase().includes(activeQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(activeQuery.toLowerCase()) ||
        product.tags.some((t) => t.toLowerCase().includes(activeQuery.toLowerCase()));
      const matchesPrice = product.price <= maxPrice;

      return matchesCategory && matchesQuery && matchesPrice;
    });
  }, [products, selectedCategory, activeQuery, maxPrice]);

  // Sort logic (BUG-01: In Bug Mode, "price-low" sorts alphabetically by string price!)
  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];

    if (sortBy === 'price-low') {
      if (isBugMode) {
        // BUG-01: String sort! "129.99" < "24.99" because '1' comes before '2'
        return list.sort((a, b) => String(a.price).localeCompare(String(b.price)));
      } else {
        // Fixed: Numeric sort
        return list.sort((a, b) => a.price - b.price);
      }
    } else if (sortBy === 'price-high') {
      return list.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      return list.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'name') {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    // Default featured
    return list;
  }, [filteredProducts, sortBy, isBugMode]);

  // Pagination Logic (BUG-03: In Bug Mode, Page 2 starts with (page - 1) * perPage - 1, repeating last item of Page 1!)
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;

  const paginatedProducts = useMemo(() => {
    if (isBugMode && currentPageNum === 2 && sortedProducts.length > itemsPerPage) {
      // BUG-03: Off-by-one error: duplicates the 4th item from Page 1 on Page 2!
      const startIndex = (currentPageNum - 1) * itemsPerPage - 1;
      return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
    } else {
      // Normal correct slice
      const startIndex = (currentPageNum - 1) * itemsPerPage;
      return sortedProducts.slice(startIndex, startIndex + itemsPerPage);
    }
  }, [sortedProducts, currentPageNum, itemsPerPage, isBugMode]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & QA Hint Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Hardware & Tech Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showing {filteredProducts.length} devices across {categories.length - 1} categories
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => openQADrawerToTab('bugs')}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-2 transition-colors"
          >
            <Bug className="w-4 h-4 text-rose-600" />
            <span>Target Bugs on this Page: BUG-01, BUG-02, BUG-03, BUG-13</span>
          </button>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              Filter Products
            </h3>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setMaxPrice(1500);
                setSearchInput('');
                setActiveQuery('');
                setSortBy('featured');
                setCurrentPageNum(1);
              }}
              className="text-xs text-slate-500 hover:text-indigo-600 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" />
              Reset
            </button>
          </div>

          {/* Category Filter List */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Category
            </label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPageNum(1);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && (
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Max Price Slider */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700 uppercase tracking-wider">
                Max Price
              </label>
              <span className="font-bold text-indigo-600">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="20"
              max="1500"
              step="10"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(Number(e.target.value));
                setCurrentPageNum(1);
              }}
              className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>$20</span>
              <span>$750</span>
              <span>$1,500</span>
            </div>
          </div>
        </aside>

        {/* Right Catalog Area */}
        <div className="lg:col-span-9 space-y-6">
          {/* Search & Sort Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* Search Input with BUG-02 clear button */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search products by name, tag, or description..."
                value={searchInput}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-colors"
                id="product-search-input"
              />
              {searchInput && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-2.5 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                  title="Clear search text (Notice BUG-02 behavior!)"
                  id="clear-search-btn"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown with BUG-01 Lexicographical Sort */}
            <div className="flex items-center gap-2 shrink-0">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-500"
                id="product-sort-select"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-low">Sort: Price: Low to High</option>
                <option value="price-high">Sort: Price: High to Low</option>
                <option value="rating">Sort: Customer Rating</option>
                <option value="name">Sort: Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Active Filter Pill Bar */}
          {(activeQuery || selectedCategory !== 'All' || maxPrice < 1500) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Active Filters:</span>
              {selectedCategory !== 'All' && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 flex items-center gap-1">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')}>
                    <X className="w-3 h-3 hover:text-indigo-900" />
                  </button>
                </span>
              )}
              {activeQuery && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 flex items-center gap-1">
                  Query: "{activeQuery}"
                  <button onClick={() => { setSearchInput(''); setActiveQuery(''); }}>
                    <X className="w-3 h-3 hover:text-indigo-900" />
                  </button>
                </span>
              )}
              {maxPrice < 1500 && (
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200 flex items-center gap-1">
                  Under ${maxPrice}
                  <button onClick={() => setMaxPrice(1500)}>
                    <X className="w-3 h-3 hover:text-indigo-900" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {paginatedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No products match your criteria</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try adjusting your search keywords, clearing categories, or expanding your price slider filter.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setMaxPrice(1500);
                  setSearchInput('');
                  setActiveQuery('');
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-500 transition-colors shadow-xs"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6">
              {paginatedProducts.map((product, idx) => {
                const isBuggyCard3 = isBugMode && product.id === 'prod-3';

                return (
                  <div
                    key={`${product.id}-${idx}`}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col overflow-hidden group"
                  >
                    <div 
                      className="relative aspect-16/10 overflow-hidden bg-slate-100 cursor-pointer"
                      onClick={() => viewProduct(product.id)}
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 left-3 flex gap-1">
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-white/95 text-slate-800 shadow-xs">
                          {product.category}
                        </span>
                      </div>
                      {product.originalPrice && (
                        <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold rounded-md bg-rose-600 text-white shadow-xs">
                          -${(product.originalPrice - product.price).toFixed(0)}
                        </span>
                      )}
                    </div>

                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{product.rating}</span>
                            <span className="text-slate-400 font-normal">({product.reviewCount})</span>
                          </div>
                          <span className={`text-[10px] font-semibold ${product.stockCount < 10 ? 'text-rose-600' : 'text-emerald-600'}`}>
                            {product.stockCount < 10 ? `Only ${product.stockCount} left!` : 'In Stock'}
                          </span>
                        </div>

                        <h3 
                          onClick={() => viewProduct(product.id)}
                          className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer"
                        >
                          {product.name}
                        </h3>

                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-base sm:text-lg font-black text-slate-900">
                            ${product.price}
                          </span>
                          {product.originalPrice && (
                            <span className="ml-1.5 text-xs text-slate-400 line-through">
                              ${product.originalPrice}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => viewProduct(product.id)}
                            className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors"
                          >
                            Details
                          </button>

                          {isBuggyCard3 ? (
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="w-16 h-8 text-[9px] px-1 py-0.5 rounded bg-indigo-600 text-white flex items-center gap-0.5 overflow-hidden leading-2.5 font-bold shadow-xs hover:bg-indigo-500"
                              title="Add to Cart (Notice UI text wrapping and icon collision!)"
                              id={`catalog-add-${product.id}`}
                            >
                              <ShoppingBag className="w-3 h-3 shrink-0" />
                              <span className="break-all whitespace-normal">Add to Cart</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(product, 1)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs"
                              id={`catalog-add-${product.id}`}
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Navigation (BUG-03: Page 2 duplicates last item of Page 1) */}
          {totalPages > 1 && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-xs text-xs">
              <div className="text-slate-500 font-medium">
                Page <span className="font-bold text-slate-900">{currentPageNum}</span> of{' '}
                <span className="font-bold text-slate-900">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPageNum((p) => Math.max(1, p - 1))}
                  disabled={currentPageNum === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-40 flex items-center gap-1"
                  id="pagination-prev-btn"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNumber = i + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPageNum(pageNumber)}
                      className={`w-8 h-8 rounded-lg font-bold transition-colors ${
                        currentPageNum === pageNumber
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                      id={`pagination-page-${pageNumber}-btn`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPageNum((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPageNum === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold disabled:opacity-40 flex items-center gap-1"
                  id="pagination-next-btn"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
