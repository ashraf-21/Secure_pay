import React, { useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    AreaChart, Area
} from 'recharts';
import { TrendingUp, Target, Zap, ShieldAlert, Activity } from 'lucide-react';

const AnalyticsContent = ({ transactions }) => {
    // Mock performance data (stays stable as it's percentage based)
    const performanceMetrics = [
        { name: 'AUC Score', value: '0.94', icon: Target, color: 'primary' },
        { name: 'Precision', value: '92.5%', icon: ShieldAlert, color: 'accent' },
        { name: 'Recall', value: '88.2%', icon: Zap, color: 'warning' },
        { name: 'F1 Score', value: '90.3%', icon: Activity, color: 'primary' },
    ];

    const secondaryMetrics = [
        { label: 'False Positives', value: '1.2%', sub: 'Target < 2.0%' },
        { label: 'False Negatives', value: '0.8%', sub: 'Target < 1.0%' },
    ];

    // Functional Mode Data
    const modeData = useMemo(() => [
        { mode: 'UPI', fraud: 45, safe: 320 },
        { mode: 'IMPS', fraud: 28, safe: 190 },
        { mode: 'NEFT', fraud: 12, safe: 450 },
        { mode: 'RTGS', fraud: 8, safe: 120 },
    ], []);

    // Functional Trend Data
    const trendData = useMemo(() => [
        { day: 'Mon', count: 4 },
        { day: 'Tue', count: 7 },
        { day: 'Wed', count: 5 },
        { day: 'Thu', count: 12 },
        { day: 'Fri', count: 9 },
        { day: 'Sat', count: 15 },
        { day: 'Sun', count: 11 },
    ], []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">



            {/* Model Performance Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {performanceMetrics.map((m) => (
                    <div key={m.name} className="glass-card p-6 border-l-4 border-l-primary">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <m.icon className="w-5 h-5 text-primary" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">{m.name}</p>
                        </div>
                        <p className="text-3xl font-black tracking-tighter">{m.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Confusion Matrix */}
                <div className="lg:col-span-1 glass-card p-6">
                    <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5 text-destructive" />
                        Confusion Matrix
                    </h3>
                    <div className="grid grid-cols-2 gap-2 relative">
                        <div className="absolute -left-6 top-1/2 -rotate-90 text-[10px] font-black uppercase text-muted-foreground opacity-50">Actual</div>
                        <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 text-[10px] font-black uppercase text-muted-foreground opacity-50">Predicted</div>

                        <div className="aspect-square bg-success/10 border-2 border-success/20 rounded-xl flex flex-col items-center justify-center p-4">
                            <p className="text-2xl font-black text-success">98.8%</p>
                            <p className="text-[9px] font-bold uppercase opacity-60">True Negative</p>
                        </div>
                        <div className="aspect-square bg-destructive/5 border-2 border-border/10 rounded-xl flex flex-col items-center justify-center p-4">
                            <p className="text-2xl font-black text-destructive/50">1.2%</p>
                            <p className="text-[9px] font-bold uppercase opacity-60">False Positive</p>
                        </div>
                        <div className="aspect-square bg-destructive/5 border-2 border-border/10 rounded-xl flex flex-col items-center justify-center p-4">
                            <p className="text-2xl font-black text-destructive/50">0.8%</p>
                            <p className="text-[9px] font-bold uppercase opacity-60">False Negative</p>
                        </div>
                        <div className="aspect-square bg-destructive/20 border-2 border-destructive/30 rounded-xl flex flex-col items-center justify-center p-4">
                            <p className="text-2xl font-black text-destructive">88.2%</p>
                            <p className="text-[9px] font-bold uppercase opacity-60">True Positive</p>
                        </div>
                    </div>
                    <div className="mt-8 space-y-4">
                        {secondaryMetrics.map(s => (
                            <div key={s.label} className="flex justify-between items-end border-b border-border/40 pb-2">
                                <div>
                                    <p className="text-xs font-bold text-muted-foreground uppercase">{s.label}</p>
                                    <p className="text-[10px] text-muted-foreground/60">{s.sub}</p>
                                </div>
                                <p className="text-lg font-black">{s.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fraud by Mode Chart */}
                <div className="lg:col-span-2 glass-card p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-primary" />
                            Fraud Incidents by Mode
                        </h3>
                        <div className="flex gap-4 text-[10px] font-bold uppercase">
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-destructive" /> Fraud</div>
                            <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-secondary" /> Safe</div>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={modeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                            <XAxis dataKey="mode" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Bar dataKey="fraud" fill="#e53935" radius={[4, 4, 0, 0]} barSize={40} />
                            <Bar dataKey="safe" fill="rgba(255,255,255,0.05)" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Over-time Trend */}
            <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-warning" />
                    Fraud Detection Timeline
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#e53935" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#e53935" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="day" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }}
                            itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey="count" stroke="#e53935" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

        </div>
    );
};

export default AnalyticsContent;
