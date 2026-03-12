import React, { useState } from 'react';
import {
    User, Bell, Settings as SettingsIcon, Shield,
    Mail, MessageSquare, Monitor, Save, Lock,
    FileAxis3d, Percent, IndianRupee
} from 'lucide-react';

const Settings = ({ user }) => {
    const [profile, setProfile] = useState({
        name: user?.username || '',
        email: user?.email || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notifications, setNotifications] = useState({
        email: true,
        sms: false,
        inApp: true
    });

    const [simulation, setSimulation] = useState({
        defaultBatchSize: 10,
        defaultFraudRatio: 0.15,
        maxAmount: 500000
    });

    const handleProfileUpdate = (e) => {
        e.preventDefault();
        console.log('Profile updated:', profile);
        alert('Profile settings updated successfully!');
    };

    const handleSimulationSave = (e) => {
        e.preventDefault();
        console.log('Simulation settings saved:', simulation);
        alert('Simulation parameters saved!');
    };

    const Toggle = ({ enabled, onChange, label, icon: Icon }) => (
        <div className="flex items-center justify-between p-4 glass-card bg-secondary/20 hover:bg-secondary/40 transition-colors">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${enabled ? 'bg-primary/20 text-primary' : 'bg-muted/20 text-muted-foreground'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-sm font-bold text-foreground uppercase tracking-tight">{label}</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-black opacity-60">Status: {enabled ? 'Active' : 'Disabled'}</p>
                </div>
            </div>
            <button
                onClick={() => onChange(!enabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background ${enabled ? 'bg-primary' : 'bg-secondary'
                    }`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                />
            </button>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">

            {/* Profile Settings */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <User className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold uppercase tracking-tight">Profile Settings</h2>
                </div>

                <form onSubmit={handleProfileUpdate} className="glass-card p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                    className="input-field !pl-11"
                                    placeholder="Your Name"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="email"
                                    value={profile.email}
                                    disabled
                                    className="input-field !pl-11 opacity-60 cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-border/40">
                        <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1 block mb-4">Change Password</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="Current Password"
                                    className="input-field !pl-11"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    className="input-field !pl-11"
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="input-field !pl-11"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button type="submit" className="btn-primary px-8 flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Update Profile
                        </button>
                    </div>
                </form>
            </section>

            {/* Notification Settings */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <Bell className="w-6 h-6 text-warning" />
                    <h2 className="text-xl font-bold uppercase tracking-tight">Notification Channels</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Toggle
                        label="Email Alerts"
                        enabled={notifications.email}
                        onChange={(val) => setNotifications({ ...notifications, email: val })}
                        icon={Mail}
                    />
                    <Toggle
                        label="SMS Alerts"
                        enabled={notifications.sms}
                        onChange={(val) => setNotifications({ ...notifications, sms: val })}
                        icon={MessageSquare}
                    />
                    <Toggle
                        label="In-App Alerts"
                        enabled={notifications.inApp}
                        onChange={(val) => setNotifications({ ...notifications, inApp: val })}
                        icon={Monitor}
                    />
                </div>
            </section>

            {/* Simulation Defaults */}
            <section>
                <div className="flex items-center gap-2 mb-6">
                    <Shield className="w-6 h-6 text-accent" />
                    <h2 className="text-xl font-bold uppercase tracking-tight">Simulation Parameters</h2>
                </div>

                <form onSubmit={handleSimulationSave} className="glass-card p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Default Batch Size</label>
                            <div className="relative">
                                <FileAxis3d className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="number"
                                    value={simulation.defaultBatchSize}
                                    onChange={(e) => setSimulation({ ...simulation, defaultBatchSize: parseInt(e.target.value) })}
                                    className="input-field !pl-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Default Fraud Ratio (0-1)</label>
                            <div className="relative">
                                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="1"
                                    value={simulation.defaultFraudRatio}
                                    onChange={(e) => setSimulation({ ...simulation, defaultFraudRatio: parseFloat(e.target.value) })}
                                    className="input-field !pl-11"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest pl-1">Max Tx Amount (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <input
                                    type="number"
                                    value={simulation.maxAmount}
                                    onChange={(e) => setSimulation({ ...simulation, maxAmount: parseInt(e.target.value) })}
                                    className="input-field !pl-11"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-accent/5 p-4 rounded-xl border border-accent/10">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-accent" />
                            <p className="text-xs font-bold text-muted-foreground uppercase">These values will pre-fill simulation forms by default.</p>
                        </div>
                        <button type="submit" className="btn-secondary px-8 flex items-center gap-2 !bg-accent hover:!bg-accent-hover !text-white border-none shadow-lg shadow-accent/20">
                            <Save className="w-4 h-4" />
                            Save Parameters
                        </button>
                    </div>
                </form>
            </section>

        </div>
    );
};

export default Settings;
