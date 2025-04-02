export interface Lead {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: 'new' | 'contacted' | 'qualified' | 'lost';
    notes: string;
    created_at: string;
    updated_at: string;
  }
  
  export type LeadStatus = Lead['status'];