"use client";

// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Editor Context
// React Context for managing editor state with undo/redo support
// ═══════════════════════════════════════════════════════════════════════════

import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import type {
  UIElement,
  UIDesign,
  EditorState,
  ElementType,
  ElementProperties,
  UITemplate,
} from './types';
import {
  createNewDesign,
  createDefaultEditorState,
  createElementFromPalette,
  createElementFromTemplate,
  getPaletteItem,
  canHaveChildren,
  generateId,
} from './defaults';

// ─── Action Types ───
type EditorAction =
  | { type: 'SET_DESIGN'; payload: UIDesign }
  | { type: 'SELECT_ELEMENT'; payload: string | null }
  | { type: 'ADD_ELEMENT'; payload: { parentId: string; elementType: ElementType } }
  | { type: 'ADD_TEMPLATE_ELEMENT'; payload: { parentId: string; template: UITemplate } }
  | { type: 'DELETE_ELEMENT'; payload: string }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; properties: Partial<ElementProperties> } }
  | { type: 'UPDATE_ELEMENT_NAME'; payload: { id: string; name: string } }
  | { type: 'MOVE_ELEMENT'; payload: { elementId: string; targetParentId: string; index?: number } }
  | { type: 'DUPLICATE_ELEMENT'; payload: string }
  | { type: 'COPY_ELEMENT'; payload: string }
  | { type: 'PASTE_ELEMENT'; payload: string }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'SET_CODE_TAB'; payload: 'ui' | 'java' | 'hyuiml' }
  | { type: 'TOGGLE_GRID' }
  | { type: 'TOGGLE_COLLAPSE'; payload: string }
  | { type: 'NEW_DESIGN' }
  | { type: 'APPLY_TEMPLATE'; payload: UITemplate }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<UIDesign['settings']> };

// ─── History Management ───
const MAX_HISTORY = 50;

function pushToHistory(state: EditorState): EditorState {
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(JSON.parse(JSON.stringify(state.design)));
  
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
  }
  
  return {
    ...state,
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

// ─── Tree Traversal Helpers ───
function findElement(root: UIElement, id: string): UIElement | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findElement(child, id);
    if (found) return found;
  }
  return null;
}

function findParent(root: UIElement, id: string): UIElement | null {
  for (const child of root.children) {
    if (child.id === id) return root;
    const found = findParent(child, id);
    if (found) return found;
  }
  return null;
}

function updateElementInTree(
  root: UIElement,
  id: string,
  updater: (el: UIElement) => UIElement
): UIElement {
  if (root.id === id) {
    return updater(root);
  }
  return {
    ...root,
    children: root.children.map(child => updateElementInTree(child, id, updater)),
  };
}

function removeElementFromTree(root: UIElement, id: string): UIElement {
  return {
    ...root,
    children: root.children
      .filter(child => child.id !== id)
      .map(child => removeElementFromTree(child, id)),
  };
}

function addElementToParent(
  root: UIElement,
  parentId: string,
  newElement: UIElement,
  index?: number
): UIElement {
  if (root.id === parentId) {
    const children = [...root.children];
    if (index !== undefined && index >= 0 && index <= children.length) {
      children.splice(index, 0, newElement);
    } else {
      children.push(newElement);
    }
    return { ...root, children };
  }
  return {
    ...root,
    children: root.children.map(child => addElementToParent(child, parentId, newElement, index)),
  };
}

function cloneElement(element: UIElement): UIElement {
  return {
    ...element,
    id: generateId(),
    children: element.children.map(cloneElement),
  };
}

