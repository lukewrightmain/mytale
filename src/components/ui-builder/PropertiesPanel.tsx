"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Properties Panel Component
// Dynamic property editor for the selected element
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react';
import { useEditor } from '@/lib/ui-builder/EditorContext';
import type { UIElement, LayoutMode, Anchor, Padding, TextStyle } from '@/lib/ui-builder/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

// ─── Property Section ───
function PropertySection({ 
  title, 
  children, 
  defaultOpen = true 
}: { 
  title: string; 
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-foreground-subtle hover:bg-surface-elevated transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-3 h-3" />
        ) : (
          <ChevronRight className="w-3 h-3" />
        )}
        {title}
      </button>
      {isOpen && (
        <div className="px-4 pb-3 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Property Row ───
function PropertyRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <label className="flex-shrink-0 w-20 text-xs text-foreground-muted truncate">
        {label}
      </label>
      <div className="flex-1 min-w-0">
        {children}
      </div>
    </div>
  );
}

// ─── Input Components ───
function TextInput({ 
  value, 
  onChange, 
  placeholder 
}: { 
  value: string; 
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-2 py-1 text-xs bg-surface-elevated border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-foreground"
    />
  );
}

function NumberInput({ 
  value, 
  onChange, 
  min, 
  max,
  placeholder,
}: { 
  value: number | undefined; 
  onChange: (value: number | undefined) => void;
  min?: number;
  max?: number;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={value ?? ''}
      onChange={(e) => {
        const v = e.target.value;
        onChange(v === '' ? undefined : Number(v));
      }}
      min={min}
      max={max}
      placeholder={placeholder}
      className="w-full px-2 py-1 text-xs bg-surface-elevated border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-foreground"
    />
  );
}

function ColorInput({ 
  value, 
  onChange 
}: { 
  value: string | undefined; 
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="w-6 h-6 rounded cursor-pointer border border-border"
      />
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="flex-1 px-2 py-1 text-xs bg-surface-elevated border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-foreground font-mono"
      />
    </div>
  );
}

