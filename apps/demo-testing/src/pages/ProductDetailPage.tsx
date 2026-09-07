import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Star, 
  ShoppingBag, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  MessageSquare, 
  ChevronRight, 
  ArrowLeft,
  Plus,
  Minus,
  Bug,
  HelpCircle,
  ThumbsUp
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { 
    selectedProductId, 
    products, 
    reviews, 
    addReview, 
    addToCart, 
    setCurrentPage, 
    viewProduct, 
    isBugMode, 
    openQADrawerToTab,
    showToast 
  } = useApp();

  const product = products.find((p) => p.id === selectedProductId) || products[0];
  const productReviews = reviews.filter((r) => r.productId === product.id);

  const [selectedImage, setSelectedImage] = useState<string>(product.images[0] || product.image);
  const [quantityInput, setQuantityInput] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>('Space Gray');

  // Review Form State
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewAuthor, setReviewAuthor] = useState<string>('Taylor Tester');
  const [reviewTitle, setReviewTitle] = useState<string>('');
  const [reviewComment, setReviewComment] = useState<string>('');

  const colors = ['Space Gray', 'Midnight Black', 'Silver Frost', 'Deep Navy'];

  // Handle Quantity Change (BUG-04: in Bug Mode, raw negative and zero inputs are accepted without Math.max(1) clamp!)
  const handleQuantityInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    if (isNaN(val)) {
      setQuantityInput(0);
    } else {
      if (isBugMode) {
        // BUG-04: Allows negative and zero values directly!
        setQuantityInput(val);
      } else {
        // Fixed: Clamped >= 1
        setQuantityInput(Math.max(1, val));
      }
    }
  };

  const incrementQuantity = () => setQuantityInput((prev) => prev + 1);
  const decrementQuantity = () => {
    if (isBugMode) {
      // Allows going below 1 in buggy mode
      setQuantityInput((prev) => prev - 1);
    } else {
      setQuantityInput((prev) => Math.max(1, prev - 1));
    }
  };

  // Handle Review Submission (BUG-05: 0-indexed rating bug in Bug Mode)
  const handleStarClick = (starIndexZeroBased: number) => {
    if (isBugMode) {
      // BUG-05: 0-based index assignment! Clicking 5th star (index 4) saves 4 stars!
      setReviewRating(starIndexZeroBased);
    } else {
      // Fixed: 1-based index assignment!
      setReviewRating(starIndexZeroBased + 1);
    }
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) {
      showToast('Please fill in both a review title and comment.', 'error');
      return;
    }

    addReview({
      productId: product.id,
      author: reviewAuthor || 'Anonymous Tester',
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verified: true
    });

    setReviewTitle('');
    setReviewComment('');
    setIsReviewFormOpen(false);
  };

  const relatedProducts = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb & Target Bug Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage('products')}
            className="hover:text-indigo-600 font-medium flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Products
          </button>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-slate-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        <button
          onClick={() => openQADrawerToTab('bugs')}
          className="px-3 py-1 rounded-lg bg-rose-50 text-rose-700 font-semibold border border-rose-200 flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Bug className="w-3.5 h-3.5 text-rose-600" />
          <span>Page Target Bugs: BUG-04 (Quantity Bypass), BUG-05 (0-Indexed Stars)</span>
        </button>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          {/* Main Large Image */}
          <div className="aspect-4/3 rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-md">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === img
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Purchase Form */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                {product.category}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className={`text-xs font-semibold ${product.stockCount < 10 ? 'text-rose-600 font-bold' : 'text-emerald-600'}`}>
                {product.stockCount < 10 ? `Low Stock (Only ${product.stockCount} units remaining)` : 'In Stock & Ready to Ship'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {product.name}
            </h1>

            {/* Rating Stars Summary */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                ))}
              </div>
              <span className="font-bold text-slate-900">{product.rating}</span>
              <span className="text-slate-500">({product.reviewCount} customer reviews)</span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-baseline gap-3">
            <span className="text-3xl font-black text-slate-900">
              ${product.price}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-base text-slate-400 line-through">
                  ${product.originalPrice}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
                  Save ${(product.originalPrice - product.price).toFixed(2)}
                </span>
              </>
            )}
          </div>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            {product.description}
          </p>

          {/* Color Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Finish / Color: <span className="text-indigo-600 font-semibold">{selectedColor}</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedColor(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedColor === c
                      ? 'bg-slate-900 text-white shadow-xs font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart Form (BUG-04: Testable zero and negative inputs) */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Quantity
            </label>
            <div className="flex flex-wrap items-center gap-3">
              {/* Stepper + Raw Input Field */}
              <div className="flex items-center border border-slate-300 rounded-xl bg-white p-1">
                <button
                  onClick={decrementQuantity}
                  className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  aria-label="Decrease Quantity"
                  id="qty-minus-btn"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  value={quantityInput}
                  onChange={handleQuantityInputChange}
                  className="w-14 text-center font-bold text-sm text-slate-900 focus:outline-hidden"
                  id="product-detail-qty-input"
                  title="Direct numeric quantity input. Try entering -2 or 0!"
                />
                <button
                  onClick={incrementQuantity}
                  className="w-8 h-8 rounded-lg text-slate-600 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  aria-label="Increase Quantity"
                  id="qty-plus-btn"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={() => addToCart(product, quantityInput, selectedColor)}
                className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                id="detail-add-to-cart-btn"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add {quantityInput} to Cart • ${(product.price * quantityInput).toFixed(2)}</span>
              </button>
            </div>

            {quantityInput <= 0 && isBugMode && (
              <p className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                <Bug className="w-3.5 h-3.5" />
                <span>Notice: Quantity is {quantityInput}. Adding this to cart will subtract from the balance! (BUG-04)</span>
              </p>
            )}
          </div>

          {/* Value Perks */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-indigo-600" />
              <span>Fast Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>2-Yr Warranty</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-600" />
              <span>30-Day Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <h3 className="text-base font-bold text-slate-900">
          Hardware Technical Specifications
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {Object.entries(product.specs).map(([key, val]) => (
            <div key={key} className="flex justify-between py-2 border-b border-slate-100">
              <span className="font-semibold text-slate-600">{key}</span>
              <span className="text-slate-900 font-medium">{val}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Reviews & Submission Form (BUG-05) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-indigo-600" />
              Customer Reviews ({productReviews.length})
            </h3>
            <p className="text-xs text-slate-500">Verified buyer ratings & impressions</p>
          </div>

          <button
            onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            id="open-write-review-btn"
          >
            {isReviewFormOpen ? 'Close Form' : 'Write a Review'}
          </button>
        </div>

        {/* Review Form (BUG-05: 0-indexed star offset) */}
        {isReviewFormOpen && (
          <form onSubmit={handleReviewSubmit} className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-xs animate-in fade-in">
            <h4 className="font-bold text-slate-900 text-sm">
              Submit Your Product Review
            </h4>

            {/* Star Rating Picker */}
            <div className="space-y-1.5">
              <label className="block font-semibold text-slate-700">
                Your Rating (Click to Select Stars):
              </label>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, idx) => {
                  const starNumber = idx + 1;
                  const isFilled = isBugMode ? idx <= reviewRating : starNumber <= reviewRating;

                  return (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => handleStarClick(idx)}
                      className="p-1 hover:scale-110 transition-transform focus:outline-hidden"
                      id={`star-btn-${starNumber}`}
                    >
                      <Star
                        className={`w-6 h-6 ${
                          isFilled
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
                <span className="ml-2 font-bold text-slate-700">
                  {reviewRating} / 5 Stars
                </span>
              </div>
              <span className="text-[10px] text-slate-500 block">
                Tip: Click the 5th star and submit. Notice how many stars the saved review has!
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={reviewAuthor}
                  onChange={(e) => setReviewAuthor(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Review Headline *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Incredible audio clarity and comfort"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                  id="review-title-input"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Review Comments *
              </label>
              <textarea
                rows={3}
                placeholder="Share your detailed feedback on battery, build quality, and usability..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                required
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                id="review-comment-textarea"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsReviewFormOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs"
                id="submit-review-btn"
              >
                Submit Review
              </button>
            </div>
          </form>
        )}

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {productReviews.length === 0 ? (
            <p className="text-xs text-slate-500 py-4">No reviews yet for this product. Be the first to write one!</p>
          ) : (
            productReviews.map((rev) => (
              <div key={rev.id} className="p-4 bg-slate-50/70 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{rev.author}</span>
                    {rev.verified && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-1.5 py-0.5 rounded">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400">{rev.date}</span>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs font-bold text-slate-700 ml-1">{rev.rating} / 5</span>
                </div>

                <h5 className="font-bold text-xs text-slate-900">{rev.title}</h5>
                <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
