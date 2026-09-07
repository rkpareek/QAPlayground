import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CustomField, CustomFieldType, CustomFieldOption } from '../../types';
import {
  Sliders,
  Plus,
  Type,
  AlignLeft,
  Hash,
  ListFilter,
  CheckSquare,
  Calendar,
  UserCheck,
  Link,
  Edit2,
  Trash2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Layers,
} from 'lucide-react';

export const CustomFieldsManagementTab: React.FC = () => {
  const {
    customFields,
    testCases,
    currentUser,
    projects,
    createCustomField,
    updateCustomField,
    deleteCustomField,
    addToast,
  } = useApp();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<CustomField | null>(null);

  // Form State
  const [fieldName, setFieldName] = useState('');
  const [fieldKey, setFieldKey] = useState('');
  const [fieldType, setFieldType] = useState<CustomFieldType>('text');
  const [fieldDescription, setFieldDescription] = useState('');
  const [fieldPlaceholder, setFieldPlaceholder] = useState('');
  const [isRequired, setIsRequired] = useState(false);
  const [targetProjectId, setTargetProjectId] = useState<string>('all');
  const [appliesTo, setAppliesTo] = useState<'test_case' | 'test_run' | 'defect'>('test_case');

  // Options for Dropdown / Multi-select
  const [optionsString, setOptionsString] = useState('');

  const isOwnerOrAdmin =
    currentUser.role === 'owner' ||
    currentUser.isOwner ||
    currentUser.role === 'admin' ||
    currentUser.role === 'qa_lead';

  const FIELD_TYPE_CONFIG: Record<
    CustomFieldType,
    { label: string; icon: React.ReactNode; desc: string; sample: string }
  > = {
    text: { label: 'Short Text', icon: <Type className="w-4 h-4 text-blue-500" />, desc: 'Single-line input, tickets, identifiers', sample: 'e.g. CORE-1092' },
    long_text: { label: 'Paragraph Text', icon: <AlignLeft className="w-4 h-4 text-purple-500" />, desc: 'Multi-line notes and markdown', sample: 'Detailed steps...' },
    number: { label: 'Numeric Value', icon: <Hash className="w-4 h-4 text-emerald-500" />, desc: 'Execution SLA, retry counts, latency', sample: 'e.g. 5' },
    dropdown: { label: 'Single Select', icon: <ListFilter className="w-4 h-4 text-amber-500" />, desc: 'Choice of enumerated options', sample: 'PCI-DSS, SOC2' },
    multi_select: { label: 'Multi-Select', icon: <Layers className="w-4 h-4 text-indigo-500" />, desc: 'Select multiple tag attributes', sample: 'Chrome, Firefox, Safari' },
    multiselect: { label: 'Multi-Select', icon: <Layers className="w-4 h-4 text-indigo-500" />, desc: 'Select multiple tag attributes', sample: 'Chrome, Firefox, Safari' },
    checkbox: { label: 'Boolean Checkbox', icon: <CheckSquare className="w-4 h-4 text-teal-500" />, desc: 'True/False toggles', sample: 'Yes / No' },
    boolean: { label: 'Boolean Checkbox', icon: <CheckSquare className="w-4 h-4 text-teal-500" />, desc: 'True/False toggles', sample: 'Yes / No' },
    date: { label: 'Date Picker', icon: <Calendar className="w-4 h-4 text-rose-500" />, desc: 'Target milestones, signoff dates', sample: 'YYYY-MM-DD' },
    user: { label: 'Workspace User', icon: <UserCheck className="w-4 h-4 text-cyan-500" />, desc: 'Secondary reviewer or signatory', sample: 'Select team member' },
    url: { label: 'Web URL / Link', icon: <Link className="w-4 h-4 text-orange-500" />, desc: 'Figma specs, Confluence PRD URLs', sample: 'https://...' },
  };

  const handleOpenCreate = () => {
    setFieldName('');
    setFieldKey('');
    setFieldType('text');
    setFieldDescription('');
    setFieldPlaceholder('');
    setIsRequired(false);
    setTargetProjectId('all');
    setAppliesTo('test_case');
    setOptionsString('');
    setIsCreateModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    setFieldName(val);
    if (!fieldKey || fieldKey === fieldName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')) {
      const generatedKey = val
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
          index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '')
        .replace(/[^a-zA-Z0-9]/g, '');
      setFieldKey(generatedKey);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fieldName.trim()) return;

    const parsedOptions =
      fieldType === 'dropdown' || fieldType === 'multi_select'
        ? optionsString
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

    createCustomField({
      name: fieldName.trim(),
      key: fieldKey.trim() || fieldName.trim().toLowerCase().replace(/\s+/g, '_'),
      type: fieldType,
      description: fieldDescription.trim(),
      placeholder: fieldPlaceholder.trim(),
      required: isRequired,
      projectId: targetProjectId,
      appliesTo,
      options: parsedOptions,
    });

    setIsCreateModalOpen(false);
  };

  const handleOpenEdit = (field: CustomField) => {
    setSelectedField(field);
    setFieldName(field.name);
    setFieldKey(field.key);
    setFieldType(field.type);
    setFieldDescription(field.description || '');
    setFieldPlaceholder(field.placeholder || '');
    setIsRequired(field.required || false);
    setTargetProjectId(field.projectId || 'all');
    setAppliesTo(field.appliesTo || 'test_case');
    setOptionsString((field.options || []).join('\n'));
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedField) return;

    const parsedOptions =
      fieldType === 'dropdown' || fieldType === 'multi_select'
        ? optionsString
            .split('\n')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined;

    updateCustomField(selectedField.id, {
      name: fieldName.trim(),
      key: fieldKey.trim(),
      type: fieldType,
      description: fieldDescription.trim(),
      placeholder: fieldPlaceholder.trim(),
      required: isRequired,
      projectId: targetProjectId,
      appliesTo,
      options: parsedOptions,
    });

    setIsEditModalOpen(false);
    setSelectedField(null);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Custom Fields Engine</h2>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              {customFields.length} Defined Attributes
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Extend test case schemas with custom input fields (Jira ticket links, compliance frameworks, hardware flags, reviewer assignments).
          </p>
        </div>

        {isOwnerOrAdmin && (
          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Field</span>
          </button>
        )}
      </div>

      {/* Custom Fields Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">Field Name & Key</th>
                <th className="py-3 px-4">Field Type</th>
                <th className="py-3 px-4">Scope</th>
                <th className="py-3 px-4">Configuration / Options</th>
                <th className="py-3 px-4">Requirement</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {customFields.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No custom fields configured. Click "Add Custom Field" to extend the schema.
                  </td>
                </tr>
              ) : (
                customFields.map((field) => {
                  const typeCfg = FIELD_TYPE_CONFIG[field.type] || FIELD_TYPE_CONFIG.text;
                  const project = projects.find((p) => p.id === field.projectId);
                  const isGlobal = !field.projectId || field.projectId === 'all';

                  return (
                    <tr key={field.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-bold text-slate-900">{field.name}</span>
                          <div className="text-[11px] text-slate-500 font-mono">key: {field.key}</div>
                          {field.description && (
                            <div className="text-[10px] text-slate-400 mt-0.5">{field.description}</div>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 w-fit">
                          {typeCfg.icon}
                          <span>{typeCfg.label}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {isGlobal ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                            Global (All Projects)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {project?.name || field.projectId}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {field.options && field.options.length > 0 ? (
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {field.options.map((opt) => (
                              <span
                                key={opt}
                                className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-600 border border-slate-200"
                              >
                                {opt}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">
                            {field.placeholder ? `placeholder: "${field.placeholder}"` : 'Standard input'}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        {field.required ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Required *
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600">
                            Optional
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isOwnerOrAdmin && (
                            <>
                              <button
                                onClick={() => handleOpenEdit(field)}
                                className="p-1.5 rounded border border-slate-200 hover:bg-slate-100 text-slate-600 font-semibold"
                                title="Edit Field"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Remove custom field "${field.name}"? Existing data in test cases will remain intact.`)) {
                                    deleteCustomField(field.id);
                                  }
                                }}
                                className="p-1.5 rounded border border-slate-200 hover:bg-red-50 hover:text-red-700 text-slate-400"
                                title="Delete Field"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: CREATE CUSTOM FIELD */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Create New Custom Field</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Field Label <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Compliance Tier"
                    value={fieldName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Field Key (JSON API) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="complianceTier"
                    value={fieldKey}
                    onChange={(e) => setFieldKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-mono"
                  />
                </div>
              </div>

              {/* Field Type Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Field Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.keys(FIELD_TYPE_CONFIG) as CustomFieldType[]).map((typeKey) => {
                    const cfg = FIELD_TYPE_CONFIG[typeKey];
                    const isSelected = fieldType === typeKey;
                    return (
                      <button
                        key={typeKey}
                        type="button"
                        onClick={() => setFieldType(typeKey)}
                        className={`p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-500'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          {cfg.icon}
                          <span className="font-bold text-slate-900 text-[11px]">{cfg.label}</span>
                        </div>
                        <span className="text-[10px] text-slate-500 leading-tight">{cfg.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dropdown Options Input if dropdown/multi_select */}
              {(fieldType === 'dropdown' || fieldType === 'multi_select') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Selectable Options (One per line)
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Option 1&#10;Option 2&#10;Option 3"
                    value={optionsString}
                    onChange={(e) => setOptionsString(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-mono"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Scope</label>
                  <select
                    value={targetProjectId}
                    onChange={(e) => setTargetProjectId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                  >
                    <option value="all">Global (All Projects)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Applies To</label>
                  <select
                    value={appliesTo}
                    onChange={(e) => setAppliesTo(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                  >
                    <option value="test_case">Test Cases</option>
                    <option value="test_run">Test Runs</option>
                    <option value="defect">Defects / Bugs</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Placeholder Text (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Enter external reference code..."
                  value={fieldPlaceholder}
                  onChange={(e) => setFieldPlaceholder(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Help Text</label>
                <textarea
                  rows={2}
                  placeholder="Help text displayed under the input field for test authors..."
                  value={fieldDescription}
                  onChange={(e) => setFieldDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isRequired}
                    onChange={(e) => setIsRequired(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Mark field as mandatory / required before saving</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Save Custom Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDIT CUSTOM FIELD */}
      {isEditModalOpen && selectedField && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden text-xs">
            <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Edit Custom Field: {selectedField.name}</h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Field Label</label>
                  <input
                    type="text"
                    required
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Field Key</label>
                  <input
                    type="text"
                    required
                    value={fieldKey}
                    onChange={(e) => setFieldKey(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Field Type</label>
                <select
                  value={fieldType}
                  onChange={(e) => setFieldType(e.target.value as CustomFieldType)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                >
                  {(Object.keys(FIELD_TYPE_CONFIG) as CustomFieldType[]).map((t) => (
                    <option key={t} value={t}>
                      {FIELD_TYPE_CONFIG[t].label}
                    </option>
                  ))}
                </select>
              </div>

              {(fieldType === 'dropdown' || fieldType === 'multi_select') && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Selectable Options (One per line)
                  </label>
                  <textarea
                    rows={4}
                    value={optionsString}
                    onChange={(e) => setOptionsString(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-mono"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Project Scope</label>
                  <select
                    value={targetProjectId}
                    onChange={(e) => setTargetProjectId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900 font-semibold"
                  >
                    <option value="all">Global (All Projects)</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Placeholder</label>
                  <input
                    type="text"
                    value={fieldPlaceholder}
                    onChange={(e) => setFieldPlaceholder(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={fieldDescription}
                  onChange={(e) => setFieldDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white text-slate-900"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isRequired}
                    onChange={(e) => setIsRequired(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span>Mark field as mandatory / required</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Update Custom Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
