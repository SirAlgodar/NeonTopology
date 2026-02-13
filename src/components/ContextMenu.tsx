import React from 'react';
import { Menu, MenuItem, IconName } from '@grafana/ui';

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  items: { label: string; onClick: () => void; icon?: IconName; destructive?: boolean }[];
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, items }) => {
  return (
    <div 
      style={{
        position: 'fixed',
        left: x,
        top: y,
        zIndex: 2000,
        background: '#222',
        border: '1px solid #444',
        borderRadius: '4px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
        minWidth: '150px'
      }}
      onMouseLeave={onClose}
    >
      <Menu>
        {items.map((item, i) => (
          <MenuItem
            key={i}
            label={item.label}
            icon={item.icon}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            destructive={item.destructive}
          />
        ))}
      </Menu>
    </div>
  );
};
