import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Utensils, 
  Car, 
  ShoppingBag, 
  ReceiptText, 
  CircleEllipsis, 
  Plus, 
  Bell, 
  ChevronRight, 
  CreditCard, 
  TrendingUp, 
  TrendingDown, 
  X, 
  Check, 
  Lock, 
  Unlock, 
  Battery, 
  Wifi, 
  Signal, 
  Calendar, 
  DollarSign,
  Trash2,
  PlusCircle,
  Sparkles,
  BarChart3,
  Mail,
  Key,
  User,
  UserPlus,
  LogIn,
  LogOut,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Transaction, Category, ThemeAccent, ThemeConfig } from '../types';
import { CATEGORIES, THEME_CONFIGS } from './ThemeConfigData';

interface PhoneMockupProps {
  transactions: Transaction[];
  onAddTransaction: (t: Omit<Transaction, 'id' | 'time'>) => void;
  onDeleteTransaction: (id: string) => void;
  themeConfig: ThemeConfig;
  isDarkMode: boolean;
  budgetTotal: number;
  incomeTotal: number;
  onToggleDarkMode: () => void;
  dynamicIslandMsg: string | null;
  setDynamicIslandMsg: (msg: string | null) => void;
}

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  transactions,
  onAddTransaction,
  onDeleteTransaction,
  themeConfig,
  isDarkMode,
  budgetTotal,
  incomeTotal,
  onToggleDarkMode,
  dynamicIslandMsg,
  setDynamicIslandMsg
}) => {
  // Lock screen toggle
  const [isLocked, setIsLocked] = useState<boolean>(false);
  
  // Real-time Email Authentication State
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; avatarSeed: string } | null>({
    email: 'seenusreenivas388@gmail.com',
    name: 'Seenu',
    avatarSeed: 'Seenu'
  });
  const [authScreenMode, setAuthScreenMode] = useState<'login' | 'signup'>('login');
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(false);
  
  // Auth Form Inputs
  const [authEmail, setAuthEmail] = useState<string>('seenusreenivas388@gmail.com');
  const [authPassword, setAuthPassword] = useState<string>('password123');
  const [authName, setAuthName] = useState<string>('Seenu');
  const [authError, setAuthError] = useState<string | null>(null);

  // Connection mode
  const [firebaseConnected, setFirebaseConnected] = useState<boolean>(true);

  // In-App Notifications State
  const [isNotificationsOpen, setIsNotificationsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<{ id: string; title: string; body: string; time: string; read: boolean; type: 'system' | 'auth' | 'transaction' | 'budget'; icon: string }[]>([
    {
      id: 'n1',
      title: 'Firebase Connection Established',
      body: 'Successfully connected to cloud Auth & Firestore endpoints. Syncing active.',
      time: 'Just now',
      read: false,
      type: 'system',
      icon: 'Wifi'
    },
    {
      id: 'n2',
      title: 'Zero-Trust Security Deployed',
      body: 'Zero-Trust ABAC ruleset validated. Direct write-exploits blocked.',
      time: '5 mins ago',
      read: false,
      type: 'system',
      icon: 'Lock'
    },
    {
      id: 'n3',
      title: 'Welcome to Daily Expense Pro!',
      body: 'Your safe caution limit is $150.00/day. Add transactions using the floating button.',
      time: '15 mins ago',
      read: true,
      type: 'system',
      icon: 'Sparkles'
    }
  ]);

  // Volume state (just a fun visual element)
  const [volumeLevel, setVolumeLevel] = useState<number>(65);
  const [showVolumeBar, setShowVolumeBar] = useState<boolean>(false);
  // Category filter
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Active sub-screen state
  const [mockupTab, setMockupTab] = useState<'wallet' | 'profile'>('wallet');

  // Profile Form States
  const [profileName, setProfileName] = useState<string>('Seenu');
  const [profileAvatarSeed, setProfileAvatarSeed] = useState<string>('Seenu');
  const [isFirestoreSync, setIsFirestoreSync] = useState<boolean>(true);
  const [isBiometricLock, setIsBiometricLock] = useState<boolean>(false);
  // Bottom sheet state
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState<boolean>(false);
  // Add Transaction form state
  const [amountInput, setAmountInput] = useState<string>('');
  const [merchantInput, setMerchantInput] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<Category>('food');
  const [isExpenseInput, setIsExpenseInput] = useState<boolean>(true);
  const [dateInput, setDateInput] = useState<string>('2026-07-08');
  
  // Simulated clock
  const [currentTime, setCurrentTime] = useState<string>('09:41');
  const [currentDateString, setCurrentDateString] = useState<string>('Wednesday, July 8');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const formattedHours = String(hours).padStart(2, '0');
      setCurrentTime(`${formattedHours}:${minutes}`);

      // e.g., "Wednesday, Jul 8"
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', month: 'short', day: 'numeric' };
      setCurrentDateString(now.toLocaleDateString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  // Synchronize profile inputs when logged-in user changes
  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name);
      setProfileAvatarSeed(currentUser.avatarSeed);
    }
  }, [currentUser]);

  // Calculate stats for today
  const getTodayExpenses = () => {
    const todayStr = '2026-07-08'; // Matches context date
    return transactions
      .filter(t => t.isExpense && (t.date === todayStr || t.time === 'Just now' || t.time.includes('AM') || t.time.includes('PM') && !t.time.includes('Jul')))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthSpent = () => {
    return transactions
      .filter(t => t.isExpense)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const todaySpent = getTodayExpenses();
  const totalSpentMonth = getMonthSpent();
  const remainingBudget = Math.max(0, budgetTotal - totalSpentMonth);
  const budgetProgressPercent = Math.min(100, (totalSpentMonth / budgetTotal) * 100);

  // Trigger temporary dynamic island notification
  const handleVolumeClick = (increment: boolean) => {
    setVolumeLevel(prev => {
      const next = increment ? Math.min(100, prev + 10) : Math.max(0, prev - 10);
      return next;
    });
    setShowVolumeBar(true);
    const timer = setTimeout(() => {
      setShowVolumeBar(false);
    }, 1500);
    return () => clearTimeout(timer);
  };

  // Helper to render Category Icon
  const renderCategoryIcon = (category: Category, className: string = 'w-4 h-4') => {
    const info = CATEGORIES[category] || CATEGORIES.other;
    switch (info.icon) {
      case 'Utensils': return <Utensils className={className} />;
      case 'Car': return <Car className={className} />;
      case 'ShoppingBag': return <ShoppingBag className={className} />;
      case 'ReceiptText': return <ReceiptText className={className} />;
      default: return <CircleEllipsis className={className} />;
    }
  };

  // Helper to render Notification Icon
  const renderNotifIcon = (iconName: string, type: string) => {
    const baseClass = "w-4 h-4";
    let colorClass = "text-slate-500";
    if (type === 'auth') colorClass = "text-indigo-500 dark:text-indigo-400";
    if (type === 'budget') colorClass = "text-amber-500 dark:text-amber-400";
    if (type === 'transaction') colorClass = "text-emerald-500 dark:text-emerald-400";
    if (type === 'system') colorClass = "text-teal-500 dark:text-teal-400";
    
    switch (iconName) {
      case 'Wifi': return <Wifi className={`${baseClass} ${colorClass}`} />;
      case 'Lock': return <Lock className={`${baseClass} ${colorClass}`} />;
      case 'Sparkles': return <Sparkles className={`${baseClass} ${colorClass}`} />;
      case 'ShoppingBag': return <ShoppingBag className={`${baseClass} ${colorClass}`} />;
      case 'TrendingUp': return <TrendingUp className={`${baseClass} ${colorClass}`} />;
      case 'AlertTriangle': return <AlertTriangle className={`${baseClass} ${colorClass}`} />;
      case 'UserPlus': return <UserPlus className={`${baseClass} ${colorClass}`} />;
      case 'LogIn': return <LogIn className={`${baseClass} ${colorClass}`} />;
      case 'LogOut': return <LogOut className={`${baseClass} ${colorClass}`} />;
      case 'Unlock': return <Unlock className={`${baseClass} ${colorClass}`} />;
      default: return <Bell className={`${baseClass} ${colorClass}`} />;
    }
  };

  // Filtered transactions
  const filteredTransactions = transactions.filter(t => {
    if (selectedCategoryFilter === 'all') return true;
    return t.category === selectedCategoryFilter;
  });

  // Submit adding expense
  const handleAddExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amountInput || !merchantInput) return;

    const amt = parseFloat(amountInput);
    if (isNaN(amt) || amt <= 0) return;

    onAddTransaction({
      merchant: merchantInput,
      amount: amt,
      category: categoryInput,
      date: dateInput || '2026-07-08',
      isExpense: isExpenseInput
    });

    // Reset fields
    setAmountInput('');
    setMerchantInput('');
    setCategoryInput('food');
    setDateInput('2026-07-08');
    setIsBottomSheetOpen(false);

    // Show Dynamic Island Notification
    setDynamicIslandMsg(`${isExpenseInput ? 'Spent' : 'Received'} $${amt.toFixed(2)} on ${merchantInput}`);

    // Push In-App Notification Log
    const newNotif = {
      id: 'n_' + Math.random().toString(36).substring(2, 9),
      title: isExpenseInput ? 'Expense Tracked' : 'Income Recorded',
      body: `${isExpenseInput ? 'Debited' : 'Credited'} $${amt.toFixed(2)} - ${merchantInput}`,
      time: 'Just now',
      read: false,
      type: (isExpenseInput ? 'transaction' : 'budget') as 'system' | 'auth' | 'transaction' | 'budget',
      icon: isExpenseInput ? 'ShoppingBag' : 'TrendingUp'
    };
    setNotifications(prev => [newNotif, ...prev]);

    // Budget threshold warning
    if (isExpenseInput && amt > 100) {
      setTimeout(() => {
        const warningNotif = {
          id: 'n_' + Math.random().toString(36).substring(2, 9),
          title: 'High Transaction Warning',
          body: `A single expense of $${amt.toFixed(2)} is higher than your safety thresholds.`,
          time: 'Just now',
          read: false,
          type: 'budget' as 'system' | 'auth' | 'transaction' | 'budget',
          icon: 'AlertTriangle'
        };
        setNotifications(prev => [warningNotif, ...prev]);
        setDynamicIslandMsg(`⚠️ Budget Warning: High Spent $${amt.toFixed(2)}!`);
      }, 1000);
    }
  };

  // Simulated Firebase Email Auth Submit Handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) {
      setAuthError("Email is required.");
      return;
    }
    if (authPassword.length < 6) {
      setAuthError("Password must be at least 6 characters.");
      return;
    }

    setAuthError(null);
    setIsAuthLoading(true);

    // Simulate standard Firebase Auth latency
    setTimeout(() => {
      setIsAuthLoading(false);
      const isSignup = authScreenMode === 'signup';
      const name = isSignup ? authName || 'New User' : authName || 'Seenu';
      
      const loggedUser = {
        email: authEmail.trim(),
        name: name,
        avatarSeed: name
      };
      
      setCurrentUser(loggedUser);
      setDynamicIslandMsg(isSignup ? "🎉 Account Registered via Firebase!" : "🔓 Signed in via Firebase Auth!");
      
      // Push auth notification
      const authNotif = {
        id: 'auth_' + Math.random().toString(36).substring(2, 9),
        title: isSignup ? 'New Account Registered' : 'Secure Login Success',
        body: isSignup 
          ? `Welcome ${loggedUser.name}! Your account has been synced to Firebase Firestore.` 
          : `Signed in as ${loggedUser.email}. Security credentials synced.`,
        time: 'Just now',
        read: false,
        type: 'auth' as 'system' | 'auth' | 'transaction' | 'budget',
        icon: isSignup ? 'UserPlus' : 'LogIn'
      };
      setNotifications(prev => [authNotif, ...prev]);
    }, 1200);
  };

  // Skip auth for quick demo
  const handleSkipAuth = () => {
    setIsAuthLoading(true);
    setTimeout(() => {
      setIsAuthLoading(false);
      const demoUser = {
        email: 'seenusreenivas388@gmail.com',
        name: 'Seenu',
        avatarSeed: 'Seenu'
      };
      setCurrentUser(demoUser);
      setDynamicIslandMsg("⚡ Guest Demo Account Synced!");
      
      const bypassNotif = {
        id: 'bypass_' + Math.random().toString(36).substring(2, 9),
        title: 'Bypassed Auth Gate',
        body: 'Simulated guest state active. Real Flutter code uses secure FirebaseAuth constraints.',
        time: 'Just now',
        read: false,
        type: 'auth' as 'system' | 'auth' | 'transaction' | 'budget',
        icon: 'Unlock'
      };
      setNotifications(prev => [bypassNotif, ...prev]);
    }, 500);
  };

  // Sign out handler
  const handleSignOut = () => {
    setCurrentUser(null);
    setAuthEmail('seenusreenivas388@gmail.com');
    setAuthPassword('');
    setDynamicIslandMsg("🔒 Signed out of Firebase.");
    
    // Push notifications
    const signoutNotif = {
      id: 'signout_' + Math.random().toString(36).substring(2, 9),
      title: 'Signed Out Successfully',
      body: 'Firebase Auth token cleared securely. Lock screen active.',
      time: 'Just now',
      read: false,
      type: 'auth' as 'system' | 'auth' | 'transaction' | 'budget',
      icon: 'LogOut'
    };
    // Keep notifications persistent but add signout entry
    setNotifications(prev => [signoutNotif, ...prev]);
  };

  return (
    <div className="relative mx-auto flex flex-col items-center select-none" id="phone-container">
      {/* Physical phone side buttons for visual realism */}
      <div className="absolute left-[-4px] top-28 w-1 h-10 bg-slate-400 dark:bg-slate-700 rounded-l-md z-0 shadow-sm" />
      <div 
        className="absolute left-[-4px] top-44 w-1 h-14 bg-slate-400 dark:bg-slate-700 rounded-l-md z-0 shadow-sm cursor-pointer hover:bg-slate-500"
        onClick={() => handleVolumeClick(true)}
        title="Volume Up"
      />
      <div 
        className="absolute left-[-4px] top-60 w-1 h-14 bg-slate-400 dark:bg-slate-700 rounded-l-md z-0 shadow-sm cursor-pointer hover:bg-slate-500"
        onClick={() => handleVolumeClick(false)}
        title="Volume Down"
      />
      <div 
        className="absolute right-[-4px] top-40 w-1 h-20 bg-slate-400 dark:bg-slate-700 rounded-r-md z-0 shadow-sm cursor-pointer hover:bg-slate-500"
        onClick={() => setIsLocked(prev => !prev)}
        title="Power / Lock Screen"
      />

      {/* Main iPhone Frame Chassis */}
      <div className="relative w-[390px] h-[812px] bg-slate-900 dark:bg-slate-950 p-[12px] rounded-[52px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.35)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.65)] border-4 border-slate-700 dark:border-slate-800 transition-colors duration-500">
        
        {/* Anti-reflective glare overlay */}
        <div className="absolute top-[14px] left-[14px] right-[14px] h-[250px] bg-gradient-to-tr from-white/0 via-white/5 to-white/10 rounded-t-[40px] pointer-events-none z-40" />

        {/* Screen Content Wrapper */}
        <div className={`relative w-full h-full overflow-hidden rounded-[40px] flex flex-col transition-colors duration-500 ${
          isDarkMode 
            ? 'bg-slate-950 text-slate-100' 
            : 'bg-slate-50 text-slate-900'
        }`}>
          
          {/* iOS TOP STATUS BAR */}
          <div className="relative h-11 px-6 flex items-center justify-between z-50 pointer-events-none select-none font-sans font-semibold text-[13px] tracking-tight">
            <span className={`${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{currentTime}</span>
            
            {/* Battery / Wifi Icons Row */}
            <div className="flex items-center gap-1.5">
              <Signal className="w-3.5 h-3.5" />
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-medium mr-0.5">84%</span>
                <div className={`w-5 h-2.5 rounded-[4px] p-0.5 border flex items-center ${isDarkMode ? 'border-white/40' : 'border-black/30'}`}>
                  <div className={`h-full w-4/5 rounded-[2px] ${isDarkMode ? 'bg-white' : 'bg-black'}`} />
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC ISLAND (Notch Wrapper) */}
          <div className="absolute top-2.5 left-0 right-0 flex justify-center z-50">
            <AnimatePresence mode="wait">
              {dynamicIslandMsg ? (
                // EXPANDED DYNAMIC ISLAND (Notification Alert)
                <motion.div
                  key="expanded-island"
                  initial={{ width: 110, height: 28, borderRadius: 14 }}
                  animate={{ width: 330, height: 64, borderRadius: 28 }}
                  exit={{ width: 110, height: 28, borderRadius: 14 }}
                  transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  className="bg-black text-white flex items-center justify-between px-4 py-2 shadow-lg cursor-pointer"
                  onClick={() => setDynamicIslandMsg(null)}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-teal-500 flex items-center justify-center shrink-0">
                      <Sparkles className="w-5 h-5 text-black" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-400">Budget Update</span>
                      <span className="text-xs font-medium truncate pr-1">{dynamicIslandMsg}</span>
                    </div>
                  </div>
                  <X className="w-4 h-4 text-slate-400 hover:text-white shrink-0" />
                </motion.div>
              ) : showVolumeBar ? (
                // VOLUME DISPLAY IN DYNAMIC ISLAND
                <motion.div
                  key="volume-island"
                  initial={{ width: 110, height: 28, borderRadius: 14 }}
                  animate={{ width: 180, height: 32, borderRadius: 16 }}
                  exit={{ width: 110, height: 28, borderRadius: 14 }}
                  className="bg-black text-white flex items-center justify-center gap-3 px-3 shadow-md"
                >
                  <TrendingDown className="w-3.5 h-3.5 text-slate-400" />
                  <div className="flex-1 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-white h-full" style={{ width: `${volumeLevel}%` }} />
                  </div>
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                </motion.div>
              ) : (
                // COMPACT DYNAMIC ISLAND (Default state)
                <motion.div
                  key="compact-island"
                  initial={{ width: 110, height: 28 }}
                  animate={{ width: 110, height: 28 }}
                  className="bg-black h-7 rounded-[14px] flex items-center justify-between px-2.5"
                  onClick={() => {
                    setDynamicIslandMsg("Tap '+' below to track expenses!");
                    setTimeout(() => setDynamicIslandMsg(null), 3500);
                  }}
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                  <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800 mr-1" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* SCREEN BODY CONTENT */}
          <div className="flex-1 flex flex-col overflow-hidden relative">
            <AnimatePresence mode="wait">
              {isLocked ? (
                /* LOCK SCREEN STATE */
                <motion.div
                  key="lock-screen"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col justify-between p-6 pb-12 bg-cover bg-center z-30"
                  style={{
                    backgroundImage: isDarkMode 
                      ? 'linear-gradient(to bottom, rgba(15,23,42,0.85), rgba(9,9,11,0.95)), url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop")'
                      : 'linear-gradient(to bottom, rgba(248,250,252,0.85), rgba(255,255,255,0.95)), url("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop")'
                  }}
                >
                  {/* Lock Status */}
                  <div className="flex flex-col items-center mt-6">
                    <Lock className="w-5 h-5 mb-2 opacity-60 text-current" />
                    <span className="text-[13px] font-semibold uppercase tracking-widest opacity-60">Locked Mockup</span>
                    
                    {/* Grand Digital Clock */}
                    <h1 className="text-6xl font-extrabold tracking-tight mt-3 font-mono">
                      {currentTime}
                    </h1>
                    <p className="text-[14px] font-semibold opacity-80 mt-1">{currentDateString}</p>

                    {/* Quick lock screen widget */}
                    <div className="mt-8 bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/10 p-4 rounded-3xl w-full max-w-[280px]">
                      <div className="flex items-center gap-2 mb-1.5">
                        <CreditCard className={`w-4 h-4 ${themeConfig.accentText}`} />
                        <span className="text-xs font-semibold">Today's Total Spent</span>
                      </div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-bold font-mono text-current">
                          ${todaySpent.toFixed(2)}
                        </span>
                        <span className="text-[10px] opacity-75">/ limit</span>
                      </div>
                      <div className="w-full bg-white/10 dark:bg-white/5 h-1.5 rounded-full mt-2.5 overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${themeConfig.gradient}`} 
                          style={{ width: `${Math.min(100, (todaySpent / 150) * 100)}%` }} 
                        />
                      </div>
                      <p className="text-[9px] opacity-70 mt-1">Daily caution limit: $150.00</p>
                    </div>
                  </div>

                  {/* Swipe bottom prompt */}
                  <div className="flex flex-col items-center gap-3">
                    <motion.div 
                      animate={{ y: [0, -6, 0] }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center cursor-pointer hover:scale-105"
                      onClick={() => setIsLocked(false)}
                    >
                      <Unlock className={`w-4 h-4 ${themeConfig.accentText}`} />
                    </motion.div>
                    <span className="text-[11px] font-bold opacity-60">Click Button to Unlock Screen</span>
                  </div>
                </motion.div>
              ) : !currentUser ? (
                /* AUTHENTICATION STATE: EMAIL LOGIN & SIGNUP */
                <motion.div
                  key="auth-screens"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex flex-col justify-between p-6 overflow-y-auto no-scrollbar relative"
                  style={{
                    background: isDarkMode 
                      ? 'linear-gradient(to bottom, #09090b, #0f172a)'
                      : 'linear-gradient(to bottom, #ffffff, #f8fafc)'
                  }}
                >
                  {/* Decorative Glowing Mesh in background */}
                  <div className="absolute top-[-40px] left-[-40px] w-36 h-36 rounded-full bg-teal-500/10 blur-[40px] pointer-events-none" />
                  <div className="absolute bottom-[-40px] right-[-40px] w-36 h-36 rounded-full bg-indigo-500/10 blur-[40px] pointer-events-none" />

                  <div className="flex flex-col items-center mt-6">
                    {/* Glowing Logo Circle */}
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-teal-500/20 mb-3 transform hover:rotate-6 transition-transform">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-white">
                      {authScreenMode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 text-center">
                      {authScreenMode === 'login' ? 'Sign in to access your budget records' : 'Set up email credentials for database sync'}
                    </p>
                  </div>

                  {/* Auth Form */}
                  <form onSubmit={handleAuthSubmit} className="space-y-3 my-4 relative z-10 text-left">
                    {authError && (
                      <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 p-2.5 rounded-xl border border-rose-100/10 text-[11px] font-semibold flex items-start gap-1.5 animate-pulse">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{authError}</span>
                      </div>
                    )}

                    {authScreenMode === 'signup' && (
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block pl-1">Display Name</label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 text-current" />
                          <input 
                            type="text" 
                            required
                            placeholder="Seenu"
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            className="w-full bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-800 dark:text-slate-100"
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block pl-1">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 text-current" />
                        <input 
                          type="email" 
                          required
                          placeholder="seenusreenivas388@gmail.com"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          className="w-full bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block pl-1">Password</label>
                      <div className="relative">
                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 text-current" />
                        <input 
                          type="password" 
                          required
                          placeholder="••••••••"
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          className="w-full bg-slate-100/60 dark:bg-slate-950/60 border border-slate-200/50 dark:border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isAuthLoading}
                      className="w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-center text-white bg-gradient-to-r from-teal-500 to-indigo-600 shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 mt-3"
                    >
                      {isAuthLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        authScreenMode === 'login' ? 'Sign In with Email' : 'Register Account'
                      )}
                    </button>
                  </form>

                  <div className="flex flex-col items-center gap-3 text-xs">
                    <button 
                      onClick={() => setAuthScreenMode(authScreenMode === 'login' ? 'signup' : 'login')}
                      className="text-slate-500 dark:text-slate-400 font-semibold hover:underline text-[11px]"
                    >
                      {authScreenMode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                    </button>

                    <div className="w-full border-t border-slate-200/50 dark:border-slate-800/80 my-1" />

                    {/* Quick Access Dev mode */}
                    <div className="text-center w-full">
                      <p className="text-[10px] text-slate-400 mb-1.5">Simulate connected Firebase state</p>
                      <button 
                        onClick={handleSkipAuth}
                        className="w-full py-2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        ⚡ Fast-Track Demo Sign-In
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* MAIN APP HOME/DASHBOARD STATE */
                <motion.div
                  key="app-dashboard"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 flex flex-col h-full overflow-hidden"
                >
                  
                  {/* APP CUSTOM HEADER */}
                  <div className="px-5 pt-2 pb-4 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-slate-800 shadow-md">
                        <img 
                          src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${currentUser?.avatarSeed || 'Seenu'}`} 
                          alt="Avatar" 
                          referrerPolicy="no-referrer"
                          className="w-full h-full bg-slate-200"
                        />
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                      </div>
                      <div className="text-left">
                        <span className="text-[11px] font-bold uppercase tracking-wider opacity-50 block">Wallet Account</span>
                        <h2 className="text-[15px] font-bold tracking-tight">Hi, {currentUser?.name || 'Seenu'} 👋</h2>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Bell Indicator with Dynamic Badge Count */}
                      <button 
                        onClick={() => {
                          setIsNotificationsOpen(true);
                          // Mark all notifications as read when opening
                          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                        }}
                        className="relative w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800/80 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105 transition-transform active:scale-95"
                      >
                        <Bell className="w-4.5 h-4.5" />
                        {notifications.some(n => !n.read) && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-950 animate-bounce" />
                        )}
                      </button>
                      
                      {/* Sign Out Button */}
                      <button 
                        onClick={handleSignOut}
                        title="Sign Out of Firebase"
                        className="w-9 h-9 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800/80 flex items-center justify-center text-rose-500 hover:scale-105 transition-transform active:scale-95"
                      >
                        <LogOut className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>

                  {/* SCROLLABLE INNER APP BODY */}
                  <div className="flex-1 overflow-y-auto px-5 pb-24 no-scrollbar space-y-4">
                    {mockupTab === 'wallet' ? (
                      <>
                        {/* TODAY SPENT DISPLAY HERO HERO CARD */}
                    <div className="py-2 px-1 relative text-left">
                      <span className="text-slate-400 dark:text-slate-500 text-[11px] font-extrabold uppercase tracking-wider mb-0.5 block">Today Spent</span>
                      <div className="flex items-baseline gap-1 mt-0.5">
                        <span className="text-xl font-bold text-slate-400 dark:text-slate-500">$</span>
                        <motion.h3 
                          key={todaySpent}
                          initial={{ scale: 0.98, opacity: 0.8 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-4xl font-black tracking-tight text-slate-900 dark:text-white"
                        >
                          {todaySpent.toFixed(2)}
                        </motion.h3>
                      </div>
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-100/10 mt-1.5">
                        <TrendingDown className="w-2.5 h-2.5" />
                        <span>-12% from yesterday</span>
                      </div>
                    </div>

                    {/* REMAINING BUDGET CARD (Premium fintech look) */}
                    <div className={`relative overflow-hidden rounded-[24px] p-5 text-white bg-gradient-to-br ${themeConfig.gradient} ${themeConfig.glow} shadow-lg border border-white/10`}>
                      {/* Grid background mesh design */}
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                      <div className="absolute top-[-40px] right-[-40px] w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
                      
                      <div className="flex justify-between items-start relative z-10">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider text-white/70 block">Monthly Budget Remaining</span>
                          <span className="text-2xl font-black font-mono mt-0.5 block">
                            ${remainingBudget.toFixed(2)}
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold bg-white/20 px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm">
                          July
                        </span>
                      </div>

                      <div className="mt-6 relative z-10">
                        <div className="flex justify-between items-center text-[11px] font-bold text-white/90 mb-1.5">
                          <span>Progress: {budgetProgressPercent.toFixed(0)}%</span>
                          <span>Spent ${totalSpentMonth.toFixed(0)} of ${budgetTotal.toFixed(0)}</span>
                        </div>
                        {/* Custom visual progress bar */}
                        <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden border border-white/5 p-0.5">
                          <motion.div 
                            className="h-full bg-white rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${budgetProgressPercent}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* INCOME VS EXPENSES SPLIT OVERVIEW */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center shrink-0">
                          <TrendingUp className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block">Income</span>
                          <span className="text-[13px] font-extrabold font-mono text-emerald-600 dark:text-emerald-400 truncate block">
                            +${incomeTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-3.5 rounded-2xl shadow-sm flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center shrink-0">
                          <TrendingDown className="w-4.5 h-4.5 text-rose-600 dark:text-rose-400" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold uppercase tracking-wider opacity-50 block">Expenses</span>
                          <span className="text-[13px] font-extrabold font-mono text-rose-600 dark:text-rose-400 truncate block">
                            -${totalSpentMonth.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* HORIZONTAL CATEGORY SWIPER / BADGES */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider opacity-60">Categories</h4>
                        <span className="text-[10px] font-semibold text-slate-400">Filter transactions</span>
                      </div>
                      
                      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 pt-1">
                        <button
                          onClick={() => setSelectedCategoryFilter('all')}
                          className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-200 shrink-0 shadow-sm ${
                            selectedCategoryFilter === 'all'
                              ? `${themeConfig.primary}`
                              : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 text-slate-600 dark:text-slate-300'
                          }`}
                        >
                          All
                        </button>
                        {Object.values(CATEGORIES).map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategoryFilter(cat.id)}
                            className={`px-3.5 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all duration-200 shrink-0 shadow-sm ${
                              selectedCategoryFilter === cat.id
                                ? `${themeConfig.primary}`
                                : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:bg-slate-50 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            {renderCategoryIcon(cat.id, 'w-3.5 h-3.5')}
                            <span>{cat.label.split(' ')[0]}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* QUICK STATS SUMMARY WIDGETS */}
                    <div className="bg-slate-100 dark:bg-slate-900/60 p-4 rounded-3xl space-y-2.5 border border-slate-200/20">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Quick Insights</span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 font-bold">Auto</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Daily Avg</span>
                          <span className="text-sm font-extrabold font-mono mt-0.5 block">
                            ${(totalSpentMonth / 8).toFixed(2)}
                          </span>
                        </div>
                        <div className="bg-white dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                          <span className="text-[9px] text-slate-400 font-bold uppercase block">Transactions</span>
                          <span className="text-sm font-extrabold font-mono mt-0.5 block">
                            {transactions.length} items
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* RECENT TRANSACTIONS HEADER */}
                    <div className="pt-2">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider opacity-60">
                          Transactions ({filteredTransactions.length})
                        </h4>
                        <span className="text-[10px] font-semibold text-slate-400">Swipe/Click to delete</span>
                      </div>

                      {/* TRANSACTIONS LIST */}
                      <div className="space-y-2.5">
                        <AnimatePresence initial={false}>
                          {filteredTransactions.length === 0 ? (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-center py-8 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl"
                            >
                              <CircleEllipsis className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-xs font-bold text-slate-400">No transactions in this category</p>
                              <p className="text-[10px] text-slate-400/80 mt-0.5">Click + Add Expense to create one!</p>
                            </motion.div>
                          ) : (
                            filteredTransactions.map(t => {
                              const catInfo = CATEGORIES[t.category] || CATEGORIES.other;
                              return (
                                <motion.div
                                  key={t.id}
                                  layout
                                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, x: -80, scale: 0.95 }}
                                  transition={{ type: 'spring', duration: 0.35 }}
                                  className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-3 rounded-2xl shadow-sm hover:border-slate-200 dark:hover:border-slate-700/80 transition-colors flex items-center justify-between"
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${catInfo.bgClass} ${catInfo.textClass}`}>
                                      {renderCategoryIcon(t.category, 'w-5 h-5')}
                                    </div>
                                    <div className="min-w-0">
                                      <h5 className="text-[13px] font-bold truncate pr-1 text-slate-900 dark:text-white">
                                        {t.merchant}
                                      </h5>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase ${catInfo.bgClass} ${catInfo.textClass}`}>
                                          {catInfo.label.split(' ')[0]}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-mono">
                                          {t.date !== '2026-07-08' ? t.date : t.time}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <span className={`text-[13px] font-extrabold font-mono ${
                                      t.isExpense 
                                        ? 'text-slate-900 dark:text-white' 
                                        : 'text-emerald-500 font-bold'
                                    }`}>
                                      {t.isExpense ? '-' : '+'}${t.amount.toFixed(2)}
                                    </span>
                                    
                                    {/* Action button to delete */}
                                    <button 
                                      onClick={() => onDeleteTransaction(t.id)}
                                      className="opacity-0 group-hover:opacity-100 focus:opacity-100 ml-1 p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all cursor-pointer"
                                      title="Delete transaction"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </motion.div>
                              );
                            })
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                        <div className="h-20" /> {/* spacer for bottom bar */}
                      </>
                    ) : (
                      /* MY PROFILE SCREEN VIEW */
                      <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 text-left pb-24"
                      >
                        {/* Premium Avatar & Randomizer Card */}
                        <div className="p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-4">
                          <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 shadow-md shrink-0">
                            <img 
                              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${profileAvatarSeed}`} 
                              alt="Avatar" 
                              referrerPolicy="no-referrer"
                              className="w-full h-full bg-slate-200"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-[14px] font-black tracking-tight truncate text-slate-800 dark:text-white">Interactive Avatar</h4>
                            <div className="flex gap-1.5 mt-1.5">
                              <button 
                                type="button"
                                onClick={() => {
                                  const randomSeeds = ['John', 'Jane', 'Seenu', 'Alice', 'Fintech', 'Wallet', 'Spark', 'Cloud', 'Sre'];
                                  const nextSeed = randomSeeds[Math.floor(Math.random() * randomSeeds.length)] + Math.floor(Math.random() * 100);
                                  setProfileAvatarSeed(nextSeed);
                                  setDynamicIslandMsg("🎲 Generated dynamic adventurer avatar!");
                                  setTimeout(() => setDynamicIslandMsg(null), 3000);
                                }}
                                className="px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/20 border border-teal-100/10 text-[9px] font-bold text-teal-600 dark:text-teal-400 hover:scale-105 transition-transform cursor-pointer"
                              >
                                🎲 Randomize
                              </button>
                              <button 
                                type="button"
                                onClick={() => {
                                  const input = prompt("Enter a custom avatar seed string:", profileAvatarSeed);
                                  if (input) setProfileAvatarSeed(input.trim());
                                }}
                                className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[9px] font-semibold text-slate-600 dark:text-slate-300 hover:scale-105 transition-transform cursor-pointer"
                              >
                                ✏️ Custom Seed
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Display Profile Information Settings */}
                        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-3.5">
                          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Account Credentials</h4>
                          
                          {/* Display Name Input */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 pl-0.5">Display Name</label>
                            <div className="relative">
                              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 text-current" />
                              <input 
                                type="text"
                                placeholder="Display Name"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100"
                              />
                            </div>
                          </div>

                          {/* Email Verified display */}
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 pl-0.5">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 opacity-40 text-current" />
                              <div className="w-full bg-slate-100/50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-xl py-2 pl-9 pr-3 text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-between">
                                <span className="truncate">{currentUser?.email || 'unregistered@firebase.sandbox'}</span>
                                <span className="text-[8px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-1.5 py-0.5 rounded-md font-bold uppercase shrink-0">Verified</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Firebase Sync Settings & Controls */}
                        <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800/80 shadow-sm space-y-4">
                          <h4 className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400">Security & Database Settings</h4>
                          
                          {/* Firestore Toggle */}
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">Cloud Firestore Sync</span>
                              <span className="text-[10px] text-slate-400 block max-w-[180px]">Keep budget records synced across all active devices in real-time.</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setIsFirestoreSync(!isFirestoreSync)}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                                isFirestoreSync ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                isFirestoreSync ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>

                          {/* Biometric Toggle */}
                          <div className="flex items-center justify-between border-t border-slate-100/60 dark:border-slate-800/60 pt-3">
                            <div className="space-y-0.5">
                              <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100 block">Biometric Lock Security</span>
                              <span className="text-[10px] text-slate-400 block max-w-[180px]">Require face ID or passcode when restoring app from minimized.</span>
                            </div>
                            <button 
                              type="button"
                              onClick={() => setIsBiometricLock(!isBiometricLock)}
                              className={`w-9 h-5 rounded-full p-0.5 transition-colors focus:outline-none ${
                                isBiometricLock ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-700'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                isBiometricLock ? 'translate-x-4' : 'translate-x-0'
                              }`} />
                            </button>
                          </div>
                        </div>

                        {/* Interactive Save Button */}
                        <button
                          type="button"
                          onClick={() => {
                            if (!profileName.trim()) {
                              alert("Please enter a valid display name.");
                              return;
                            }
                            setCurrentUser({
                              email: currentUser?.email || 'seenusreenivas388@gmail.com',
                              name: profileName.trim(),
                              avatarSeed: profileAvatarSeed
                            });
                            
                            // Trigger dynamic island feedback
                            setDynamicIslandMsg("👤 Profile synchronized to Firebase!");
                            setTimeout(() => setDynamicIslandMsg(null), 3000);
                            
                            // Add a real-time event log
                            const newNotif = {
                              id: 'notif-' + Date.now(),
                              title: 'Profile Updated Successfully',
                              body: `Metadata records for user "${profileName.trim()}" successfully deployed to Cloud Firestore.`,
                              time: 'Just now',
                              read: false,
                              type: 'auth' as const,
                              icon: 'UserPlus'
                            };
                            setNotifications(prev => [newNotif, ...prev]);
                            
                            // Switch back to wallet view
                            setMockupTab('wallet');
                          }}
                          className={`w-full py-3.5 rounded-2xl text-xs uppercase tracking-widest font-black text-center text-white bg-gradient-to-r ${themeConfig.gradient} ${themeConfig.glow} shadow-md transition-all active:scale-[0.98] cursor-pointer`}
                        >
                          Save Profile Changes
                        </button>
                      </motion.div>
                    )}
                  </div>

                  {/* BOTTOM BLURRED NAVIGATION TAB BAR */}
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/90 dark:bg-slate-950/90 backdrop-blur-lg border-t border-slate-100/60 dark:border-slate-800/60 px-6 pt-2 pb-6 flex items-center justify-between z-30 select-none">
                    <button 
                      onClick={() => {
                        setMockupTab('wallet');
                        setDynamicIslandMsg("🏠 Dashboard view is active!");
                        setTimeout(() => setDynamicIslandMsg(null), 3000);
                      }}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <CreditCard className={`w-5 h-5 ${mockupTab === 'wallet' ? 'text-teal-500' : 'text-slate-400'}`} />
                      <span className={`text-[10px] ${mockupTab === 'wallet' ? 'font-bold text-teal-600 dark:text-teal-400' : 'font-semibold text-slate-400'}`}>Wallet</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" onClick={() => {
                      setDynamicIslandMsg("📊 Category segments are on the left!");
                      setTimeout(() => setDynamicIslandMsg(null), 3000);
                    }}>
                      <BarChart3 className="w-5 h-5" />
                      <span className="text-[10px] font-semibold">Stats</span>
                    </button>

                    {/* Gap for floating button */}
                    <div className="w-12" />

                    <button 
                      onClick={() => {
                        setMockupTab('profile');
                        setDynamicIslandMsg("👤 Profile view is active!");
                        setTimeout(() => setDynamicIslandMsg(null), 3000);
                      }}
                      className="flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <User className={`w-5 h-5 ${mockupTab === 'profile' ? 'text-teal-500' : 'text-slate-400'}`} />
                      <span className={`text-[10px] ${mockupTab === 'profile' ? 'font-bold text-teal-600 dark:text-teal-400' : 'font-semibold text-slate-400'}`}>Profile</span>
                    </button>

                    <button className="flex flex-col items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer" onClick={() => setIsLocked(true)}>
                      <Lock className="w-5 h-5" />
                      <span className="text-[10px] font-semibold">Lock</span>
                    </button>
                  </div>

                  {/* FLOATING + ADD EXPENSE FLOATING BUTTON (Fintech style) */}
                  <div className="absolute bottom-6 left-0 right-0 flex justify-center z-40 pointer-events-none">
                    <button
                      onClick={() => setIsBottomSheetOpen(true)}
                      className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transform transition-all duration-200 cursor-pointer active:scale-95 hover:scale-105 pointer-events-auto bg-gradient-to-r ${themeConfig.gradient} ${themeConfig.glow}`}
                    >
                      <Plus className="w-7 h-7 text-white" />
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

            {/* INTUITIVE IOS HOME BOTTOM INDICATOR BAR */}
            <div className="absolute bottom-1 left-0 right-0 flex justify-center z-50 pointer-events-none select-none">
              <div className={`w-32 h-1 rounded-full ${isDarkMode ? 'bg-white/40' : 'bg-black/20'}`} />
            </div>

            {/* ADD EXPENSE iOS SLIDE-UP BOTTOM SHEET */}
            <AnimatePresence>
              {isBottomSheetOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsBottomSheetOpen(false)}
                    className="absolute inset-0 bg-black z-40"
                  />
                  
                  {/* Bottom Sheet Box */}
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                    className={`absolute bottom-0 left-0 right-0 rounded-t-[32px] p-6 pb-8 z-50 border-t border-slate-100 dark:border-slate-800 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] ${
                      isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
                    }`}
                  >
                    {/* IOS Drag bar indicator */}
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-md font-extrabold tracking-tight">Add New Entry</h4>
                      <button 
                        onClick={() => setIsBottomSheetOpen(false)}
                        className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-current hover:bg-slate-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
                      {/* Flow switcher: Expense or Income */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200/10">
                        <button
                          type="button"
                          onClick={() => setIsExpenseInput(true)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            isExpenseInput 
                              ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' 
                              : 'text-slate-400 dark:text-slate-500 hover:text-current'
                          }`}
                        >
                          💸 Expense
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsExpenseInput(false)}
                          className={`py-2 rounded-xl text-xs font-bold transition-all ${
                            !isExpenseInput 
                              ? 'bg-white dark:bg-slate-800 text-emerald-500 dark:text-emerald-400 shadow-sm' 
                              : 'text-slate-400 dark:text-slate-500 hover:text-current'
                          }`}
                        >
                          📈 Income
                        </button>
                      </div>

                      {/* Numeric Amount Input */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          Amount ($ USD)
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 opacity-40" />
                          <input 
                            type="number"
                            step="0.01"
                            min="0.01"
                            required
                            placeholder="0.00"
                            value={amountInput}
                            onChange={(e) => setAmountInput(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-10 pr-4 font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                          />
                        </div>
                      </div>

                      {/* Merchant name */}
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                          {isExpenseInput ? 'Merchant Name' : 'Income Source'}
                        </label>
                        <input 
                          type="text"
                          required
                          placeholder={isExpenseInput ? "e.g., Starbucks Coffee" : "e.g., Freelance Project"}
                          value={merchantInput}
                          onChange={(e) => setMerchantInput(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 px-4 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      </div>

                      {/* Transaction Date Picker with Quick Presets */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block pl-0.5">
                          Transaction Date
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <input 
                              type="date"
                              required
                              value={dateInput}
                              onChange={(e) => setDateInput(e.target.value)}
                              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl py-2.5 px-4 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-700 dark:text-slate-300 [&::-webkit-calendar-picker-indicator]:dark:invert"
                            />
                          </div>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={() => setDateInput('2026-07-08')}
                              className={`px-3 py-2.5 rounded-2xl text-[10px] font-extrabold border transition-all ${
                                dateInput === '2026-07-08'
                                  ? 'bg-teal-500 border-teal-500 text-white shadow-sm shadow-teal-500/20'
                                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                              }`}
                            >
                              Today
                            </button>
                            <button
                              type="button"
                              onClick={() => setDateInput('2026-07-07')}
                              className={`px-3 py-2.5 rounded-2xl text-[10px] font-extrabold border transition-all ${
                                dateInput === '2026-07-07'
                                  ? 'bg-teal-500 border-teal-500 text-white shadow-sm shadow-teal-500/20'
                                  : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                              }`}
                            >
                              Yest
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Category selector */}
                      {isExpenseInput && (
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                            Category
                          </label>
                          <div className="grid grid-cols-4 gap-2">
                            {(['food', 'travel', 'shopping', 'bills'] as Category[]).map(catId => {
                              const info = CATEGORIES[catId];
                              return (
                                <button
                                  key={catId}
                                  type="button"
                                  onClick={() => setCategoryInput(catId)}
                                  className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all text-[11px] font-bold ${
                                    categoryInput === catId
                                      ? 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 text-teal-600 dark:text-teal-400'
                                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
                                  }`}
                                >
                                  {renderCategoryIcon(catId, 'w-4 h-4')}
                                  <span>{info.label.split(' ')[0]}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Add Button */}
                      <button
                        type="submit"
                        className={`w-full py-3.5 rounded-2xl text-xs uppercase tracking-widest font-black text-center text-white bg-gradient-to-r ${themeConfig.gradient} shadow-lg hover:shadow-xl transform transition-transform active:scale-[0.98] mt-2 cursor-pointer`}
                      >
                        Add Entry
                      </button>
                    </form>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* IN-APP NOTIFICATIONS iOS OVERLAY SLIDE-UP */}
            <AnimatePresence>
              {isNotificationsOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setIsNotificationsOpen(false)}
                    className="absolute inset-0 bg-black z-40"
                  />
                  
                  {/* Notification Center sliding panel */}
                  <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 24, stiffness: 210 }}
                    className={`absolute bottom-0 left-0 right-0 rounded-t-[32px] p-5 pb-8 z-50 border-t border-slate-100 dark:border-slate-800 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] flex flex-col max-h-[70%] ${
                      isDarkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'
                    }`}
                  >
                    {/* iOS Bar indicator */}
                    <div className="flex justify-center mb-4 shrink-0">
                      <div className="w-12 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                    </div>

                    <div className="flex justify-between items-center mb-4 shrink-0">
                      <div className="flex items-center gap-1.5">
                        <Bell className="w-5 h-5 text-teal-500" />
                        <h4 className="text-md font-black tracking-tight">Notification Center</h4>
                      </div>
                      
                      {notifications.length > 0 && (
                        <button 
                          onClick={() => setNotifications([])}
                          className="text-[10px] uppercase tracking-wider font-extrabold text-rose-500 dark:text-rose-400 hover:opacity-80 cursor-pointer"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    {/* Scrollable notifications lists */}
                    <div className="flex-1 overflow-y-auto no-scrollbar space-y-2.5 pb-4">
                      {notifications.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center opacity-60">
                          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                            <Bell className="w-5 h-5 text-slate-400" />
                          </div>
                          <p className="text-xs font-bold">No notifications yet</p>
                          <p className="text-[10px] text-slate-400 max-w-[200px] mt-1">Transaction entries and account changes trigger real-time alert logs.</p>
                        </div>
                      ) : (
                        notifications.map(notif => (
                          <div 
                            key={notif.id}
                            className={`p-3 rounded-2xl border flex gap-3 transition-all ${
                              notif.read 
                                ? 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-800/60' 
                                : 'bg-teal-50/10 dark:bg-teal-950/5 border-teal-500/20'
                            }`}
                          >
                            <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                              {renderNotifIcon(notif.icon, notif.type)}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="flex justify-between items-start gap-1">
                                <h5 className="text-[12px] font-extrabold tracking-tight">{notif.title}</h5>
                                <span className="text-[9px] text-slate-400 shrink-0 font-mono">{notif.time}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed font-semibold">{notif.body}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    <button
                      onClick={() => setIsNotificationsOpen(false)}
                      className="w-full py-3.5 rounded-2xl text-xs uppercase tracking-widest font-black text-center text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors mt-2 cursor-pointer shrink-0"
                    >
                      Close Logs
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

          </div>

        </div>
      </div>
    </div>
  );
};
