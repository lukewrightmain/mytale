"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Canvas Component
// Visual design canvas with drag/drop, selection, and element rendering
// ═══════════════════════════════════════════════════════════════════════════

import { useCallback, useRef, useState } from 'react';
import { useEditor } from '@/lib/ui-builder/EditorContext';
import { canHaveChildren } from '@/lib/ui-builder/defaults';
import type { UIElement, ElementType, DragData } from '@/lib/ui-builder/types';
import { ZoomIn, ZoomOut, Grid3X3, Maximize2 } from 'lucide-react';

// ─── Element Renderer ───
function CanvasElement({ 
  element, 
  isRoot = false,
  depth = 0,
}: { 
  element: UIElement; 
  isRoot?: boolean;
  depth?: number;
}) {
  const { state, selectElement, addElement, moveElement } = useEditor();
  const [isDragOver, setIsDragOver] = useState(false);
  
  const isSelected = state.selectedElementId === element.id;
  const canAcceptChildren = canHaveChildren(element.type);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (!canAcceptChildren) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!canAcceptChildren) return;

    try {
      const data: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (data.type === 'palette' && data.elementType) {
        addElement(element.id, data.elementType as ElementType);
      } else if (data.type === 'hierarchy' && data.elementId) {
        // Moving element within hierarchy
        if (data.elementId !== element.id) {
          moveElement(data.elementId, element.id);
        }
      }
    } catch {
      // Invalid drag data
    }
  };

  // Get element dimensions and styling
  const anchor = element.properties.anchor || {};
  const width = anchor.width || 'auto';
  const height = anchor.height || 'auto';
  const bgColor = element.properties.background?.color || 'transparent';

  // Base styles
  const baseStyles: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    backgroundColor: bgColor !== 'transparent' ? bgColor : undefined,
    position: 'relative',
    minWidth: isRoot ? '100%' : '40px',
    minHeight: isRoot ? '100%' : '24px',
  };

  // Layout mode positioning for children
  const getLayoutStyles = (): React.CSSProperties => {
    const mode = element.properties.layoutMode || 'None';
    switch (mode) {
      case 'Top':
        return { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start' };
      case 'Middle':
        return { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' };
      case 'Bottom':
        return { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' };
      case 'MiddleCenter':
        return { display: 'flex', alignItems: 'center', justifyContent: 'center' };
      default:
        return { display: 'flex', flexDirection: 'column', alignItems: 'flex-start' };
    }
  };

  // Apply padding
  const padding = element.properties.padding || {};
  if (padding.all) {
    baseStyles.padding = `${padding.all}px`;
  } else {
    if (padding.top) baseStyles.paddingTop = `${padding.top}px`;
    if (padding.right) baseStyles.paddingRight = `${padding.right}px`;
    if (padding.bottom) baseStyles.paddingBottom = `${padding.bottom}px`;
    if (padding.left) baseStyles.paddingLeft = `${padding.left}px`;
  }

  // Render element based on type
  const renderContent = () => {
    switch (element.type) {
      case 'Label':
      case 'TimerLabel': {
        const text = 'text' in element.properties ? element.properties.text : 'Label';
        const style = 'style' in element.properties ? element.properties.style : {};
        const alignment = 'alignment' in element.properties ? element.properties.alignment : 'Left';
        return (
          <div 
            className="w-full h-full flex items-center"
            style={{
              color: style?.textColor || '#ffffff',
              fontSize: style?.fontSize ? `${style.fontSize}px` : '14px',
              fontWeight: style?.renderBold ? 'bold' : 'normal',
              fontStyle: style?.renderItalic ? 'italic' : 'normal',
              justifyContent: alignment === 'Center' ? 'center' : alignment === 'Right' ? 'flex-end' : 'flex-start',
              textAlign: alignment?.toLowerCase() as 'left' | 'center' | 'right',
            }}
          >
            {text || 'Label'}
          </div>
        );
      }

      case 'AssetImage': {
        return (
          <div className="w-full h-full flex items-center justify-center bg-stone-700/50 border border-dashed border-stone-600 rounded">
            <span className="text-xs text-foreground-subtle">Image</span>
          </div>
        );
      }

      case 'RawButton':
      case 'TextButton':
      case 'CancelButton':
      case 'BackButton': {
        const text = 'text' in element.properties ? element.properties.text : 'Button';
        return (
          <div className="w-full h-full flex items-center justify-center bg-stone-600 hover:bg-stone-500 rounded border border-stone-500 text-sm text-foreground cursor-pointer transition-colors">
            {text || 'Button'}
          </div>
        );
      }

      case 'RawField':
      case 'TextInput': {
        const placeholder = 'placeholder' in element.properties ? element.properties.placeholder : 'Enter text...';
        return (
          <div className="w-full h-full flex items-center px-3 bg-stone-800 border border-stone-600 rounded text-sm text-foreground-muted">
            {placeholder || 'Enter text...'}
          </div>
        );
      }

      case 'NumberInput': {
        return (
          <div className="w-full h-full flex items-center px-3 bg-stone-800 border border-stone-600 rounded text-sm text-foreground-muted">
            0
          </div>
        );
      }

      case 'CheckBox': {
        const label = 'label' in element.properties ? element.properties.label : 'Option';
        return (
          <div className="w-full h-full flex items-center gap-2">
            <div className="w-4 h-4 border border-stone-500 rounded bg-stone-700" />
            <span className="text-sm text-foreground-muted">{label || 'Option'}</span>
          </div>
        );
      }

      case 'ColorPicker': {
        const color = 'defaultColor' in element.properties ? element.properties.defaultColor : '#ffffff';
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div 
              className="w-12 h-12 rounded border border-stone-600" 
              style={{ backgroundColor: color || '#ffffff' }}
            />
          </div>
        );
      }

      case 'Group':
      case 'PageOverlay':
      case 'ContainerPanel':
      default: {
        // Container elements - render children
        return (
          <div 
            className="w-full h-full"
            style={getLayoutStyles()}
          >
            {element.children.map((child) => (
              <CanvasElement 
                key={child.id} 
                element={child} 
                depth={depth + 1}
              />
            ))}
            {element.children.length === 0 && !isRoot && (
              <div className="w-full h-full flex items-center justify-center text-xs text-foreground-subtle opacity-50">
                {canAcceptChildren ? 'Drop elements here' : ''}
              </div>
            )}
          </div>
        );
      }
    }
  };

  return (
    <div
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative transition-all duration-100
        ${isRoot ? '' : 'rounded'}
        ${isSelected ? 'ring-2 ring-primary-500 ring-offset-1 ring-offset-background z-10' : ''}
        ${isDragOver && canAcceptChildren ? 'ring-2 ring-accent-400 bg-accent-500/10' : ''}
        ${!isRoot && !isSelected ? 'hover:ring-1 hover:ring-stone-600' : ''}
      `}
      style={baseStyles}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {/* Element label overlay */}
      {isSelected && !isRoot && (
        <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-primary-500 text-[10px] text-white rounded-t font-mono z-20">
          {element.name || element.type}
        </div>
      )}
      
      {renderContent()}
    </div>
  );
}

// ─── Main Canvas Component ───
export function Canvas() {
  const { state, setZoom, toggleGrid, selectElement } = useEditor();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(state.zoom + 0.1);
  const handleZoomOut = () => setZoom(state.zoom - 0.1);
  const handleResetZoom = () => setZoom(1);

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Deselect when clicking on canvas background
    if (e.target === canvasRef.current) {
      selectElement(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle mouse button or Alt+Left click for panning
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setZoom(state.zoom + delta);
    }
  }, [state.zoom, setZoom]);

  const canvasWidth = state.design.settings.canvasWidth;
  const canvasHeight = state.design.settings.canvasHeight;

  return (
    <div className="flex flex-col h-full bg-stone-900">
      {/* Toolbar */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground-muted">
            {Math.round(state.zoom * 100)}%
          </span>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded hover:bg-surface-elevated transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4 text-foreground-muted" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded hover:bg-surface-elevated transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4 text-foreground-muted" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded hover:bg-surface-elevated transition-colors"
            title="Reset Zoom"
          >
            <Maximize2 className="w-4 h-4 text-foreground-muted" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={toggleGrid}
            className={`p-1.5 rounded transition-colors ${
              state.showGrid ? 'bg-primary-500/20 text-primary-400' : 'hover:bg-surface-elevated text-foreground-muted'
            }`}
            title="Toggle Grid"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <span className="text-xs text-foreground-subtle">
            {canvasWidth} × {canvasHeight}
          </span>
        </div>
      </div>

      {/* Canvas Area */}
      <div 
        ref={canvasRef}
        className="flex-1 overflow-auto relative"
        onClick={handleCanvasClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
      >
        {/* Grid Background */}
        {state.showGrid && (
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
            }}
          />
        )}

        {/* Canvas Content */}
        <div 
          className="absolute top-1/2 left-1/2 shadow-2xl"
          style={{
            width: canvasWidth,
            height: canvasHeight,
            transform: `translate(-50%, -50%) translate(${panOffset.x}px, ${panOffset.y}px) scale(${state.zoom})`,
            transformOrigin: 'center center',
          }}
        >
          {/* Design Canvas */}
          <div 
            className="w-full h-full overflow-hidden rounded-lg border border-stone-700"
            style={{ backgroundColor: state.design.root.properties.background?.color || '#2a2a2a' }}
          >
            <CanvasElement element={state.design.root} isRoot />
          </div>
        </div>
      </div>
    </div>
  );
}