// ─── Reducer ───
function editorReducer(state: EditorState, action: EditorAction): EditorState {
  switch (action.type) {
    case 'SET_DESIGN': {
      return pushToHistory({
        ...state,
        design: action.payload,
        selectedElementId: null,
      });
    }

    case 'SELECT_ELEMENT': {
      return {
        ...state,
        selectedElementId: action.payload,
      };
    }

    case 'ADD_ELEMENT': {
      const paletteItem = getPaletteItem(action.payload.elementType);
      if (!paletteItem) return state;

      const parent = findElement(state.design.root, action.payload.parentId);
      if (!parent || !canHaveChildren(parent.type)) return state;

      const newElement = createElementFromPalette(paletteItem);
      const newRoot = addElementToParent(state.design.root, action.payload.parentId, newElement);
      
      const newDesign: UIDesign = {
        ...state.design,
        root: newRoot,
        updatedAt: new Date().toISOString(),
      };

      return pushToHistory({
        ...state,
        design: newDesign,
        selectedElementId: newElement.id,
      });
    }

    case 'ADD_TEMPLATE_ELEMENT': {
      const { parentId, template } = action.payload;
      
      const parent = findElement(state.design.root, parentId);
      if (!parent || !canHaveChildren(parent.type)) return state;

      const newElement = createElementFromTemplate(template);
      const newRoot = addElementToParent(state.design.root, parentId, newElement);
      
      const newDesign: UIDesign = {
        ...state.design,
        root: newRoot,
        updatedAt: new Date().toISOString(),
      };

      return pushToHistory({
        ...state,
        design: newDesign,
        selectedElementId: newElement.id,
      });
    }

    case 'DELETE_ELEMENT': {
      if (action.payload === state.design.root.id) return state; // Can't delete root
      
      const newRoot = removeElementFromTree(state.design.root, action.payload);
      const newDesign: UIDesign = {
        ...state.design,
        root: newRoot,
        updatedAt: new Date().toISOString(),
      };

      return pushToHistory({
        ...state,
        design: newDesign,
        selectedElementId: state.selectedElementId === action.payload ? null : state.selectedElementId,
      });
    }

    case 'UPDATE_ELEMENT': {
      const newRoot = updateElementInTree(state.design.root, action.payload.id, (el) => ({
        ...el,
        properties: deepMerge(el.properties, action.payload.properties),
      }));

      const newDesign: UIDesign = {
        ...state.design,
        root: newRoot,
        updatedAt: new Date().toISOString(),
      };

      return pushToHistory({
        ...state,
        design: newDesign,
      });
    }

    case 'UPDATE_ELEMENT_NAME': {
      const newRoot = updateElementInTree(state.design.root, action.payload.id, (el) => ({
        ...el,
        name: action.payload.name,
      }));

      const newDesign: UIDesign = {
        ...state.design,
        root: newRoot,
        updatedAt: new Date().toISOString(),
      };

      return pushToHistory({
        ...state,
        design: newDesign,
      });
    }

    case 'MOVE_ELEMENT': {
      const { elementId, targetParentId, index } = action.payload;
      
      // Can't move root
      if (elementId === state.design.root.id) return state;
      
      // Can't move to self or descendant
      const element = findElement(state.design.root, elementId);
      if (!element) return state;
      
      const targetParent = findElement(state.design.root, targetParentId);
      if (!targetParent || !canHaveChildren(targetParent.type)) return state;

      // Check if target is descendant of element
      if (findElement(element, targetParentId)) return state;

      // Clone element, remove from old position, add to new
      const cloned = cloneElement(element);
      cloned.id = element.id; // Keep same ID
      cloned.children = element.children;
      
      let newRoot = removeElementFromTree(state.design.root, elementId);
      newRoot = addElementToParent(newRoot, targetParentId, cloned, index);

      const newDesign: UIDesign = {
        ...state.design,
        root: newRoot,
        updatedAt: new Date().toISOString(),
      };

      return pushToHistory({
        ...state,
        design: newDesign,
      });
    }

    case 'DUPLICATE_ELEMENT': {
      const element = findElement(state.design.root, action.payload);
      if (!element || action.payload === state.design.root.id) return state;

      const parent = findParent(state.design.root, action.payload);
      if (!parent) return state;

      const cloned = cloneElement(element);
      cloned.name = `${element.name || element.type} Copy`;

      const newRoot = addElementToParent(state.design.root, parent.id, cloned);
      
      const newDesign: UIDesign = {
        ...state.design,
        root: newRoot,
        updatedAt: new Date().toISOString(),
      };

      return pushToHistory({
        ...state,
        design: newDesign,
        selectedElementId: cloned.id,
      });
    }

    case 'COPY_ELEMENT': {
      const element = findElement(state.design.root, action.payload);
      if (!element) return state;
      return {
        ...state,
        clipboard: cloneElement(element),
      };
    }

    case 'PASTE_ELEMENT': {
      if (!state.clipboard) return state;
      
      const targetParent = findElement(state.design.root, action.payload);
      if (!targetParent || !canHaveChildren(targetParent.type)) return state;

      const cloned = cloneElement(state.clipboard);
      const newRoot = addElementToParent(state.design.root, action.payload, cloned);

      const newDesign: UIDesign = {
        ...state.design,
        root: newRoot,
        updatedAt: new Date().toISOString(),
      };

      return pushToHistory({
        ...state,
        design: newDesign,
        selectedElementId: cloned.id,
      });
    }

    case 'UNDO': {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      return {
        ...state,
        design: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
      };
    }

    case 'REDO': {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      return {
        ...state,
        design: JSON.parse(JSON.stringify(state.history[newIndex])),
        historyIndex: newIndex,
      };
    }

    case 'SET_ZOOM': {
      return {
        ...state,
        zoom: Math.max(0.25, Math.min(2, action.payload)),
      };
    }

    case 'SET_CODE_TAB': {
      return {
        ...state,
        activeCodeTab: action.payload,
      };
    }

    case 'TOGGLE_GRID': {
      return {
        ...state,
        showGrid: !state.showGrid,
      };
    }

    case 'TOGGLE_COLLAPSE': {
      const newRoot = updateElementInTree(state.design.root, action.payload, (el) => ({
        ...el,
        _collapsed: !el._collapsed,
      }));

      return {
        ...state,
        design: {
          ...state.design,
          root: newRoot,
        },
      };
    }

    case 'NEW_DESIGN': {
      const newDesign = createNewDesign();
      return {
        ...createDefaultEditorState(),
        design: newDesign,
        history: [newDesign],
        historyIndex: 0,
      };
    }

    case 'APPLY_TEMPLATE': {
      const template = action.payload;
      const templateRoot = createElementFromTemplate(template);
      
      // Create a new design based on the template
      const newDesign: UIDesign = {
        ...state.design,
        root: templateRoot,
        settings: {
          ...state.design.settings,
          ...template.settings,
        },
        updatedAt: new Date().toISOString(),
      };

      return pushToHistory({
        ...state,
        design: newDesign,
        selectedElementId: templateRoot.id,
      });
    }

    case 'UPDATE_SETTINGS': {
      const newDesign: UIDesign = {
        ...state.design,
        settings: {
          ...state.design.settings,
          ...action.payload,
        },
        updatedAt: new Date().toISOString(),
      };

      return pushToHistory({
        ...state,
        design: newDesign,
      });
    }

    default:
      return state;
  }
}

