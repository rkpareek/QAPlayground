export type PageType = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'cart' 
  | 'checkout' 
  | 'login' 
  | 'register' 
  | 'profile' 
  | 'orders' 
  | 'contact' 
  | 'blog' 
  | 'qa-dashboard';

export type BugSeverity = 'Blocker' | 'Critical' | 'Major' | 'Minor' | 'Trivial';
export type BugCategory = 'Functional' | 'UI / Visual' | 'Validation' | 'Calculation & Data' | 'State & Navigation';

export interface Product {
  id: string;
  name: string;
  category: 'Audio' | 'Wearables' | 'Smart Home' | 'Accessories' | 'Laptops';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  description: string;
  inStock: boolean;
  stockCount: number;
  isFeatured?: boolean;
  specs: Record<string, string>;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone?: string;
  role: 'tester' | 'admin' | 'guest';
  memberSince: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  paymentMethod: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  verified: boolean;
}

export interface KnownBug {
  id: string;
  code: string; // e.g. "BUG-01"
  title: string;
  category: BugCategory;
  severity: BugSeverity;
  page: string;
  location: string;
  summary: string;
  stepsToReproduce: string[];
  expectedResult: string;
  actualResult: string;
  hint1: string;
  hint2: string;
  fixExplanation: string;
}

export interface UserBugReport {
  id: string;
  bugCode?: string;
  title: string;
  page: string;
  category: BugCategory;
  severity: BugSeverity;
  stepsToReproduce: string;
  actualResult: string;
  expectedResult: string;
  environment: string;
  reportedAt: string;
  status: 'Open' | 'In Review' | 'Verified' | 'Closed';
}

export interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  content: string[];
  tags: string[];
}
