// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Default Values and Component Definitions
// ═══════════════════════════════════════════════════════════════════════════

import type {
  ElementType,
  PaletteItem,
  UIElement,
  UIDesign,
  DesignSettings,
  EditorState,
  ComponentDefinition,
  PropertyField,
} from './types';

// ─── Generate Unique ID ───
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// ─── Default Design Settings ───
export const DEFAULT_SETTINGS: DesignSettings = {
  canvasWidth: 800,
  canvasHeight: 500,
  commonUiPath: '../Common.ui',
  packageName: 'com.example.mod',
  className: 'MyGeneratedGui',
  uiFilePath: 'Pages/MyMod_GUI.ui',
};

// ─── Create Default Root Element ───
export function createDefaultRoot(): UIElement {
  return {
    id: generateId(),
    type: 'Group',
    name: 'Root',
    properties: {
      layoutMode: 'Top',
      background: { color: '#2a2a2a' },
      anchor: { width: 800, height: 500 },
    },
    children: [],
  };
}

// ─── Create New Design ───
export function createNewDesign(): UIDesign {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name: 'Untitled Design',
    description: '',
    root: createDefaultRoot(),
    createdAt: now,
    updatedAt: now,
    settings: { ...DEFAULT_SETTINGS },
  };
}

// ─── Create Default Editor State ───
export function createDefaultEditorState(): EditorState {
  const design = createNewDesign();
  return {
    design,
    selectedElementId: null,
    clipboard: null,
    zoom: 1,
    history: [design],
    historyIndex: 0,
    activeCodeTab: 'ui',
    showGrid: true,
  };
}

// ─── Palette Items ───
export const PALETTE_ITEMS: PaletteItem[] = [
  // Primitives
  {
    type: 'Group',
    label: 'Group',
    icon: 'Gr',
    category: 'primitive',
    canHaveChildren: true,
    defaultProperties: {
      layoutMode: 'Middle',
      anchor: { width: 200, height: 200 },
    },
  },
  {
    type: 'Label',
    label: 'Label',
    icon: 'La',
    category: 'primitive',
    canHaveChildren: false,
    defaultProperties: {
      text: 'Label',
      alignment: 'Center',
      style: { textColor: '#ffffff', fontSize: 16 },
    },
  },
  {
    type: 'TimerLabel',
    label: 'Timer Label',
    icon: 'Ti',
    category: 'primitive',
    canHaveChildren: false,
    defaultProperties: {
      text: '00:00',
      alignment: 'Center',
      duration: 60,
      style: { textColor: '#ffffff', fontSize: 16 },
    },
  },
  {
    type: 'ColorPicker',
    label: 'Color Picker',
    icon: 'Co',
    category: 'primitive',
    canHaveChildren: false,
    defaultProperties: {
      defaultColor: '#ffffff',
      anchor: { width: 100, height: 100 },
    },
  },
  {
    type: 'RawButton',
    label: 'Raw Button',
    icon: 'Bu',
    category: 'primitive',
    canHaveChildren: false,
    defaultProperties: {
      text: 'Button',
      anchor: { width: 120, height: 40 },
      background: { color: '#444444' },
    },
  },
  {
    type: 'RawField',
    label: 'Raw Field',
    icon: 'Te',
    category: 'primitive',
    canHaveChildren: false,
    defaultProperties: {
      placeholder: 'Enter text...',
      anchor: { width: 200, height: 32 },
      background: { color: '#333333' },
      style: { textColor: '#ffffff', fontSize: 14 },
    },
  },
  {
    type: 'AssetImage',
    label: 'Image',
    icon: 'As',
    category: 'primitive',
    canHaveChildren: false,
    defaultProperties: {
      anchor: { width: 100, height: 100 },
    },
  },
  // Macros
  {
    type: 'PageOverlay',
    label: 'Page Overlay',
    icon: 'Gr',
    category: 'macro',
    canHaveChildren: true,
    defaultProperties: {
      macro: '$C @PageOverlay',
      layoutMode: 'MiddleCenter',
    },
  },
  {
    type: 'ContainerPanel',
    label: 'Container Panel',
    icon: 'Gr',
    category: 'macro',
    canHaveChildren: true,
    defaultProperties: {
      macro: '$C @ContainerPanel',
      anchor: { width: 400, height: 300 },
      background: { color: '#1a1a1a' },
    },
  },
  {
    type: 'TextButton',
    label: 'Text Button',
    icon: 'Te',
    category: 'macro',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C @TextButton',
      text: 'Button',
      anchor: { width: 140, height: 36 },
    },
  },
  {
    type: 'CancelButton',
    label: 'Cancel Button',
    icon: 'Te',
    category: 'macro',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C @CancelButton',
      text: 'Cancel',
      anchor: { width: 140, height: 36 },
    },
  },
  {
    type: 'CheckBox',
    label: 'Check Box',
    icon: 'Gr',
    category: 'macro',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C @CheckBox',
      checked: false,
      label: 'Option',
      anchor: { width: 120, height: 24 },
    },
  },
  {
    type: 'TextInput',
    label: 'Text Input',
    icon: 'Te',
    category: 'macro',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C @TextInput',
      placeholder: 'Enter text...',
      anchor: { width: 200, height: 32 },
    },
  },
  {
    type: 'NumberInput',
    label: 'Number Input',
    icon: 'Te',
    category: 'macro',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C @NumberInput',
      value: '0',
      min: 0,
      max: 100,
      anchor: { width: 120, height: 32 },
    },
  },
  {
    type: 'BackButton',
    label: 'Back Button',
    icon: 'Gr',
    category: 'macro',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C @BackButton',
      text: 'Back',
      anchor: { width: 100, height: 36 },
    },
  },
];

