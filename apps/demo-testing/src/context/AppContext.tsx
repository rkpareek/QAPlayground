import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, User, Order, ProductReview, KnownBug, UserBugReport, PageType } from '../types';
import { MOCK_PRODUCTS, MOCK_USER, MOCK_ORDERS, MOCK_REVIEWS, KNOWN_BUGS } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'bug';
}

interface AppContextType {
  // Navigation
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  selectedProductId: string | null;
  viewProduct: (id: string) => void;
  
  // Auth
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string, confirmPassword?: string) => { success: boolean; error?: string };
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  
  // Products & Reviews
  products: Product[];
  reviews: ProductReview[];
  addReview: (review: Omit<ProductReview, 'id' | 'date'>) => void;
  
  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  appliedPromo: string | null;
  promoDiscountPercent: number;
  promoDiscountDollar: number;
  applyPromoCode: (code: string) => { success: boolean; message: string; discountPercent?: number };
  removePromoCode: () => void;
  
  // Orders
  orders: Order[];
  placeOrder: (shipping: { fullName: string; street: string; city: string; state: string; zip: string }, paymentMethod: string) => Order;
  
  // QA Testing System
  isBugMode: boolean;
  setIsBugMode: (enabled: boolean) => void;
  knownBugs: KnownBug[];
  foundBugCodes: string[];
  toggleBugFound: (code: string) => void;
  userBugReports: UserBugReport[];
  addUserBugReport: (report: Omit<UserBugReport, 'id' | 'reportedAt' | 'status'>) => void;
  deleteUserBugReport: (id: string) => void;
  resetAllData: () => void;
  
  // UI / Toasts / QA Drawer
  isQADrawerOpen: boolean;
  setIsQADrawerOpen: (open: boolean) => void;
  qaDrawerInitialTab: 'bugs' | 'log' | 'guide' | 'scenarios';
  openQADrawerToTab: (tab: 'bugs' | 'log' | 'guide' | 'scenarios') => void;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'bug') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-1');

  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bugcraft_user');
    return saved ? JSON.parse(saved) : MOCK_USER;
  });

  // Products & Reviews
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const saved = localStorage.getItem('bugcraft_reviews');
    return saved ? JSON.parse(saved) : MOCK_REVIEWS;
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('bugcraft_cart');
    return saved ? JSON.parse(saved) : [
      { product: MOCK_PRODUCTS[0], quantity: 1 }
    ];
  });
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoDiscountPercent, setPromoDiscountPercent] = useState<number>(0);
  const [promoDiscountDollar, setPromoDiscountDollar] = useState<number>(0);

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('bugcraft_orders');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  // QA System State
  const [isBugMode, setIsBugMode] = useState<boolean>(true); // Default true for testing
  const [foundBugCodes, setFoundBugCodes] = useState<string[]>(() => {
    const saved = localStorage.getItem('bugcraft_found_bugs');
    return saved ? JSON.parse(saved) : [];
  });
  const [userBugReports, setUserBugReports] = useState<UserBugReport[]>(() => {
    const saved = localStorage.getItem('bugcraft_user_bug_reports');
    return saved ? JSON.parse(saved) : [];
  });

  // UI State
  const [isQADrawerOpen, setIsQADrawerOpen] = useState<boolean>(false);
  const [qaDrawerInitialTab, setQaDrawerInitialTab] = useState<'bugs' | 'log' | 'guide' | 'scenarios'>('bugs');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('bugcraft_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('bugcraft_found_bugs', JSON.stringify(foundBugCodes));
  }, [foundBugCodes]);

  useEffect(() => {
    localStorage.setItem('bugcraft_user_bug_reports', JSON.stringify(userBugReports));
  }, [userBugReports]);

  useEffect(() => {
    localStorage.setItem('bugcraft_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('bugcraft_reviews', JSON.stringify(reviews));
  }, [reviews]);

  // Toast Helpers
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'bug' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openQADrawerToTab = (tab: 'bugs' | 'log' | 'guide' | 'scenarios') => {
    setQaDrawerInitialTab(tab);
    setIsQADrawerOpen(true);
  };

  const viewProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentPage('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth Operations
  const login = (email: string, password: string) => {
    // BUG-14: If isBugMode is on and email has trailing space, it rejects with invalid email!
    const effectiveEmail = isBugMode ? email : email.trim();

    if (effectiveEmail.endsWith(' ') || effectiveEmail.startsWith(' ')) {
      return { success: false, error: 'Invalid email address format. Extra spacing detected.' };
    }

    if (!effectiveEmail || !password) {
      return { success: false, error: 'Please enter both email and password.' };
    }

    if (effectiveEmail === 'tester@testcraft.io' && password === 'password123') {
      const loggedUser: User = {
        ...MOCK_USER,
        email: effectiveEmail
      };
      setUser(loggedUser);
      localStorage.setItem('bugcraft_user', JSON.stringify(loggedUser));
      showToast(`Welcome back, ${loggedUser.name}!`, 'success');
      return { success: true };
    } else if (password.length >= 6) {
      const loggedUser: User = {
        id: 'user-' + Date.now(),
        name: effectiveEmail.split('@')[0],
        email: effectiveEmail,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        role: 'tester',
        memberSince: 'Today',
        shippingAddress: {
          street: '100 QA Parkway',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94105',
          country: 'USA'
        }
      };
      setUser(loggedUser);
      localStorage.setItem('bugcraft_user', JSON.stringify(loggedUser));
      showToast(`Logged in successfully as ${loggedUser.name}!`, 'success');
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials. Try tester@testcraft.io / password123' };
    }
  };

  const register = (name: string, email: string, password: string, confirmPassword?: string) => {
    const effectiveEmail = isBugMode ? email : email.trim();

    if (effectiveEmail.endsWith(' ') || effectiveEmail.startsWith(' ')) {
      return { success: false, error: 'Please enter a valid email format.' };
    }

    if (!name || !effectiveEmail || !password) {
      return { success: false, error: 'All fields are required.' };
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return { success: false, error: 'Passwords do not match.' };
    }

    const newUser: User = {
      id: 'user-' + Date.now(),
      name,
      email: effectiveEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      role: 'tester',
      memberSince: 'Just now'
    };
    setUser(newUser);
    localStorage.setItem('bugcraft_user', JSON.stringify(newUser));
    showToast('Account created successfully!', 'success');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('bugcraft_user');
    showToast('You have been logged out.', 'info');
    setCurrentPage('home');
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('bugcraft_user', JSON.stringify(updated));
  };

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, color?: string) => {
    // BUG-04: If isBugMode is on, accept raw quantity even if <= 0!
    const effectiveQuantity = isBugMode ? quantity : Math.max(1, quantity);

    setCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.product.id === product.id && item.selectedColor === color);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += effectiveQuantity;
        return updated;
      }
      return [...prev, { product, quantity: effectiveQuantity, selectedColor: color }];
    });

    if (effectiveQuantity > 0) {
      showToast(`Added "${product.name}" (${effectiveQuantity}) to cart!`, 'success');
    } else {
      showToast(`Added "${product.name}" with quantity ${effectiveQuantity} to cart!`, 'bug');
    }
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    // BUG-04: Allow negative or 0 if bug mode
    const effectiveQuantity = isBugMode ? quantity : Math.max(1, quantity);

    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity: effectiveQuantity } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from cart.', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
    setPromoDiscountPercent(0);
    setPromoDiscountDollar(0);
  };

  const applyPromoCode = (code: string) => {
    // BUG-06: Case sensitive in bug mode ("SAVE20" works, "save20" fails)
    // BUG-06: Stacks multiple times without checking if already applied!
    const testCode = isBugMode ? code : code.trim().toUpperCase();

    if (testCode === 'SAVE20') {
      if (isBugMode) {
        // Buggy: Stacks 20% every single time clicked!
        const newPercent = promoDiscountPercent + 20;
        setAppliedPromo(code);
        setPromoDiscountPercent(newPercent);
        showToast(`Promo SAVE20 applied! (${newPercent}% discount total)`, 'success');
        return { success: true, message: `Promo SAVE20 applied! Total discount: ${newPercent}%`, discountPercent: newPercent };
      } else {
        // Fixed: exactly 20%, once
        if (appliedPromo) {
          return { success: false, message: 'A promo code is already applied.' };
        }
        setAppliedPromo('SAVE20');
        setPromoDiscountPercent(20);
        showToast('Promo code SAVE20 applied (20% off)!', 'success');
        return { success: true, message: '20% off applied.', discountPercent: 20 };
      }
    } else if (testCode.toUpperCase() === 'FREESHIP') {
      setAppliedPromo('FREESHIP');
      setPromoDiscountDollar(9.99);
      showToast('Free shipping promo applied!', 'success');
      return { success: true, message: 'Free standard shipping applied.' };
    } else if (testCode.toUpperCase() === 'BUGHUNTER') {
      setAppliedPromo('BUGHUNTER');
      setPromoDiscountPercent(30);
      showToast('Master Bug Hunter 30% discount applied!', 'success');
      return { success: true, message: '30% QA Special discount applied!' };
    } else {
      return { success: false, message: `Promo code "${code}" is invalid or expired. (Tip: Try uppercase "SAVE20")` };
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoDiscountPercent(0);
    setPromoDiscountDollar(0);
    showToast('Promo code removed.', 'info');
  };

  const addReview = (newReviewData: Omit<ProductReview, 'id' | 'date'>) => {
    const newRev: ProductReview = {
      ...newReviewData,
      id: 'rev-' + Date.now(),
      date: new Date().toISOString().split('T')[0]
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('Thank you! Your product review has been posted.', 'success');
  };

  const placeOrder = (shippingAddress: { fullName: string; street: string; city: string; state: string; zip: string }, paymentMethod: string): Order => {
    const rawSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const discount = (rawSubtotal * promoDiscountPercent) / 100 + promoDiscountDollar;
    const discountedSubtotal = Math.max(0, rawSubtotal - discount);
    const taxRate = 0.0825;
    const tax = discountedSubtotal * taxRate;
    const shipping = appliedPromo === 'FREESHIP' || discountedSubtotal > 150 ? 0 : 9.99;
    const total = discountedSubtotal + tax + shipping;

    const orderItems = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      image: item.product.image
    }));

    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split('T')[0],
      items: orderItems,
      subtotal: rawSubtotal,
      discount,
      tax,
      shipping,
      total,
      status: 'Processing',
      shippingAddress,
      paymentMethod
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  // Bug Tracker Operations
  const toggleBugFound = (code: string) => {
    setFoundBugCodes((prev) => {
      const exists = prev.includes(code);
      if (exists) {
        showToast(`Unmarked ${code} from your found list.`, 'info');
        return prev.filter((c) => c !== code);
      } else {
        showToast(`🎉 Verified bug found: ${code}! Great job!`, 'bug');
        return [...prev, code];
      }
    });
  };

  const addUserBugReport = (report: Omit<UserBugReport, 'id' | 'reportedAt' | 'status'>) => {
    const newReport: UserBugReport = {
      ...report,
      id: 'REP-' + Date.now().toString().slice(-4),
      reportedAt: new Date().toISOString(),
      status: 'Open'
    };
    setUserBugReports((prev) => [newReport, ...prev]);
    showToast(`Bug Ticket [${newReport.id}] "${newReport.title}" created successfully!`, 'success');
  };

  const deleteUserBugReport = (id: string) => {
    setUserBugReports((prev) => prev.filter((r) => r.id !== id));
    showToast('Bug ticket removed.', 'info');
  };

  const resetAllData = () => {
    localStorage.removeItem('bugcraft_cart');
    localStorage.removeItem('bugcraft_found_bugs');
    localStorage.removeItem('bugcraft_user_bug_reports');
    localStorage.removeItem('bugcraft_orders');
    localStorage.removeItem('bugcraft_reviews');
    localStorage.removeItem('bugcraft_user');
    setCart([{ product: MOCK_PRODUCTS[0], quantity: 1 }]);
    setFoundBugCodes([]);
    setUserBugReports([]);
    setOrders(MOCK_ORDERS);
    setReviews(MOCK_REVIEWS);
    setUser(MOCK_USER);
    setAppliedPromo(null);
    setPromoDiscountPercent(0);
    setPromoDiscountDollar(0);
    showToast('All application and QA test state has been reset to baseline defaults.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        selectedProductId,
        viewProduct,
        user,
        login,
        register,
        logout,
        updateUser,
        products,
        reviews,
        addReview,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        appliedPromo,
        promoDiscountPercent,
        promoDiscountDollar,
        applyPromoCode,
        removePromoCode,
        orders,
        placeOrder,
        isBugMode,
        setIsBugMode,
        knownBugs: KNOWN_BUGS,
        foundBugCodes,
        toggleBugFound,
        userBugReports,
        addUserBugReport,
        deleteUserBugReport,
        resetAllData,
        isQADrawerOpen,
        setIsQADrawerOpen,
        qaDrawerInitialTab,
        openQADrawerToTab,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
