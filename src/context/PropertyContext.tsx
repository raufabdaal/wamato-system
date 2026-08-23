import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Property, RentRecord, MaintenanceTicket, MessageThread, TicketStatus, PayoutStatus } from '../types';
import { INITIAL_PROPERTIES, INITIAL_RENT_RECORDS, INITIAL_MAINTENANCE_TICKETS, INITIAL_THREADS } from '../data/initialData';

interface PropertyContextType {
  properties: Property[];
  rentRecords: RentRecord[];
  tickets: MaintenanceTicket[];
  threads: MessageThread[];
  activeTab: 'overview' | 'rent' | 'maintenance' | 'communications' | 'properties';
  setActiveTab: (tab: 'overview' | 'rent' | 'maintenance' | 'communications' | 'properties') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Actions
  addTicket: (ticket: Omit<MaintenanceTicket, 'id' | 'reportedDate'>) => void;
  updateTicketStatus: (ticketId: string, status: TicketStatus) => void;
  updateTicketDetails: (ticketId: string, updates: Partial<MaintenanceTicket>) => void;
  deleteTicket: (ticketId: string) => void;
  
  recordRentPaid: (recordId: string, paidDate?: string) => void;
  executeOwnerPayout: (recordId: string) => void;
  addRentRecord: (record: Omit<RentRecord, 'id'>) => void;
  
  addProperty: (property: Omit<Property, 'id'>) => void;
  
  sendMessage: (threadId: string, text: string) => void;
  createThread: (thread: Omit<MessageThread, 'id' | 'lastMessageTime' | 'unreadCount'>) => void;
  
