import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useNavigate } from 'react-router-dom';
import { Lead } from '../types/lead';

const KanbanCard: React.FC<{ lead: Lead }> = ({ lead }) => {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`kanban-card ${isDragging ? 'dragging' : ''}`}
      onClick={() => navigate(`/form/${lead.id}`)}
    >
      <h4>{lead.name}</h4>
      <p>{lead.company}</p>
      <p className="email">{lead.email}</p>
      <div className="card-footer">
        <span className={`status-badge ${lead.status}`}>
          {lead.status}
        </span>
        <span className="updated-at">
          {lead.updated_at}
        </span>
      </div>
    </div>
  );
};

export default KanbanCard;