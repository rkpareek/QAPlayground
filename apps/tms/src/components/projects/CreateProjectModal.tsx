import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FolderPlus,
  Layers,
  Sparkles,
  UserCheck,
  Palette,
  KeyRound,
  CheckCircle2,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const COLOR_OPTIONS = [
  { label: 'Blue', value: '#2563eb' },
  { label: 'Emerald', value: '#059669' },
  { label: 'Purple', value: '#7c3aed' },
  { label: 'Indigo', value: '#4f46e5' },
  { label: 'Amber', value: '#d97706' },
  { label: 'Rose', value: '#e11d48' },
  { label: 'Cyan', value: '#0891b2' },
  { label: 'Slate', value: '#475569' },
];

export const CreateProjectModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { users, currentUser, createProject, setNavSection } = useApp();

  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [isKeyManuallyEdited, setIsKeyManuallyEdited] = useState(false);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[0].value);
  const [ownerId, setOwnerId] = useState(currentUser.id || users[0]?.id || '');
  const [includeStarterAssets, setIncludeStarterAssets] = useState(true);

  if (!isOpen) return null;

  // Auto-generate project key from name if not manually edited
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isKeyManuallyEdited) {
      const generated = val
        .trim()
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, '')
        .split(/\s+/)
        .map((w) => w[0])
        .join('')
        .slice(0, 6);

      if (generated) {
        setKey(generated);
      } else if (val.trim()) {
        setKey(val.trim().slice(0, 4).toUpperCase());
      } else {
        setKey('');
      }
    }
  };

  const handleKeyChange = (val: string) => {
    setIsKeyManuallyEdited(true);
    setKey(val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !key.trim()) return;

    createProject({
      name: name.trim(),
      key: key.trim().toUpperCase(),
      description: description.trim() || `QA repository and test management for ${name.trim()}`,
      color,
      ownerId,
    });

    onClose();
    setNavSection('repository');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-xs"
              style={{ backgroundColor: color }}
            >
              {key ? key.substring(0, 2) : <FolderPlus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create New Project</h2>
              <p className="text-xs text-slate-500">Initialize a dedicated QA test management workspace</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Project Name */}
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mobile Banking App, Payment Gateway API"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden shadow-2xs"
            />
          </div>

          {/* Project Key (Prefix for TC, RUN, BUG) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <KeyRound className="w-3.5 h-3.5 text-blue-600" />
                <span>Project Key / Prefix</span> <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                maxLength={8}
                placeholder="e.g. MBANK, PAY"
                value={key}
                onChange={(e) => handleKeyChange(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-slate-300 font-mono font-bold text-blue-800 uppercase text-xs focus:ring-1 focus:ring-blue-500 outline-hidden"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Used for IDs (e.g. {key || 'PROJ'}-TC-0001, {key || 'PROJ'}-RUN-0001)
              </p>
            </div>

            {/* Project Lead / Owner */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                <span>Project Lead</span>
              </label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full px-2.5 py-2 rounded-md border border-slate-300 text-slate-900 text-xs bg-white focus:ring-1 focus:ring-blue-500 outline-hidden"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Project Color Picker */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-slate-500" />
              <span>Workspace Theme Color</span>
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                    color === c.value ? 'ring-2 ring-offset-2 ring-slate-800 scale-110' : 'hover:opacity-80'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                >
                  {color === c.value && <CheckCircle2 className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <textarea
              rows={2}
              placeholder="Scope, application architecture, test objectives, and team boundaries..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-md border border-slate-300 text-slate-900 text-xs outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Starter Assets Notice */}
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start gap-2.5 text-xs text-blue-900">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">Automated Workspace Provisioning</div>
              <p className="text-[11px] text-blue-800 mt-0.5">
                Automatically configures default QA & Staging environments, Release v1.0.0 milestone, and Root Functional Suite so you can start authoring and executing test cases immediately.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !key.trim()}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center gap-1.5 shadow-xs transition-colors disabled:opacity-50"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