  // Quick filters & stats
  stats: {
    totalGrossRent: number;
    totalRentCollected: number;
    totalRentPending: number;
    collectionRate: number;
    totalManagementFeeEarned: number;
    totalGuaranteedPayoutsPaid: number;
    totalPayoutsPending: number;
    activeMaintenanceCount: number;
    urgentTicketsCount: number;
    occupancyRate: number;
    totalUnits: number;
    occupiedUnits: number;
  };
  resetToDefaults: () => void;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PROPERTIES: 'pm_hub_properties_v1',
  RENT: 'pm_hub_rent_records_v1',
  TICKETS: 'pm_hub_tickets_v1',
  THREADS: 'pm_hub_threads_v1',
};

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROPERTIES);
      return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
    } catch {
      return INITIAL_PROPERTIES;
    }
  });

  const [rentRecords, setRentRecords] = useState<RentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RENT);
      return saved ? JSON.parse(saved) : INITIAL_RENT_RECORDS;
    } catch {
      return INITIAL_RENT_RECORDS;
    }
  });

  const [tickets, setTickets] = useState<MaintenanceTicket[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
      return saved ? JSON.parse(saved) : INITIAL_MAINTENANCE_TICKETS;
    } catch {
      return INITIAL_MAINTENANCE_TICKETS;
    }
  });

  const [threads, setThreads] = useState<MessageThread[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THREADS);
      return saved ? JSON.parse(saved) : INITIAL_THREADS;
    } catch {
      return INITIAL_THREADS;
    }
  });

  const [activeTab, setActiveTab] = useState<'overview' | 'rent' | 'maintenance' | 'communications' | 'properties'>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROPERTIES, JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RENT, JSON.stringify(rentRecords));
  }, [rentRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THREADS, JSON.stringify(threads));
  }, [threads]);

  // Actions
  const addTicket = (ticketData: Omit<MaintenanceTicket, 'id' | 'reportedDate'>) => {
    const newTicket: MaintenanceTicket = {
      ...ticketData,
      id: `t-${Date.now().toString().slice(-4)}`,
      reportedDate: new Date().toISOString().split('T')[0],
    };
    setTickets(prev => [newTicket, ...prev]);
  };

  const updateTicketStatus = (ticketId: string, status: TicketStatus) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, status } : t))
    );
  };

  const updateTicketDetails = (ticketId: string, updates: Partial<MaintenanceTicket>) => {
    setTickets(prev =>
      prev.map(t => (t.id === ticketId ? { ...t, ...updates } : t))
    );
  };

  const deleteTicket = (ticketId: string) => {
    setTickets(prev => prev.filter(t => t.id !== ticketId));
  };

  const recordRentPaid = (recordId: string, paidDate?: string) => {
    const today = paidDate || new Date().toISOString().split('T')[0];
    setRentRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          return {
            ...r,
            rentStatus: 'paid',
            rentPaidDate: today,
          };
        }
        return r;
      })
    );
  };

  const executeOwnerPayout = (recordId: string) => {
    const today = new Date().toISOString().split('T')[0];
    const ref = `ACH-${Math.floor(1000 + Math.random() * 9000)}-EXP`;
    setRentRecords(prev =>
      prev.map(r => {
        if (r.id === recordId) {
          return {
            ...r,
            payoutStatus: 'completed' as PayoutStatus,
            payoutCompletedDate: today,
            payoutTransactionRef: ref,
          };
        }
        return r;
      })
    );
  };

  const addRentRecord = (record: Omit<RentRecord, 'id'>) => {
    const newRecord: RentRecord = {
      ...record,
      id: `rent-${Date.now().toString().slice(-4)}`,
    };
    setRentRecords(prev => [newRecord, ...prev]);
  };

  const addProperty = (propData: Omit<Property, 'id'>) => {
    const newProp: Property = {
      ...propData,
      id: `prop-${Date.now().toString().slice(-4)}`,
    };
    setProperties(prev => [...prev, newProp]);

    // Also auto-generate initial rent records for occupied units
    propData.units.forEach(u => {
      if (u.status === 'occupied' && u.tenant) {
        const feeAmount = Math.round(u.currentRent * (propData.owner.managementFeePercent / 100));
        const newRentRec: RentRecord = {
          id: `rent-${Date.now()}-${u.unitNumber.replace(/\s+/g, '')}`,
          propertyId: newProp.id,
          propertyName: newProp.name,
          unitNumber: u.unitNumber,
          tenantName: u.tenant.name,
          ownerName: propData.owner.name,
          ownerEmail: propData.owner.email,
          ownerPhone: propData.owner.phone,
          rentAmount: u.currentRent,
          managementFeePercent: propData.owner.managementFeePercent,
          managementFeeAmount: feeAmount,
          maintenanceDeductions: 0,
          netOwnerPayout: u.currentRent - feeAmount,
          month: 'March 2026',
          rentStatus: 'paid',
          rentPaidDate: new Date().toISOString().split('T')[0],
          guaranteedPayoutDay: propData.owner.guaranteedPayoutDay,
          guaranteedPayoutDate: `2026-03-0${propData.owner.guaranteedPayoutDay}`,
          payoutStatus: 'scheduled',
          payoutTransactionRef: `ACH-${propData.owner.bankAccountEnding}-AUTO`,
        };
        setRentRecords(r => [newRentRec, ...r]);
      }
    });
  };

  const sendMessage = (threadId: string, text: string) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setThreads(prev =>
      prev.map(t => {
        if (t.id === threadId) {
          return {
            ...t,
            lastMessage: text,
            lastMessageTime: timeString,
            messages: [
              ...t.messages,
              {
                id: `m-${Date.now()}`,
                sender: 'manager',
                senderName: 'Management Desk',
                text,
                timestamp: timeString,
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const createThread = (threadData: Omit<MessageThread, 'id' | 'lastMessageTime' | 'unreadCount'>) => {
    const newThread: MessageThread = {
      ...threadData,
      id: `thread-${Date.now()}`,
      lastMessageTime: 'Just now',
      unreadCount: 0,
    };
    setThreads(prev => [newThread, ...prev]);
  };

  const resetToDefaults = () => {
    setProperties(INITIAL_PROPERTIES);
    setRentRecords(INITIAL_RENT_RECORDS);
    setTickets(INITIAL_MAINTENANCE_TICKETS);
    setThreads(INITIAL_THREADS);
    localStorage.clear();
  };

  // Compute stats
  const stats = useMemo(() => {
    const totalGrossRent = rentRecords.reduce((acc, r) => acc + r.rentAmount, 0);
    const totalRentCollected = rentRecords
      .filter(r => r.rentStatus === 'paid')
      .reduce((acc, r) => acc + r.rentAmount, 0);
    const totalRentPending = rentRecords
      .filter(r => r.rentStatus !== 'paid')
      .reduce((acc, r) => acc + r.rentAmount, 0);
    
    const collectionRate = totalGrossRent > 0 ? Math.round((totalRentCollected / totalGrossRent) * 100) : 100;
    
    const totalManagementFeeEarned = rentRecords
      .filter(r => r.rentStatus === 'paid')
      .reduce((acc, r) => acc + r.managementFeeAmount, 0);

    const totalGuaranteedPayoutsPaid = rentRecords
      .filter(r => r.payoutStatus === 'completed')
      .reduce((acc, r) => acc + r.netOwnerPayout, 0);

    const totalPayoutsPending = rentRecords
      .filter(r => r.payoutStatus !== 'completed')
      .reduce((acc, r) => acc + r.netOwnerPayout, 0);

    const activeMaintenanceCount = tickets.filter(t => t.status !== 'resolved').length;
    const urgentTicketsCount = tickets.filter(t => (t.priority === 'urgent' || t.priority === 'high') && t.status !== 'resolved').length;

    let totalUnits = 0;
    let occupiedUnits = 0;
    properties.forEach(p => {
      p.units.forEach(u => {
        totalUnits += 1;
        if (u.status === 'occupied') occupiedUnits += 1;
      });
    });

    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnits / totalUnits) * 100) : 0;

    return {
      totalGrossRent,
      totalRentCollected,
      totalRentPending,
      collectionRate,
      totalManagementFeeEarned,
      totalGuaranteedPayoutsPaid,
      totalPayoutsPending,
      activeMaintenanceCount,
      urgentTicketsCount,
      occupancyRate,
      totalUnits,
      occupiedUnits,
    };
  }, [rentRecords, tickets, properties]);

  return (
    <PropertyContext.Provider
      value={{
        properties,
        rentRecords,
        tickets,
        threads,
        activeTab,
        setActiveTab,
        searchQuery,
        setSearchQuery,
        addTicket,
        updateTicketStatus,
        updateTicketDetails,
        deleteTicket,
        recordRentPaid,
        executeOwnerPayout,
        addRentRecord,
        addProperty,
        sendMessage,
        createThread,
        stats,
        resetToDefaults,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

export const usePropertyManager = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('usePropertyManager must be used within a PropertyProvider');
  }
  return context;
};