function SelectInput({ 
  value, 
  onChange, 
  options 
}: { 
  value: string | undefined; 
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-2 py-1 text-xs bg-surface-elevated border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary-500 text-foreground cursor-pointer"
    >
      <option value="">Select...</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function CheckboxInput({ 
  value, 
  onChange,
  label,
}: { 
  value: boolean | undefined; 
  onChange: (value: boolean) => void;
  label?: string;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={value ?? false}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-border text-primary-500 focus:ring-primary-500 cursor-pointer"
      />
      {label && <span className="text-xs text-foreground-muted">{label}</span>}
    </label>
  );
}

// ─── Anchor Editor ───
function AnchorEditor({ 
  anchor, 
  onChange 
}: { 
  anchor: Anchor | undefined; 
  onChange: (anchor: Anchor) => void;
}) {
  const update = (key: keyof Anchor, value: number | undefined) => {
    onChange({ ...anchor, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">
        <label className="text-[10px] text-foreground-subtle">Width</label>
        <NumberInput value={anchor?.width} onChange={(v) => update('width', v)} placeholder="px" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-foreground-subtle">Height</label>
        <NumberInput value={anchor?.height} onChange={(v) => update('height', v)} placeholder="px" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-foreground-subtle">Left</label>
        <NumberInput value={anchor?.left} onChange={(v) => update('left', v)} placeholder="px" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-foreground-subtle">Right</label>
        <NumberInput value={anchor?.right} onChange={(v) => update('right', v)} placeholder="px" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-foreground-subtle">Top</label>
        <NumberInput value={anchor?.top} onChange={(v) => update('top', v)} placeholder="px" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-foreground-subtle">Bottom</label>
        <NumberInput value={anchor?.bottom} onChange={(v) => update('bottom', v)} placeholder="px" />
      </div>
    </div>
  );
}

// ─── Padding Editor ───
function PaddingEditor({ 
  padding, 
  onChange 
}: { 
  padding: Padding | undefined; 
  onChange: (padding: Padding) => void;
}) {
  const update = (key: keyof Padding, value: number | undefined) => {
    onChange({ ...padding, [key]: value });
  };

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="space-y-1">
        <label className="text-[10px] text-foreground-subtle">Top</label>
        <NumberInput value={padding?.top} onChange={(v) => update('top', v)} placeholder="px" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-foreground-subtle">Right</label>
        <NumberInput value={padding?.right} onChange={(v) => update('right', v)} placeholder="px" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-foreground-subtle">Bottom</label>
        <NumberInput value={padding?.bottom} onChange={(v) => update('bottom', v)} placeholder="px" />
      </div>
      <div className="space-y-1">
        <label className="text-[10px] text-foreground-subtle">Left</label>
        <NumberInput value={padding?.left} onChange={(v) => update('left', v)} placeholder="px" />
      </div>
      <div className="col-span-2 space-y-1">
        <label className="text-[10px] text-foreground-subtle">All</label>
        <NumberInput value={padding?.all} onChange={(v) => update('all', v)} placeholder="px" />
      </div>
    </div>
  );
}

// ─── Layout Mode Options ───
const LAYOUT_MODE_OPTIONS = [
  { value: 'None', label: 'None' },
  { value: 'Top', label: 'Top' },
  { value: 'Middle', label: 'Middle' },
  { value: 'Bottom', label: 'Bottom' },
  { value: 'MiddleCenter', label: 'Middle Center' },
  { value: 'TopLeft', label: 'Top Left' },
  { value: 'TopRight', label: 'Top Right' },
  { value: 'BottomLeft', label: 'Bottom Left' },
  { value: 'BottomRight', label: 'Bottom Right' },
];

const ALIGNMENT_OPTIONS = [
  { value: 'Left', label: 'Left' },
  { value: 'Center', label: 'Center' },
  { value: 'Right', label: 'Right' },
];

// ─── Main Properties Panel ───
export function PropertiesPanel() {
  const { state, getSelectedElement, updateElement, updateElementName } = useEditor();
  const [element, setElement] = useState<UIElement | null>(null);
  const [localName, setLocalName] = useState('');

  // Update local state when selection changes
  useEffect(() => {
    const selected = getSelectedElement();
    setElement(selected);
    setLocalName(selected?.name || '');
  }, [state.selectedElementId, getSelectedElement]);

  // Debounced property update
  const handlePropertyChange = useCallback((path: string, value: unknown) => {
    if (!element) return;

    // Build nested property object from path like "style.textColor"
    const parts = path.split('.');
    let updates: Record<string, unknown> = {};
    let current = updates;
    
    for (let i = 0; i < parts.length - 1; i++) {
      current[parts[i]] = {};
      current = current[parts[i]] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;

    updateElement(element.id, updates);
  }, [element, updateElement]);

  const handleNameChange = useCallback((name: string) => {
    setLocalName(name);
    if (element) {
      updateElementName(element.id, name);
    }
  }, [element, updateElementName]);

  if (!element) {
    return (
      <div className="flex flex-col h-full bg-surface border-l border-border">
        <div className="flex-shrink-0 px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Properties</h2>
        </div>
        <div className="flex-1 flex items-center justify-center p-4">
          <p className="text-sm text-foreground-subtle text-center">
            Select an element to edit its properties
          </p>
        </div>
      </div>
    );
  }

  const props = element.properties;

  return (
    <div className="flex flex-col h-full bg-surface border-l border-border overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-3 border-b border-border">
        <h2 className="text-sm font-semibold text-foreground">{element.type}</h2>
        <p className="text-xs text-foreground-subtle font-mono truncate">
          #{element.id.substring(0, 8)}
        </p>
      </div>

      {/* Scrollable Properties */}
      <div className="flex-1 overflow-y-auto">
        {/* Identity Section */}
        <PropertySection title="Identity">
          <PropertyRow label="ID Code">
            <TextInput 
              value={localName} 
              onChange={handleNameChange}
              placeholder={element.type}
            />
          </PropertyRow>
          <PropertyRow label="Visible">
            <CheckboxInput 
              value={props.visible !== false} 
              onChange={(v) => handlePropertyChange('visible', v)}
            />
          </PropertyRow>
          {props.macro && (
            <PropertyRow label="Macro">
              <TextInput 
                value={props.macro} 
                onChange={(v) => handlePropertyChange('macro', v)}
              />
            </PropertyRow>
          )}
        </PropertySection>

        {/* Layout Section */}
        <PropertySection title="Layout">
          <PropertyRow label="Layout Mode">
            <SelectInput
              value={props.layoutMode}
              onChange={(v) => handlePropertyChange('layoutMode', v as LayoutMode)}
              options={LAYOUT_MODE_OPTIONS}
            />
          </PropertyRow>
          <PropertyRow label="Flex Weight">
            <NumberInput
              value={props.flexWeight}
              onChange={(v) => handlePropertyChange('flexWeight', v)}
              min={0}
            />
          </PropertyRow>
          {props.scrollStyle !== undefined && (
            <PropertyRow label="Scroll Style">
              <TextInput 
                value={props.scrollStyle || ''} 
                onChange={(v) => handlePropertyChange('scrollStyle', v)}
                placeholder="$C @DefaultScrollbarStyle"
              />
            </PropertyRow>
          )}
        </PropertySection>

        {/* Anchor & Size Section */}
        <PropertySection title="Anchor & Size">
          <AnchorEditor
            anchor={props.anchor}
            onChange={(anchor) => handlePropertyChange('anchor', anchor)}
          />
        </PropertySection>

        {/* Padding Section */}
        <PropertySection title="Padding" defaultOpen={false}>
          <PaddingEditor
            padding={props.padding}
            onChange={(padding) => handlePropertyChange('padding', padding)}
          />
        </PropertySection>

        {/* Background Section */}
        <PropertySection title="Background" defaultOpen={false}>
          <PropertyRow label="Color">
            <ColorInput
              value={props.background?.color}
              onChange={(v) => handlePropertyChange('background', { ...props.background, color: v })}
            />
          </PropertyRow>
        </PropertySection>

        {/* Content Section - for Labels, Buttons, Fields */}
        {('text' in props || 'placeholder' in props) && (
          <PropertySection title="Content">
            {'text' in props && (
              <PropertyRow label="Text">
                <TextInput
                  value={(props as { text?: string }).text || ''}
                  onChange={(v) => handlePropertyChange('text', v)}
                  placeholder="Enter text..."
                />
              </PropertyRow>
            )}
            {'placeholder' in props && (
              <PropertyRow label="Placeholder">
                <TextInput
                  value={(props as { placeholder?: string }).placeholder || ''}
                  onChange={(v) => handlePropertyChange('placeholder', v)}
                  placeholder="Placeholder text..."
                />
              </PropertyRow>
            )}
            {'alignment' in props && (
              <PropertyRow label="Alignment">
                <SelectInput
                  value={(props as { alignment?: string }).alignment}
                  onChange={(v) => handlePropertyChange('alignment', v)}
                  options={ALIGNMENT_OPTIONS}
                />
              </PropertyRow>
            )}
          </PropertySection>
        )}

        {/* Style Section - for elements with text styling */}
        {'style' in props && (
          <PropertySection title="Style">
            <PropertyRow label="Text Color">
              <ColorInput
                value={(props.style as TextStyle | undefined)?.textColor}
                onChange={(v) => handlePropertyChange('style', { ...(props.style as TextStyle), textColor: v })}
              />
            </PropertyRow>
            <PropertyRow label="Font Size">
              <NumberInput
                value={(props.style as TextStyle | undefined)?.fontSize}
                onChange={(v) => handlePropertyChange('style', { ...(props.style as TextStyle), fontSize: v })}
                min={1}
                max={200}
              />
            </PropertyRow>
            <PropertyRow label="Bold">
              <CheckboxInput
                value={(props.style as TextStyle | undefined)?.renderBold}
                onChange={(v) => handlePropertyChange('style', { ...(props.style as TextStyle), renderBold: v })}
              />
            </PropertyRow>
            <PropertyRow label="Italic">
              <CheckboxInput
                value={(props.style as TextStyle | undefined)?.renderItalic}
                onChange={(v) => handlePropertyChange('style', { ...(props.style as TextStyle), renderItalic: v })}
              />
            </PropertyRow>
          </PropertySection>
        )}

        {/* Binding Section */}
        <PropertySection title="Binding" defaultOpen={false}>
          <PropertyRow label="Enabled">
            <CheckboxInput
              value={props.binding?.enabled}
              onChange={(v) => handlePropertyChange('binding', { ...props.binding, enabled: v })}
            />
          </PropertyRow>
        </PropertySection>
      </div>
    </div>
  );
}

