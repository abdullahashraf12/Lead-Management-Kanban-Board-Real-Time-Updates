// this is process from dragging left to right and right to left 

import React, { useCallback, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { useWebSocket } from '../context/WebSocketContext';
import { useNavigate } from 'react-router-dom';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { Lead, LeadStatus } from '../types/lead';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import Cookies from 'js-cookie';

const STATUSES: LeadStatus[] = ['new', 'contacted', 'qualified', 'lost'];

const KanbanBoard: React.FC = () => {
  const { leads, updateLead } = useWebSocket();
  const navigate = useNavigate();
    const [LoggedIn, setLoggedIn] = useState("");
  
    const handleClick = async () => {
      try {
        const response = await fetch("http://localhost/api/get-csrf-token/", {
          credentials: "include", // Ensure cookies are sent
        });
  
        if (!response.ok) throw new Error("Failed to fetch CSRF token");
  
        const data = await response.json();
        console.log("CSRF Token:", data.csrfToken); // Debugging
  
        if (data.csrfToken) {
          const responseCheck = await fetch("http://localhost/api/Logout/", {
            credentials: "include",
          });
  
          if (!responseCheck.ok) throw new Error("Failed to check user login");
  
          const checkData = await responseCheck.json(); // Extract JSON response
          console.log("User login status:", checkData); // Debugging
  
          if (checkData.status === true) {
            Cookies.set("LoggedIn", "true");
            setLoggedIn("true");
            navigate("/", { replace: true });
          } else {
            navigate("/login", { replace: true });
            window.location.reload();
          }
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };





  // State management
  const [dragState, setDragState] = useState<{
    activeId: string | null;
    overId: string | null;
    overColumn: LeadStatus | null;
    activeColumn: LeadStatus | null;
    isOverCard: boolean;
  }>({
    activeId: null,
    overId: null,
    overColumn: null,
    activeColumn: null,
    isOverCard: false,
  });

  // Memoized derived values
  const activeLead = React.useMemo(
    () => (dragState.activeId ? leads.find(lead => lead.id === dragState.activeId) : null),
    [dragState.activeId, leads]
  );

  const overLead = React.useMemo(
    () => (dragState.overId ? leads.find(lead => lead.id === dragState.overId) : null),
    [dragState.overId, leads]
  );

  // Reset drag state helper
  const resetDragState = useCallback(() => {
    setDragState({
      activeId: null,
      overId: null,
      overColumn: null,
      activeColumn: null,
      isOverCard: false,
    });
  }, []);

  // Lead status update handler
  const updateLeadStatus = useCallback(
    (lead: Lead, newStatus: LeadStatus) => {
      if (lead.status === newStatus) return;

      const updatedLead: Lead = {
        ...lead,
        status: newStatus,
        updatedAt: new Date().toISOString(),
      };
      
      updateLead(updatedLead);
    },
    [updateLead]
  );

  // Drag event handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const lead = leads.find(l => l.id === active.id);
    
    if (lead) {
      setDragState(prev => ({
        ...prev,
        activeId: active.id as string,
        activeColumn: lead.status,
      }));
    }
  }, [leads]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    // Check if over a column
    if (STATUSES.includes(over.id as LeadStatus)) {
      setDragState(prev => ({
        ...prev,
        overId: null,
        overColumn: over.id as LeadStatus,
        isOverCard: false,
      }));
      return;
    }

    // Check if over another card
    const overLead = leads.find(lead => lead.id === over.id);
    if (overLead) {
      setDragState(prev => ({
        ...prev,
        overId: over.id as string,
        overColumn: overLead.status,
        isOverCard: true,
      }));
    }
  }, [leads]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !activeLead) {
      resetDragState();
      return;
    }

    let targetStatus: LeadStatus | null = null;

    // Determine target status based on what we're over
    if (STATUSES.includes(over.id as LeadStatus)) {
      targetStatus = over.id as LeadStatus;
    } else if (overLead) {
      targetStatus = overLead.status;
    }

    if (targetStatus) {
      updateLeadStatus(activeLead, targetStatus);
    }

    resetDragState();
  }, [activeLead, overLead, resetDragState, updateLeadStatus]);

  // Get border color - now always green since all drops are allowed
  const getColumnBorderColor = useCallback((status: LeadStatus) => {
    return dragState.overColumn === status ? '3px solid #28a745' : 'transparent';
  }, [dragState.overColumn]);

  return (
    <div className="container-fluid py-4">
      <header className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary h2">Leads Kanban Board</h1>
        
        <button 
          onClick={() => navigate('/form')} 
          className="btn btn-primary"
          aria-label="Add new lead"
          data-testid="add-lead-button"
        >
          <i className="bi bi-plus-lg me-2"></i> Add New Lead
        </button>
       
       
        <button
      style={{ marginRight: "15vh", textDecoration: "none" }}
      className="btn btn-link"
      id="Logout"
      onClick={handleClick}
    >
      Logout
    </button>
      </header>
      
      <DndContext
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        accessibility={{
          announcements: {
            onDragStart({ active }) {
              return `Picked up lead ${active.id}`;
            },
            onDragOver({ active, over }) {
              if (over?.id) {
                if (STATUSES.includes(over.id as LeadStatus)) {
                  return `Moving lead ${active.id} to ${over.id} column`;
                }
                return `Moving lead ${active.id} near lead ${over.id}`;
              }
              return null;
            },
            onDragEnd({ active, over }) {
              if (over?.id) {
                const status = STATUSES.includes(over.id as LeadStatus)
                  ? over.id
                  : leads.find(l => l.id === over.id)?.status;
                return `Lead ${active.id} moved to ${status} column`;
              }
              return null;
            },
          },
        }}
      >
        <div 
          className="d-flex gap-4 overflow-auto px-3" 
          style={{ width: '90vw' }}
          role="grid"
          aria-label="Kanban board columns"
          data-testid="kanban-board"
        >
          {STATUSES.map(status => (
            <div 
              key={status} 
              className="flex-grow-1" 
              style={{ 
                minWidth: '250px',
                border: getColumnBorderColor(status),
                borderRadius: '4px',
                transition: 'border 0.2s ease',
              }}
              role="gridcell"
              data-testid={`column-${status}`}
            >
              <KanbanColumn
                status={status}
                leads={leads.filter(lead => lead.status === status)}
                isOver={dragState.overColumn === status}
                canDrop={true} // All drops are now allowed
                isActiveColumn={dragState.activeColumn === status}
              />
            </div>
          ))}
        </div>
        
        <DragOverlay>
          {activeLead ? (
            <div 
              style={{ 
                transform: 'rotate(3deg)', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                width: '100%',
                opacity: 0.9,
              }}
              data-testid="dragging-card"
            >
              <KanbanCard lead={activeLead} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;





// this is process from dragging left to right and never the opposite

// import React, { useCallback, useState } from 'react';
// import {
//   DndContext,
//   DragOverlay,
//   closestCorners,
//   DragStartEvent,
//   DragOverEvent,
//   DragEndEvent,
// } from '@dnd-kit/core';
// import { useWebSocket } from '../context/WebSocketContext';
// import { useNavigate } from 'react-router-dom';
// import KanbanColumn from './KanbanColumn';
// import KanbanCard from './KanbanCard';
// import { Lead, LeadStatus } from '../types/lead';
// import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';

// // Define status order and transitions in a more maintainable way
// const STATUS_FLOW: Record<LeadStatus, LeadStatus[]> = {
//   new: ['contacted', 'qualified', 'lost'],
//   contacted: ['qualified', 'lost'],
//   qualified: ['lost'],
//   lost: [], // Once lost, cannot transition to other statuses
// };

// const STATUSES: LeadStatus[] = Object.keys(STATUS_FLOW) as LeadStatus[];

// const KanbanBoard: React.FC = () => {
//   const { leads, updateLead } = useWebSocket();
//   const navigate = useNavigate();
  
//   // State management
//   const [dragState, setDragState] = useState<{
//     activeId: string | null;
//     overId: string | null;
//     overColumn: LeadStatus | null;
//     activeColumn: LeadStatus | null;
//     isOverCard: boolean;
//   }>({
//     activeId: null,
//     overId: null,
//     overColumn: null,
//     activeColumn: null,
//     isOverCard: false,
//   });

//   // Memoized derived values
//   const activeLead = React.useMemo(
//     () => (dragState.activeId ? leads.find(lead => lead.id === dragState.activeId) : null),
//     [dragState.activeId, leads]
//   );

//   const overLead = React.useMemo(
//     () => (dragState.overId ? leads.find(lead => lead.id === dragState.overId) : null),
//     [dragState.overId, leads]
//   );

//   // Reset drag state helper
//   const resetDragState = useCallback(() => {
//     setDragState({
//       activeId: null,
//       overId: null,
//       overColumn: null,
//       activeColumn: null,
//       isOverCard: false,
//     });
//   }, []);

//   // Status transition validation
//   const isValidStatusTransition = useCallback(
//     (currentStatus: LeadStatus, targetStatus: LeadStatus): boolean => {
//       if (!STATUSES.includes(currentStatus)) return false;
//       if (!STATUSES.includes(targetStatus)) return false;
//       return STATUS_FLOW[currentStatus].includes(targetStatus);
//     },
//     []
//   );

//   // Lead status update handler
//   const updateLeadStatus = useCallback(
//     (lead: Lead, newStatus: LeadStatus) => {
//       if (lead.status === newStatus) return;
//       if (!isValidStatusTransition(lead.status, newStatus)) return;

//       const updatedLead: Lead = {
//         ...lead,
//         status: newStatus,
//         updatedAt: new Date().toISOString(),
//       };
      
//       updateLead(updatedLead);
//     },
//     [updateLead, isValidStatusTransition]
//   );

//   // Drag event handlers
//   const handleDragStart = useCallback((event: DragStartEvent) => {
//     const { active } = event;
//     const lead = leads.find(l => l.id === active.id);
    
//     if (lead) {
//       setDragState(prev => ({
//         ...prev,
//         activeId: active.id as string,
//         activeColumn: lead.status,
//       }));
//     }
//   }, [leads]);

//   const handleDragOver = useCallback((event: DragOverEvent) => {
//     const { active, over } = event;
    
//     if (!over) return;

//     // Check if over a column
//     if (STATUSES.includes(over.id as LeadStatus)) {
//       setDragState(prev => ({
//         ...prev,
//         overId: null,
//         overColumn: over.id as LeadStatus,
//         isOverCard: false,
//       }));
//       return;
//     }

//     // Check if over another card
//     const overLead = leads.find(lead => lead.id === over.id);
//     if (overLead) {
//       setDragState(prev => ({
//         ...prev,
//         overId: over.id as string,
//         overColumn: overLead.status,
//         isOverCard: true,
//       }));
//     }
//   }, [leads]);

//   const handleDragEnd = useCallback((event: DragEndEvent) => {
//     const { active, over } = event;
    
//     if (!over || !activeLead) {
//       resetDragState();
//       return;
//     }

//     let targetStatus: LeadStatus | null = null;

//     // Determine target status based on what we're over
//     if (STATUSES.includes(over.id as LeadStatus)) {
//       targetStatus = over.id as LeadStatus;
//     } else if (overLead) {
//       targetStatus = overLead.status;
//     }

//     if (targetStatus && isValidStatusTransition(activeLead.status, targetStatus)) {
//       updateLeadStatus(activeLead, targetStatus);
//     }

//     resetDragState();
//   }, [activeLead, overLead, resetDragState, updateLeadStatus, isValidStatusTransition]);

//   // Get border color based on drag state
//   const getColumnBorderColor = useCallback((status: LeadStatus) => {
//     if (dragState.overColumn !== status) return 'transparent';
    
//     const currentStatus = activeLead?.status;
//     if (!currentStatus) return 'transparent';
    
//     return isValidStatusTransition(currentStatus, status) 
//       ? '3px solid #28a745' // Green for allowed
//       : '3px solid #dc3545'; // Red for prevented
//   }, [dragState.overColumn, activeLead, isValidStatusTransition]);

//   return (
//     <div className="container-fluid py-4">
//       <header className="d-flex justify-content-between align-items-center mb-4">
//         <h1 className="text-primary h2">Leads Kanban Board</h1>
//         <button 
//           onClick={() => navigate('/form')} 
//           className="btn btn-primary"
//           aria-label="Add new lead"
//           data-testid="add-lead-button"
//         >
//           <i className="bi bi-plus-lg me-2"></i> Add New Lead
//         </button>
//       </header>
      
//       <DndContext
//         collisionDetection={closestCorners}
//         onDragStart={handleDragStart}
//         onDragOver={handleDragOver}
//         onDragEnd={handleDragEnd}
//         accessibility={{
//           announcements: {
//             onDragStart({ active }) {
//               return `Picked up lead ${active.id}`;
//             },
//             onDragOver({ active, over }) {
//               if (over?.id) {
//                 if (STATUSES.includes(over.id as LeadStatus)) {
//                   return `Moving lead ${active.id} to ${over.id} column`;
//                 }
//                 return `Moving lead ${active.id} near lead ${over.id}`;
//               }
//               return null;
//             },
//             onDragEnd({ active, over }) {
//               if (over?.id) {
//                 const status = STATUSES.includes(over.id as LeadStatus)
//                   ? over.id
//                   : leads.find(l => l.id === over.id)?.status;
//                 return `Lead ${active.id} moved to ${status} column`;
//               }
//               return null;
//             },
//           },
//         }}
//       >
//         <div 
//           className="d-flex gap-4 overflow-auto px-3" 
//           style={{ width: '90vw' }}
//           role="grid"
//           aria-label="Kanban board columns"
//           data-testid="kanban-board"
//         >
//           {STATUSES.map(status => (
//             <div 
//               key={status} 
//               className="flex-grow-1" 
//               style={{ 
//                 minWidth: '250px',
//                 border: getColumnBorderColor(status),
//                 borderRadius: '4px',
//                 transition: 'border 0.2s ease',
//               }}
//               role="gridcell"
//               data-testid={`column-${status}`}
//             >
//               <KanbanColumn
//                 status={status}
//                 leads={leads.filter(lead => lead.status === status)}
//                 isOver={dragState.overColumn === status}
//                 canDrop={
//                   dragState.activeId 
//                     ? isValidStatusTransition(
//                         leads.find(lead => lead.id === dragState.activeId)?.status as LeadStatus, 
//                         status
//                       ) 
//                     : false
//                 }
//                 isActiveColumn={dragState.activeColumn === status}
//               />
//             </div>
//           ))}
//         </div>
        
//         <DragOverlay>
//           {activeLead ? (
//             <div 
//               style={{ 
//                 transform: 'rotate(3deg)', 
//                 boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
//                 width: '100%',
//                 opacity: 0.9,
//               }}
//               data-testid="dragging-card"
//             >
//               <KanbanCard lead={activeLead} isDragging />
//             </div>
//           ) : null}
//         </DragOverlay>
//       </DndContext>
//     </div>
//   );
// };

// export default KanbanBoard;


