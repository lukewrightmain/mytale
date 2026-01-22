"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Settings Panel
// Configure project settings, file paths, and export options
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useEditor } from '@/lib/ui-builder/EditorContext';
import { BACKGROUND_PRESETS } from '@/lib/ui-builder/defaults';
import { X, Info, FolderOpen, Package, Code2, FileCode, AlertCircle } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

// ─── Input Field Component ───
function SettingInput({ 
  label, 
  value, 
  onChange, 
  placeholder,
  description,
  icon: Icon,
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        {Icon && <Icon className="w-4 h-4 text-primary-400" />}
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 bg-stone-800 border border-stone-600 rounded text-sm text-foreground focus:border-primary-500 focus:outline-none"
      />
      {description && (
        <p className="text-xs text-foreground-subtle">{description}</p>
      )}
    </div>
  );
}

// ─── Number Input ───
function NumberInput({ 
  label, 
  value, 
  onChange, 
  min,
  max,
  description,
}: { 
  label: string; 
  value: number; 
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
        min={min}
        max={max}
        className="w-full px-3 py-2 bg-stone-800 border border-stone-600 rounded text-sm text-foreground focus:border-primary-500 focus:outline-none"
      />
      {description && (
        <p className="text-xs text-foreground-subtle">{description}</p>
      )}
    </div>
  );
}

// ─── Select Field ───
function SelectInput({ 
  label, 
  value, 
  onChange, 
  options,
  description,
}: { 
  label: string; 
  value: string; 
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-stone-800 border border-stone-600 rounded text-sm text-foreground focus:border-primary-500 focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {description && (
        <p className="text-xs text-foreground-subtle">{description}</p>
      )}
    </div>
  );
}

