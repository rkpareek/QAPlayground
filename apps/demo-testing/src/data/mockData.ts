import { Product, KnownBug, User, Order, BlogPost, ProductReview } from '../types';

export const KNOWN_BUGS: KnownBug[] = [
  {
    id: 'bug-1',
    code: 'BUG-01',
    title: 'Lexicographical (Alphabetical) Price Sort Glitch',
    category: 'Functional',
    severity: 'Major',
    page: 'Products Page',
    location: 'Sort Dropdown > "Price: Low to High"',
    summary: 'Products are sorted alphabetically by string price rather than numerically, causing $129.99 to appear before $29.99.',
    stepsToReproduce: [
      '1. Navigate to the Products page.',
      '2. In the "Sort By" dropdown, select "Price: Low to High".',
      '3. Observe the ordered list of product prices.'
    ],
    expectedResult: 'Products should be sorted in numeric ascending order (e.g., $19.99, $29.99, $49.99, $129.99, $349.99).',
    actualResult: 'Products are sorted as strings (e.g., $129.99, $199.99, $24.99, $349.99, $49.99) because "1" precedes "2".',
    hint1: 'Look at the prices when sorting "Low to High". Notice any $100+ items appearing before $20 items?',
    hint2: 'Check how numbers starting with digit 1 are grouped before numbers starting with digit 2.',
    fixExplanation: 'Convert price values to numbers with `Number(a.price) - Number(b.price)` before sorting instead of `String(a.price).localeCompare()`.',
  },
  {
    id: 'bug-2',
    code: 'BUG-02',
    title: 'Search Clear Button (X) Desync with Results',
    category: 'State & Navigation',
    severity: 'Minor',
    page: 'Products Page',
    location: 'Search Input Bar > "Clear (X)" button',
    summary: 'Clicking the "X" button clears the text in the input box, but the filtered list fails to update to show all products.',
    stepsToReproduce: [
      '1. Go to Products page.',
      '2. Type "Sony" or "Wireless" into the search bar to filter items.',
      '3. Click the "X" icon inside the search input to clear text.',
      '4. Observe the product grid below.'
    ],
    expectedResult: 'Clearing the search input should reset the active query filter and display all products.',
    actualResult: 'The input becomes empty, but the product catalog remains filtered by the previous search term.',
    hint1: 'Search for a specific product, then click the (X) clear icon inside the input box.',
    hint2: 'Notice whether the catalog resets back to showing all items or remains stuck on the filtered subset.',
    fixExplanation: 'The clear button handler only clears the local input string without triggering the parent query state update.',
  },
  {
    id: 'bug-3',
    code: 'BUG-03',
    title: 'Pagination Off-By-One Duplicate Item on Page 2',
    category: 'Calculation & Data',
    severity: 'Major',
    page: 'Products Page',
    location: 'Pagination navigation (Page 1 -> Page 2)',
    summary: 'Page 2 duplicates the last item displayed on Page 1 due to an off-by-one slice calculation.',
    stepsToReproduce: [
      '1. Navigate to Products page (ensure all categories are shown).',
      '2. Note the last item shown at the bottom of Page 1.',
      '3. Click "Page 2" in the pagination footer.',
      '4. Inspect the first item on Page 2.'
    ],
    expectedResult: 'Page 2 should strictly display unique subsequent items without repeating items from Page 1.',
    actualResult: 'The first product on Page 2 is identical to the last product on Page 1.',
    hint1: 'Compare the last card on Page 1 with the first card on Page 2.',
    hint2: 'Check if one product appears on both pages.',
    fixExplanation: 'Array slicing uses `(page - 1) * perPage - 1` instead of `(page - 1) * perPage`.',
  },
  {
    id: 'bug-4',
    code: 'BUG-04',
    title: 'Negative & Zero Quantity Input Bypass in Cart / Details',
    category: 'Validation',
    severity: 'Critical',
    page: 'Product Detail & Cart Page',
    location: 'Quantity input field',
    summary: 'Typing negative numbers (e.g. -2) or 0 into the quantity input field updates the cart and subtracts money from the total.',
    stepsToReproduce: [
      '1. Open any product detail page.',
      '2. Double click the quantity input box and manually type "-2" or "0".',
      '3. Click "Add to Cart".',
      '4. Open the Cart page and check the subtotal.'
    ],
    expectedResult: 'Quantity inputs should reject values <= 0 and force a minimum of 1.',
    actualResult: 'Negative quantities are accepted, resulting in negative subtotals and improper cart state.',
    hint1: 'Try typing a negative number or zero directly into the quantity box on the product page or cart.',
    hint2: 'Look at the subtotal when a negative quantity item is added to the cart.',
    fixExplanation: 'Missing validation on direct input `onChange` allows negative integers to pass through without `Math.max(1, value)`.',
  },
  {
    id: 'bug-5',
    code: 'BUG-05',
    title: 'Review Submission 0-Indexed Rating Offset (5 Stars -> 4 Stars)',
    category: 'Functional',
    severity: 'Major',
    page: 'Product Detail Page',
    location: 'Customer Reviews section > "Write a Review" star picker',
    summary: 'Selecting 5 stars assigns an internal rating value of 4 stars upon submission due to zero-based array indexing.',
    stepsToReproduce: [
      '1. Go to any product detail page.',
      '2. Scroll down to Customer Reviews and click "Write a Review".',
      '3. Click on the 5th star (all 5 stars highlight).',
      '4. Enter a title and comment, then click "Submit Review".',
      '5. Inspect the newly published review in the list.'
    ],
    expectedResult: 'The published review should display 5 out of 5 stars.',
    actualResult: 'The review is saved and displayed with only 4 stars.',
    hint1: 'Try submitting a 5-star review on any product.',
    hint2: 'Check how many stars the review has after it appears in the list.',
    fixExplanation: 'The star click handler passes the zero-based loop index `idx` directly instead of `idx + 1`.',
  },
  {
    id: 'bug-6',
    code: 'BUG-06',
    title: 'Promo Code Case-Sensitivity & Infinite Stacking Glitch',
    category: 'Calculation & Data',
    severity: 'Critical',
    page: 'Cart Page',
    location: 'Coupon / Promo Code input ("SAVE20")',
    summary: 'Coupon code "SAVE20" is rejected if typed in lowercase ("save20"), and repeatedly clicking "Apply" stacks 20% discounts consecutively.',
    stepsToReproduce: [
      '1. Add items to your cart and navigate to the Cart page.',
      '2. Type "save20" in lowercase and click "Apply" -> note the error.',
      '3. Type "SAVE20" in uppercase and click "Apply" -> discount is applied.',
      '4. Click the "Apply" button again multiple times.'
    ],
    expectedResult: 'Coupons should be case-insensitive, and applying the same coupon repeatedly should not compound discounts.',
    actualResult: 'Lowercase "save20" fails, and clicking Apply multiple times keeps reducing 20% off the remaining balance each time.',
    hint1: 'Try applying the promo code SAVE20 in lowercase "save20".',
    hint2: 'After applying SAVE20 once, click the Apply button a 2nd and 3rd time without clearing the box.',
    fixExplanation: 'Missing `.toUpperCase().trim()` on coupon check, and discount logic lacks a flag checking if a coupon is already applied.',
  },
  {
    id: 'bug-7',
    code: 'BUG-07',
    title: 'Unrounded Floating-Point Math in Tax Calculation',
    category: 'Calculation & Data',
    severity: 'Minor',
    page: 'Cart & Checkout Pages',
    location: 'Order Summary > Estimated Tax row',
    summary: 'Tax calculation displays raw JavaScript floating-point decimals like "$14.849999999999998" instead of rounding to 2 decimal places.',
    stepsToReproduce: [
      '1. Add items with fractional cents or specific totals (e.g. 2 items of $89.99).',
      '2. Go to the Cart page.',
      '3. Inspect the "Estimated Tax (8.25%)" row in the Order Summary box.'
    ],
    expectedResult: 'All monetary figures should be formatted as clean two-decimal currency strings ($XX.YY).',
    actualResult: 'The tax row displays long floating-point arithmetic artifacts ($XX.YYYYYYYYYYY).',
    hint1: 'Look at the "Estimated Tax" figure in the Cart summary when you have multiple items.',
    hint2: 'Notice the decimal precision in the tax amount.',
    fixExplanation: 'The tax formula calculates `subtotal * 0.0825` without applying `.toFixed(2)` or `Math.round`.',
  },
  {
    id: 'bug-8',
    code: 'BUG-08',
    title: 'Cart Subtotal Stale Cache When Deleting Last Item',
    category: 'State & Navigation',
    severity: 'Major',
    page: 'Cart Page',
    location: 'Cart Item list > Trash icon on last item',
    summary: 'Removing the final remaining item from the cart clears the list view but leaves the summary subtotal at the previous dollar amount.',
    stepsToReproduce: [
      '1. Add a single product to your cart.',
      '2. Open the Cart page.',
      '3. Click the trash / remove icon on the product row.',
      '4. Observe the Order Summary box on the right.'
    ],
    expectedResult: 'When cart is empty, Subtotal, Tax, and Total should be $0.00.',
    actualResult: 'Cart items table is empty, but Order Summary retains the previous non-zero subtotal and checkout button remains active.',
    hint1: 'Put 1 item in your cart, go to Cart, and delete that single item.',
    hint2: 'Check if the Order Summary subtotal on the right resets to $0.00 or stays stuck on the previous price.',
    fixExplanation: 'The subtotal calculation skips recalculation when `cartItems.length === 0` due to a flawed early return.',
  },
  {
    id: 'bug-9',
    code: 'BUG-09',
    title: 'Password Reveal Icon Desync on Registration Form',
    category: 'UI / Visual',
    severity: 'Minor',
    page: 'Registration Page',
    location: 'Confirm Password Field > Eye toggle icon',
    summary: 'Toggling the eye icon on the Confirm Password field toggles the icon visual but fails to change the input type from password to text.',
    stepsToReproduce: [
      '1. Navigate to the Register page (/register).',
      '2. Enter text into "Password" and "Confirm Password" fields.',
      '3. Click the eye icon on the "Confirm Password" field.',
      '4. Observe whether the characters are unmasked.'
    ],
    expectedResult: 'Clicking the eye icon on Confirm Password should toggle the characters between masked bullets and plain text.',
    actualResult: 'The icon changes from Eye to Eye-Off, but the input type remains "password", keeping characters hidden.',
    hint1: 'On the Register form, test the eye reveal button on the "Confirm Password" input.',
    hint2: 'Does the input text actually reveal or does only the icon toggle?',
    fixExplanation: 'The `type` prop on the Confirm Password input is hardcoded to `"password"` instead of dynamic `showConfirmPassword ? "text" : "password"`.',
  },
  {
    id: 'bug-10',
    code: 'BUG-10',
    title: 'Checkout Accepts Expired Credit Card Expiry Dates',
    category: 'Validation',
    severity: 'Critical',
    page: 'Checkout Page',
    location: 'Payment Method > Card Expiry MM/YY field',
    summary: 'Entering an expired card date (e.g., "01/20" or "05/19") passes form validation and completes order placement.',
    stepsToReproduce: [
      '1. Add items to cart and proceed to Checkout.',
      '2. Fill in required shipping details.',
      '3. In the Payment section, enter any 16-digit card number.',
      '4. Set Expiry Date to "01/20" (a past date) and enter a 3-digit CVV.',
      '5. Click "Complete Order".'
    ],
    expectedResult: 'The form should reject past expiry dates and display an error: "Card has expired".',
    actualResult: 'The order succeeds without any validation warning regarding the expired date.',
    hint1: 'During checkout, try entering a date in the past for the card expiration (like 01/20).',
    hint2: 'See if the system allows placing an order with an expired card.',
    fixExplanation: 'Card validation only checks regex format `\\d{2}/\\d{2}` without parsing month/year against current date.',
  },
  {
    id: 'bug-11',
    code: 'BUG-11',
    title: 'Character Counter Counts Up Instead of Down',
    category: 'UI / Visual',
    severity: 'Minor',
    page: 'Contact Us Page',
    location: 'Message / Feedback Textarea > Remaining characters counter',
    summary: 'The counter below the message area states "500 characters remaining", but typing characters increases the number (501, 502, etc.).',
    stepsToReproduce: [
      '1. Navigate to the Contact Us page.',
      '2. Scroll down to the message textarea.',
      '3. Observe the initial text: "500 characters remaining".',
      '4. Type 5 characters into the textarea.'
    ],
    expectedResult: 'The counter should decrease from 500 down to 495 (500 - length).',
    actualResult: 'The counter increases to "505 characters remaining" (500 + length).',
    hint1: 'Go to the Contact Us page and type a few sentences in the message box.',
    hint2: 'Watch the "characters remaining" text beneath the box as you type.',
    fixExplanation: 'The calculation uses `500 + text.length` instead of `500 - text.length`.',
  },
  {
    id: 'bug-12',
    code: 'BUG-12',
    title: 'Profile Avatar Selection Does Not Persist on Navigation',
    category: 'State & Navigation',
    severity: 'Major',
    page: 'User Profile Page',
    location: 'Profile Details > Avatar selector',
    summary: 'Selecting a new avatar updates the header temporarily in the current view, but navigating away resets it to default.',
    stepsToReproduce: [
      '1. Log in and go to the Profile page (/profile).',
      '2. Click on a different avatar from the avatar selector list.',
      '3. Click "Save Profile Changes" (a success toast appears).',
      '4. Click on "Products" in the top navbar, then click back to "Profile".'
    ],
    expectedResult: 'The selected avatar should persist across page navigation and session state.',
    actualResult: 'The avatar reverts back to the initial default avatar upon navigating away.',
    hint1: 'On your Profile page, choose a different avatar and click Save.',
    hint2: 'Navigate to Products page and check the top-right profile icon or return to Profile.',
    fixExplanation: 'The profile save function updates local component state instead of dispatching the update to global AppContext / storage.',
  },
  {
    id: 'bug-13',
    code: 'BUG-13',
    title: 'Featured Product Card Action Button Text Wrap & Icon Overlap',
    category: 'UI / Visual',
    severity: 'Minor',
    page: 'Home Page & Products Grid',
    location: 'Featured Product Card #3 ("Noise-Cancelling Pro Headphones")',
    summary: 'The "Add to Cart" button has a fixed rigid width class (`w-24`) that causes button text to wrap awkwardly across two lines and overlap the cart icon.',
    stepsToReproduce: [
      '1. Go to the Home Page or Products Page.',
      '2. Locate Product #3: "Noise-Cancelling Pro Headphones".',
      '3. Inspect the "Add to Cart" button styling and text alignment.'
    ],
    expectedResult: 'The button should flex or fit its content cleanly with proper padding and no text wrapping or overlapping icons.',
    actualResult: 'Text is broken into "Add to" and "Cart" on two tight lines colliding with the shopping bag icon.',
    hint1: 'Look closely at the buttons on the product cards on the Home and Products page.',
    hint2: 'Compare the "Add to Cart" button on the 3rd product (Noise-Cancelling Pro) with the other product buttons.',
    fixExplanation: 'Card #3 button has an accidental inline class `w-20 overflow-hidden leading-3` causing layout compression.',
  },
  {
    id: 'bug-14',
    code: 'BUG-14',
    title: 'Trailing Whitespace in Email Triggers Invalid Format Error',
    category: 'Validation',
    severity: 'Major',
    page: 'Login & Registration Page',
    location: 'Email address input field',
    summary: 'Copy-pasting or typing an email address with a trailing space (e.g. "tester@testcraft.io ") causes an invalid email format error instead of auto-trimming.',
    stepsToReproduce: [
      '1. Open the Login page.',
      '2. Type or paste "tester@testcraft.io " (with a space at the end) into the email input.',
      '3. Type "password123" in the password field.',
      '4. Click "Sign In".'
    ],
    expectedResult: 'Emails should be trimmed automatically so trailing spaces do not cause validation failures.',
    actualResult: 'Error message appears: "Please enter a valid email address".',
    hint1: 'Try logging in with "tester@testcraft.io " (add a space at the end of the email).',
    hint2: 'Check whether the system trims whitespace or fails validation.',
    fixExplanation: 'Regex test runs on raw input without calling `.trim()` before validation.',
  },
  {
    id: 'bug-15',
    code: 'BUG-15',
    title: 'Order Status Filter Case-Sensitivity Returns Zero Results',
    category: 'Functional',
    severity: 'Major',
    page: 'Order History / Profile Page',
    location: 'Orders Tab > Filter by "Delivered"',
    summary: 'Filtering order history by "Delivered" shows "No orders found" because the filter checks for capitalized "Delivered" while order objects store lowercase "delivered".',
    stepsToReproduce: [
      '1. Log in with demo account (`tester@testcraft.io`).',
      '2. Navigate to Profile > "Order History" tab (or click Orders in navbar).',
      '3. Observe the pre-loaded orders (there is a delivered order present).',
      '4. Select the "Delivered" filter tab.'
    ],
    expectedResult: 'The filtered view should display all orders that have been successfully delivered.',
    actualResult: 'Displays "No orders found matching Delivered" even though delivered orders exist in the account.',
    hint1: 'View your Orders in your profile where you have multiple past orders.',
    hint2: 'Click the "Delivered" filter tab and see if delivered orders show up.',
    fixExplanation: 'Filter condition compares `order.status === filter` without normalizing both with `.toLowerCase()`.',
  }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'AeroPulse Wireless Earbuds',
    category: 'Audio',
    price: 49.99,
    originalPrice: 79.99,
    rating: 4.6,
    reviewCount: 128,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Ultra-lightweight true wireless earbuds featuring active noise cancellation, transparency mode, and up to 32 hours of battery life with the wireless charging case.',
    inStock: true,
    stockCount: 42,
    isFeatured: true,
    specs: {
      'Battery Life': '8h single charge (32h with case)',
      'Connectivity': 'Bluetooth 5.3',
      'Water Resistance': 'IPX5 Sweat & Splash Proof',
      'Driver Size': '11mm Dynamic'
    },
    tags: ['wireless', 'earbuds', 'anc', 'audio']
  },
  {
    id: 'prod-2',
    name: 'TitanTrack Pro Smartwatch',
    category: 'Wearables',
    price: 199.99,
    originalPrice: 249.99,
    rating: 4.8,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Rugged titanium fitness smartwatch with advanced SpO2, continuous ECG monitoring, built-in dual-band GPS, and comprehensive workout tracking.',
    inStock: true,
    stockCount: 18,
    isFeatured: true,
    specs: {
      'Display': '1.43" AMOLED Sapphire Glass',
      'Battery Life': 'Up to 14 Days',
      'Water Rating': '5 ATM / 50 meters',
      'Sensors': 'Optical Heart Rate, SpO2, ECG, Barometer'
    },
    tags: ['smartwatch', 'fitness', 'wearable', 'gps']
  },
  {
    id: 'prod-3',
    name: 'Noise-Cancelling Pro Headphones',
    category: 'Audio',
    price: 129.99,
    originalPrice: 179.99,
    rating: 4.7,
    reviewCount: 215,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Premium over-ear studio headphones featuring hybrid active noise cancellation, plush memory foam ear cushions, and lossless audio reproduction.',
    inStock: true,
    stockCount: 27,
    isFeatured: true,
    specs: {
      'Frequency Response': '20Hz - 40kHz High-Res',
      'Battery Life': '40 Hours Playback',
      'Weight': '250g Lightweight',
      'Codec Support': 'LDAC, AAC, SBC'
    },
    tags: ['headphones', 'anc', 'over-ear', 'hifi']
  },
  {
    id: 'prod-4',
    name: 'LuminaGlow Smart Ambient Lamp',
    category: 'Smart Home',
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.3,
    reviewCount: 68,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'WiFi & Bluetooth enabled RGB mood lamp with 16 million colors, dynamic scene modes, music sync synchronization, and Alexa / Google Assistant voice control.',
    inStock: true,
    stockCount: 55,
    isFeatured: true,
    specs: {
      'Brightness': '800 Lumens Dimmable',
      'Power': '12W Energy Efficient',
      'Wireless': 'WiFi 2.4GHz + BLE',
      'App Support': 'iOS & Android'
    },
    tags: ['smarthome', 'lighting', 'rgb', 'alexa']
  },
  {
    id: 'prod-5',
    name: 'OmniDesk Ultra Stand & Dock',
    category: 'Accessories',
    price: 349.99,
    originalPrice: 399.99,
    rating: 4.9,
    reviewCount: 41,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Solid aluminum ergonomic laptop riser integrated with a 12-in-1 Thunderbolt 4 hub, dual 4K 60Hz display outputs, and 100W Power Delivery.',
    inStock: true,
    stockCount: 12,
    isFeatured: false,
    specs: {
      'Ports': '2x TB4, 3x USB-A 3.2, 1x HDMI 2.1, 1x DP 1.4, SD 4.0, Gigabit LAN',
      'Material': 'Space Gray Anodized Aluminum',
      'Power Delivery': '100W Max Passthrough'
    },
    tags: ['dock', 'accessories', 'workspace', 'thunderbolt']
  },
  {
    id: 'prod-6',
    name: 'SwiftKey Wireless Mechanical Board',
    category: 'Accessories',
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.5,
    reviewCount: 112,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80'
    ],
    description: '75% compact mechanical keyboard with hot-swappable tactile switches, per-key RGB backlighting, and seamless triple-mode wireless connectivity.',
    inStock: true,
    stockCount: 34,
    isFeatured: true,
    specs: {
      'Layout': '75% Compact (84 Keys)',
      'Switches': 'Gateron Brown Tactile (Hot-Swap)',
      'Battery': '4000mAh (Up to 200h)',
      'Connectivity': '2.4GHz + BT 5.1 + USB-C'
    },
    tags: ['keyboard', 'mechanical', 'rgb', 'accessories']
  },
  {
    id: 'prod-7',
    name: 'Zenith 4K UHD Webcam Pro',
    category: 'Accessories',
    price: 74.99,
    originalPrice: 99.99,
    rating: 4.4,
    reviewCount: 53,
    image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Professional streaming webcam with 4K resolution at 30fps / 1080p 60fps, dual noise-cancelling microphones, HDR image tuning, and physical privacy shutter.',
    inStock: true,
    stockCount: 22,
    isFeatured: false,
    specs: {
      'Resolution': '4K UHD (3840x2160) 30FPS',
      'Field of View': '90° Wide Angle',
      'Microphone': 'Dual Stereo Mic with AI Noise Reduction'
    },
    tags: ['webcam', 'streaming', 'camera', 'accessories']
  },
  {
    id: 'prod-8',
    name: 'HyperCharge 100W GaN Travel Charger',
    category: 'Accessories',
    price: 39.99,
    originalPrice: 49.99,
    rating: 4.8,
    reviewCount: 180,
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Next-generation Gallium Nitride (GaN) fast charger with 3 USB-C and 1 USB-A ports, capable of charging laptops, tablets, and phones simultaneously at peak speed.',
    inStock: true,
    stockCount: 60,
    isFeatured: false,
    specs: {
      'Total Output': '100W Max',
      'Technology': 'GaN III Fast Charging',
      'Ports': '3x USB-C PD 3.0, 1x USB-A QC 4.0+'
    },
    tags: ['charger', 'gan', 'usbc', 'power']
  },
  {
    id: 'prod-9',
    name: 'NovaBook Carbon Ultra Laptop',
    category: 'Laptops',
    price: 1299.99,
    originalPrice: 1499.99,
    rating: 4.9,
    reviewCount: 37,
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Featherweight 14-inch flagship laptop powered by latest 12-core processor, 32GB LPDDR5X RAM, 1TB NVMe Gen4 SSD, and stunning 3K 120Hz OLED display.',
    inStock: true,
    stockCount: 8,
    isFeatured: true,
    specs: {
      'Processor': '12-Core 4.8GHz Ultra Turbo',
      'RAM': '32GB LPDDR5X',
      'Storage': '1TB NVMe PCIe 4.0 SSD',
      'Weight': '1.18 kg Carbon Fiber Chassis'
    },
    tags: ['laptop', 'ultrabook', 'oled', 'computing']
  }
];

