import React, { useState } from 'react';

const CustomTooltip = ({ children, content, placement = 'top' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className="tooltip-trigger"
        style={{ cursor: 'help' }}
      >
        {children}
      </span>
      {isOpen && (
        <div
          className="tooltip-content"
          style={{
            position: 'absolute',
            top: placement === 'top' ? '-120px' : '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#333',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '6px',
            fontSize: '14px',
            maxWidth: '300px',
            zIndex: 1000,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            border: '1px solid #555',
            whiteSpace: 'normal',
            wordWrap: 'break-word'
          }}
        >
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