// ─── Color Preset Picker ───
function BackgroundPicker({ 
  value, 
  onChange 
}: { 
  value: string; 
  onChange: (color: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Page Background</label>
      <div className="flex flex-wrap gap-2">
        {BACKGROUND_PRESETS.map((preset) => (
          <button
            key={preset.name}
            onClick={() => onChange(preset.color)}
            className={`
              w-8 h-8 rounded border-2 transition-all
              ${value === preset.color ? 'border-primary-500 scale-110' : 'border-stone-600 hover:border-stone-400'}
              ${preset.color === 'transparent' ? 'bg-[repeating-conic-gradient(#2a2a2a_0%_25%,#1a1a1a_0%_50%)] bg-[length:10px_10px]' : ''}
            `}
            style={{ backgroundColor: preset.color !== 'transparent' ? preset.color : undefined }}
            title={preset.name}
          />
        ))}
        <input
          type="color"
          value={value.startsWith('#') ? value : '#2a2a2a'}
          onChange={(e) => onChange(e.target.value)}
          className="w-8 h-8 rounded border border-stone-600 cursor-pointer"
          title="Custom color"
        />
      </div>
    </div>
  );
}

// ─── Info Box ───
function InfoBox({ 
  title, 
  children,
  variant = 'info',
}: { 
  title: string; 
  children: React.ReactNode;
  variant?: 'info' | 'warning';
}) {
  return (
    <div className={`p-3 rounded-lg border ${
      variant === 'warning' 
        ? 'bg-amber-500/10 border-amber-500/30' 
        : 'bg-primary-500/10 border-primary-500/30'
    }`}>
      <div className="flex items-start gap-2">
        {variant === 'warning' ? (
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        ) : (
          <Info className="w-4 h-4 text-primary-400 flex-shrink-0 mt-0.5" />
        )}
        <div>
          <div className={`text-sm font-medium ${
            variant === 'warning' ? 'text-amber-200' : 'text-primary-200'
          }`}>
            {title}
          </div>
          <div className="text-xs text-foreground-muted mt-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Settings Panel ───
export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { state, updateSettings, updateElement } = useEditor();
  const { settings } = state.design;
  const [activeTab, setActiveTab] = useState<'project' | 'export' | 'help'>('project');

  if (!isOpen) return null;

  const handleBackgroundChange = (color: string) => {
    updateElement(state.design.root.id, {
      background: { color },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-surface border border-border rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface-elevated">
          <h2 className="text-lg font-bold text-foreground">Project Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded hover:bg-stone-700 transition-colors"
          >
            <X className="w-5 h-5 text-foreground-muted" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border">
          {[
            { id: 'project', label: 'Project', icon: FolderOpen },
            { id: 'export', label: 'Export', icon: FileCode },
            { id: 'help', label: 'Help', icon: Info },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                activeTab === id 
                  ? 'bg-primary-500/10 text-primary-400 border-b-2 border-primary-500' 
                  : 'text-foreground-muted hover:bg-stone-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {activeTab === 'project' && (
            <>
              {/* Canvas Size */}
              <div className="grid grid-cols-2 gap-4">
                <NumberInput
                  label="Canvas Width"
                  value={settings.canvasWidth}
                  onChange={(value) => updateSettings({ canvasWidth: value })}
                  min={100}
                  max={2000}
                />
                <NumberInput
                  label="Canvas Height"
                  value={settings.canvasHeight}
                  onChange={(value) => updateSettings({ canvasHeight: value })}
                  min={100}
                  max={2000}
                />
              </div>

              {/* Background */}
              <BackgroundPicker 
                value={state.design.root.properties.background?.color || '#2a2a2a'}
                onChange={handleBackgroundChange}
              />

              {/* Page Type */}
              <SelectInput
                label="Page Type"
                value={settings.pageType}
                onChange={(value) => updateSettings({ pageType: value as typeof settings.pageType })}
                options={[
                  { value: 'CustomUIPage', label: 'CustomUIPage (Standard Page)' },
                  { value: 'InteractiveCustomUIPage', label: 'InteractiveCustomUIPage (With Events)' },
                  { value: 'CustomUIHud', label: 'CustomUIHud (Always Visible)' },
                ]}
                description="Determines the Java class your page extends"
              />

              {/* Page Lifetime */}
              <SelectInput
                label="Page Lifetime"
                value={settings.pageLifetime}
                onChange={(value) => updateSettings({ pageLifetime: value as typeof settings.pageLifetime })}
                options={[
                  { value: 'Closeable', label: 'Closeable (Player can close)' },
                  { value: 'CanDismiss', label: 'CanDismiss (Closes on Escape)' },
                  { value: 'RequiresFocus', label: 'RequiresFocus (Must stay open)' },
                  { value: 'Persistent', label: 'Persistent (HUD-style, always visible)' },
                ]}
                description="Controls how the page can be dismissed"
              />
            </>
          )}

          {activeTab === 'export' && (
            <>
              <SettingInput
                label="Package Name"
                value={settings.packageName}
                onChange={(value) => updateSettings({ packageName: value })}
                placeholder="com.example.mod"
                description="Java package for generated code"
                icon={Package}
              />

              <SettingInput
                label="Class Name"
                value={settings.className}
                onChange={(value) => updateSettings({ className: value })}
                placeholder="MyCustomPage"
                description="Name of the generated Java class"
                icon={Code2}
              />

              <SettingInput
                label="UI File Path"
                value={settings.uiFilePath}
                onChange={(value) => updateSettings({ uiFilePath: value })}
                placeholder="Pages/MyPage.ui"
                description="Path where the .ui file will be saved"
                icon={FileCode}
              />

              <SettingInput
                label="Common.ui Path"
                value={settings.commonUiPath}
                onChange={(value) => updateSettings({ commonUiPath: value })}
                placeholder="../Common.ui"
                description="Relative path to Common.ui from your .ui file"
                icon={FolderOpen}
              />

              <InfoBox title="File Structure" variant="info">
                Your mod should include these files:
                <pre className="mt-2 p-2 bg-stone-900 rounded text-[11px] font-mono overflow-x-auto">
{`MyMod/
├── manifest.json
└── UI/
    └── Pages/
        └── ${settings.uiFilePath.split('/').pop() || 'MyPage.ui'}`}
                </pre>
              </InfoBox>

              <InfoBox title="manifest.json Required Field" variant="warning">
                You must add <code className="bg-stone-800 px-1 rounded">IncludesAssetPack: true</code> to your 
                manifest.json for the UI files to be loaded!
              </InfoBox>
            </>
          )}

          {activeTab === 'help' && (
            <>
              <InfoBox title="Getting Started" variant="info">
                <ol className="list-decimal list-inside space-y-1 mt-1">
                  <li>Choose a template from the left panel, or drag primitives to build from scratch</li>
                  <li>Click on elements to select them, then edit properties in the right panel</li>
                  <li>Drag elements on the canvas to reposition, use corners to resize</li>
                  <li>Use the code tabs below to copy the generated .ui and Java code</li>
                  <li>Export and add the files to your Hytale mod folder</li>
                </ol>
              </InfoBox>

              <InfoBox title="Keyboard Shortcuts" variant="info">
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <div><code className="bg-stone-800 px-1 rounded text-[11px]">Ctrl+Z</code> Undo</div>
                  <div><code className="bg-stone-800 px-1 rounded text-[11px]">Ctrl+Y</code> Redo</div>
                  <div><code className="bg-stone-800 px-1 rounded text-[11px]">Ctrl+C</code> Copy</div>
                  <div><code className="bg-stone-800 px-1 rounded text-[11px]">Ctrl+V</code> Paste</div>
                  <div><code className="bg-stone-800 px-1 rounded text-[11px]">Ctrl+D</code> Duplicate</div>
                  <div><code className="bg-stone-800 px-1 rounded text-[11px]">Delete</code> Remove</div>
                </div>
              </InfoBox>

              <InfoBox title="Asset Paths" variant="info">
                <p>For images (AssetImage), use paths relative to your mod&apos;s asset pack:</p>
                <pre className="mt-1 p-2 bg-stone-900 rounded text-[11px] font-mono">
                  Textures/MyMod/icon.png
                </pre>
                <p className="mt-1">Make sure your images are in PNG format and included in your asset pack.</p>
              </InfoBox>

              <InfoBox title="Item Icons" variant="info">
                <p>ItemIcon elements display in-game items. Set the ItemId in Java:</p>
                <pre className="mt-1 p-2 bg-stone-900 rounded text-[11px] font-mono">
{`uiCommandBuilder.update()
  .ofElement("MyIcon")
  .setItemId(item);`}
                </pre>
              </InfoBox>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-4 py-3 border-t border-border bg-surface-elevated">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

