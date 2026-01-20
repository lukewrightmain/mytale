"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Palette Component
// Draggable component palette for primitives and macros
// ═══════════════════════════════════════════════════════════════════════════

import { useEditor } from '@/lib/ui-builder/EditorContext';
import { PALETTE_ITEMS } from '@/lib/ui-builder/defaults';
import type { PaletteItem, ElementType } from '@/lib/ui-builder/types';

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
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-elevated border border-border 
                 hover:border-primary-500/50 hover:bg-surface-overlay cursor-grab active:cursor-grabbing
                 transition-all duration-150 select-none group"
      title={`Drag to add ${item.label}`}
    >
      <span className="flex items-center justify-center w-6 h-6 rounded bg-stone-700 text-xs font-mono text-foreground-muted group-hover:bg-primary-600 group-hover:text-foreground transition-colors">
        {item.icon}
      </span>
      <span className="text-sm text-foreground-muted group-hover:text-foreground transition-colors">
        {item.label}
      </span>
    </div>
  );
}

// ─── Palette Section ───
function PaletteSection({ title, items }: { title: string; items: PaletteItem[] }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-foreground-subtle px-2">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <PaletteItemCard key={item.type} item={item} />
        ))}
      </div>
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
      <div className="flex-shrink-0 px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">PALETTE</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-3 space-y-6">
        <PaletteSection title="Primitives" items={primitives} />
        <PaletteSection title="Macros (Common.ui)" items={macros} />
      </div>

      {/* Footer with attribution */}
      <div className="flex-shrink-0 px-4 py-2 border-t border-border">
        <p className="text-xs text-foreground-subtle">
          Drag items to canvas or<br />double-click to add
        </p>
      </div>
    </div>
  );
}

