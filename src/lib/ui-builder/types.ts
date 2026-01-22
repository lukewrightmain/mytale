// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Core Types
// Types matching the Hytale UI system for .ui, Java, and HYUIML code generation
// Based on reverse-engineering Hytale's UI system and successful mod implementations
// ═══════════════════════════════════════════════════════════════════════════

// ─── Layout Modes (from Hytale UI system) ───
export type LayoutMode = 
  | 'None'
  | 'Top'              // Vertical stacking (top to bottom)
  | 'Left'             // Horizontal stacking (left to right)
  | 'Middle'
  | 'Bottom'
  | 'MiddleCenter'
  | 'TopLeft'
  | 'TopRight'
  | 'BottomLeft'
  | 'BottomRight'
  | 'TopScrolling'     // Vertical with scrollbar
  | 'LeftScrolling';   // Horizontal with scrollbar

// ─── Text Alignment ───
export type TextAlignment = 'Left' | 'Center' | 'Right';
export type VerticalAlignment = 'Top' | 'Center' | 'Bottom';
export type HorizontalAlignment = 'Left' | 'Center' | 'Right';

// ─── Element Types ───
export type ElementType = 
  // Primitives
  | 'Group'
  | 'Label'
  | 'TimerLabel'
  | 'Button'            // Interactive button with states
  | 'ColorPicker'
  | 'RawButton'
  | 'RawField'
  | 'AssetImage'
  | 'ItemIcon'          // Display game items
  | 'ItemGrid'          // Grid of items (inventory-style)
  | 'ProgressBar'       // Progress indicator
  // Macros (from Common.ui)
  | 'PageOverlay'       // $C.@PageOverlay - Full-screen overlay container
  | 'DecoratedContainer'// $C.@DecoratedContainer - Styled panel with border
  | 'Title'             // $C.@Title - Page title with @Text parameter
  | 'ContainerPanel'
  | 'TextButton'
  | 'CancelButton'
  | 'CheckBox'
  | 'TextInput'
  | 'NumberInput'
  | 'BackButton'        // $C.@BackButton - Back/close button
  | 'ScrollbarStyle';   // $C.@DefaultScrollbarStyle

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
  full?: number;        // Margin on all sides
}

// ─── Padding Properties ───
export interface Padding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
  horizontal?: number;
  vertical?: number;
  all?: number;
  full?: number;        // Hytale uses Full: for all-sides padding
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
  horizontalAlignment?: HorizontalAlignment;  // Text alignment within label
}

// ─── Background (supports color with alpha) ───
// Format: #RRGGBB or #RRGGBB(alpha) where alpha is 0.0-1.0
export interface Background {
  color?: string;           // e.g., "#1a1a1a" or "#1a1a1a(0.7)"
  image?: string;           // TexturePath
  texturePath?: string;     // Alternative for textures
  border?: number;          // 9-slice border size
}

// ─── Style State (for hover/pressed states) ───
export interface StyleState {
  background?: string;      // Background color for this state
  textColor?: string;       // Text color for this state
  scale?: number;           // Scale factor
}

// ─── Interactive Style (Button states) ───
export interface InteractiveStyle {
  hovered?: StyleState;
  pressed?: StyleState;
  disabled?: StyleState;
}

// ─── Binding Configuration ───
export interface Binding {
  enabled?: boolean;
  eventType?: 'Activating' | 'ValueChanged' | 'KeyDown';
  eventHandler?: string;
  eventData?: Record<string, string>;
}

// ─── Base Element Properties ───
export interface BaseElementProperties {
  // Identity
  visible?: boolean;
  macro?: string;           // e.g., "$C.@PageOverlay"
  
  // Layout
  scrollStyle?: string;
  scrollbarStyle?: string;  // e.g., "$C.@DefaultScrollbarStyle"
  flexWeight?: number;      // Takes remaining space (FlexWeight: 1)
  layoutMode?: LayoutMode;
  
  // Anchor & Size
  anchor?: Anchor;
  
  // Fill Constraints
  fillConstraints?: FillConstraints;
  
  // Padding
  padding?: Padding;
  
