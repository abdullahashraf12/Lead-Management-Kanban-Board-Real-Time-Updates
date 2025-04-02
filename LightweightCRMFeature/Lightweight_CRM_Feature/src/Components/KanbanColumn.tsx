import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import KanbanCard from './KanbanCard';
import { Lead } from '../types/lead';

interface KanbanColumnProps {
  status: string;
  leads: Lead[];
  isOver: boolean;
  canDrop: boolean;
  isActiveColumn: boolean;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  status, 
  leads, 
  isOver, 
  canDrop, 
  isActiveColumn 
}) => {
  const { setNodeRef } = useDroppable({ id: status });

  const getBorderStyle = () => {
    if (!isOver) return {};
    
    if (isActiveColumn) {
      return {
        borderImage: 'repeating-linear-gradient(45deg, #0d6efd, #0d6efd 5px, transparent 5px, transparent 10px) 1',
        borderWidth: '2px',
        borderStyle: 'solid',
      };
    }
    
    if (canDrop) {
      return {
        borderImage: 'repeating-linear-gradient(45deg, #198754, #198754 5px, transparent 5px, transparent 10px) 1',
        borderWidth: '2px',
        borderStyle: 'solid',
      };
    }
    
    return {
      borderImage: 'repeating-linear-gradient(45deg, #dc3545, #dc3545 5px, transparent 5px, transparent 10px) 1',
      borderWidth: '2px',
      borderStyle: 'solid',
    };
  };

  return (
    <div 
      ref={setNodeRef}
      className="card"
      style={{
        ...getBorderStyle(),
        minHeight: '500px',
        background: isOver ? 'rgba(0,0,0,0.05)' : '',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className={`card-header text-capitalize fw-bold status-badge ${status}`} >
        {status} ({leads.length})
      </div>
      <div className="card-body p-3" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
        {leads.map(lead => (
          <KanbanCard key={lead.id} lead={lead} />
        ))}
      </div>
    </div>
  );
};

export default KanbanColumn;




// import React from 'react';
// import { useDroppable } from '@dnd-kit/core';
// import KanbanCard from './KanbanCard';
// import { Lead } from '../types/lead';

// interface KanbanColumnProps {
//   status: string;
//   leads: Lead[];
//   isOver: boolean;
//   canDrop: boolean;
//   isActiveColumn: boolean;
// }

// const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
//   status, 
//   leads, 
//   isOver, 
//   canDrop, 
//   isActiveColumn 
// }) => {
//   const { setNodeRef } = useDroppable({ id: status });

//   const getBorderColor = () => {
//     if (!isOver) return '';
//     if (isActiveColumn) return 'border-primary'; // Blue
//     return canDrop ? 'border-success' : 'border-danger'; // Green or Red
//   };

//   return (
//     <div 
//       ref={setNodeRef}
//       className={`card ${getBorderColor()}`}
//       style={{
//         borderWidth: isOver ? '2px' : '1px',
//         borderStyle: isOver ? 'dashed' : 'solid',
//         minHeight: '500px',
//         background: isOver ? 'rgba(0,0,0,0.05)' : ''
//       }}
//     >
//       <div className="card-header text-capitalize fw-bold">
//         {status} ({leads.length})
//       </div>
//       <div className="card-body p-3" style={{ overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
//         {leads.map(lead => (
//           <KanbanCard key={lead.id} lead={lead} />
//         ))}
//       </div>
//     </div>
//   );
// };

// export default KanbanColumn;


// // import React from 'react';
// // import { useDroppable } from '@dnd-kit/core';
// // import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
// // import KanbanCard from './KanbanCard';
// // import { Lead, LeadStatus } from '../types/lead';

// // interface KanbanColumnProps {
// //   status: LeadStatus;
// //   leads: Lead[];
// // }

// // const KanbanColumn: React.FC<KanbanColumnProps> = ({ status, leads }) => {
// //   const { setNodeRef } = useDroppable({ id: status });
// //   return (
// //     <div className="kanban-column" ref={setNodeRef}>
// //       <h3 className={`column-header status-badge ${status}`}>
// //         {status.charAt(0).toUpperCase() + status.slice(1)}
// //         <span className="count-badge">{leads.length}</span>
// //       </h3>
// //       <SortableContext
// //         items={leads}
// //         strategy={verticalListSortingStrategy}
// //       >
// //         <div className="cards-container">
// //           {leads.map(lead => (
// //             <KanbanCard key={lead.id} lead={lead} />
// //           ))}
// //         </div>
// //       </SortableContext>
// //     </div>
// //   );
// // };

// // export default KanbanColumn;