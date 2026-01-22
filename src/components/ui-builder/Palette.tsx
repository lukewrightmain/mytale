"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Palette Component
// Draggable component palette with templates, primitives, and macros
// Canva-like experience with visual previews
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useEditor } from '@/lib/ui-builder/EditorContext';
import { PALETTE_ITEMS, PAGE_TEMPLATES } from '@/lib/ui-builder/defaults';
import type { PaletteItem, ElementType, UITemplate } from '@/lib/ui-builder/types';
import { ChevronDown, ChevronRight, Sparkles, Box, Layers } from 'lucide-react';

// ─── Collapsible Section ───
function Section({ 
  title, 
  count, 
  icon: Icon,
  defaultOpen = true, 
  children 
}: { 
  title: string; 
  count?: number;
  icon?: React.ComponentType<{ className?: string }>;
  defaultOpen?: boolean; 
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 hover:bg-surface-elevated transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-3.5 h-3.5 text-primary-400" />}
          <span className="text-xs font-semibold text-foreground-muted uppercase tracking-wide">
            {title}
          </span>
          {count !== undefined && (
            <span className="text-[10px] text-foreground-subtle bg-surface-elevated px-1.5 py-0.5 rounded">
              {count}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-foreground-subtle" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-foreground-subtle" />
        )}
      </button>
      {isOpen && (
        <div className="px-2 pb-2">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Template Card (Canva-like) ───
function TemplateCard({ template }: { template: UITemplate }) {
  const { applyTemplate } = useEditor();
  
  const handleClick = () => {
    applyTemplate(template);
  };

  // Category colors
  const categoryColors: Record<string, string> = {
    page: 'bg-primary-500/20 border-primary-500/30',
    hud: 'bg-accent-500/20 border-accent-500/30',
    card: 'bg-green-500/20 border-green-500/30',
  };

  return (
    <button
      onClick={handleClick}
      className={`
        w-full p-3 rounded-lg border text-left transition-all duration-150
        hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]
        ${categoryColors[template.category] || 'bg-surface-elevated border-border'}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="text-2xl">{template.preview || '📄'}</div>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-foreground truncate">
            {template.name}
          </div>
          <div className="text-[11px] text-foreground-muted mt-0.5 line-clamp-2">
            {template.description}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Palette Item Component ───
function PaletteItemCard({ item }: { item: PaletteItem }) {
  const { addElement, state } = useEditor();

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: 'palette',
      elementType: item.type,
    }));
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleClick = () => {
    // Quick add to selected element or root
    const targetId = state.selectedElementId || state.design.root.id;
    addElement(targetId, item.type as ElementType);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={handleClick}
      className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-elevated cursor-grab active:cursor-grabbing transition-colors group"
      title={item.description}
    >
      <div className="w-6 h-6 flex items-center justify-center text-base bg-stone-700/50 rounded border border-stone-600/50 group-hover:border-primary-500/50 transition-colors">
        {item.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-foreground truncate">{item.label}</div>
      </div>
    </div>
  );
}

// ─── Quick Tips Panel ───
function QuickTips() {
  const tips = [
    { key: 'drag', label: 'Drag components onto the canvas or click to add' },
    { key: 'select', label: 'Click elements to select, drag to move' },
    { key: 'resize', label: 'Use corner handles to resize elements' },
    { key: 'delete', label: 'Press Delete or Backspace to remove' },
    { key: 'undo', label: 'Ctrl+Z to undo, Ctrl+Y to redo' },
  ];

  return (
    <div className="p-3 border-t border-border">
      <div className="text-[10px] text-foreground-subtle uppercase tracking-wide mb-2 flex items-center gap-1">
        <Sparkles className="w-3 h-3" /> Quick Tips
      </div>
      <ul className="space-y-1">
        {tips.map(tip => (
          <li key={tip.key} className="text-[10px] text-foreground-muted leading-relaxed">
            • {tip.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main Palette Component ───
export function Palette() {
  // Separate templates by category
  const pageTemplates = PAGE_TEMPLATES.filter(t => t.category === 'page');
  const cardTemplates = PAGE_TEMPLATES.filter(t => t.category === 'card');
  const hudTemplates = PAGE_TEMPLATES.filter(t => t.category === 'hud');
  
  // Separate primitives and macros
  const primitives = PALETTE_ITEMS.filter(item => item.category === 'primitive');
  const macros = PALETTE_ITEMS.filter(item => item.category === 'macro');

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-3 py-2 border-b border-border bg-surface-elevated">
        <h2 className="text-sm font-bold text-foreground">COMPONENTS</h2>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Templates Section */}
        <Section title="Templates" count={PAGE_TEMPLATES.length} icon={Layers} defaultOpen={true}>
          <div className="space-y-2">
            <div className="text-[10px] text-foreground-subtle uppercase tracking-wide px-1 pt-1">
              Pages
            </div>
            <div className="space-y-2">
              {pageTemplates.map(template => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
            
            {cardTemplates.length > 0 && (
              <>
                <div className="text-[10px] text-foreground-subtle uppercase tracking-wide px-1 pt-2">
                  Cards
                </div>
                <div className="space-y-2">
                  {cardTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              </>
            )}
            
            {hudTemplates.length > 0 && (
              <>
                <div className="text-[10px] text-foreground-subtle uppercase tracking-wide px-1 pt-2">
                  HUD
                </div>
                <div className="space-y-2">
                  {hudTemplates.map(template => (
                    <TemplateCard key={template.id} template={template} />
                  ))}
                </div>
              </>
            )}
          </div>
        </Section>

        {/* Primitives Section */}
        <Section title="Primitives" count={primitives.length} icon={Box} defaultOpen={false}>
          <div className="space-y-0.5">
            {primitives.map(item => (
              <PaletteItemCard key={item.type} item={item} />
            ))}
          </div>
        </Section>

        {/* Common.ui Macros Section */}
        <Section title="Common.ui Macros" count={macros.length} icon={Sparkles} defaultOpen={false}>
          <div className="space-y-0.5">
            {macros.map(item => (
              <PaletteItemCard key={item.type} item={item} />
            ))}
          </div>
          <div className="mt-2 p-2 bg-stone-800/50 rounded text-[10px] text-foreground-subtle">
            These use <code className="text-primary-400">$C.@MacroName</code> from Common.ui
          </div>
        </Section>
      </div>

      {/* Quick Tips at bottom */}
      <QuickTips />
    </div>
  );
}
