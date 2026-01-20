"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Canvas Component
// Visual design canvas with drag/drop, selection, resize, and element rendering
// ═══════════════════════════════════════════════════════════════════════════

import { useCallback, useRef, useState, useEffect } from 'react';
import { useEditor } from '@/lib/ui-builder/EditorContext';
import { canHaveChildren } from '@/lib/ui-builder/defaults';
import type { UIElement, ElementType, DragData, Anchor } from '@/lib/ui-builder/types';
import { ZoomIn, ZoomOut, Grid3X3, Maximize2 } from 'lucide-react';

// ─── Resize Handle Positions ───
type ResizeHandle = 'nw' | 'n' | 'ne' | 'w' | 'e' | 'sw' | 's' | 'se';

// ─── Resize Handles Component ───
function ResizeHandles({ 
  onResizeStart 
}: { 
  onResizeStart: (handle: ResizeHandle, e: React.MouseEvent) => void;
}) {
  const handles: { position: ResizeHandle; cursor: string; className: string }[] = [
    { position: 'nw', cursor: 'nwse-resize', className: '-top-1 -left-1' },
    { position: 'n', cursor: 'ns-resize', className: '-top-1 left-1/2 -translate-x-1/2' },
    { position: 'ne', cursor: 'nesw-resize', className: '-top-1 -right-1' },
    { position: 'w', cursor: 'ew-resize', className: 'top-1/2 -left-1 -translate-y-1/2' },
    { position: 'e', cursor: 'ew-resize', className: 'top-1/2 -right-1 -translate-y-1/2' },
    { position: 'sw', cursor: 'nesw-resize', className: '-bottom-1 -left-1' },
    { position: 's', cursor: 'ns-resize', className: '-bottom-1 left-1/2 -translate-x-1/2' },
    { position: 'se', cursor: 'nwse-resize', className: '-bottom-1 -right-1' },
  ];

  return (
    <>
      {handles.map(({ position, cursor, className }) => (
        <div
          key={position}
          className={`absolute w-2.5 h-2.5 bg-primary-500 border border-white rounded-sm z-30 ${className}`}
          style={{ cursor }}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(position, e);
          }}
        />
      ))}
    </>
  );
}

