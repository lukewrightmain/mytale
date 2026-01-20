"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Main Client Component
// 4-panel layout with all builder components
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useLayoutEffect } from 'react';
import { EditorProvider, useEditor } from '@/lib/ui-builder/EditorContext';
import { Palette, Canvas, HierarchyTree, PropertiesPanel, CodeOutput, Toolbar } from '@/components/ui-builder';

// ─── Full Screen Effect - Hides header/footer and removes padding ───
function FullScreenEffect() {
  useLayoutEffect(() => {
    // Hide header and footer for full-screen editor experience
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const main = document.querySelector('main');
    
    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
    if (main) {
      main.style.paddingTop = '0';
      main.style.flex = '1';
    }
    
    // Prevent scrolling on body
    document.body.style.overflow = 'hidden';
    
    return () => {
      // Restore on unmount
      if (header) header.style.display = '';
      if (footer) footer.style.display = '';
      if (main) {
        main.style.paddingTop = '';
        main.style.flex = '';
      }
      document.body.style.overflow = '';
    };
  }, []);
  
  return null;
}

// ─── Keyboard Shortcuts Handler ───
function KeyboardHandler() {
  const { undo, redo, deleteElement, copyElement, pasteElement, duplicateElement, state } = useEditor();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const isMod = e.ctrlKey || e.metaKey;

      if (isMod && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if ((isMod && e.key === 'y') || (isMod && e.shiftKey && e.key === 'z')) {
        e.preventDefault();
        redo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (state.selectedElementId && state.selectedElementId !== state.design.root.id) {
          e.preventDefault();
          deleteElement(state.selectedElementId);
        }
      } else if (isMod && e.key === 'c') {
        if (state.selectedElementId) {
          e.preventDefault();
          copyElement(state.selectedElementId);
        }
      } else if (isMod && e.key === 'v') {
        if (state.clipboard && state.selectedElementId) {
          e.preventDefault();
          pasteElement(state.selectedElementId);
        } else if (state.clipboard) {
          e.preventDefault();
          pasteElement(state.design.root.id);
        }
      } else if (isMod && e.key === 'd') {
        if (state.selectedElementId && state.selectedElementId !== state.design.root.id) {
          e.preventDefault();
          duplicateElement(state.selectedElementId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteElement, copyElement, pasteElement, duplicateElement, state]);

  return null;
}

// ─── Main Layout ───
function BuilderLayout() {
  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Top Toolbar */}
      <Toolbar />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Palette */}
        <div className="w-48 flex-shrink-0">
          <Palette />
        </div>

        {/* Center: Canvas + Bottom Panels */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Canvas Area (takes 60% height) */}
          <div className="flex-[3] min-h-0">
            <Canvas />
          </div>

          {/* Bottom Panels */}
          <div className="flex-[2] min-h-0 flex">
            {/* Hierarchy Tree (left half) */}
            <div className="w-1/2 min-w-0">
              <HierarchyTree />
            </div>

            {/* Code Output (right half) */}
            <div className="w-1/2 min-w-0">
              <CodeOutput />
            </div>
          </div>
        </div>

        {/* Right Panel: Properties */}
        <div className="w-64 flex-shrink-0">
          <PropertiesPanel />
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <KeyboardHandler />
    </div>
  );
}

// ─── Exported Client Component ───
export function UIBuilderClient() {
  return (
    <EditorProvider>
      <FullScreenEffect />
      <BuilderLayout />
    </EditorProvider>
  );
}

