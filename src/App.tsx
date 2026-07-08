import { useState, useEffect } from 'react';
import { PhoneMockup } from './components/PhoneMockup';
import { ControlPanel } from './components/ControlPanel';
import { Transaction, ThemeAccent, ThemeConfig } from './types';
import { INITIAL_TRANSACTIONS, THEME_CONFIGS } from './components/ThemeConfigData';
import { 
  Sparkle, 
  Sparkles,
  Smartphone, 
  Layers, 
  Code2, 
  Coins, 
  AppWindow, 
  Github,
  CheckCircle2,
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export default function App() {
  // Global States
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [themeAccent, setThemeAccent] = useState<ThemeAccent>('teal');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [budgetTotal, setBudgetTotal] = useState<number>(2000);
  const [incomeTotal, setIncomeTotal] = useState<number>(4800);
  const [dynamicIslandMsg, setDynamicIslandMsg] = useState<string | null>(
    "Welcome! Click the '+' button below to add an expense"
  );

  // Trigger brief greeting in dynamic island on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setDynamicIslandMsg(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, []);

  // Sync Dark Mode with DOM for Tailwind dark: classes
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handlers
  const handleAddTransaction = (newTx: Omit<Transaction, 'id' | 'time'>) => {
    const id = 't_' + Math.random().toString(36).substr(2, 9);
    const dateObj = new Date();
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    let hours = dateObj.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // conversion of '0' to '12'
    const formattedTime = `Today, ${hours}:${minutes} ${ampm}`;

    const createdTx: Transaction = {
      ...newTx,
      id,
      time: formattedTime
    };

    setTransactions(prev => [createdTx, ...prev]);
  };

  const handleDeleteTransaction = (id: string) => {
    const tx = transactions.find(t => t.id === id);
    setTransactions(prev => prev.filter(t => t.id !== id));
    
    if (tx) {
      setDynamicIslandMsg(`🗑️ Deleted: ${tx.merchant} (${tx.isExpense ? '-' : '+'}$${tx.amount})`);
      setTimeout(() => setDynamicIslandMsg(null), 3000);
    }
  };

  const handleClearTransactions = () => {
    setTransactions([]);
    setDynamicIslandMsg("🧹 Cleared all transactions!");
    setTimeout(() => setDynamicIslandMsg(null), 2500);
  };

  const handleResetSeedData = () => {
    setTransactions(INITIAL_TRANSACTIONS);
    setDynamicIslandMsg("🔄 Restored demo transaction history!");
    setTimeout(() => setDynamicIslandMsg(null), 2500);
  };

  const currentThemeConfig = THEME_CONFIGS[themeAccent];

  return (
    <div className="min-h-screen bg-[#F3F4F6] dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Design Context Elements */}
      <div className="absolute top-12 left-12 pointer-events-none hidden xl:block z-0">
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-sm mb-2">Daily Expense Pro</p>
        <h2 className="text-4xl font-serif italic text-slate-800 dark:text-slate-200 opacity-20">Refined Finance</h2>
      </div>
      <div className="absolute bottom-12 right-12 text-right pointer-events-none hidden xl:block z-0">
        <p className="text-slate-400 text-xs font-mono uppercase tracking-widest">UI Design Preview • 2026</p>
        <p className="text-slate-400 dark:text-slate-600 text-[10px] mt-1">Standard iOS Grid Layout (390x812)</p>
      </div>

      {/* Decorative Blueprint/Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.25] pointer-events-none z-0" />
      
      {/* Decorative blurred backdrops */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-200/20 dark:bg-teal-950/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-200/20 dark:bg-blue-950/10 rounded-full blur-[120px] pointer-events-none" />

      {/* PRIMARY WEB WRAPPER */}
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 relative z-10 space-y-8">
        
        {/* UPPER DISPLAY HEADER */}
        <header className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="space-y-3 max-w-2xl">
            {/* Tech tag list */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-950 text-[10px] font-extrabold tracking-wider uppercase shadow-sm">
                <Smartphone className="w-3 h-3" />
                <span>iOS 17 Simulator</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-50 dark:bg-teal-950/50 text-teal-600 dark:text-teal-400 border border-teal-100/30 text-[10px] font-bold tracking-wider uppercase">
                <Layers className="w-3 h-3" />
                <span>Figma UI system</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 text-[10px] font-bold tracking-wider uppercase">
                <Code2 className="w-3 h-3" />
                <span>React 19 + Tailwind v4</span>
              </span>
            </div>

            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Coins className="w-7 h-7 text-teal-500 animate-float" />
                <h1 className="text-2xl lg:text-3xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-200 dark:to-slate-400 bg-clip-text text-transparent">
                  Daily Expenses Calculator
                </h1>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                High-fidelity digital app presentation mockup. Customize limits, test bottom-sheet forms, 
                and inspect live category segment distributions in real time on a functional smartphone simulator.
              </p>
            </div>
          </div>

          {/* Quick info alert badge */}
          <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-sm shrink-0">
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center shrink-0">
              <Sparkle className="w-5 h-5 text-teal-600 dark:text-teal-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">Dribbble Feature</span>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-tight mt-0.5">
                Full-stack local interaction with animated iOS drawer & physical power buttons.
              </p>
            </div>
          </div>
        </header>

        {/* MAIN BODY WORKSPACE GRID */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: THE COMPANION CONTROL SYSTEM (Figma Panel) */}
          <section className="lg:col-span-5 space-y-6">
            <ControlPanel 
              transactions={transactions}
              themeAccent={themeAccent}
              onChangeAccent={setThemeAccent}
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
              budgetTotal={budgetTotal}
              onChangeBudget={setBudgetTotal}
              incomeTotal={incomeTotal}
              onChangeIncome={setIncomeTotal}
              onAddTransaction={handleAddTransaction}
              onClearTransactions={handleClearTransactions}
              onResetSeedData={handleResetSeedData}
              setDynamicIslandMsg={setDynamicIslandMsg}
            />

            {/* Design Specifications Sub-Widget */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-3.5 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <Lightbulb className="w-4 h-4 text-amber-500 shrink-0" />
                <h4 className="font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">Mockup Sandbox Guide</h4>
              </div>

              <div className="space-y-2 text-slate-500 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                  <p><strong>Physical Chassis Mock:</strong> Click the power button on the right edge of the iPhone to test Lock Screen notifications. Use left volume edges to adjust volume overlays.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                  <p><strong>iOS Bottom Sheet:</strong> Click <strong className="text-slate-800 dark:text-white">"+ Add Transaction"</strong> inside the device. Drag-bars, category pills, and cash metrics calculate instantly.</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-500 shrink-0 mt-0.5" />
                  <p><strong>Live Donut Segmenting:</strong> Hover segments on the left donut circle to inspect detailed ratios. Category filters inside the phone align synchronously.</p>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: THE SMARTPHONE PORTFOLIO PRESENTATION (iPhone Model) */}
          <section className="lg:col-span-7 flex flex-col items-center justify-center py-4 bg-slate-200/40 dark:bg-slate-900/40 rounded-[48px] border border-dashed border-slate-300 dark:border-slate-800 relative min-h-[820px] shadow-inner">
            
            {/* Visual presentation stand header */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-10 pointer-events-none opacity-40">
              <div className="flex items-center gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Device Render</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">1170 x 2532 px • 460 ppi</span>
            </div>

            {/* Interactive iPhone Simulator Component */}
            <div className="transform scale-[0.93] sm:scale-100 transition-transform duration-300">
              <PhoneMockup 
                transactions={transactions}
                onAddTransaction={handleAddTransaction}
                onDeleteTransaction={handleDeleteTransaction}
                themeConfig={currentThemeConfig}
                isDarkMode={isDarkMode}
                budgetTotal={budgetTotal}
                incomeTotal={incomeTotal}
                onToggleDarkMode={() => setIsDarkMode(prev => !prev)}
                dynamicIslandMsg={dynamicIslandMsg}
                setDynamicIslandMsg={setDynamicIslandMsg}
              />
            </div>

            {/* Device reflection shadow */}
            <div className="w-64 h-8 bg-slate-900/10 dark:bg-black/40 rounded-full blur-xl absolute bottom-2 opacity-80 pointer-events-none" />
          </section>

        </main>

        {/* BOTTOM SHOWCASE PORTFOLIO META */}
        <footer className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400 select-none">
          <p>
            Daily Expenses Calculator • Created for <strong>seenusreenivas388@gmail.com</strong>
          </p>
          <div className="flex items-center gap-4 font-semibold">
            <span className="hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">Spec Sheet</span>
            <span>•</span>
            <span className="hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">Apple HIG Compliant</span>
            <span>•</span>
            <span className="hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer">Privacy Protocol</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