// ─── Deep Merge Helper ───
function deepMerge<T extends object>(target: T, source: Partial<T>): T {
  const result = { ...target } as Record<string, unknown>;
  
  for (const key in source) {
    const sourceValue = source[key as keyof typeof source];
    const targetValue = target[key as keyof T];
    
    if (
      sourceValue !== null &&
      sourceValue !== undefined &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      targetValue !== undefined &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(
        targetValue as object,
        sourceValue as object
      );
    } else if (sourceValue !== undefined) {
      result[key] = sourceValue as unknown;
    }
  }
  
  return result as T;
}

// ─── Context Type ───
interface EditorContextType {
  state: EditorState;
  // Selection
  selectElement: (id: string | null) => void;
  getSelectedElement: () => UIElement | null;
  // Element Operations
  addElement: (parentId: string, elementType: ElementType) => void;
  addTemplateElement: (parentId: string, template: UITemplate) => void;
  deleteElement: (id: string) => void;
  updateElement: (id: string, properties: Partial<ElementProperties>) => void;
  updateElementName: (id: string, name: string) => void;
  moveElement: (elementId: string, targetParentId: string, index?: number) => void;
  duplicateElement: (id: string) => void;
  copyElement: (id: string) => void;
  pasteElement: (parentId: string) => void;
  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  // View
  setZoom: (zoom: number) => void;
  setCodeTab: (tab: 'ui' | 'java' | 'hyuiml') => void;
  toggleGrid: () => void;
  toggleCollapse: (id: string) => void;
  // Design
  newDesign: () => void;
  loadDesign: (design: UIDesign) => void;
  applyTemplate: (template: UITemplate) => void;
  updateSettings: (settings: Partial<UIDesign['settings']>) => void;
  // Utilities
  findElement: (id: string) => UIElement | null;
  findParent: (id: string) => UIElement | null;
}

const EditorContext = createContext<EditorContextType | null>(null);

