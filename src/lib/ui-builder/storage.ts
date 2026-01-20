// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Storage
// LocalStorage helpers for guest users
// ═══════════════════════════════════════════════════════════════════════════

import type { UIDesign } from './types';

const STORAGE_KEY = 'hytale-ui-builder-designs';

// ─── Design Summary (for listing) ───
export interface DesignSummary {
  id: string;
  name: string;
  updatedAt: string;
}

// ─── Get All Local Designs ───
export function getLocalDesigns(): DesignSummary[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const designs: UIDesign[] = JSON.parse(stored);
    return designs.map(d => ({
      id: d.id,
      name: d.name,
      updatedAt: d.updatedAt,
    })).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  } catch {
    return [];
  }
}

// ─── Save Design to LocalStorage ───
export function saveDesignToLocal(design: UIDesign): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    let designs: UIDesign[] = stored ? JSON.parse(stored) : [];
    
    // Update or add
    const existingIndex = designs.findIndex(d => d.id === design.id);
    if (existingIndex >= 0) {
      designs[existingIndex] = design;
    } else {
      designs.push(design);
    }
    
    // Limit to 50 designs
    if (designs.length > 50) {
      designs = designs
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 50);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
  } catch (e) {
    console.error('Failed to save design:', e);
  }
}

// ─── Load Design from LocalStorage ───
export function loadDesignFromLocal(id: string): UIDesign | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const designs: UIDesign[] = JSON.parse(stored);
    return designs.find(d => d.id === id) || null;
  } catch {
    return null;
  }
}

// ─── Delete Design from LocalStorage ───
export function deleteLocalDesign(id: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    
    let designs: UIDesign[] = JSON.parse(stored);
    designs = designs.filter(d => d.id !== id);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(designs));
  } catch (e) {
    console.error('Failed to delete design:', e);
  }
}

// ─── Export Design as JSON ───
export function exportDesignAsJSON(design: UIDesign): string {
  return JSON.stringify(design, null, 2);
}

// ─── Import Design from JSON ───
export function importDesignFromJSON(json: string): UIDesign | null {
  try {
    const design = JSON.parse(json) as UIDesign;
    
    // Basic validation
    if (!design.id || !design.root || !design.settings) {
      return null;
    }
    
    return design;
  } catch {
    return null;
  }
}

// ─── Auto-save Key for Current Session ───
const AUTOSAVE_KEY = 'hytale-ui-builder-autosave';

export function autoSave(design: UIDesign): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(design));
  } catch (e) {
    console.error('Autosave failed:', e);
  }
}

export function loadAutosave(): UIDesign | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(AUTOSAVE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function clearAutosave(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTOSAVE_KEY);
}

