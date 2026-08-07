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
  const [hoveredTab, setHoveredTab] = useState<ActiveTab | null>(null);
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
    <header className="sticky top-0 z-50 w-full navbar-solid-black transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo & Royal Name with Sparkling 24K Gold Text */}
        <div className="flex items-center gap-5 shrink-0">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-3.5 text-left focus:outline-none group"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD700] via-[#BF953F] to-[#7A5310] text-white shadow-lg shadow-[#FFD700]/25 group-hover:scale-105 transition-transform p-0.5">
              <div className="h-full w-full bg-[#08090E] rounded-[14px] flex items-center justify-center border border-[#FFD700]/40">
                <Cpu className="h-6 w-6 text-[#FFD700] animate-pulse" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-[#08090E]" />
            </div>

            <div>
              <div className="flex items-center gap-2.5">
                <span className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-navbar-gold-sparkle">
                  SemiRestore<span className="text-[#FFD700]">.AI</span>
                </span>
                <span className="rounded-md badge-gold-glitter px-2 py-0.5 text-[10px] font-black tracking-widest uppercase shadow-xs">
                  ENTERPRISE
                </span>
              </div>
              <p className="font-royal-sans text-[11px] font-semibold tracking-wide text-[#E6BF83]/80">
                Semiconductor Image Metrology & Restoration
              </p>
            </div>
          </button>
        </div>

        {/* Navigation Links with Smooth Sliding Pill & Equal Proportional Spacing */}
        <nav 
          onMouseLeave={() => setHoveredTab(null)}
          className="hidden md:flex items-center justify-between gap-1.5 lg:gap-2.5 px-3 py-1.5 rounded-2xl bg-white/[0.05] border border-[#D4AF37]/35 backdrop-blur-md relative mx-2 lg:mx-4"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isHovered = hoveredTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                onMouseEnter={() => setHoveredTab(item.id)}
                className={`relative flex items-center justify-center gap-1.5 lg:gap-2 rounded-xl px-2.5 lg:px-3.5 py-2 text-[11px] lg:text-xs font-royal-sans font-bold tracking-wide transition-all duration-200 z-10 text-center whitespace-nowrap ${
                  isActive
                    ? 'text-[#FFF8D6]'
                    : 'text-[#D3D3FF]/80 hover:text-[#FFF4B8]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 lg:h-4 lg:w-4 shrink-0 transition-colors ${
                  isActive ? 'text-[#FFD700]' : 'text-[#CEB5FF]/70'
                }`} />
                <span>{item.label}</span>

                {/* Sliding Active Pill Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="navbarSlidingIndicator"
                    className="absolute inset-0 rounded-xl navbar-active-gold-pill z-[-1]"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}

                {/* Sliding Hover Subtle Glow */}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="navbarHoverIndicator"
                    className="absolute inset-0 rounded-xl bg-white/[0.06] border border-[#D4AF37]/30 z-[-2]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Search, GPU Badge, Notifications, Profile */}
        <div className="flex items-center gap-3.5 shrink-0">
          {/* Global Search */}
          <div className="relative hidden lg:block w-60">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-[#D4AF37]/70" />
            <input
              type="text"
              placeholder="Search wafer ID, defect..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-[#D4AF37]/40 bg-white/[0.06] py-2 pl-10 pr-3 text-xs font-royal-sans font-medium text-[#FFF4D0] placeholder-[#D3D3FF]/50 transition focus:border-[#FFD700] focus:bg-white/[0.1] focus:outline-none focus:ring-2 focus:ring-[#FFD700]/25"
            />
          </div>

          {/* GPU Status Pill with Sparkling Real Gold & Obsidian Base */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-[#D4AF37]/70 bg-gradient-to-r from-[#141829] via-[#0B0D17] to-[#141829] px-3.5 py-1.5 text-[11px] font-royal-sans font-extrabold shadow-md">
            <Zap className="h-3.5 w-3.5 text-[#FFD700] fill-[#FFD700] animate-pulse" />
            <span className="text-navbar-gold-sparkle font-black tracking-wide">NVIDIA H100 SXM5</span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
          </div>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-xl border border-[#D4AF37]/50 bg-white/[0.06] p-2.5 text-[#E6BF83] hover:bg-white/[0.12] hover:text-[#FFD700] transition focus:outline-none shadow-xs"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-[#BF953F] to-[#FFD700] text-[9px] font-black text-slate-950 ring-2 ring-[#08090E]">
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
                  className="absolute right-0 mt-2 w-84 rounded-3xl border border-[#D4AF37]/60 bg-[#0B0D17]/98 backdrop-blur-2xl p-4 shadow-2xl z-50 text-white"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/30">
                    <h4 className="text-xs font-cinzel font-bold text-[#FFF8D6] flex items-center gap-2">
                      <Bell className="h-3.5 w-3.5 text-[#FFD700]" /> Metrology Alerts
                    </h4>
                    <span className="text-[10px] font-black text-navbar-gold-sparkle badge-gold-glitter px-2 py-0.5 rounded-md">
                      3 New
                    </span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2.5 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/20 hover:bg-white/[0.08] transition flex items-start gap-2.5"
                      >
                        {n.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />}
                        {n.type === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />}
                        {n.type === 'info' && <Zap className="h-4 w-4 text-[#FFD700] shrink-0 mt-0.5" />}
                        <div>
                          <p className="text-xs font-bold text-[#FFF6C7]">{n.title}</p>
                          <p className="text-[11px] text-[#D3D3FF]/80 mt-0.5 leading-relaxed">{n.text}</p>
                          <span className="text-[9px] text-[#E6BF83]/60 mt-1 block font-mono">{n.time}</span>
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
              className="flex items-center gap-2.5 rounded-xl border border-[#D4AF37]/50 bg-white/[0.06] p-2 hover:bg-white/[0.12] transition focus:outline-none shadow-xs"
            >
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-r from-[#BF953F] to-[#FFD700] text-xs font-black text-slate-950 shadow-xs">
                EV
              </div>
              <span className="hidden sm:inline-block font-royal-sans text-xs font-extrabold text-[#FFF4D0]">
                Dr. Vance
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-[#D4AF37]" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 rounded-3xl border border-[#D4AF37]/60 bg-[#0B0D17]/98 backdrop-blur-2xl p-3 shadow-2xl z-50 text-white"
                >
                  <div className="p-2 border-b border-[#D4AF37]/30">
                    <p className="font-cinzel text-xs font-bold text-[#FFF8D6]">Dr. Elena Vance</p>
                    <p className="text-[11px] text-[#D3D3FF]/70">Lead Metrology Engineer</p>
                    <p className="text-[10px] font-black text-navbar-gold-sparkle mt-1">TSMC / Intel Enterprise Portal</p>
                  </div>
                  <div className="mt-2 pt-1 space-y-1 font-royal-sans">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#E6BF83] hover:bg-white/[0.08] hover:text-[#FFF6C7] transition"
                    >
                      Account Settings & API Keys
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('report');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#E6BF83] hover:bg-white/[0.08] hover:text-[#FFF6C7] transition"
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
