// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - .ui Format Generator
// Generates Hytale .ui format code from design tree
// ═══════════════════════════════════════════════════════════════════════════

import type { UIElement, UIDesign, ElementProperties, Anchor, Padding, TextStyle } from '../types';
import { COMPONENT_DEFINITIONS } from '../defaults';

// ─── Generate .ui Code ───
export function generateUICode(design: UIDesign): string {
  const lines: string[] = [];
  
  // Common.ui reference (matching reference format)
  lines.push(`$C = "${design.settings.commonUiPath}";`);
  lines.push('');
  
  // Generate root and children
  generateElementUI(design.root, lines, 0, true);
  
  return lines.join('\n');
}

// ─── Generate Element ───
function generateElementUI(element: UIElement, lines: string[], indent: number, isRoot: boolean = false): void {
  const prefix = '  '.repeat(indent);
  const definition = COMPONENT_DEFINITIONS[element.type];
  const uiKeyword = definition?.uiKeyword || element.type;
  
  // Generate element ID (root has no ID in reference format)
  let idPart = '';
  if (!isRoot) {
    const elementId = getCleanId(element);
    idPart = ` #${elementId}`;
  }
  
  lines.push(`${prefix}${uiKeyword}${idPart} {`);
  
  // Generate properties
  generatePropertiesUI(element.properties, lines, indent + 1);
  
  // Generate children
  for (const child of element.children) {
    generateElementUI(child, lines, indent + 1, false);
  }
  
  lines.push(`${prefix}}`);
}

// ─── Get Clean Element ID ───
function getCleanId(element: UIElement): string {
  // Use custom name if provided, combined with short hash for uniqueness
  const baseName = element.name || element.type;
  const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '');
  return `${cleanName}${element.id.substring(0, 8)}`;
}

// ─── Generate Properties ───
function generatePropertiesUI(props: ElementProperties, lines: string[], indent: number): void {
  const prefix = '  '.repeat(indent);
  
  // Macro reference (first if present)
  if ('macro' in props && props.macro) {
    lines.push(`${prefix}${props.macro};`);
  }
  
  // Layout Mode
  if ('layoutMode' in props && props.layoutMode && props.layoutMode !== 'None') {
    lines.push(`${prefix}LayoutMode: ${props.layoutMode};`);
  }
  
  // Anchor
  if ('anchor' in props && props.anchor) {
    const anchorStr = formatAnchor(props.anchor);
    if (anchorStr) {
      lines.push(`${prefix}Anchor: ${anchorStr};`);
    }
  }
  
  // Background
  if ('background' in props && props.background) {
    if (props.background.color && props.background.color !== 'transparent') {
      lines.push(`${prefix}Background: ${props.background.color};`);
    } else if (props.background.image) {
      lines.push(`${prefix}Background: (Image: "${props.background.image}");`);
    }
  }
  
  // Padding
  if ('padding' in props && props.padding) {
    const paddingStr = formatPadding(props.padding);
    if (paddingStr) {
      lines.push(`${prefix}Padding: ${paddingStr};`);
    }
  }
  
  // Alignment (for labels)
  if ('alignment' in props && props.alignment) {
    lines.push(`${prefix}Alignment: ${props.alignment};`);
  }
  
  // Style (for labels and text elements)
  if ('style' in props && props.style) {
    const styleStr = formatTextStyle(props.style);
    if (styleStr) {
      lines.push(`${prefix}Style: ${styleStr};`);
    }
  }
  
  // Text content
  if ('text' in props && props.text !== undefined && props.text !== '') {
    lines.push(`${prefix}Text: "${escapeString(props.text)}";`);
  }
  
  // Placeholder
  if ('placeholder' in props && props.placeholder) {
    lines.push(`${prefix}Placeholder: "${escapeString(props.placeholder)}";`);
  }
  
  // Value
  if ('value' in props && props.value !== undefined && props.value !== '') {
    lines.push(`${prefix}Value: "${escapeString(props.value)}";`);
  }
  
  // Asset Path (for images)
  if ('assetPath' in props && props.assetPath) {
    lines.push(`${prefix}Asset: "${props.assetPath}";`);
  }
  
  // Visible
  if ('visible' in props && props.visible === false) {
    lines.push(`${prefix}Visible: false;`);
  }
  
  // Flex Weight
  if ('flexWeight' in props && props.flexWeight !== undefined && props.flexWeight !== 0) {
    lines.push(`${prefix}FlexWeight: ${props.flexWeight};`);
  }
  
  // Scroll Style
  if ('scrollStyle' in props && props.scrollStyle) {
    lines.push(`${prefix}ScrollStyle: ${props.scrollStyle};`);
  }
  
  // Fill Constraints
  if ('fillConstraints' in props && props.fillConstraints) {
    if (props.fillConstraints.full) {
      lines.push(`${prefix}Fill: ${props.fillConstraints.full};`);
    }
    if (props.fillConstraints.horizontal) {
      lines.push(`${prefix}FillHorizontal: ${props.fillConstraints.horizontal};`);
    }
    if (props.fillConstraints.vertical) {
      lines.push(`${prefix}FillVertical: ${props.fillConstraints.vertical};`);
    }
  }
  
  // Checked (for checkboxes)
  if ('checked' in props && props.checked !== undefined) {
    lines.push(`${prefix}Checked: ${props.checked};`);
  }
  
  // Label (for checkboxes)
  if ('label' in props && props.label) {
    lines.push(`${prefix}Label: "${escapeString(props.label)}";`);
  }
  
  // Min/Max (for number inputs)
  if ('min' in props && props.min !== undefined) {
    lines.push(`${prefix}Min: ${props.min};`);
  }
  if ('max' in props && props.max !== undefined) {
    lines.push(`${prefix}Max: ${props.max};`);
  }
}

