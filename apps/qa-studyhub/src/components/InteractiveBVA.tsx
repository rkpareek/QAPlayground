import React, { useState } from 'react';
import { Calculator, CheckCircle, XCircle, Sparkles } from 'lucide-react';

export const InteractiveBVA: React.FC = () => {
  const [minVal, setMinVal] = useState<number>(18);
  const [maxVal, setMaxVal] = useState<number>(60);
  const [testInput, setTestInput] = useState<string>('25');

  const testNum = parseFloat(testInput);
  const isValid = !isNaN(testNum) && testNum >= minVal && testNum <= maxVal;

  const min = Number(minVal);
  const max = Number(maxVal);

  const boundaries = [
    { label: 'Min - 1 (Invalid)', val: min - 1, valid: false, note: 'Just below lower boundary' },
    { label: 'Min (Valid)', val: min, valid: true, note: 'Exact lower boundary' },
    { label: 'Min + 1 (Valid)', val: min + 1, valid: true, note: 'Just above lower boundary' },
    { label: 'Nominal / Mid (Valid)', val: Math.round((min + max) / 2), valid: true, note: 'Middle safe value' },
    { label: 'Max - 1 (Valid)', val: max - 1, valid: true, note: 'Just below upper boundary' },
    { label: 'Max (Valid)', val: max, valid: true, note: 'Exact upper boundary' },
    { label: 'Max + 1 (Invalid)', val: max + 1, valid: false, note: 'Just above upper boundary' }
  ];

  return (
    <div id="interactive-bva-tool" className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs my-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-slate-900 text-base">Interactive BVA & Equivalence Partitioning Tool</h4>
          <p className="text-xs text-slate-500">Experiment with any input range to see exact test boundaries and equivalence classes.</p>
        </div>
      </div>

      {/* Inputs Configuration */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Minimum Valid (Min)</label>
          <input
            type="number"
            value={minVal}
            onChange={(e) => setMinVal(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-800 focus:outline-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Maximum Valid (Max)</label>
          <input
            type="number"
            value={maxVal}
            onChange={(e) => setMaxVal(Number(e.target.value))}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-800 focus:outline-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Test an Input Value</label>
          <div className="relative">
            <input
              type="text"
              value={testInput}
              onChange={(e) => setTestInput(e.target.value)}
              placeholder="e.g. 18"
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-mono text-slate-800 focus:outline-indigo-500"
            />
            <div className="absolute right-2.5 top-2 text-xs">
              {!isNaN(testNum) && (
                isValid ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" /> Valid
                  </span>
                ) : (
                  <span className="text-rose-600 font-semibold flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> Invalid
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Equivalence Partitioning Visualizer */}
      <div className="mb-6">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          1. Equivalence Partitions (3 Classes)
        </h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-800">Invalid Partition 1</span>
              <span className="text-[11px] font-mono bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">value &lt; {min}</span>
            </div>
            <p className="text-xs text-rose-700 mt-1">Sample test value: <strong className="font-mono">{min - 5}</strong></p>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-emerald-800">Valid Partition</span>
              <span className="text-[11px] font-mono bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded">{min} ≤ value ≤ {max}</span>
            </div>
            <p className="text-xs text-emerald-700 mt-1">Sample test value: <strong className="font-mono">{Math.round((min + max) / 2)}</strong></p>
          </div>

          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-rose-800">Invalid Partition 2</span>
              <span className="text-[11px] font-mono bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded">value &gt; {max}</span>
            </div>
            <p className="text-xs text-rose-700 mt-1">Sample test value: <strong className="font-mono">{max + 5}</strong></p>
          </div>
        </div>
      </div>

      {/* Boundary Value Analysis Table */}
      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          2. Standard 2-Value & 3-Value Boundary Test Points
        </h5>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-semibold">
              <tr>
                <th className="p-2.5">Boundary Condition</th>
                <th className="p-2.5">Calculated Value</th>
                <th className="p-2.5">Expected Status</th>
                <th className="p-2.5">QA Purpose</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {boundaries.map((b, idx) => (
                <tr key={idx} className={b.valid ? 'bg-emerald-50/30' : 'bg-rose-50/30'}>
                  <td className="p-2.5 font-sans font-medium text-slate-800">{b.label}</td>
                  <td className="p-2.5 font-bold text-slate-900">{b.val}</td>
                  <td className="p-2.5">
                    {b.valid ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-sans font-semibold text-[11px]">Valid (Pass)</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded font-sans font-semibold text-[11px]">Invalid (Reject)</span>
                    )}
                  </td>
                  <td className="p-2.5 font-sans text-slate-500">{b.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
