import React, { useState } from 'react';
import type { ActiveTab } from '../../types/semicon';
import {
  Cpu,
  LayoutDashboard,
  Eye,
  Activity,
  History,
  Settings,
  Search,
  Bell,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchTerm,
  setSearchTerm,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifications = [
    {
      id: '1',
      title: 'Restormer 4x Upscaling Finished',
      time: '2 mins ago',
      type: 'success',
      text: 'Wafer lot TSMC-N7-8829 achieved PSNR 39.8 dB (+15.6 dB gain).',
    },
    {
      id: '2',
      title: 'AI Defect Detected',
      time: '14 mins ago',
      type: 'warning',
      text: 'Gate Oxide Pin-hole void identified on EUV reticle sample #3301.',
    },
    {
      id: '3',
      title: 'GPU Cluster Thermal Status',
      time: '1 hr ago',
      type: 'info',
      text: 'NVIDIA H100 Node-04 running optimal at 48°C / 148 FPS throughput.',
    },
  ];

  const navItems = [
    { id: 'landing' as ActiveTab, label: 'Overview', icon: Sparkles },
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'workspace' as ActiveTab, label: 'Inspection Workspace', icon: Eye },
    { id: 'pipeline' as ActiveTab, label: 'Live Pipeline', icon: Activity },
    { id: 'history' as ActiveTab, label: 'Batch History', icon: History },
    { id: 'settings' as ActiveTab, label: 'Settings', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3 text-left focus:outline-none group"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-500 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="h-5 w-5" />
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-poppins text-lg font-bold tracking-tight text-slate-900">
                  SemiRestore<span className="text-blue-600">.AI</span>
                </span>
                <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-700/10">
                  ENTERPRISE
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500">
                Semiconductor Image Inspection
              </p>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-blue-600 bg-blue-50/80 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className="absolute inset-0 rounded-lg border border-blue-600/20 bg-blue-50/50 pointer-events-none"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Search, GPU Badge, Notifications, Profile */}
        <div className="flex items-center gap-3">
          {/* Global Search */}
          <div className="relative hidden lg:block w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search wafer ID, defect, lot..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-1.5 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 transition focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* GPU Status Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/60 px-3 py-1 text-[11px] font-semibold text-blue-800">
            <Zap className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
            <span>NVIDIA H100 SXM5</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition focus:outline-none"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[9px] font-bold text-white ring-2 ring-white">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-4 shadow-xl shadow-slate-900/10 z-50"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <Bell className="h-3.5 w-3.5 text-blue-600" /> System Alerts
                    </h4>
                    <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      3 New
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50/50 transition flex items-start gap-2.5"
                      >
                        {n.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />}
                        {n.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />}
                        {n.type === 'info' && <Zap className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />}
                        <div>
                          <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{n.text}</p>
                          <span className="text-[9px] text-slate-400 mt-1 block">{n.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white p-1.5 hover:bg-slate-50 transition focus:outline-none"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white">
                EV
              </div>
              <span className="hidden sm:inline-block text-xs font-semibold text-slate-800">
                Dr. Vance
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50"
                >
                  <div className="p-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900">Dr. Elena Vance</p>
                    <p className="text-[11px] text-slate-500">Lead Metrology Engineer</p>
                    <p className="text-[10px] text-blue-600 font-semibold mt-1">TSMC / Intel Enterprise Portal</p>
                  </div>
                  <div className="mt-2 pt-1 space-y-1">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      Account Settings & API Keys
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('report');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition"
                    >
                      Export Metrology Certificates
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};
