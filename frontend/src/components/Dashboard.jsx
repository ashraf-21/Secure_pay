import React, { useState, useEffect } from 'react';
import { transactionAPI } from '../api';
import TransactionList from './TransactionList';
import MetricsCard from './MetricsCard';
import FraudChart from './FraudChart';
import ThemeToggle from './ThemeToggle';
import {
  Shield, AlertTriangle, TrendingUp, IndianRupee,
  Activity, LogOut, RefreshCw,
  LayoutDashboard, History, Bell, BarChart2, Search,
  Menu, PanelLeftClose, Settings as SettingsIcon, Timer
} from 'lucide-react';
import AnalyticsContent from './AnalyticsContent';
import Settings from './Settings';

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard },
  { name: 'Transaction History', icon: History },
  { name: 'Fraud Alerts', icon: Bell },
  { name: 'Analytics', icon: BarChart2 },
  { name: 'Settings', icon: SettingsIcon },
];

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [historyFilter, setHistoryFilter] = useState('All');
  const [historySearch, setHistorySearch] = useState('');
  const [lastSeenFraudCount, setLastSeenFraudCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [nextRefreshIn, setNextRefreshIn] = useState(30);

  const generateRandomTransactions = (count = 5) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const isFraudCase = Math.random() < 0.15;
      const amount = Math.floor(Math.random() * 10000);
      data.push({
        transactionId: `TXN-AUTO-${Date.now()}-${i}`,
        transactionType: Math.random() > 0.5 ? 'Credit' : 'Debit',
        transactionMode: ['UPI', 'IMPS', 'NEFT', 'RTGS'][Math.floor(Math.random() * 4)],
        amount: amount,
        senderId: `USR-${Math.floor(Math.random() * 9000) + 1000}`,
        senderAccount: `ACC${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        senderMobile: `${Math.floor(6000000000 + Math.random() * 4000000000)}`,
        senderDevice: isFraudCase ? 'New Device' : 'Authorized Device',
        senderLocation: isFraudCase ? 'International / Proxy' : 'Mumbai, India',
        receiverId: `USR-${Math.floor(Math.random() * 9000) + 1000}`,
        receiverAccount: `ACC${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        receiverMobile: `${Math.floor(6000000000 + Math.random() * 4000000000)}`,
        receiverLocation: 'Chennai, India',
        authType: 'OTP',
        transactionTime: new Date().toLocaleTimeString()
      });
    }
    return data;
  };

  const performAutoGeneration = async () => {
    setNextRefreshIn(30);
    try {
      const payload = generateRandomTransactions(5);
      const response = await transactionAPI.createBatch(payload);
      handleTransactionAdded(response.data);
    } catch (error) {
      console.error('Auto-generation failed:', error);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await transactionAPI.getAll();
      setTransactions(response.data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Auto-generate every 30 seconds
    const genInterval = setInterval(() => {
      performAutoGeneration();
    }, 30000);

    // Countdown timer for UI
    const countdownInterval = setInterval(() => {
      setNextRefreshIn(prev => (prev > 0 ? prev - 1 : 30));
    }, 1000);

    return () => {
      clearInterval(genInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTransactions();
    await performAutoGeneration();
  };

  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // High-pitched A5
      oscillator.frequency.exponentialRampToValueAtTime(440, audioCtx.currentTime + 0.5); // Descend to A4

      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } catch (e) {
      console.warn('Audio visualization blocked or failed', e);
    }
  };

  const handleTransactionAdded = (newTx) => {
    const txArray = Array.isArray(newTx) ? newTx : [newTx];
    const hasFraud = txArray.some(t => t.isFraud);

    if (hasFraud) {
      playAlertSound();
    }

    if (Array.isArray(newTx)) {
      setTransactions(prev => [...newTx, ...prev]);
    } else {
      setTransactions(prev => [newTx, ...prev]);
    }
  };

  const totalFraudCount = transactions.filter(t => t.isFraud).length;
  const unreadAlerts = Math.max(0, totalFraudCount - lastSeenFraudCount);

  useEffect(() => {
    if (activeTab === 'Fraud Alerts') {
      setLastSeenFraudCount(totalFraudCount);
    }
  }, [activeTab, totalFraudCount]);

  const fraudCount = totalFraudCount; // Keep for metrics
  const safeCount = transactions.filter(t => !t.isFraud).length;
  const totalAmount = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const fraudAmount = transactions
    .filter(t => t.isFraud)
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const avgFraudScore = transactions.length > 0
    ? (transactions.reduce((sum, t) => sum + (t.fraudScore || 0), 0) / transactions.length).toFixed(2)
    : 0;

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background flex relative">

      {/* Sidebar Overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 glass-card border-r border-border/40 fixed inset-y-0 left-0 z-50 flex flex-col rounded-none rounded-r-2xl transition-all duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0 outline-none' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center gap-3">
          <div className="bg-primary/20 p-2.5 rounded-xl">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text leading-tight">SecurePay</h1>
            <p className="text-xs text-muted-foreground">Monitor & Alert</p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === item.name
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/25 translate-x-1'
                : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                }`}
            >
              <div className="flex items-center gap-4">
                <item.icon className="w-5 h-5" />
                {item.name}
              </div>
              {item.name === 'Fraud Alerts' && unreadAlerts > 0 && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeTab === item.name ? 'bg-primary-foreground text-primary' : 'bg-destructive text-white'
                  }`}>
                  {unreadAlerts}
                </span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>

        {/* Header */}
        <header className="glass-card rounded-none border-b border-border/40 sticky top-0 z-40 backdrop-blur-xl">
          <div className="px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2.5 rounded-xl bg-secondary hover:bg-secondary/80 text-primary transition-all shadow-sm flex items-center justify-center shrink-0"
                  title={sidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
                >
                  {sidebarOpen ? (
                    <PanelLeftClose className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-4 min-w-0">
                <div className="text-right hidden sm:block border-r border-border/40 pr-4 lg:pr-6 shrink-0">
                  <h2 className="text-lg lg:text-xl font-bold gradient-text truncate">{activeTab}</h2>
                  <p className="text-[9px] lg:text-[10px] text-muted-foreground uppercase font-black tracking-wider leading-tight hidden xl:block">
                    {activeTab === 'Dashboard' && 'Real-time Monitoring'}
                    {activeTab === 'Transaction History' && 'History Log'}
                    {activeTab === 'Fraud Alerts' && 'Suspicious Activities'}
                    {activeTab === 'Analytics' && 'Performance Data'}
                    {activeTab === 'Settings' && 'Configuration & Profile'}
                  </p>
                </div>

                <div className="flex items-center gap-2 lg:gap-3 shrink-0">
                  <div className="relative mr-2">
                    <button
                      onClick={() => setActiveTab('Fraud Alerts')}
                      className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors notification-btn"
                      title="View Fraud Alerts"
                    >
                      <Bell className={`w-5 h-5 text-muted-foreground ${unreadAlerts > 0 ? 'notification-pulse text-destructive' : ''}`} />
                      {unreadAlerts > 0 && (
                        <span className="notification-badge">
                          {unreadAlerts > 9 ? '9+' : unreadAlerts}
                        </span>
                      )}
                    </button>
                  </div>
                  <ThemeToggle />
                  <div className="text-right hidden lg:block">
                    <p className="text-sm font-bold text-foreground leading-none">{user.username}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">{user.email}</p>
                  </div>

                  <button
                    onClick={onLogout}
                    className="btn-secondary flex items-center gap-2 px-3 lg:px-4 py-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:block">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-8">

          {/* Dashboard Tab */}
          {activeTab === 'Dashboard' && (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold">Transaction Overview</h2>
                  <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 rounded-full border border-border/40">
                    <Timer className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-black font-mono tracking-tighter">
                      AUTO-GEN IN: {nextRefreshIn}s
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleRefresh}
                  className="btn-secondary flex items-center gap-2"
                  disabled={refreshing}
                >
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh & Generate New
                </button>
              </div>

              <div className="dashboard-grid mb-8">
                <MetricsCard title="Total Transactions" value={transactions.length} icon={Activity} color="primary" />
                <MetricsCard title="Fraud Detected" value={fraudCount} icon={AlertTriangle} color="destructive" />
                <MetricsCard title="Safe Transactions" value={safeCount} icon={Shield} color="accent" />
                <MetricsCard
                  title="Amount Prevented from Fraud"
                  value={new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(fraudAmount)}
                  icon={Shield}
                  color="primary"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <FraudChart transactions={transactions} />
              </div>

              <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
              <TransactionList transactions={transactions.slice(0, 5)} loading={loading} />
            </>
          )}


          {/* History Tab */}
          {activeTab === 'Transaction History' && (() => {
            const filtered = transactions
              .filter(t => {
                if (historyFilter === 'Safe') return !t.isFraud;
                if (historyFilter === 'Fraud') return t.isFraud;
                return true;
              })
              .filter(t => {
                if (!historySearch.trim()) return true;
                const q = historySearch.toLowerCase();
                return (
                  (t.transactionId || '').toLowerCase().includes(q) ||
                  (t.senderId || '').toLowerCase().includes(q) ||
                  (t.receiverId || '').toLowerCase().includes(q) ||
                  (t.senderAccount || '').toLowerCase().includes(q) ||
                  (t.receiverAccount || '').toLowerCase().includes(q)
                );
              });

            return (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                  <h3 className="text-xl font-bold">Recent Transactions</h3>

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search accounts..."
                        value={historySearch}
                        onChange={(e) => setHistorySearch(e.target.value)}
                        className="input-field !pl-9 !py-2 text-sm w-56"
                      />
                    </div>

                    {/* Filter Pills */}
                    <div className="flex items-center bg-secondary rounded-lg p-1">
                      {['All', 'Safe', 'Fraud'].map((f) => (
                        <button
                          key={f}
                          onClick={() => setHistoryFilter(f)}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${historyFilter === f
                            ? 'bg-primary text-primary-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>

                    {/* Refresh */}
                    <button onClick={handleRefresh} className="btn-secondary flex items-center gap-2" disabled={refreshing}>
                      <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </button>
                  </div>
                </div>

                <TransactionList transactions={filtered} loading={loading} />
              </>
            );
          })()}

          {/* Fraud Alerts Tab */}
          {activeTab === 'Fraud Alerts' && (
            <>
              <div className="flex justify-end mb-4">
                <button onClick={handleRefresh} className="btn-secondary flex items-center gap-2" disabled={refreshing}>
                  <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh Alerts
                </button>
              </div>
              <TransactionList transactions={transactions.filter(t => t.isFraud)} loading={loading} />
            </>
          )}

          {/* Analytics Tab */}
          {activeTab === 'Analytics' && (
            <AnalyticsContent transactions={transactions} />
          )}

          {/* Settings Tab */}
          {activeTab === 'Settings' && (
            <Settings user={user} />
          )}

        </main>

        {/* Footer */}
        <footer className="w-full mt-auto bg-primary text-primary-foreground py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <div className="max-w-[1600px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-xs opacity-90">
              © {new Date().getFullYear()} Fraud Guard. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-xs opacity-90">
              <a href="#" className="hover:opacity-100 hover:underline transition-colors">Privacy Policy</a>
              <a href="#" className="hover:opacity-100 hover:underline transition-colors">Terms of Service</a>
              <a href="#" className="hover:opacity-100 hover:underline transition-colors">Support</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
};

export default Dashboard;