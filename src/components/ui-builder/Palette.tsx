"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Palette Component
// Draggable component palette for primitives, macros, and templates
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useEditor } from '@/lib/ui-builder/EditorContext';
import { PALETTE_ITEMS, PAGE_TEMPLATES } from '@/lib/ui-builder/defaults';
import type { PaletteItem, ElementType, UITemplate } from '@/lib/ui-builder/types';

// ─── Palette Item Component ───
function PaletteItemCard({ item }: { item: PaletteItem }) {
  const { state, addElement } = useEditor();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'palette',
      elementType: item.type,
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleDoubleClick = () => {
    // Add to currently selected element or root
    const parentId = state.selectedElementId || state.design.root.id;
    addElement(parentId, item.type as ElementType);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDoubleClick={handleDoubleClick}
      className="flex items-center gap-2 px-2 py-1.5 rounded bg-surface-elevated border border-border 
                 hover:border-primary-500/50 hover:bg-surface-overlay cursor-grab active:cursor-grabbing
                 transition-all duration-150 select-none group"
      title={item.description || `Drag to add ${item.label}`}
    >
      <span className="flex items-center justify-center w-5 h-5 rounded bg-stone-700 text-xs font-mono text-foreground-muted group-hover:bg-primary-600 group-hover:text-foreground transition-colors">
        {item.icon}
      </span>
      <span className="text-xs text-foreground-muted group-hover:text-foreground transition-colors truncate">
        {item.label}
      </span>
    </div>
  );
}

// ─── Template Card Component ───
function TemplateCard({ template }: { template: UITemplate }) {
  const { loadDesign, state } = useEditor();

  const handleClick = () => {
    // Create a new design from the template
    if (confirm(`Apply template "${template.name}"? This will replace your current design.`)) {
      const now = new Date().toISOString();
      loadDesign({
        id: Math.random().toString(36).substring(2, 9),
        name: template.name,
        description: template.description,
        root: JSON.parse(JSON.stringify(template.root)),
        createdAt: now,
        updatedAt: now,
        settings: {
          ...state.design.settings,
          ...template.settings,
        },
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left px-2 py-2 rounded bg-surface-elevated border border-border 
                 hover:border-amber-500/50 hover:bg-surface-overlay
                 transition-all duration-150 group"
    >
      <div className="text-xs font-medium text-foreground group-hover:text-amber-400 transition-colors">
        {template.name}
      </div>
      <div className="text-xs text-foreground-subtle mt-0.5">
        {template.description}
      </div>
    </button>
  );
}

// ─── Palette Section ───
function PaletteSection({ 
  title, 
  items, 
  defaultOpen = true 
}: { 
  title: string; 
  items: PaletteItem[];
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="space-y-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 w-full text-xs font-semibold uppercase tracking-wider text-foreground-subtle px-1 hover:text-foreground transition-colors"
      >
        <span className="text-xs">{isOpen ? '▾' : '▸'}</span>
        {title}
        <span className="text-foreground-subtle/50 font-normal ml-auto">{items.length}</span>
      </button>
      {isOpen && (
        <div className="grid grid-cols-1 gap-1">
          {items.map((item) => (
            <PaletteItemCard key={item.type} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Templates Section ───
function TemplatesSection() {
  const [isOpen, setIsOpen] = useState(true);
  const pageTemplates = PAGE_TEMPLATES.filter(t => t.category === 'page');
  const cardTemplates = PAGE_TEMPLATES.filter(t => t.category === 'card');
  const hudTemplates = PAGE_TEMPLATES.filter(t => t.category === 'hud');

  return (
    <div className="space-y-1">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 w-full text-xs font-semibold uppercase tracking-wider text-amber-500/80 px-1 hover:text-amber-400 transition-colors"
      >
        <span className="text-xs">{isOpen ? '▾' : '▸'}</span>
        Templates
        <span className="text-foreground-subtle/50 font-normal ml-auto">{PAGE_TEMPLATES.length}</span>
      </button>
      {isOpen && (
        <div className="space-y-3">
          {pageTemplates.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-foreground-subtle px-1">Pages</div>
              {pageTemplates.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          )}
          {cardTemplates.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-foreground-subtle px-1">Cards</div>
              {cardTemplates.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          )}
          {hudTemplates.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs text-foreground-subtle px-1">HUD</div>
              {hudTemplates.map((t) => (
                <TemplateCard key={t.id} template={t} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Palette Component ───
export function Palette() {
  const primitives = PALETTE_ITEMS.filter(item => item.category === 'primitive');
  const macros = PALETTE_ITEMS.filter(item => item.category === 'macro');

  return (
    <div className="flex flex-col h-full bg-surface border-r border-border">
      {/* Header */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-border">
        <h2 className="text-xs font-semibold text-foreground uppercase tracking-wider">Components</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {/* Templates Section */}
        <TemplatesSection />
        
        {/* Divider */}
        <div className="border-t border-border/50 my-2" />
        
        {/* Primitives */}
        <PaletteSection title="Primitives" items={primitives} defaultOpen={true} />
        
        {/* Macros */}
        <PaletteSection title="Common.ui Macros" items={macros} defaultOpen={false} />
      </div>

      {/* Footer with tips */}
      <div className="flex-shrink-0 px-3 py-2 border-t border-border bg-surface-elevated">
        <p className="text-xs text-foreground-subtle">
          💡 Drag to canvas or double-click
        </p>
      </div>
    </div>
  );
}
