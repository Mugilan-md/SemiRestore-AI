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
  const [searchOpen, setSearchOpen] = useState(false);

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
      <div className="w-full max-w-[1440px] mx-auto flex h-20 items-center justify-between px-3 sm:px-5 lg:px-8 gap-2 sm:gap-4 lg:gap-6">
        
        {/* Brand Logo & Royal Title with Crisp Sparkling Star Effect (No Blurry Halo) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('landing')}
            className="flex items-center gap-2.5 sm:gap-3 text-left focus:outline-none group cursor-pointer"
          >
            <div className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD700] via-[#BF953F] to-[#7A5310] text-white shadow-md p-0.5 group-hover:scale-105 transition-transform shrink-0">
              <div className="h-full w-full bg-[#08090E] rounded-[14px] flex items-center justify-center border border-[#FFD700]/30">
                <Cpu className="h-5 w-5 sm:h-6 sm:w-6 text-[#FFD700]" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#08090E]" />
            </div>

            <div className="shrink-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* Crisp Sparkling Pure Gold Title */}
                <div className="relative inline-flex items-center">
                  <span className="font-cinzel text-base sm:text-xl font-black tracking-wider text-navbar-sparkle whitespace-nowrap">
                    SemiRestore<span className="text-[#FFD700]">.AI</span>
                  </span>
                  {/* Subtle Shimmering Sparkle Stars */}
                  <span className="sparkle-star-1 text-[#FFF8D6] text-[10px] select-none ml-1">✦</span>
                  <span className="sparkle-star-2 text-[#FFD700] text-[8px] select-none -mt-2 -ml-0.5">✦</span>
                </div>

                <span className="hidden sm:inline-block rounded-md badge-gold-solid px-1.5 py-0.5 text-[9px] font-black tracking-wider uppercase whitespace-nowrap">
                  ENTERPRISE
                </span>
              </div>
              <p className="font-royal-sans text-[10px] sm:text-[11px] font-medium tracking-wide text-[#E6BF83]/90 hidden md:block whitespace-nowrap">
                Semiconductor Image Metrology & Restoration
              </p>
            </div>
          </button>
        </div>

        {/* Center Navigation Links: Fully Visible, Equal Spacing, 3D Tactile Effects */}
        <nav 
          onMouseLeave={() => setHoveredTab(null)}
          className="hidden md:flex items-center justify-center gap-1.5 lg:gap-2.5 px-2.5 sm:px-3 py-1.5 rounded-2xl bg-white/[0.04] border border-[#D4AF37]/35 backdrop-blur-md relative shrink"
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
                className={`navbar-tab-3d relative flex items-center justify-center gap-1.5 rounded-xl px-2.5 sm:px-3 lg:px-3.5 py-2 text-[11px] lg:text-xs font-royal-sans font-bold tracking-wide z-10 whitespace-nowrap cursor-pointer shrink-0 border border-transparent ${
                  isActive
                    ? 'text-[#FFF8D6] border-[#D4AF37]/60'
                    : 'text-[#D3D3FF]/85 hover:text-[#FFF4B8]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                  isActive ? 'text-[#FFD700]' : 'text-[#CEB5FF]/80'
                }`} />
                <span>{item.label}</span>

                {/* Sliding Active Pill Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="navbarSlidingIndicator"
                    className="absolute inset-0 rounded-xl navbar-active-gold-pill z-[-1]"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}

                {/* Sliding Hover Subtle Glow */}
                {isHovered && !isActive && (
                  <motion.div
                    layoutId="navbarHoverIndicator"
                    className="absolute inset-0 rounded-xl bg-white/[0.07] border border-[#D4AF37]/35 z-[-2]"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Compact, Fully Visible, Zero Truncation */}
        <div className="flex items-center gap-2 sm:gap-2.5 lg:gap-3 shrink-0">
          
          {/* Search: Expandable or Compact */}
          <div className="relative shrink-0">
            {searchOpen ? (
              <motion.div 
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 180, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="relative"
              >
                <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#D4AF37]" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search wafer..."
                  value={searchTerm}
                  onBlur={() => !searchTerm && setSearchOpen(false)}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-[#D4AF37]/50 bg-white/[0.08] py-1.5 pl-8 pr-2 text-xs font-royal-sans text-[#FFF4D0] placeholder-[#D3D3FF]/50 focus:border-[#FFD700] focus:outline-none focus:ring-1 focus:ring-[#FFD700]/30"
                />
              </motion.div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="rounded-xl border border-[#D4AF37]/40 bg-white/[0.05] p-2 text-[#E6BF83] hover:bg-white/[0.1] hover:text-[#FFD700] transition cursor-pointer shrink-0"
                title="Search Wafers"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* GPU Status Pill: Clean, 100% Unclipped, Fully Visible */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#D4AF37]/50 bg-[#121524] px-2.5 py-1 text-[10px] sm:text-[11px] font-royal-sans font-bold shadow-xs shrink-0 whitespace-nowrap">
            <Zap className="h-3.5 w-3.5 text-[#FFD700] fill-[#FFD700] shrink-0" />
            <span className="text-[#FFF4D0] font-black tracking-wide whitespace-nowrap">H100 SXM5</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse ml-0.5 shrink-0" />
          </div>

          {/* Notifications Button */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative rounded-xl border border-[#D4AF37]/40 bg-white/[0.05] p-2 text-[#E6BF83] hover:bg-white/[0.1] hover:text-[#FFD700] transition cursor-pointer shrink-0"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-r from-[#BF953F] to-[#FFD700] text-[8px] font-black text-slate-950 ring-1 ring-[#08090E]">
                3
              </span>
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.12 }}
                  className="absolute right-0 mt-2 w-80 rounded-2xl border border-[#D4AF37]/50 bg-[#0B0D17]/98 backdrop-blur-2xl p-4 shadow-2xl z-50 text-white"
                >
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#D4AF37]/20">
                    <h4 className="text-xs font-cinzel font-bold text-[#FFF8D6] flex items-center gap-2">
                      <Bell className="h-3.5 w-3.5 text-[#FFD700]" /> Metrology Alerts
                    </h4>
                    <span className="text-[9px] font-black text-[#693D04] bg-[#FFD700] px-2 py-0.5 rounded-md font-mono">
                      3 NEW
                    </span>
                  </div>

                  <div className="mt-2.5 space-y-2 max-h-60 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className="p-2 rounded-xl bg-white/[0.04] border border-[#D4AF37]/15 hover:bg-white/[0.08] transition flex items-start gap-2.5"
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
          <div className="relative shrink-0">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 sm:gap-2 rounded-xl border border-[#D4AF37]/40 bg-white/[0.05] p-1.5 sm:px-2.5 sm:py-1.5 hover:bg-white/[0.1] transition cursor-pointer shrink-0"
            >
              <div className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-lg bg-gradient-to-r from-[#BF953F] to-[#FFD700] text-[11px] font-black text-slate-950 shrink-0">
                EV
              </div>
              <span className="hidden sm:inline-block font-royal-sans text-xs font-bold text-[#FFF4D0] whitespace-nowrap">
                Dr. Vance
              </span>
              <ChevronDown className="h-3 w-3 text-[#D4AF37] shrink-0" />
            </button>

            <AnimatePresence>
              {showProfileMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  className="absolute right-0 mt-2 w-60 rounded-2xl border border-[#D4AF37]/50 bg-[#0B0D17]/98 backdrop-blur-2xl p-3 shadow-2xl z-50 text-white"
                >
                  <div className="p-2 border-b border-[#D4AF37]/20">
                    <p className="font-cinzel text-xs font-bold text-[#FFF8D6]">Dr. Elena Vance</p>
                    <p className="text-[11px] text-[#D3D3FF]/70">Lead Metrology Engineer</p>
                    <p className="text-[9px] font-mono font-bold text-[#FFD700] mt-1">TSMC / Intel Node</p>
                  </div>
                  <div className="mt-1.5 pt-1 space-y-1 font-royal-sans">
                    <button
                      onClick={() => {
                        setActiveTab('settings');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#E6BF83] hover:bg-white/[0.08] hover:text-[#FFF6C7] transition cursor-pointer"
                    >
                      Account Settings & GPU Nodes
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab('report');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium text-[#E6BF83] hover:bg-white/[0.08] hover:text-[#FFF6C7] transition cursor-pointer"
                    >
                      Export Inspection Certificate
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Horizontal Navigation Tabs Row */}
      <div className="flex md:hidden overflow-x-auto px-3 py-2 border-t border-[#D4AF37]/20 bg-[#08090E] gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`navbar-tab-3d flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'navbar-active-gold-pill text-[#FFF8D6]'
                  : 'text-[#D3D3FF]/75 hover:text-white'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#FFD700]' : 'text-[#CEB5FF]/70'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