  // Background
  background?: Background;
  
  // Interactive style
  interactiveStyle?: InteractiveStyle;
  
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

// ─── Image Fit Modes ───
export type ImageFitMode = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

// ─── Image Properties ───
export interface ImageProperties extends BaseElementProperties {
  assetPath?: string;          // Hytale asset path for code generation
  imageSrc?: string;           // Base64 or URL for preview in editor
  objectFit?: ImageFitMode;    // How the image fits within its container
  preserveAspect?: boolean;    // Legacy: preserve aspect ratio
  tint?: string;               // Color overlay tint
}

// ─── Item Icon Properties ───
export interface ItemIconProperties extends BaseElementProperties {
  itemId?: string;            // e.g., "Weapon_Sword_Iron"
  showQuantity?: boolean;
  quantity?: number;
}

// ─── Item Grid Properties ───
export interface ItemGridProperties extends BaseElementProperties {
  slotsPerRow?: number;                   // Number of slots per row
  renderItemQualityBackground?: boolean; // Show quality colors
  infoDisplay?: 'None' | 'Tooltip' | 'Overlay';
  slotSize?: number;
  slotSpacing?: number;
  slotIconSize?: number;
}

// ─── Progress Bar Properties ───
export interface ProgressBarProperties extends BaseElementProperties {
  value?: number;             // 0.0 to 1.0
  barTexturePath?: string;    // Custom fill texture
  fillColor?: string;         // Fill color
  backgroundColor?: string;   // Background color
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

// ─── Title Macro Properties ───
export interface TitleProperties extends BaseElementProperties {
  text?: string;              // @Text parameter
  style?: TextStyle;
}

// ─── Page Overlay Properties ───
export interface PageOverlayProperties extends BaseElementProperties {
  // Container for page content
}

// ─── Decorated Container Properties ───
export interface DecoratedContainerProperties extends BaseElementProperties {
  // Styled panel - uses anchor for size
}

// ─── Union of all property types ───
export type ElementProperties = 
  | BaseElementProperties
  | LabelProperties
  | TimerLabelProperties
  | ButtonProperties
  | FieldProperties
  | ImageProperties
  | ItemIconProperties
  | ItemGridProperties
  | ProgressBarProperties
  | ColorPickerProperties
  | CheckBoxProperties
  | NumberInputProperties
  | TitleProperties
  | PageOverlayProperties
  | DecoratedContainerProperties;

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
  // Page type settings
  pageType: 'CustomUIPage' | 'InteractiveCustomUIPage' | 'CustomUIHud';
  pageLifetime: 'CanDismiss' | 'Persistent';
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
  category: 'primitive' | 'macro' | 'data' | 'layout';
  description?: string;
  defaultProperties: ElementProperties;
  canHaveChildren: boolean;
}

// ─── Template Definition ───
export interface UITemplate {
  id: string;
  name: string;
  description: string;
  category: 'page' | 'card' | 'hud' | 'component';
  preview?: string;     // Preview image URL
  root: UIElement;
  settings: Partial<DesignSettings>;
}

// ─── Drag Data ───
export interface DragData {
  type: 'palette' | 'hierarchy' | 'template';
  elementType?: ElementType;
  elementId?: string;
  templateId?: string;
}

// ─── Property Editor Field Definition ───
export interface PropertyField {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'select' | 'anchor' | 'padding' | 'style' | 'binding';
  options?: { value: string; label: string }[];
  group: string;
  placeholder?: string;
  description?: string;
}

// ─── Component Definition (for code generation) ───
export interface ComponentDefinition {
  type: ElementType;
  uiKeyword: string;        // Keyword in .ui format
  hyuimlTag: string;        // HTML tag for HYUIML
  supportsChildren: boolean;
  isMacro: boolean;         // Uses $C.@MacroName syntax
  defaultProperties: ElementProperties;
  propertyFields: PropertyField[];
}

// ─── Export Options ───
export interface ExportOptions {
  includeManifest: boolean;
  includeReadme: boolean;
  format: 'zip' | 'files';
  outputPath?: string;
}
