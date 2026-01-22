// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - .ui Format Generator
// Generates Hytale .ui format code matching official documentation
// ═══════════════════════════════════════════════════════════════════════════

import type { UIElement, UIDesign, ElementProperties, Anchor, Padding, TextStyle, InteractiveStyle } from '../types';
import { COMPONENT_DEFINITIONS } from '../defaults';

// ─── Generate .ui Code ───
export function generateUICode(design: UIDesign): string {
  const lines: string[] = [];
  
  // Common.ui reference (matching reference format)
  lines.push(`$C = "${design.settings.commonUiPath}";`);
  lines.push('');
  
  // Generate root and children
  generateElementUI(design.root, lines, 0, true);
  
  // Add BackButton if not already in tree (common pattern)
  if (!hasBackButton(design.root)) {
    lines.push('');
    lines.push('$C.@BackButton {}');
  }
  
  return lines.join('\n');
}

// ─── Check if tree has BackButton ───
function hasBackButton(element: UIElement): boolean {
  if (element.type === 'BackButton') return true;
  return element.children.some(hasBackButton);
}

// ─── Generate Element ───
function generateElementUI(element: UIElement, lines: string[], indent: number, isRoot: boolean = false): void {
  const prefix = '  '.repeat(indent);
  const definition = COMPONENT_DEFINITIONS[element.type];
  
  // Determine the keyword to use
  let uiKeyword: string;
  let idPart = '';
  
  if (definition?.isMacro) {
    // Macros use $C.@MacroName syntax
    uiKeyword = definition.uiKeyword;
  } else {
    uiKeyword = definition?.uiKeyword || element.type;
  }
  
  // Generate element ID (root has no ID in reference format)
  if (!isRoot && element.name) {
    const elementId = getCleanId(element);
    idPart = ` #${elementId}`;
  }
  
  // Check if element has any content (properties or children)
  const props = generatePropertiesUI(element, indent + 1);
  const hasChildren = element.children.length > 0;
  const hasContent = props.length > 0 || hasChildren;
  
  if (!hasContent) {
    // Empty element - use shorthand
    lines.push(`${prefix}${uiKeyword}${idPart} {}`);
  } else {
    lines.push(`${prefix}${uiKeyword}${idPart} {`);
    
    // Add properties
    for (const prop of props) {
      lines.push(prop);
    }
    
    // Generate children
    for (const child of element.children) {
      generateElementUI(child, lines, indent + 1, false);
    }
    
    lines.push(`${prefix}}`);
  }
}

// ─── Get Clean Element ID ───
function getCleanId(element: UIElement): string {
  // Use custom name if provided, combined with short hash for uniqueness
  const baseName = element.name || element.type;
  const cleanName = baseName.replace(/[^a-zA-Z0-9]/g, '');
  return `${cleanName}`;
}