// ─── Component Definitions for Code Generation ───
export const COMPONENT_DEFINITIONS: Record<ElementType, ComponentDefinition> = {
  Group: {
    type: 'Group',
    uiKeyword: 'Group',
    hyuimlTag: 'div',
    supportsChildren: true,
    defaultProperties: {},
    propertyFields: getCommonPropertyFields(),
  },
  Label: {
    type: 'Label',
    uiKeyword: 'Label',
    hyuimlTag: 'p',
    supportsChildren: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getLabelPropertyFields()],
  },
  TimerLabel: {
    type: 'TimerLabel',
    uiKeyword: 'TimerLabel',
    hyuimlTag: 'p',
    supportsChildren: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getLabelPropertyFields()],
  },
  ColorPicker: {
    type: 'ColorPicker',
    uiKeyword: 'ColorPicker',
    hyuimlTag: 'div',
    supportsChildren: false,
    defaultProperties: {},
    propertyFields: getCommonPropertyFields(),
  },
  RawButton: {
    type: 'RawButton',
    uiKeyword: 'RawButton',
    hyuimlTag: 'button',
    supportsChildren: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getButtonPropertyFields()],
  },
  RawField: {
    type: 'RawField',
    uiKeyword: 'RawField',
    hyuimlTag: 'input',
    supportsChildren: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getFieldPropertyFields()],
  },
  AssetImage: {
    type: 'AssetImage',
    uiKeyword: 'AssetImage',
    hyuimlTag: 'div',
    supportsChildren: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getImagePropertyFields()],
  },
  PageOverlay: {
    type: 'PageOverlay',
    uiKeyword: 'Group',
    hyuimlTag: 'div',
    supportsChildren: true,
    defaultProperties: { macro: '$C @PageOverlay' },
    propertyFields: getCommonPropertyFields(),
  },
  ContainerPanel: {
    type: 'ContainerPanel',
    uiKeyword: 'Group',
    hyuimlTag: 'div',
    supportsChildren: true,
    defaultProperties: { macro: '$C @ContainerPanel' },
    propertyFields: getCommonPropertyFields(),
  },
  TextButton: {
    type: 'TextButton',
    uiKeyword: 'TextButton',
    hyuimlTag: 'button',
    supportsChildren: false,
    defaultProperties: { macro: '$C @TextButton' },
    propertyFields: [...getCommonPropertyFields(), ...getButtonPropertyFields()],
  },
  CancelButton: {
    type: 'CancelButton',
    uiKeyword: 'CancelButton',
    hyuimlTag: 'button',
    supportsChildren: false,
    defaultProperties: { macro: '$C @CancelButton' },
    propertyFields: [...getCommonPropertyFields(), ...getButtonPropertyFields()],
  },
  CheckBox: {
    type: 'CheckBox',
    uiKeyword: 'CheckBox',
    hyuimlTag: 'input',
    supportsChildren: false,
    defaultProperties: { macro: '$C @CheckBox' },
    propertyFields: getCommonPropertyFields(),
  },
  TextInput: {
    type: 'TextInput',
    uiKeyword: 'TextInput',
    hyuimlTag: 'input',
    supportsChildren: false,
    defaultProperties: { macro: '$C @TextInput' },
    propertyFields: [...getCommonPropertyFields(), ...getFieldPropertyFields()],
  },
  NumberInput: {
    type: 'NumberInput',
    uiKeyword: 'NumberInput',
    hyuimlTag: 'input',
    supportsChildren: false,
    defaultProperties: { macro: '$C @NumberInput' },
    propertyFields: [...getCommonPropertyFields(), ...getFieldPropertyFields()],
  },
  BackButton: {
    type: 'BackButton',
    uiKeyword: 'BackButton',
    hyuimlTag: 'button',
    supportsChildren: false,
    defaultProperties: { macro: '$C @BackButton' },
    propertyFields: [...getCommonPropertyFields(), ...getButtonPropertyFields()],
  },
};

