import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Bug, 
  CheckCircle2, 
  Sparkles,
  Phone,
  Clock
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { isBugMode, openQADrawerToTab, showToast } = useApp();

  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('Order Issue');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // BUG-11: Character counter counts UP instead of down when in Bug Mode!
  const maxLimit = 500;
  const remainingChars = isBugMode
    ? maxLimit + contactMessage.length // BUG-11: Increments from 500 up to 501, 502, ...
    : Math.max(0, maxLimit - contactMessage.length); // Fixed: Decrements to 0

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    setSubmitted(true);
    showToast('Your inquiry has been received by our QA support team.', 'success');
  };

  const faqs = [
    {
      q: 'How do I use this QA testing playground effectively?',
      a: 'Navigate through different sections (Products, Cart, Checkout, Login, Profile, Contact). Try unusual inputs, negative quantities, case variations, and observe any layout or calculation glitches. Use the QA Companion Drawer to record tickets and review hints!'
    },
    {
      q: 'What types of bugs are hidden throughout the application?',
      a: 'The app contains 15 deliberate bugs covering Boundary Value Analysis, Lexicographical Price Sorting, Password Masking State Desynchronization, Promo Code Stacking, Floating Point Currency Math, Trailing Whitespace Validation, and Case-Sensitive Filters.'
    },
    {
      q: 'Can I export my found bug reports for a portfolio or interview?',
      a: 'Yes! Open the QA Bug Tracker drawer or visit the QA Dashboard tab. You can export all your logged bug tickets formatted in professional Markdown (.md) or JSON.'
    },
    {
      q: 'How does the "Fixed Mode" toggle work?',
      a: 'Switching between "Buggy Mode" and "Fixed Mode" lets you see the intended correct behavior of each component, helping you verify how developers resolve reported bugs.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header & Target Bug Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-indigo-600" />
            QA Support & Contact Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Submit inquiries, request testing assistance, or report simulated platform bugs.
          </p>
        </div>

        <button
          onClick={() => openQADrawerToTab('bugs')}
          className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200 flex items-center gap-2"
        >
          <Bug className="w-4 h-4 text-rose-600" />
          <span>Target Bug on this Page: BUG-11 (Character Counter Counts Up)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Contact Form */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-900">
              Send us a Message
            </h2>
            <p className="text-xs text-slate-500">
              Our QA lab engineering team reviews all feedback within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Message Sent Successfully!</h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Thank you for your feedback. We have dispatched a simulated ticket to our customer desk.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setContactMessage('');
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Alex Morgan"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    id="contact-name-input"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    placeholder="alex@testcraft.io"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    id="contact-email-input"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Topic / Department
                </label>
                <select
                  value={contactCategory}
                  onChange={(e) => setContactCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                >
                  <option value="Order Issue">Order & Delivery Issue</option>
                  <option value="Product Hardware">Product Technical Support</option>
                  <option value="QA Bug Report">Reporting a Software Defect</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              {/* Message Textarea (BUG-11 Character Counter) */}
              <div className="space-y-1">
                <label className="block font-semibold text-slate-700">
                  Message Details *
                </label>
                <textarea
                  rows={5}
                  placeholder="Describe your question, defect observation, or request in detail..."
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                  id="contact-message-textarea"
                />

                {/* Character Counter Display (BUG-11: Counts up from 500 in bug mode) */}
                <div className="flex justify-between items-center text-[11px] pt-1">
                  <span className="text-slate-400">
                    Maximum 500 characters
                  </span>
                  <span className={`font-mono font-bold ${isBugMode && contactMessage.length > 0 ? 'text-rose-600' : 'text-slate-600'}`}>
                    {remainingChars} characters remaining
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Tip: Type a few characters and watch the remaining count increment instead of decrement (BUG-11).
                </span>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2"
                  id="contact-submit-btn"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right Column: FAQ Accordion & Lab Information */}
        <div className="lg:col-span-5 space-y-6">
          {/* FAQ Accordion */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-indigo-600" />
              Frequently Asked Questions
            </h3>

            <div className="divide-y divide-slate-100 space-y-2 pt-2">
              {faqs.map((faq, idx) => (
                <div key={idx} className="pt-3 first:pt-0">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full text-left font-bold text-xs text-slate-900 hover:text-indigo-600 flex justify-between items-center py-1 transition-colors"
                  >
                    <span>{faq.q}</span>
                    {openFaqIndex === idx ? (
                      <ChevronUp className="w-4 h-4 text-indigo-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {openFaqIndex === idx && (
                    <p className="text-xs text-slate-600 pt-2 pb-1 leading-relaxed animate-in fade-in">
                      {faq.a}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Contact Cards */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <Phone className="w-4 h-4 text-indigo-600" />
              <h5 className="font-bold text-slate-900">Support Desk</h5>
              <p className="text-slate-500">+1 (800) 555-TEST</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h5 className="font-bold text-slate-900">Operating Hours</h5>
              <p className="text-slate-500">24/7 Sandbox Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