// ─── Format Anchor ───
function formatAnchor(anchor: Anchor): string {
  const parts: string[] = [];
  
  if (anchor.width !== undefined) parts.push(`Width: ${anchor.width}`);
  if (anchor.height !== undefined) parts.push(`Height: ${anchor.height}`);
  if (anchor.left !== undefined) parts.push(`Left: ${anchor.left}`);
  if (anchor.right !== undefined) parts.push(`Right: ${anchor.right}`);
  if (anchor.top !== undefined) parts.push(`Top: ${anchor.top}`);
  if (anchor.bottom !== undefined) parts.push(`Bottom: ${anchor.bottom}`);
  if (anchor.minWidth !== undefined) parts.push(`MinWidth: ${anchor.minWidth}`);
  if (anchor.maxWidth !== undefined) parts.push(`MaxWidth: ${anchor.maxWidth}`);
  if (anchor.minHeight !== undefined) parts.push(`MinHeight: ${anchor.minHeight}`);
  if (anchor.maxHeight !== undefined) parts.push(`MaxHeight: ${anchor.maxHeight}`);
  
  if (parts.length === 0) return '';
  return `(${parts.join(', ')})`;
}

// ─── Format Padding ───
function formatPadding(padding: Padding): string {
  // Check if all values are zero or undefined
  const hasValue = padding.all !== undefined || 
                   padding.top !== undefined || 
                   padding.right !== undefined || 
                   padding.bottom !== undefined || 
                   padding.left !== undefined ||
                   padding.horizontal !== undefined;
  
  if (!hasValue) return '';
  
  if (padding.all !== undefined && padding.all !== 0) {
    return `${padding.all}`;
  }
  
  const parts: string[] = [];
  if (padding.top !== undefined && padding.top !== 0) parts.push(`Top: ${padding.top}`);
  if (padding.right !== undefined && padding.right !== 0) parts.push(`Right: ${padding.right}`);
  if (padding.bottom !== undefined && padding.bottom !== 0) parts.push(`Bottom: ${padding.bottom}`);
  if (padding.left !== undefined && padding.left !== 0) parts.push(`Left: ${padding.left}`);
  if (padding.horizontal !== undefined && padding.horizontal !== 0) parts.push(`Horiz: ${padding.horizontal}`);
  
  if (parts.length === 0) return '';
  return `(${parts.join(', ')})`;
}

// ─── Format Text Style ───
function formatTextStyle(style: TextStyle): string {
  const parts: string[] = [];
  
  if (style.textColor) parts.push(`TextColor: ${style.textColor}`);
  if (style.fontSize !== undefined) parts.push(`FontSize: ${style.fontSize}`);
  if (style.renderBold) parts.push(`RenderBold: true`);
  if (style.renderItalic) parts.push(`RenderItalic: true`);
  if (style.fontFamily) parts.push(`FontFamily: "${style.fontFamily}"`);
  
  if (parts.length === 0) return '';
  return `(${parts.join(', ')})`;
}

// ─── Escape String ───
function escapeString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