// ─── Property Field Helpers ───
function getCommonPropertyFields(): PropertyField[] {
  return [
    { key: 'visible', label: 'Visible', type: 'boolean', group: 'Identity' },
    { key: 'macro', label: 'Macro', type: 'string', group: 'Identity' },
    { key: 'layoutMode', label: 'Layout Mode', type: 'select', group: 'Layout', options: [
      { value: 'None', label: 'None' },
      { value: 'Top', label: 'Top' },
      { value: 'Middle', label: 'Middle' },
      { value: 'Bottom', label: 'Bottom' },
      { value: 'MiddleCenter', label: 'MiddleCenter' },
      { value: 'TopLeft', label: 'TopLeft' },
      { value: 'TopRight', label: 'TopRight' },
      { value: 'BottomLeft', label: 'BottomLeft' },
      { value: 'BottomRight', label: 'BottomRight' },
    ]},
    { key: 'scrollStyle', label: 'Scroll Style', type: 'string', group: 'Layout' },
    { key: 'flexWeight', label: 'Flex Weight', type: 'number', group: 'Layout' },
    { key: 'anchor', label: 'Anchor', type: 'anchor', group: 'Anchor & Size' },
    { key: 'padding', label: 'Padding', type: 'padding', group: 'Padding' },
    { key: 'background.color', label: 'Background Color', type: 'color', group: 'Background' },
  ];
}

function getLabelPropertyFields(): PropertyField[] {
  return [
    { key: 'text', label: 'Text', type: 'string', group: 'Content' },
    { key: 'alignment', label: 'Alignment', type: 'select', group: 'Content', options: [
      { value: 'Left', label: 'Left' },
      { value: 'Center', label: 'Center' },
      { value: 'Right', label: 'Right' },
    ]},
    { key: 'style.textColor', label: 'Text Color', type: 'color', group: 'Style' },
    { key: 'style.fontSize', label: 'Font Size', type: 'number', group: 'Style' },
    { key: 'style.renderBold', label: 'Bold', type: 'boolean', group: 'Style' },
  ];
}

function getButtonPropertyFields(): PropertyField[] {
  return [
    { key: 'text', label: 'Text', type: 'string', group: 'Content' },
  ];
}

function getFieldPropertyFields(): PropertyField[] {
  return [
    { key: 'placeholder', label: 'Placeholder', type: 'string', group: 'Content' },
    { key: 'value', label: 'Value', type: 'string', group: 'Content' },
    { key: 'maxLength', label: 'Max Length', type: 'number', group: 'Content' },
  ];
}

function getImagePropertyFields(): PropertyField[] {
  return [
    { key: 'assetPath', label: 'Asset Path', type: 'string', group: 'Content' },
    { key: 'tint', label: 'Tint', type: 'color', group: 'Style' },
  ];
}

// ─── Create Element from Palette Item ───
export function createElementFromPalette(item: PaletteItem): UIElement {
  return {
    id: generateId(),
    type: item.type,
    name: item.label,
    properties: { ...item.defaultProperties },
    children: [],
  };
}

// ─── Get Palette Item by Type ───
export function getPaletteItem(type: ElementType): PaletteItem | undefined {
  return PALETTE_ITEMS.find(item => item.type === type);
}

// ─── Check if Element Can Have Children ───
export function canHaveChildren(type: ElementType): boolean {
  const item = getPaletteItem(type);
  return item?.canHaveChildren ?? false;
}

