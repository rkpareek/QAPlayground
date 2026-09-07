import React, { useState } from 'react';
import { MOCK_BLOGS } from '../data/mockData';
import { BlogPost } from '../types';
import { BookOpen, Clock, User, ArrowRight, Tag, X, Share2, Sparkles, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BlogPage: React.FC = () => {
  const { showToast } = useApp();
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null);

  const handleShare = (title: string) => {
    navigator.clipboard.writeText(window.location.href);
    showToast(`Article link for "${title}" copied to clipboard!`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
          <BookOpen className="w-3.5 h-3.5" />
          <span>QA Knowledge Base</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Software Testing & QA Guides
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Practical strategies for black-box testing, defect reporting, boundary value analysis, and writing test charters.
        </p>
      </div>

      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MOCK_BLOGS.map((blog) => (
          <div
            key={blog.id}
            className="bg-white rounded-3xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all p-6 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {blog.category}
                </span>
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {blog.readTime}
                </span>
              </div>

              <h3 
                onClick={() => setSelectedBlog(blog)}
                className="font-extrabold text-base text-slate-900 hover:text-indigo-600 cursor-pointer transition-colors leading-snug"
              >
                {blog.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {blog.snippet}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700">
                  {blog.author.charAt(0)}
                </div>
                <span>{blog.author.split(',')[0]}</span>
              </div>

              <button
                onClick={() => setSelectedBlog(blog)}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                <span>Read Full</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Reader Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-start border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                  {selectedBlog.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-2">
                  {selectedBlog.title}
                </h2>
                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                  <span>By {selectedBlog.author}</span>
                  <span>•</span>
                  <span>{selectedBlog.date}</span>
                  <span>•</span>
                  <span>{selectedBlog.readTime}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedBlog(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
              {selectedBlog.content.map((p, idx) => (
                <p key={idx} className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                  {p}
                </p>
              ))}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedBlog.tags.map((t) => (
                <span key={t} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-slate-400" />
                  {t}
                </span>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => handleShare(selectedBlog.title)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </button>

              <button
                onClick={() => setSelectedBlog(null)}
                className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-500 shadow-xs"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
