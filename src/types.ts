export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TicketStatus = 'new' | 'in_progress' | 'scheduled' | 'resolved';

export interface MaintenanceTicket {
  id: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  tenantName: string;
  title: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'appliance' | 'structural' | 'other';
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  reportedDate: string;
  scheduledDate?: string;
  assignedVendor?: string;
  estimatedCost: number;
  actualCost?: number;
  chargeTo: 'owner' | 'manager' | 'tenant';
  notes?: string;
}

export type RentStatus = 'paid' | 'pending' | 'overdue' | 'partial';
export type PayoutStatus = 'scheduled' | 'processing' | 'completed' | 'on_hold';

export interface RentRecord {
  id: string;
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  tenantName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  rentAmount: number;
  managementFeePercent: number; // e.g. 8 for 8%
  managementFeeAmount: number;  // rentAmount * (managementFeePercent / 100)
  maintenanceDeductions: number;
  netOwnerPayout: number;        // rentAmount - managementFeeAmount - maintenanceDeductions
  month: string; // e.g. "March 2026"
  rentStatus: RentStatus;
  rentPaidDate?: string;
  guaranteedPayoutDay: number; // Day of month, e.g. 5 for 5th of every month
  guaranteedPayoutDate: string; // e.g. "2026-03-05"
  payoutStatus: PayoutStatus;
  payoutCompletedDate?: string;
  payoutTransactionRef?: string;
}

export interface Unit {
  id: string;
  unitNumber: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  currentRent: number;
  status: 'occupied' | 'vacant' | 'maintenance';
  tenant?: {
    name: string;
    email: string;
    phone: string;
    leaseStart: string;
    leaseEnd: string;
  };
}

export interface Property {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  type: 'Single Family' | 'Multi Family' | 'Luxury Estate' | 'Townhome' | 'Condo';
  totalUnits: number;
  units: Unit[];
  owner: {
    id: string;
    name: string;
    email: string;
    phone: string;
    bankAccountEnding: string;
    guaranteedPayoutDay: number; // e.g. 1st or 5th of month
    managementFeePercent: number; // e.g. 8%
  };
  image?: string;
}

export interface MessageThread {
  id: string;
  recipientType: 'tenant' | 'owner';
  recipientName: string;
  propertyName: string;
  unitNumber?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: {
    id: string;
    sender: 'manager' | 'contact';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}
