import React from 'react';
import { InlineField, Button, IconButton } from '@grafana/ui';

interface ToolbarProps {
  onAddNode: () => void;
  isDrawing: boolean;
  onToggleDrawing: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onAddNode,
  isDrawing,
  onToggleDrawing,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  return (
    <div style={{
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 1000,
      display: 'flex',
      gap: '8px',
      background: 'rgba(0, 0, 0, 0.6)',
      padding: '8px',
      borderRadius: '4px',
      backdropFilter: 'blur(4px)'
    }}>
      <Button size="sm" variant="secondary" icon="plus" onClick={onAddNode}>
        Add Node
      </Button>
      <Button 
        size="sm" 
        variant={isDrawing ? "primary" : "secondary"} 
        icon="share-alt" 
        onClick={onToggleDrawing}
      >
        {isDrawing ? 'Cancel Link' : 'Draw Link'}
      </Button>
      <div style={{ width: '1px', background: 'rgba(255,255,255,0.2)', margin: '0 4px' }} />
      <IconButton name="arrow-left" onClick={onUndo} disabled={!canUndo} tooltip="Undo" />
      <IconButton name="arrow-right" onClick={onRedo} disabled={!canRedo} tooltip="Redo" />
    </div>
  );
};
