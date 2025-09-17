import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const DraggableSection = ({ id, title, children }) => {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({ id });

  const style = {
   transform: CSS.Transform.toString(transform),
   transition,
   cursor: 'grab',
   padding: '2rem',
   backgroundColor: '#f9f9f9',
   border: '1px solid #ddd',
   borderRadius: '8px',
   boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
   opacity: isDragging ? 0.5 : 1,
   zIndex: isDragging ? 10 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h2 className="section-title">{title}</h2>
      {children}
    </div>
  );
};

export default DraggableSection;