export const MOCK_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    author: 'Alex Morgan',
    rating: 5,
    date: '2026-08-15',
    title: 'Outstanding battery life and sound quality!',
    comment: 'The noise cancellation blocks out all office chatter and train commutes. Very comfortable to wear all day without ear fatigue.',
    verified: true
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    author: 'Sarah Chen',
    rating: 4,
    date: '2026-08-10',
    title: 'Great value for money',
    comment: 'Pairing with both my phone and laptop works smoothly. The microphone could be slightly crisper in windy environments, but overall fantastic.',
    verified: true
  },
  {
    id: 'rev-3',
    productId: 'prod-3',
    author: 'David K.',
    rating: 5,
    date: '2026-08-20',
    title: 'Studio quality bass response',
    comment: 'These are hands down the most comfortable over-ear headphones I have owned in this price tier. Highs are crisp, lows are punchy.',
    verified: true
  }
];

export const MOCK_USER: User = {
  id: 'user-1',
  name: 'Taylor Tester',
  email: 'tester@testcraft.io',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  phone: '+1 (555) 234-5678',
  role: 'tester',
  memberSince: 'August 2026',
  shippingAddress: {
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zipCode: '97477',
    country: 'United States'
  }
};

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-9402',
    date: '2026-08-24',
    items: [
      {
        productId: 'prod-1',
        productName: 'AeroPulse Wireless Earbuds',
        price: 49.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'
      },
      {
        productId: 'prod-4',
        productName: 'LuminaGlow Smart Ambient Lamp',
        price: 24.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 99.97,
    discount: 10.00,
    tax: 7.42,
    shipping: 0.00,
    total: 97.39,
    status: 'Delivered',
    shippingAddress: {
      fullName: 'Taylor Tester',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zip: '97477'
    },
    paymentMethod: 'Credit Card ending in •••• 4242'
  },
  {
    id: 'ORD-8711',
    date: '2026-08-28',
    items: [
      {
        productId: 'prod-2',
        productName: 'TitanTrack Pro Smartwatch',
        price: 199.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'
      }
    ],
    subtotal: 199.99,
    discount: 0,
    tax: 16.50,
    shipping: 9.99,
    total: 226.48,
    status: 'Shipped',
    shippingAddress: {
      fullName: 'Taylor Tester',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      zip: '97477'
    },
    paymentMethod: 'Credit Card ending in •••• 4242'
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'A QA Guide: The Anatomy of a High-Impact Bug Report',
    snippet: 'Learn how great software testers formulate bug titles, isolate reproduction steps, identify root causes, and write actionable expected vs actual results.',
    author: 'Marcus Vance, Lead QA Architect',
    date: 'Aug 28, 2026',
    readTime: '6 min read',
    category: 'Best Practices',
    tags: ['QA', 'Bug Reporting', 'Software Testing'],
    content: [
      'Writing an effective bug report is both a technical discipline and an art form. When developers open a ticket, their speed to resolve the bug depends almost entirely on the clarity and reproducibility of your documentation.',
      'Always start with a descriptive, concise title that explains WHAT went wrong, WHERE it happened, and under WHAT conditions. For example: "[Cart] Applying coupon code in lowercase triggers invalid error instead of auto-normalizing".',
      'Isolate the exact steps to reproduce. Remove all unnecessary user actions so any developer or teammate can trigger the issue in under 30 seconds.',
      'Clearly delineate Expected Behavior from Actual Behavior. Never write "It does not work." Explain what data, state, visual alignment, or HTTP response was received versus what the business requirements specify.'
    ]
  },
  {
    id: 'blog-2',
    title: 'Mastering Boundary Value Analysis and Equivalence Partitioning',
    snippet: 'Explore the two most essential black-box test design techniques for catching numeric edge cases, off-by-one errors, and validation gaps.',
    author: 'Elena Rostova, Senior SDET',
    date: 'Aug 25, 2026',
    readTime: '8 min read',
    category: 'Testing Techniques',
    tags: ['BVA', 'Equivalence Classes', 'Black-Box Testing'],
    content: [
      'Boundary Value Analysis (BVA) is founded on the empirical truth that bugs congregate around input boundaries. If an input field accepts values between 1 and 100, the most critical test points are 0, 1, 2, 99, 100, and 101.',
      'Equivalence Partitioning divides your input domain into valid and invalid classes. Testing one representative value from each class gives high test confidence with minimal test execution cost.',
      'In e-commerce systems, always test negative quantities, string inputs into numeric fields, zero values, and extreme floating-point numbers.'
    ]
  },
  {
    id: 'blog-3',
    title: 'Top 10 Most Common Front-End Defects in Modern Web Applications',
    snippet: 'From stale state closures and race conditions to CSS overflow clipping and desynchronized form controls, here are the defects to look for.',
    author: 'Jordan Hayes, QA Consultant',
    date: 'Aug 20, 2026',
    readTime: '5 min read',
    category: 'Defect Analysis',
    tags: ['Front-End', 'UI Testing', 'State Management'],
    content: [
      'Front-end applications are filled with subtle defects that automated unit tests often miss. Visual desynchronization between input type and icon states is a classic example.',
      'Another frequent trap is string comparison sorting on numbers, where JavaScript default `.sort()` converts numbers to strings before comparison.',
      'State persistence bugs occur when components mutate local state without syncing to the root storage or context layer, causing changes to vanish upon route change.'
    ]
  }
];
