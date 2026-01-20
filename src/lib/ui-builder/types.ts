// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Core Types
// Types matching the Hytale UI system for .ui, Java, and HYUIML code generation
// ═══════════════════════════════════════════════════════════════════════════

// ─── Layout Modes ───
export type LayoutMode = 
  | 'None'
  | 'Top'
  | 'Middle'
  | 'Bottom'
  | 'MiddleCenter'
  | 'TopLeft'
  | 'TopRight'
  | 'BottomLeft'
  | 'BottomRight';

// ─── Text Alignment ───
export type TextAlignment = 'Left' | 'Center' | 'Right';
export type VerticalAlignment = 'Top' | 'Center' | 'Bottom';

// ─── Element Types ───
export type ElementType = 
  // Primitives
  | 'Group'
  | 'Label'
  | 'TimerLabel'
  | 'ColorPicker'
  | 'RawButton'
  | 'RawField'
  | 'AssetImage'
  // Macros (from Common.ui)
  | 'PageOverlay'
  | 'ContainerPanel'
  | 'TextButton'
  | 'CancelButton'
  | 'CheckBox'
  | 'TextInput'
  | 'NumberInput'
  | 'BackButton';

// ─── Anchor Properties ───
export interface Anchor {
  width?: number;
  height?: number;
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

// ─── Padding Properties ───
export interface Padding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  horizontal?: number;
  all?: number;
}

// ─── Fill Constraints ───
export interface FillConstraints {
  full?: string;      // e.g., "0/1"
  horizontal?: string;
  vertical?: string;
}

// ─── Text Style ───
export interface TextStyle {
  textColor?: string;
  fontSize?: number;
  renderBold?: boolean;
  renderItalic?: boolean;
  fontFamily?: string;
}

// ─── Background ───
export interface Background {
  color?: string;
  image?: string;
}

// ─── Binding Configuration ───
export interface Binding {
  enabled?: boolean;
  // Additional binding properties for Java code generation
  eventType?: string;
  eventHandler?: string;
}

// ─── Base Element Properties ───
export interface BaseElementProperties {
  // Identity
  visible?: boolean;
  macro?: string;
  
  // Layout
  scrollStyle?: string;
  flexWeight?: number;
  layoutMode?: LayoutMode;
  
  // Anchor & Size
  anchor?: Anchor;
  
  // Fill Constraints
  fillConstraints?: FillConstraints;
  
  // Padding
  padding?: Padding;
  
  // Background
  background?: Background;
  
  // Binding
  binding?: Binding;
}

// ─── Label Properties ───
export interface LabelProperties extends BaseElementProperties {
  text?: string;
  alignment?: TextAlignment;
  verticalAlignment?: VerticalAlignment;
  style?: TextStyle;
}

// ─── Timer Label Properties ───
export interface TimerLabelProperties extends LabelProperties {
  duration?: number;
  autoStart?: boolean;
  format?: string;
}

// ─── Button Properties ───
export interface ButtonProperties extends BaseElementProperties {
  text?: string;
  style?: TextStyle;
  hoverBackground?: Background;
  pressedBackground?: Background;
  disabledBackground?: Background;
}

// ─── Field Properties ───
export interface FieldProperties extends BaseElementProperties {
  placeholder?: string;
  value?: string;
  maxLength?: number;
  style?: TextStyle;
}

// ─── Image Properties ───
export interface ImageProperties extends BaseElementProperties {
  assetPath?: string;
  preserveAspect?: boolean;
  tint?: string;
}

// ─── Color Picker Properties ───
export interface ColorPickerProperties extends BaseElementProperties {
  defaultColor?: string;
}

// ─── Check Box Properties ───
export interface CheckBoxProperties extends BaseElementProperties {
  checked?: boolean;
  label?: string;
  style?: TextStyle;
}

// ─── Number Input Properties ───
export interface NumberInputProperties extends FieldProperties {
  min?: number;
  max?: number;
  step?: number;
}

// ─── Union of all property types ───
export type ElementProperties = 
  | BaseElementProperties
  | LabelProperties
  | TimerLabelProperties
  | ButtonProperties
  | FieldProperties
  | ImageProperties
  | ColorPickerProperties
  | CheckBoxProperties
  | NumberInputProperties;

// ─── UI Element (Tree Node) ───
export interface UIElement {
  id: string;
  type: ElementType;
  name?: string; // Custom name for hierarchy display
  properties: ElementProperties;
  children: UIElement[];
  // Editor-only state
  _collapsed?: boolean;
  _selected?: boolean;
}

// ─── Design Document ───
export interface UIDesign {
  id: string;
  name: string;
  description?: string;
  root: UIElement;
  // Meta
  createdAt: string;
  updatedAt: string;
  // Settings
  settings: DesignSettings;
}

// ─── Design Settings ───
export interface DesignSettings {
  canvasWidth: number;
  canvasHeight: number;
  commonUiPath: string;
  packageName: string;
  className: string;
  uiFilePath: string;
}

// ─── Editor State ───
export interface EditorState {
  design: UIDesign;
  selectedElementId: string | null;
  clipboard: UIElement | null;
  zoom: number;
  // History for undo/redo
  history: UIDesign[];
  historyIndex: number;
  // UI State
  activeCodeTab: 'ui' | 'java' | 'hyuiml';
  showGrid: boolean;
}

// ─── Palette Item Definition ───
export interface PaletteItem {
  type: ElementType;
  label: string;
  icon: string; // Icon identifier
  category: 'primitive' | 'macro';
  defaultProperties: ElementProperties;
  canHaveChildren: boolean;
}

// ─── Drag Data ───
export interface DragData {
  type: 'palette' | 'hierarchy';
  elementType?: ElementType;
  elementId?: string;
}

// ─── Property Editor Field Definition ───
export interface PropertyField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'anchor' | 'padding';
  options?: { value: string; label: string }[];
  group: string;
  placeholder?: string;
}

// ─── Component Definition (for code generation) ───
export interface ComponentDefinition {
  type: ElementType;
  uiKeyword: string;        // Keyword in .ui format
  hyuimlTag: string;        // HTML tag for HYUIML
  supportsChildren: boolean;
  defaultProperties: ElementProperties;
  propertyFields: PropertyField[];
}

