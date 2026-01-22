"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Toolbar Component
// Main toolbar with file operations and undo/redo
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from 'react';
import { useEditor } from '@/lib/ui-builder/EditorContext';
import { saveDesignToLocal, loadDesignFromLocal, getLocalDesigns, deleteLocalDesign } from '@/lib/ui-builder/storage';
import { SettingsPanel } from './SettingsPanel';
import { 
  FilePlus, 
  Save, 
  FolderOpen, 
  Undo2, 
  Redo2, 
  Settings,
  Download,
  Upload,
  Trash2,
  X
} from 'lucide-react';

// ─── Load Modal ───
function LoadModal({ 
  onClose, 
  onLoad 
}: { 
  onClose: () => void; 
  onLoad: (id: string) => void;
}) {
  const [designs, setDesigns] = useState(() => getLocalDesigns());

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteLocalDesign(id);
      setDesigns(getLocalDesigns());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Load Design</h3>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-surface-elevated transition-colors"
          >
            <X className="w-5 h-5 text-foreground-muted" />
          </button>
        </div>
        
        <div className="p-4 max-h-80 overflow-y-auto">
          {designs.length === 0 ? (
            <p className="text-center text-foreground-muted py-8">
              No saved designs found.<br />
              Create a design and save it first.
            </p>
          ) : (
            <div className="space-y-2">
              {designs.map((design) => (
                <div
                  key={design.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-surface-elevated hover:bg-surface-overlay transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {design.name}
                    </p>
                    <p className="text-xs text-foreground-subtle">
                      {new Date(design.updatedAt).toLocaleDateString()} at{' '}
                      {new Date(design.updatedAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => onLoad(design.id)}
                    className="px-3 py-1.5 text-xs bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleDelete(design.id, design.name)}
                    className="p-1.5 rounded hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Toolbar ───
export function Toolbar() {
  const { 
    state, 
    newDesign, 
    loadDesign,
    undo, 
    redo, 
    canUndo, 
    canRedo 
  } = useEditor();
  
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  const handleNew = () => {
    if (confirm('Create a new design? Unsaved changes will be lost.')) {
      newDesign();
    }
  };

  const handleSave = () => {
    saveDesignToLocal(state.design);
    alert(`Design "${state.design.name}" saved!`);
  };

  const handleLoad = (id: string) => {
    const design = loadDesignFromLocal(id);
    if (design) {
      loadDesign(design);
      setShowLoadModal(false);
    }
  };

  const handleExport = () => {
    const json = JSON.stringify(state.design, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.design.name || 'design'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        try {
          const text = await file.text();
          const design = JSON.parse(text);
          loadDesign(design);
        } catch {
          alert('Failed to import design. Invalid file format.');
        }
      }
    };
    input.click();
  };

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 bg-surface border-b border-border">
        {/* Left: Logo & File Operations */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src="/favicon-32x32.png" 
              alt="Mytale" 
              className="w-8 h-8 rounded-lg"
            />
            <span className="font-display text-lg text-foreground">UI Builder</span>
          </div>
          
          <div className="h-6 w-px bg-border" />
          
          <div className="flex items-center gap-1">
            <button
              onClick={handleNew}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded transition-colors"
              title="New Design"
            >
              <FilePlus className="w-4 h-4" />
              New
            </button>
            
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded transition-colors"
              title="Save Design"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            
            <button
              onClick={() => setShowLoadModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded transition-colors"
              title="Load Design"
            >
              <FolderOpen className="w-4 h-4" />
              Load
            </button>
            
            <div className="h-4 w-px bg-border mx-1" />
            
            <button
              onClick={handleImport}
              className="p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded transition-colors"
              title="Import JSON"
            >
              <Upload className="w-4 h-4" />
            </button>
            
            <button
              onClick={handleExport}
              className="p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded transition-colors"
              title="Export JSON"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Design Name */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={state.design.name}
            onChange={(e) => {
              // This would need to be added to the context
            }}
            className="px-2 py-1 bg-transparent border-none text-center text-foreground font-medium focus:outline-none focus:ring-1 focus:ring-primary-500 rounded"
            placeholder="Untitled Design"
          />
        </div>

        {/* Right: Undo/Redo & Settings */}
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${
              canUndo 
                ? 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated' 
                : 'text-foreground-subtle cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${
              canRedo 
                ? 'text-foreground-muted hover:text-foreground hover:bg-surface-elevated' 
                : 'text-foreground-subtle cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          
          <div className="h-4 w-px bg-border mx-1" />
          
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-1.5 text-foreground-muted hover:text-foreground hover:bg-surface-elevated rounded transition-colors"
            title="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {showLoadModal && (
        <LoadModal 
          onClose={() => setShowLoadModal(false)} 
          onLoad={handleLoad}
        />
      )}
      
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={showSettingsModal} 
        onClose={() => setShowSettingsModal(false)} 
      />
    </>
  );
}