// ─── Element Renderer ───
function CanvasElement({ 
  element, 
  isRoot = false,
  depth = 0,
  parentBounds,
  zoom = 1,
}: { 
  element: UIElement; 
  isRoot?: boolean;
  depth?: number;
  parentBounds?: { width: number; height: number };
  zoom?: number;
}) {
  const { state, selectElement, addElement, moveElement, updateElement } = useEditor();
  const elementRef = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialPosition, setInitialPosition] = useState({ left: 0, top: 0 });
  const [initialSize, setInitialSize] = useState({ width: 0, height: 0 });
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  
  const isSelected = state.selectedElementId === element.id;
  const canAcceptChildren = canHaveChildren(element.type);

  // Get element dimensions and position
  const anchor = element.properties.anchor || {};
  const width = anchor.width || 100;
  const height = anchor.height || 100;
  const left = anchor.left ?? 0;
  const top = anchor.top ?? 0;
  const bgColor = element.properties.background?.color || 'transparent';

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  // ─── Drag Start (Move) ───
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isRoot || e.button !== 0) return;
    
    // Don't start drag if clicking on resize handle
    if ((e.target as HTMLElement).closest('[data-resize-handle]')) return;
    
    e.stopPropagation();
    selectElement(element.id);
    
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition({ left: left, top: top });
  };

  // ─── Resize Start ───
  const handleResizeStart = (handle: ResizeHandle, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeHandle(handle);
    setDragStart({ x: e.clientX, y: e.clientY });
    setInitialPosition({ left: left, top: top });
    setInitialSize({ width: width, height: height });
  };

  // ─── Mouse Move (Drag/Resize) ───
  useEffect(() => {
    if (!isDragging && !isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = (e.clientX - dragStart.x) / zoom;
      const deltaY = (e.clientY - dragStart.y) / zoom;

      if (isDragging) {
        // Moving element
        const newLeft = Math.round(initialPosition.left + deltaX);
        const newTop = Math.round(initialPosition.top + deltaY);
        
        updateElement(element.id, {
          anchor: {
            ...anchor,
            left: newLeft,
            top: newTop,
          },
        });
      } else if (isResizing && resizeHandle) {
        // Resizing element
        let newWidth = initialSize.width;
        let newHeight = initialSize.height;
        let newLeft = initialPosition.left;
        let newTop = initialPosition.top;

        // Handle horizontal resize
        if (resizeHandle.includes('e')) {
          newWidth = Math.max(20, initialSize.width + deltaX);
        } else if (resizeHandle.includes('w')) {
          newWidth = Math.max(20, initialSize.width - deltaX);
          newLeft = initialPosition.left + (initialSize.width - newWidth);
        }

        // Handle vertical resize
        if (resizeHandle.includes('s')) {
          newHeight = Math.max(20, initialSize.height + deltaY);
        } else if (resizeHandle.includes('n')) {
          newHeight = Math.max(20, initialSize.height - deltaY);
          newTop = initialPosition.top + (initialSize.height - newHeight);
        }

        updateElement(element.id, {
          anchor: {
            ...anchor,
            width: Math.round(newWidth),
            height: Math.round(newHeight),
            left: Math.round(newLeft),
            top: Math.round(newTop),
          },
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragStart, initialPosition, initialSize, resizeHandle, element.id, anchor, updateElement, zoom]);

  // ─── Drop Zone Handling ───
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
        if (data.elementId !== element.id) {
          moveElement(data.elementId, element.id);
        }
      }
    } catch {
      // Invalid drag data
    }
  };

  // Base styles
  const baseStyles: React.CSSProperties = {
    position: isRoot ? 'relative' : 'absolute',
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    left: isRoot ? undefined : `${left}px`,
    top: isRoot ? undefined : `${top}px`,
    backgroundColor: bgColor !== 'transparent' ? bgColor : undefined,
    minWidth: isRoot ? '100%' : undefined,
    minHeight: isRoot ? '100%' : undefined,
    cursor: isRoot ? 'default' : (isDragging ? 'grabbing' : 'grab'),
    userSelect: 'none',
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
        return {};
    }
  };

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
            className="w-full h-full flex items-center pointer-events-none"
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
          <div className="w-full h-full flex items-center justify-center bg-stone-700/50 border border-dashed border-stone-600 rounded pointer-events-none">
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
          <div className="w-full h-full flex items-center justify-center bg-stone-600 rounded border border-stone-500 text-sm text-foreground pointer-events-none">
            {text || 'Button'}
          </div>
        );
      }

      case 'RawField':
      case 'TextInput': {
        const placeholder = 'placeholder' in element.properties ? element.properties.placeholder : 'Enter text...';
        return (
          <div className="w-full h-full flex items-center px-3 bg-stone-800 border border-stone-600 rounded text-sm text-foreground-muted pointer-events-none">
            {placeholder || 'Enter text...'}
          </div>
        );
      }

      case 'NumberInput': {
        return (
          <div className="w-full h-full flex items-center px-3 bg-stone-800 border border-stone-600 rounded text-sm text-foreground-muted pointer-events-none">
            0
          </div>
        );
      }

      case 'CheckBox': {
        const label = 'label' in element.properties ? element.properties.label : 'Option';
        return (
          <div className="w-full h-full flex items-center gap-2 pointer-events-none">
            <div className="w-4 h-4 border border-stone-500 rounded bg-stone-700" />
            <span className="text-sm text-foreground-muted">{label || 'Option'}</span>
          </div>
        );
      }

      case 'ColorPicker': {
        const color = 'defaultColor' in element.properties ? element.properties.defaultColor : '#ffffff';
        return (
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
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
        // Container elements - render children with absolute positioning
        return (
          <div 
            className="w-full h-full relative"
            style={getLayoutStyles()}
          >
            {element.children.map((child) => (
              <CanvasElement 
                key={child.id} 
                element={child} 
                depth={depth + 1}
                parentBounds={{ width, height }}
                zoom={zoom}
              />
            ))}
            {element.children.length === 0 && !isRoot && (
              <div className="absolute inset-0 flex items-center justify-center text-xs text-foreground-subtle opacity-50 pointer-events-none">
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
      ref={elementRef}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        transition-shadow duration-100
        ${isRoot ? '' : 'rounded'}
        ${isSelected ? 'ring-2 ring-primary-500 z-20' : ''}
        ${isDragOver && canAcceptChildren ? 'ring-2 ring-accent-400 bg-accent-500/10' : ''}
        ${!isRoot && !isSelected ? 'hover:ring-1 hover:ring-stone-500' : ''}
        ${isDragging || isResizing ? 'opacity-90' : ''}
      `}
      style={baseStyles}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      {/* Element label overlay */}
      {isSelected && !isRoot && (
        <div className="absolute -top-5 left-0 px-1.5 py-0.5 bg-primary-500 text-[10px] text-white rounded-t font-mono z-30 pointer-events-none">
          {element.name || element.type}
        </div>
      )}
      
      {/* Resize Handles */}
      {isSelected && !isRoot && (
        <ResizeHandles onResizeStart={handleResizeStart} />
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
    if (e.target === canvasRef.current || (e.target as HTMLElement).dataset?.canvasBackground) {
      selectElement(null);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle mouse button or Alt+Left click for panning
      e.preventDefault();
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
        data-canvas-background="true"
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
            className="w-full h-full overflow-hidden rounded-lg border border-stone-700 relative"
            style={{ backgroundColor: state.design.root.properties.background?.color || '#2a2a2a' }}
          >
            <CanvasElement element={state.design.root} isRoot zoom={state.zoom} />
          </div>
        </div>
      </div>
    </div>
  );
}
