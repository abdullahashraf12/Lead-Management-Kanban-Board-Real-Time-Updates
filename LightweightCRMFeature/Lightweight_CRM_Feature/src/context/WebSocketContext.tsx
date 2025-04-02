import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { Lead } from '../types/lead';

type WebSocketMessage = 
  | { type: 'INITIAL_LEADS'; leads: Lead[] }
  | { type: 'LEAD_UPDATED'; lead: Lead }
  | { type: 'LEAD_ADDED'; lead: Lead };

interface WebSocketContextType {
  leads: Lead[];
  updateLead: (lead: Lead) => void;
  addLead: (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => void;
}

const WS_URL = 'ws://localhost/ws/kanban/';

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Only create the WebSocket if it doesn't exist
    if (!ws.current) {
      ws.current = new WebSocket(WS_URL);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        const data: WebSocketMessage = JSON.parse(event.data);

        switch (data.type) {
          case 'INITIAL_LEADS':
            setLeads(data.leads);
            break;
            
          case 'LEAD_UPDATED':
            setLeads(prev =>
              prev.map(lead => (lead.id === data.lead.id ? data.lead : lead))
            );
            break;

          case 'LEAD_ADDED':
            setLeads(prev => {
              const exists = prev.some(lead => lead.id === data.lead.id);
              return exists ? prev : [...prev, data.lead];
            });
            break;
        }
      };

      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        ws.current = null;
      };
    }

    return () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.close();
      }
    };
  }, []);

  const updateLead = (lead: Lead) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({
        type: 'UPDATE_LEAD',
        lead: {
          ...lead,
          updated_at: new Date().toISOString()
        }
      }));
    }
  };

  const addLead = (lead: Omit<Lead, 'id' | 'created_at' | 'updated_at'>) => {
    if (ws.current) {
      ws.current.send(JSON.stringify({
        type: 'ADD_LEAD',
        lead: {
          ...lead,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }));
    }
  };

  return (
    <WebSocketContext.Provider value={{ leads, updateLead, addLead }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};