// ─── Generate Properties ───
function generatePropertiesUI(element: UIElement, indent: number): string[] {
  const props = element.properties;
  const lines: string[] = [];
  const prefix = '  '.repeat(indent);
  
  // Template parameter (for @Title and similar)
  if ('text' in props && props.text && element.type === 'Title') {
    lines.push(`${prefix}@Text = "${escapeString(props.text)}";`);
  }
  
  // Layout Mode
  if ('layoutMode' in props && props.layoutMode && props.layoutMode !== 'None') {
    lines.push(`${prefix}LayoutMode: ${props.layoutMode};`);
  }
  
  // Scrollbar Style
  if ('scrollbarStyle' in props && props.scrollbarStyle) {
    lines.push(`${prefix}ScrollbarStyle: ${props.scrollbarStyle};`);
  }
  
  // Anchor
  if ('anchor' in props && props.anchor) {
    const anchorStr = formatAnchor(props.anchor);
    if (anchorStr) {
      lines.push(`${prefix}Anchor: ${anchorStr};`);
    }
  }
  
  // Padding
  if ('padding' in props && props.padding) {
    const paddingStr = formatPadding(props.padding);
    if (paddingStr) {
      lines.push(`${prefix}Padding: ${paddingStr};`);
    }
  }
  
  // Background
  if ('background' in props && props.background) {
    const bgStr = formatBackground(props.background);
    if (bgStr) {
      lines.push(`${prefix}Background: ${bgStr};`);
    }
  }
  
  // Interactive Style (hover/pressed states)
  if ('interactiveStyle' in props && props.interactiveStyle) {
    const styleStr = formatInteractiveStyle(props.interactiveStyle);
    if (styleStr) {
      lines.push(`${prefix}Style: ${styleStr};`);
    }
  }
  
  // Flex Weight
  if ('flexWeight' in props && props.flexWeight !== undefined && props.flexWeight !== 0) {
    lines.push(`${prefix}FlexWeight: ${props.flexWeight};`);
  }
  
  // Alignment (for labels)
  if ('alignment' in props && props.alignment) {
    lines.push(`${prefix}Alignment: ${props.alignment};`);
  }
  
  // Style (for labels and text elements)
  if ('style' in props && props.style && element.type !== 'Title') {
    const styleStr = formatTextStyle(props.style);
    if (styleStr) {
      lines.push(`${prefix}Style: ${styleStr};`);
    }
  }
  
  // Text content (for non-Title elements)
  if ('text' in props && props.text !== undefined && props.text !== '' && element.type !== 'Title') {
    lines.push(`${prefix}Text: "${escapeString(props.text)}";`);
  }
  
  // Placeholder
  if ('placeholder' in props && props.placeholder) {
    lines.push(`${prefix}Placeholder: "${escapeString(props.placeholder)}";`);
  }
  
  // Value
  if ('value' in props && props.value !== undefined && props.value !== '') {
    if (typeof props.value === 'number') {
      lines.push(`${prefix}Value: ${props.value};`);
    } else {
      lines.push(`${prefix}Value: "${escapeString(String(props.value))}";`);
    }
  }
  
  // Asset Path (for images)
  if ('assetPath' in props && props.assetPath) {
    lines.push(`${prefix}Asset: "${props.assetPath}";`);
  }
  
  // Item ID (for ItemIcon)
  if ('itemId' in props && props.itemId) {
    lines.push(`${prefix}ItemId: "${props.itemId}";`);
  }
  
  // Item Grid properties
  if ('slotsPerRow' in props && props.slotsPerRow) {
    lines.push(`${prefix}SlotsPerRow: ${props.slotsPerRow};`);
  }
  if ('renderItemQualityBackground' in props && props.renderItemQualityBackground !== undefined) {
    lines.push(`${prefix}RenderItemQualityBackground: ${props.renderItemQualityBackground};`);
  }
  if ('infoDisplay' in props && props.infoDisplay) {
    lines.push(`${prefix}InfoDisplay: ${props.infoDisplay};`);
  }
  
  // Progress Bar properties
  if ('barTexturePath' in props && props.barTexturePath) {
    lines.push(`${prefix}BarTexturePath: "${props.barTexturePath}";`);
  }
  
  // Visible
  if ('visible' in props && props.visible === false) {
    lines.push(`${prefix}Visible: false;`);
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
  
  return lines;
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
  if (anchor.full !== undefined) parts.push(`Full: ${anchor.full}`);
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
  if (padding.full !== undefined && padding.full !== 0) {
    return `(Full: ${padding.full})`;
  }
  
  if (padding.all !== undefined && padding.all !== 0) {
    return `(Full: ${padding.all})`;
  }
  
  const parts: string[] = [];
  if (padding.horizontal !== undefined && padding.horizontal !== 0) {
    parts.push(`Horizontal: ${padding.horizontal}`);
  }
  if (padding.vertical !== undefined && padding.vertical !== 0) {
    parts.push(`Vertical: ${padding.vertical}`);
  }
  if (padding.top !== undefined && padding.top !== 0) parts.push(`Top: ${padding.top}`);
  if (padding.right !== undefined && padding.right !== 0) parts.push(`Right: ${padding.right}`);
  if (padding.bottom !== undefined && padding.bottom !== 0) parts.push(`Bottom: ${padding.bottom}`);
  if (padding.left !== undefined && padding.left !== 0) parts.push(`Left: ${padding.left}`);
  
  if (parts.length === 0) return '';
  return `(${parts.join(', ')})`;
}

// ─── Format Background ───
function formatBackground(bg: { color?: string; image?: string; texturePath?: string; border?: number }): string {
  if (bg.texturePath) {
    let result = `(TexturePath: "${bg.texturePath}"`;
    if (bg.border !== undefined) {
      result += `, Border: ${bg.border}`;
    }
    return result + ')';
  }
  
  if (bg.color && bg.color !== 'transparent') {
    // Color format: #RRGGBB or #RRGGBB(alpha)
    return bg.color;
  }
  
  if (bg.image) {
    return `(Image: "${bg.image}")`;
  }
  
  return '';
}

// ─── Format Interactive Style (Hover/Pressed) ───
function formatInteractiveStyle(style: InteractiveStyle): string {
  const parts: string[] = [];
  
  if (style.hovered?.background) {
    parts.push(`Hovered: (Background: ${style.hovered.background})`);
  }
  
  if (style.pressed?.background) {
    parts.push(`Pressed: (Background: ${style.pressed.background})`);
  }
  
  if (style.disabled?.background) {
    parts.push(`Disabled: (Background: ${style.disabled.background})`);
  }
  
  if (parts.length === 0) return '';
  return `(\n    ${parts.join(',\n    ')}\n  )`;
}

// ─── Format Text Style ───
function formatTextStyle(style: TextStyle): string {
  const parts: string[] = [];
  
  if (style.fontSize !== undefined) parts.push(`FontSize: ${style.fontSize}`);
  if (style.renderBold) parts.push(`RenderBold: true`);
  if (style.renderItalic) parts.push(`RenderItalic: true`);
  if (style.textColor) parts.push(`TextColor: ${style.textColor}`);
  if (style.horizontalAlignment) parts.push(`HorizontalAlignment: ${style.horizontalAlignment}`);
  if (style.fontFamily) parts.push(`FontFamily: "${style.fontFamily}"`);
  
  if (parts.length === 0) return '';
  return `(${parts.join(', ')})`;
}

// ─── Escape String ───
function escapeString(str: string): string {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}
