"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Hierarchy Tree Component
// Nested element tree with selection and reordering
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useEditor } from '@/lib/ui-builder/EditorContext';
import { canHaveChildren } from '@/lib/ui-builder/defaults';
import type { UIElement, ElementType, DragData } from '@/lib/ui-builder/types';
import { ChevronRight, ChevronDown, Eye, EyeOff, Copy, Trash2, FolderOpen, File } from 'lucide-react';

// ─── Tree Node Component ───
function TreeNode({ 
  element, 
  depth = 0,
  isRoot = false,
}: { 
  element: UIElement; 
  depth?: number;
  isRoot?: boolean;
}) {
  const { 
    state, 
    selectElement, 
    deleteElement, 
    duplicateElement,
    copyElement,
    toggleCollapse,
    moveElement,
    addElement,
  } = useEditor();
  
  const [isDragOver, setIsDragOver] = useState(false);
  
  const isSelected = state.selectedElementId === element.id;
  const isCollapsed = element._collapsed;
  const hasChildren = element.children.length > 0;
  const acceptsChildren = canHaveChildren(element.type);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id);
  };

  const handleToggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCollapse(element.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRoot) {
      deleteElement(element.id);
    }
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isRoot) {
      duplicateElement(element.id);
    }
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    copyElement(element.id);
  };

  // Drag source
  const handleDragStart = (e: React.DragEvent) => {
    if (isRoot) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'hierarchy',
      elementId: element.id,
    }));
    e.dataTransfer.effectAllowed = 'move';
  };

  // Drop target
  const handleDragOver = (e: React.DragEvent) => {
    if (!acceptsChildren) return;
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (!acceptsChildren) return;

    try {
      const data: DragData = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (data.type === 'hierarchy' && data.elementId) {
        // Don't drop on self
        if (data.elementId !== element.id) {
          moveElement(data.elementId, element.id);
        }
      } else if (data.type === 'palette' && data.elementType) {
        addElement(element.id, data.elementType as ElementType);
      }
    } catch {
      // Invalid drag data
    }
  };

  // Element icon based on type
  const getIcon = () => {
    if (hasChildren || acceptsChildren) {
      return <FolderOpen className="w-3.5 h-3.5 text-primary-400" />;
    }
    return <File className="w-3.5 h-3.5 text-foreground-subtle" />;
  };

  return (
    <div className="select-none">
      {/* Node Row */}
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        draggable={!isRoot}
        onDragStart={handleDragStart}
        className={`
          flex items-center gap-1 px-2 py-1 rounded cursor-pointer group transition-colors
          ${isSelected ? 'bg-primary-500/20 text-foreground' : 'text-foreground-muted hover:bg-surface-elevated hover:text-foreground'}
          ${isDragOver ? 'bg-accent-500/20 ring-1 ring-accent-400' : ''}
        `}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
      >
        {/* Collapse Toggle */}
        <button
          onClick={handleToggleCollapse}
          className={`p-0.5 rounded hover:bg-surface-overlay transition-colors ${hasChildren ? 'visible' : 'invisible'}`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          )}
        </button>

        {/* Visibility Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            // Toggle visibility - would need to add this to the context
          }}
          className="p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
          title={element.properties.visible === false ? 'Show' : 'Hide'}
        >
          {element.properties.visible === false ? (
            <EyeOff className="w-3 h-3 text-foreground-subtle" />
          ) : (
            <Eye className="w-3 h-3 text-foreground-subtle" />
          )}
        </button>

        {/* Element Icon */}
        {getIcon()}

        {/* Element Name/Type */}
        <span className="flex-1 text-xs truncate">
          #{element.name || element.type}{element.id.substring(0, 6)}
        </span>

        {/* Actions */}
        {!isRoot && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1 rounded hover:bg-surface-overlay transition-colors"
              title="Copy"
            >
              <Copy className="w-3 h-3" />
            </button>
            <button
              onClick={handleDuplicate}
              className="p-1 rounded hover:bg-surface-overlay transition-colors"
              title="Duplicate"
            >
              <Copy className="w-3 h-3 text-accent-400" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded hover:bg-red-500/20 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3 h-3 text-red-400" />
            </button>
          </div>
        )}
      </div>

      {/* Children */}
      {!isCollapsed && hasChildren && (
        <div>
          {element.children.map((child) => (
            <TreeNode 
              key={child.id} 
              element={child} 
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Hierarchy Tree Component ───
export function HierarchyTree() {
  const { state, selectElement } = useEditor();

  const handleBackgroundClick = () => {
    selectElement(null);
  };

  return (
    <div className="flex flex-col h-full bg-surface border-t border-border">
      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 py-2 border-b border-border">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle">
          Hierarchy
        </h2>
        <span className="text-xs text-foreground-subtle">
          {countElements(state.design.root)} elements
        </span>
      </div>

      {/* Tree Content */}
      <div 
        className="flex-1 overflow-y-auto py-2"
        onClick={handleBackgroundClick}
      >
        <TreeNode element={state.design.root} isRoot />
      </div>
    </div>
  );
}

// ─── Helper: Count Elements ───
function countElements(element: UIElement): number {
  return 1 + element.children.reduce((sum, child) => sum + countElements(child), 0);
}

