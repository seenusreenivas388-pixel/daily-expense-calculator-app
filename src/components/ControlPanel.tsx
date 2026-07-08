import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  Layers, 
  PieChart, 
  DollarSign, 
  BellRing, 
  Moon, 
  Sun, 
  Eye, 
  PlusCircle, 
  Lock, 
  Unlock,
  AlertCircle,
  HelpCircle,
  TrendingDown,
  Check,
  FileCode,
  Download,
  Copy,
  CheckCheck,
  BookOpen,
  Terminal,
  SmartphoneCharging
} from 'lucide-react';
import { Transaction, ThemeAccent, ThemeConfig, Category } from '../types';
import { CATEGORIES, THEME_CONFIGS } from './ThemeConfigData';
import { FLUTTER_FILES, FlutterFile } from './FlutterProjectCode';

interface ControlPanelProps {
  transactions: Transaction[];
  themeAccent: ThemeAccent;
  onChangeAccent: (accent: ThemeAccent) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  budgetTotal: number;
  onChangeBudget: (b: number) => void;
  incomeTotal: number;
  onChangeIncome: (i: number) => void;
  onAddTransaction: (t: Omit<Transaction, 'id' | 'time'>) => void;
  onClearTransactions: () => void;
  onResetSeedData: () => void;
  setDynamicIslandMsg: (msg: string | null) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  transactions,
  themeAccent,
  onChangeAccent,
  isDarkMode,
  onToggleDarkMode,
  budgetTotal,
  onChangeBudget,
  incomeTotal,
  onChangeIncome,
  onAddTransaction,
  onClearTransactions,
  onResetSeedData,
  setDynamicIslandMsg,
}) => {
  const [seedMerchant, setSeedMerchant] = useState<string>('Netflix Studio');
  const [seedAmount, setSeedAmount] = useState<string>('15.99');
  const [seedCategory, setSeedCategory] = useState<Category>('bills');
  
  const [activePanelTab, setActivePanelTab] = useState<'mockup' | 'flutter'>('mockup');
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);
  const [copiedStatus, setCopiedStatus] = useState<boolean>(false);

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2000);
    setDynamicIslandMsg("📋 Code copied to clipboard!");
    setTimeout(() => setDynamicIslandMsg(null), 3000);
  };

  const handleDownloadFile = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    setDynamicIslandMsg(`💾 Downloaded ${fileName}!`);
    setTimeout(() => setDynamicIslandMsg(null), 3000);
  };

  // Compute category totals for the interactive SVG donut chart
  const categoryTotals: Record<Category, number> = transactions
    .filter(t => t.isExpense)
    .reduce((acc: Record<Category, number>, t: Transaction) => {
      const cat = t.category;
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    }, {
      food: 0,
      travel: 0,
      shopping: 0,
      bills: 0,
      other: 0
    });

  const totalSpent = Object.values(categoryTotals).reduce((sum, v) => sum + v, 0);

  // SVG Donut Calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  const categorySlices = Object.entries(CATEGORIES).map(([catId, catInfo]) => {
    const amount = categoryTotals[catId as Category] || 0;
    const percentage = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedAngle;
    accumulatedAngle += (percentage / 100) * circumference;

    return {
      catId: catId as Category,
      label: catInfo.label,
      color: catInfo.color,
      amount,
      percentage,
      strokeDasharray,
      strokeDashoffset,
      colorHex: 
        catId === 'food' ? '#10b981' : // emerald
        catId === 'travel' ? '#3b82f6' : // blue
        catId === 'shopping' ? '#f43f5e' : // rose
        catId === 'bills' ? '#8b5cf6' : // violet
        '#64748b' // slate
    };
  });

  const handleQuickSeed = (merchant: string, amount: number, category: Category) => {
    onAddTransaction({
      merchant,
      amount,
      category,
      date: '2026-07-08',
      isExpense: true
    });
    setDynamicIslandMsg(`🚀 Injected transaction: ${merchant} (-$${amount})`);
    setTimeout(() => setDynamicIslandMsg(null), 3000);
  };

  const handleCustomSeedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(seedAmount);
    if (!seedMerchant || isNaN(amt) || amt <= 0) return;

    onAddTransaction({
      merchant: seedMerchant,
      amount: amt,
      category: seedCategory,
      date: '2026-07-08',
      isExpense: true
    });
    setDynamicIslandMsg(`⚡ Custom seeder: ${seedMerchant} (-$${amt})`);
    setSeedMerchant('');
    setSeedAmount('');
    setTimeout(() => setDynamicIslandMsg(null), 3000);
  };

  const currentThemeConfig = THEME_CONFIGS[themeAccent];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 select-none font-sans transition-colors duration-300">
      
      {/* Title Header */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/30 text-teal-600 dark:text-teal-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">Figma Companion</span>
            <h3 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">Interactive Controls</h3>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-extrabold text-slate-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>LIVE CONTROLLER</span>
        </div>
      </div>

      {/* SEGMENTED TAB SWITCHER */}
      <div className="flex p-1 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200/10">
        <button
          onClick={() => setActivePanelTab('mockup')}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
            activePanelTab === 'mockup'
              ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-600 dark:text-teal-400 border border-slate-200/10'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Figma Live Demo</span>
        </button>
        <button
          onClick={() => setActivePanelTab('flutter')}
          className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
            activePanelTab === 'flutter'
              ? 'bg-white dark:bg-slate-900 shadow-sm text-teal-600 dark:text-teal-400 border border-slate-200/10'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <SmartphoneCharging className="w-3.5 h-3.5" />
          <span>Flutter Source</span>
        </button>
      </div>

      {activePanelTab === 'mockup' ? (
        <>
          {/* SECTION 1: VISUAL THEME SELECTION */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>Figma Aesthetic Presets</span>
          </h4>
          <span className="text-[10px] text-slate-400 font-bold">Mockup Themes</span>
        </div>
        
        <div className="grid grid-cols-5 gap-2">
          {Object.entries(THEME_CONFIGS).map(([id, conf]) => {
            const isActive = themeAccent === id;
            return (
              <button
                key={id}
                onClick={() => onChangeAccent(id as ThemeAccent)}
                className={`group p-2.5 rounded-2xl border transition-all relative flex flex-col items-center gap-2 cursor-pointer ${
                  isActive 
                    ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800 ring-2 ring-slate-200 dark:ring-slate-700/50' 
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-transparent'
                }`}
              >
                {/* Circular indicator color */}
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${conf.gradient} shadow-inner flex items-center justify-center`}>
                  {isActive && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300 capitalize text-center leading-none">
                  {id}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mini switches */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <button
            onClick={onToggleDarkMode}
            className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Switch Light UI</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-500" />
                <span>Switch Dark UI</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setDynamicIslandMsg("🚨 Security Alert: Simulated card swipe was approved!");
              setTimeout(() => setDynamicIslandMsg(null), 4000);
            }}
            className="p-3 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            <BellRing className="w-4 h-4 text-emerald-500" />
            <span>Simulate Alert</span>
          </button>
        </div>
      </div>

      {/* SECTION 2: BUDGET & INCOME CAPS CONTROLLERS */}
      <div className="space-y-4 bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5" />
          <span>Mockup Financial Limits</span>
        </h4>

        {/* Budget Slider */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-500">Monthly Budget Cap</span>
            <span className="font-mono font-bold text-slate-800 dark:text-white">${budgetTotal.toLocaleString()}</span>
          </div>
          <input 
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={budgetTotal}
            onChange={(e) => onChangeBudget(parseInt(e.target.value))}
            className="w-full accent-teal-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-bold">
            <span>$1,000 min</span>
            <span>$5,500 avg</span>
            <span>$10,000 max</span>
          </div>
        </div>

        {/* Income Total Slider */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="font-semibold text-slate-500">Simulated Income</span>
            <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">${incomeTotal.toLocaleString()}</span>
          </div>
          <input 
            type="range"
            min="2000"
            max="15000"
            step="500"
            value={incomeTotal}
            onChange={(e) => onChangeIncome(parseInt(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[9px] text-slate-400 font-bold">
            <span>$2,000 min</span>
            <span>$8,500 avg</span>
            <span>$15,000 max</span>
          </div>
        </div>
      </div>

      {/* SECTION 3: FAST PRESET INJECTION */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span>Quick Preset Seeders</span>
        </h4>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => handleQuickSeed('Starbucks Coffee Premium', 7.50, 'food')}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 rounded-xl text-left text-xs transition-all flex items-center justify-between group cursor-pointer"
          >
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block truncate max-w-[100px]">Starbucks</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">☕ Food • $7.50</span>
            </div>
            <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:scale-110 transition-all shrink-0" />
          </button>

          <button
            onClick={() => handleQuickSeed('UberX Commute Ride', 18.20, 'travel')}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 rounded-xl text-left text-xs transition-all flex items-center justify-between group cursor-pointer"
          >
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block truncate max-w-[100px]">Uber Taxi</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">🚗 Travel • $18.20</span>
            </div>
            <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:scale-110 transition-all shrink-0" />
          </button>

          <button
            onClick={() => handleQuickSeed('Apple Cloud Storage', 9.99, 'bills')}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 rounded-xl text-left text-xs transition-all flex items-center justify-between group cursor-pointer"
          >
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block truncate max-w-[100px]">Apple Cloud</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">💳 Bills • $9.99</span>
            </div>
            <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:scale-110 transition-all shrink-0" />
          </button>

          <button
            onClick={() => handleQuickSeed('Nike Tech Fleece', 125.00, 'shopping')}
            className="p-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 hover:bg-slate-50 rounded-xl text-left text-xs transition-all flex items-center justify-between group cursor-pointer"
          >
            <div>
              <span className="font-bold text-slate-700 dark:text-slate-300 block truncate max-w-[100px]">Nike Store</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">🛍️ Shop • $125.00</span>
            </div>
            <PlusCircle className="w-4 h-4 text-slate-400 group-hover:text-teal-500 group-hover:scale-110 transition-all shrink-0" />
          </button>
        </div>

        {/* Custom manual quick injector form */}
        <form onSubmit={handleCustomSeedSubmit} className="bg-slate-100 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200/10 space-y-3">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-slate-400 block">Custom Injector Engine</span>
          
          <div className="grid grid-cols-2 gap-2">
            <input 
              type="text"
              required
              placeholder="Merchant name"
              value={seedMerchant}
              onChange={(e) => setSeedMerchant(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl focus:outline-none focus:border-teal-500 w-full font-semibold"
            />
            <input 
              type="number"
              required
              step="0.01"
              min="0.01"
              placeholder="Amount ($)"
              value={seedAmount}
              onChange={(e) => setSeedAmount(e.target.value)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl focus:outline-none focus:border-teal-500 w-full font-mono font-bold"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={seedCategory}
              onChange={(e) => setSeedCategory(e.target.value as Category)}
              className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs rounded-xl focus:outline-none focus:border-teal-500 text-slate-500 font-semibold text-center flex-1"
            >
              <option value="food">🍔 Food</option>
              <option value="travel">🚗 Transport</option>
              <option value="shopping">🛍️ Shopping</option>
              <option value="bills">💳 Bills & Utils</option>
              <option value="other">🌐 Other</option>
            </select>

            <button
              type="submit"
              className={`px-4 py-2 text-white bg-gradient-to-r ${currentThemeConfig.gradient} font-bold text-xs rounded-xl hover:shadow-md transition-all shrink-0 cursor-pointer`}
            >
              Inject +
            </button>
          </div>
        </form>
      </div>

      {/* SECTION 4: REAL-TIME COMPANION ANALYTICS */}
      <div className="space-y-4 pt-1">
        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
          <PieChart className="w-3.5 h-3.5 text-teal-500" />
          <span>Real-time Segment Analysis</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/80">
          
          {/* Custom SVG Donut Component */}
          <div className="md:col-span-5 flex justify-center relative">
            {totalSpent === 0 ? (
              <div className="w-24 h-24 rounded-full border-4 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-center p-2">
                <span className="text-[9px] font-bold text-slate-400 leading-none">No transactions</span>
              </div>
            ) : (
              <div className="relative w-28 h-28">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                  {categorySlices.map((slice, idx) => {
                    if (slice.amount === 0) return null;
                    return (
                      <circle
                        key={slice.catId}
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke={slice.colorHex}
                        strokeWidth="11"
                        strokeDasharray={slice.strokeDasharray}
                        strokeDashoffset={slice.strokeDashoffset}
                        className="transition-all duration-500 hover:stroke-[14px] cursor-pointer"
                        title={`${slice.label}: $${slice.amount.toFixed(2)}`}
                      />
                    );
                  })}
                </svg>
                {/* Center cut-out */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Total</span>
                  <span className="text-xs font-black font-mono text-slate-800 dark:text-white">${totalSpent.toFixed(0)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Legend breakdown list */}
          <div className="md:col-span-7 space-y-2 text-xs">
            {categorySlices.map(slice => {
              const catInfo = CATEGORIES[slice.catId];
              return (
                <div key={slice.catId} className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: slice.colorHex }} />
                    <span className="font-semibold text-slate-600 dark:text-slate-400 truncate">{catInfo.label.split(' ')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono shrink-0">
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">${slice.amount.toFixed(1)}</span>
                    <span className="text-[9px] text-slate-400 font-bold">({slice.percentage.toFixed(0)}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      </>
      ) : (
        /* FLUTTER EXPORTER COMPONENT */
        <div className="space-y-5 animate-fadeIn">
          {/* header info */}
          <div className="space-y-1 text-left">
            <h4 className="text-sm font-black tracking-tight text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
              <SmartphoneCharging className="w-4 h-4 text-teal-500 animate-bounce" />
              <span>Flutter Source Code Exporter</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Explore and download fully written dart files of your Daily Expenses app, pre-wired for <strong>Firebase Authentication</strong> and <strong>Cloud Firestore</strong> real-time data streaming.
            </p>
          </div>

          {/* list of files */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* files left pane */}
            <div className="md:col-span-4 space-y-1.5 max-h-[380px] overflow-y-auto no-scrollbar pr-1">
              {FLUTTER_FILES.map((file, idx) => {
                const isSelected = selectedFileIndex === idx;
                const isMd = file.name.endsWith('.md');
                return (
                  <button
                    key={file.name}
                    onClick={() => {
                      setSelectedFileIndex(idx);
                      setCopiedStatus(false);
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-teal-500/10 border-teal-500 text-teal-600 dark:text-teal-400 font-extrabold' 
                        : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-800/80 hover:bg-slate-100/50 dark:hover:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-bold'
                    }`}
                  >
                    {isMd ? (
                      <BookOpen className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    ) : (
                      <FileCode className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] block truncate">{file.name}</span>
                      <span className="text-[8px] opacity-60 font-mono block truncate">{file.path}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* active file viewer right pane */}
            <div className="md:col-span-8 space-y-3 flex flex-col min-w-0">
              {/* actions header */}
              <div className="flex justify-between items-center gap-2">
                <span className="text-[10px] font-bold font-mono text-slate-400 truncate max-w-[150px]" title={FLUTTER_FILES[selectedFileIndex].path}>
                  📁 {FLUTTER_FILES[selectedFileIndex].path}
                </span>

                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopyCode(FLUTTER_FILES[selectedFileIndex].content)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 cursor-pointer text-[10px] font-extrabold uppercase tracking-wider"
                  >
                    {copiedStatus ? (
                      <>
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {/* Download Button */}
                  <button
                    onClick={() => handleDownloadFile(FLUTTER_FILES[selectedFileIndex].name, FLUTTER_FILES[selectedFileIndex].content)}
                    className="p-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-white transition-colors flex items-center gap-1 cursor-pointer text-[10px] font-extrabold uppercase tracking-wider"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Code text area */}
              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800 relative flex-1 text-left">
                <pre className="text-[10px] font-mono text-slate-300 overflow-x-auto overflow-y-auto max-h-[300px] text-left no-scrollbar leading-relaxed">
                  <code>{FLUTTER_FILES[selectedFileIndex].content}</code>
                </pre>
              </div>
            </div>

          </div>

          {/* Interactive Checklist Setup Guide */}
          <div className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/80 space-y-3 text-left">
            <h5 className="text-[11px] font-black uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              <span>Firebase Deployment Pipeline Checklist</span>
            </h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
                <span>Create Firebase project console</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
                <span>Enable Email/Password Auth Provider</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
                <span>Initialize Firestore DB in Test Mode</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-emerald-500" />
                </div>
                <span>Run flutterfire CLI configuration</span>
              </div>
            </div>
            <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80 text-[10px] text-slate-500 dark:text-slate-400 leading-normal font-medium">
              💡 <strong>Pro Tip:</strong> Click the <strong>Download</strong> buttons above to download the files directly. Follow the instructions inside <strong>README.md</strong> to assemble your complete offline-first Flutter application!
            </div>
          </div>
        </div>
      )}

      {/* FOOTER ACTIONS: SEED RESET & CLEAR */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
        <button
          onClick={onResetSeedData}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer"
          title="Restore standard dummy demo records"
        >
          <RotateCcw className="w-4 h-4 text-slate-400" />
          <span>Reset Demo Data</span>
        </button>

        <button
          onClick={onClearTransactions}
          className="text-xs font-bold text-rose-500/80 hover:text-rose-500 transition-colors cursor-pointer"
          title="Clear all mockup transactions"
        >
          Clear All Entries
        </button>
      </div>

    </div>
  );
};