// ─── Provider ───
export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(editorReducer, undefined, createDefaultEditorState);

  const selectElement = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: id });
  }, []);

  const getSelectedElement = useCallback(() => {
    if (!state.selectedElementId) return null;
    return findElement(state.design.root, state.selectedElementId);
  }, [state.selectedElementId, state.design.root]);

  const addElement = useCallback((parentId: string, elementType: ElementType) => {
    dispatch({ type: 'ADD_ELEMENT', payload: { parentId, elementType } });
  }, []);

  const addTemplateElement = useCallback((parentId: string, template: UITemplate) => {
    dispatch({ type: 'ADD_TEMPLATE_ELEMENT', payload: { parentId, template } });
  }, []);

  const deleteElement = useCallback((id: string) => {
    dispatch({ type: 'DELETE_ELEMENT', payload: id });
  }, []);

  const updateElement = useCallback((id: string, properties: Partial<ElementProperties>) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, properties } });
  }, []);

  const updateElementName = useCallback((id: string, name: string) => {
    dispatch({ type: 'UPDATE_ELEMENT_NAME', payload: { id, name } });
  }, []);

  const moveElement = useCallback((elementId: string, targetParentId: string, index?: number) => {
    dispatch({ type: 'MOVE_ELEMENT', payload: { elementId, targetParentId, index } });
  }, []);

  const duplicateElement = useCallback((id: string) => {
    dispatch({ type: 'DUPLICATE_ELEMENT', payload: id });
  }, []);

  const copyElement = useCallback((id: string) => {
    dispatch({ type: 'COPY_ELEMENT', payload: id });
  }, []);

  const pasteElement = useCallback((parentId: string) => {
    dispatch({ type: 'PASTE_ELEMENT', payload: parentId });
  }, []);

  const undo = useCallback(() => {
    dispatch({ type: 'UNDO' });
  }, []);

  const redo = useCallback(() => {
    dispatch({ type: 'REDO' });
  }, []);

  const setZoom = useCallback((zoom: number) => {
    dispatch({ type: 'SET_ZOOM', payload: zoom });
  }, []);

  const setCodeTab = useCallback((tab: 'ui' | 'java' | 'hyuiml') => {
    dispatch({ type: 'SET_CODE_TAB', payload: tab });
  }, []);

  const toggleGrid = useCallback(() => {
    dispatch({ type: 'TOGGLE_GRID' });
  }, []);

  const toggleCollapse = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_COLLAPSE', payload: id });
  }, []);

  const newDesign = useCallback(() => {
    dispatch({ type: 'NEW_DESIGN' });
  }, []);

  const loadDesign = useCallback((design: UIDesign) => {
    dispatch({ type: 'SET_DESIGN', payload: design });
  }, []);

  const applyTemplate = useCallback((template: UITemplate) => {
    dispatch({ type: 'APPLY_TEMPLATE', payload: template });
  }, []);

  const updateSettings = useCallback((settings: Partial<UIDesign['settings']>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: settings });
  }, []);

  const findElementById = useCallback((id: string) => {
    return findElement(state.design.root, id);
  }, [state.design.root]);

  const findParentById = useCallback((id: string) => {
    return findParent(state.design.root, id);
  }, [state.design.root]);

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  const value = useMemo<EditorContextType>(() => ({
    state,
    selectElement,
    getSelectedElement,
    addElement,
    addTemplateElement,
    deleteElement,
    updateElement,
    updateElementName,
    moveElement,
    duplicateElement,
    copyElement,
    pasteElement,
    undo,
    redo,
    canUndo,
    canRedo,
    setZoom,
    setCodeTab,
    toggleGrid,
    toggleCollapse,
    newDesign,
    loadDesign,
    applyTemplate,
    updateSettings,
    findElement: findElementById,
    findParent: findParentById,
  }), [
    state,
    selectElement,
    getSelectedElement,
    addElement,
    addTemplateElement,
    deleteElement,
    updateElement,
    updateElementName,
    moveElement,
    duplicateElement,
    copyElement,
    pasteElement,
    undo,
    redo,
    canUndo,
    canRedo,
    setZoom,
    setCodeTab,
    toggleGrid,
    toggleCollapse,
    newDesign,
    loadDesign,
    applyTemplate,
    updateSettings,
    findElementById,
    findParentById,
  ]);

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

// ─── Hook ───
export function useEditor(): EditorContextType {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
}

