import React, { useState } from 'react';
import { usePropertyManager } from '../context/PropertyContext';
import { 
  Building2, 
  DollarSign, 
  Wrench, 
  MessageSquare, 
  LayoutDashboard, 
  Plus, 
  Search, 
  RotateCcw,
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  onOpenNewTicket: () => void;
  onOpenRecordRent: () => void;
  onOpenAddProperty: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewTicket,
  onOpenRecordRent,
  onOpenAddProperty,
}) => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery, stats, resetToDefaults } = usePropertyManager();
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, badge: null },
    { 
      id: 'rent', 
      label: 'Rent & Payouts', 
      icon: DollarSign, 
      badge: stats.totalRentPending > 0 ? `${Math.round((stats.totalRentCollected / stats.totalGrossRent) * 100)}%` : '100%' 
    },
    { 
      id: 'maintenance', 
      label: 'Maintenance', 
      icon: Wrench, 
      badge: stats.activeMaintenanceCount > 0 ? stats.activeMaintenanceCount : null 
    },
    { id: 'communications', label: 'Messages', icon: MessageSquare, badge: null },
    { id: 'properties', label: 'Properties', icon: Building2, badge: `${stats.occupiedUnits}/${stats.totalUnits}` },
  ] as const;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-white shadow-sm">
              <Building2 className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-zinc-900 text-base tracking-tight">EstateFlow</span>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Manager Pro
                </span>
              </div>
              <p className="text-xs text-zinc-500 hidden sm:block">Automated rent, maintenance & owner payouts</p>
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search properties, tenants, tickets, payouts..."
                className="w-full pl-9 pr-4 py-1.5 text-sm bg-zinc-50 hover:bg-zinc-100/70 focus:bg-white border border-zinc-200 rounded-lg text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-900/10 focus:border-zinc-400 transition-colors"
              />
            </div>
          </div>

          {/* Quick Actions & Reset */}
          <div className="flex items-center gap-2">
            
            {/* Quick Action Dropdown */}
            <div className="relative">
              <button
                id="quick-action-btn"
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className="flex items-center gap-2 px-3.5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Quick Action</span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
              </button>

              {showQuickMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setShowQuickMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-zinc-200 py-1.5 z-50 text-sm">
                    <button
                      onClick={() => {
                        setShowQuickMenu(false);
                        onOpenNewTicket();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex items-center gap-2.5 text-zinc-700 hover:text-zinc-900"
                    >
                      <Wrench className="w-4 h-4 text-amber-500" />
                      <span>Log Maintenance Ticket</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowQuickMenu(false);
                        onOpenRecordRent();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex items-center gap-2.5 text-zinc-700 hover:text-zinc-900"
                    >
                      <DollarSign className="w-4 h-4 text-emerald-600" />
                      <span>Record Rent Payment</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowQuickMenu(false);
                        onOpenAddProperty();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-zinc-50 flex items-center gap-2.5 text-zinc-700 hover:text-zinc-900"
                    >
                      <Building2 className="w-4 h-4 text-indigo-500" />
                      <span>Add Property or Unit</span>
                    </button>
                  </div>
                </>
              )}
            </div>

            <button
              onClick={() => {
                if (confirm('Reset all demo data back to initial sample state?')) {
                  resetToDefaults();
                }
              }}
              title="Reset Sample Data"
              className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-2 border-t border-zinc-100">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`nav-tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-zinc-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-xs px-1.5 py-0.2 rounded-full font-semibold ${
                      isActive
                        ? 'bg-zinc-800 text-zinc-200'
                        : 'bg-zinc-200/80 text-zinc-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
