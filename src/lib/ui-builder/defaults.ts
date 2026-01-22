// ═══════════════════════════════════════════════════════════════════════════
// Hytale UI Builder - Default Values and Component Definitions
// Based on Hytale's UI system documentation
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
  UITemplate,
} from './types';

// ─── Generate Unique ID ───
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
}

// ─── Default Design Settings ───
export const DEFAULT_SETTINGS: DesignSettings = {
  canvasWidth: 800,
  canvasHeight: 600,
  commonUiPath: '../Common.ui',
  packageName: 'com.example.mod',
  className: 'MyCustomPage',
  uiFilePath: 'Pages/MyPage.ui',
  pageType: 'CustomUIPage',
  pageLifetime: 'CanDismiss',
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
      anchor: { width: 800, height: 600 },
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
  // ══════════════════════════════════════════════════════════════════════════
  // PRIMITIVES - Basic UI elements
  // ══════════════════════════════════════════════════════════════════════════
  {
    type: 'Group',
    label: 'Group',
    icon: '⬚',
    category: 'primitive',
    description: 'Container for organizing elements',
    canHaveChildren: true,
    defaultProperties: {
      layoutMode: 'Top',
      anchor: { width: 200, height: 200 },
      padding: { full: 10 },
    },
  },
  {
    type: 'Label',
    label: 'Label',
    icon: 'T',
    category: 'primitive',
    description: 'Text display',
    canHaveChildren: false,
    defaultProperties: {
      text: 'Label Text',
      alignment: 'Center',
      style: { textColor: '#ffffff', fontSize: 16 },
    },
  },
  {
    type: 'Button',
    label: 'Button',
    icon: '▢',
    category: 'primitive',
    description: 'Clickable button with hover/press states',
    canHaveChildren: true,
    defaultProperties: {
      anchor: { width: 150, height: 40, bottom: 8 },
      padding: { full: 10 },
      background: { color: '#1a1a1a(0.7)' },
      layoutMode: 'Left',
      interactiveStyle: {
        hovered: { background: '#2a2a2a(0.85)' },
        pressed: { background: '#3a3a3a(0.95)' },
      },
    },
  },
  {
    type: 'AssetImage',
    label: 'Image',
    icon: '🖼',
    category: 'primitive',
    description: 'Display images and textures',
    canHaveChildren: false,
    defaultProperties: {
      anchor: { width: 100, height: 100 },
      assetPath: '',
      imageSrc: '',
      objectFit: 'contain',
    },
  },
  {
    type: 'ItemIcon',
    label: 'Item Icon',
    icon: '⚔',
    category: 'primitive',
    description: 'Display game items (use .ItemId in Java)',
    canHaveChildren: false,
    defaultProperties: {
      anchor: { width: 64, height: 64 },
      itemId: 'Weapon_Sword_Iron',
    },
  },
  {
    type: 'ItemGrid',
    label: 'Item Grid',
    icon: '▦',
    category: 'primitive',
    description: 'Display items in a grid (inventory style)',
    canHaveChildren: false,
    defaultProperties: {
      slotsPerRow: 9,
      renderItemQualityBackground: true,
      infoDisplay: 'None',
      slotSize: 48,
      slotSpacing: 4,
      slotIconSize: 44,
    },
  },
  {
    type: 'ProgressBar',
    label: 'Progress Bar',
    icon: '▰',
    category: 'primitive',
    description: 'Show progress (0.0 to 1.0)',
    canHaveChildren: false,
    defaultProperties: {
      anchor: { width: 200, height: 20 },
      value: 0.5,
      fillColor: '#88ff88',
      backgroundColor: '#333333',
    },
  },
  {
    type: 'TimerLabel',
    label: 'Timer Label',
    icon: '⏱',
    category: 'primitive',
    description: 'Countdown or timer display',
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
    icon: '🎨',
    category: 'primitive',
    description: 'Color selection input',
    canHaveChildren: false,
    defaultProperties: {
      defaultColor: '#ffffff',
      anchor: { width: 100, height: 100 },
    },
  },
  {
    type: 'RawField',
    label: 'Text Field',
    icon: '📝',
    category: 'primitive',
    description: 'Text input field',
    canHaveChildren: false,
    defaultProperties: {
      placeholder: 'Enter text...',
      anchor: { width: 200, height: 32 },
      background: { color: '#333333' },
      style: { textColor: '#ffffff', fontSize: 14 },
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MACROS - Pre-styled components from Common.ui
  // ══════════════════════════════════════════════════════════════════════════
  {
    type: 'PageOverlay',
    label: 'Page Overlay',
    icon: '📄',
    category: 'macro',
    description: '$C.@PageOverlay - Full-screen overlay container',
    canHaveChildren: true,
    defaultProperties: {
      macro: '$C.@PageOverlay',
      layoutMode: 'MiddleCenter',
    },
  },
  {
    type: 'DecoratedContainer',
    label: 'Decorated Container',
    icon: '🪟',
    category: 'macro',
    description: '$C.@DecoratedContainer - Styled panel with border',
    canHaveChildren: true,
    defaultProperties: {
      macro: '$C.@DecoratedContainer',
      anchor: { width: 600, height: 400 },
    },
  },
  {
    type: 'Title',
    label: 'Title',
    icon: 'H',
    category: 'macro',
    description: '$C.@Title - Page title with @Text parameter',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C.@Title',
      text: 'PAGE TITLE',
    },
  },
  {
    type: 'TextButton',
    label: 'Text Button',
    icon: '🔘',
    category: 'macro',
    description: '$C.@TextButton - Styled button',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C.@TextButton',
      text: 'Button',
      anchor: { width: 140, height: 36 },
    },
  },
  {
    type: 'BackButton',
    label: 'Back Button',
    icon: '←',
    category: 'macro',
    description: '$C.@BackButton - Close/back navigation',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C.@BackButton',
    },
  },
  {
    type: 'CheckBox',
    label: 'Check Box',
    icon: '☑',
    category: 'macro',
    description: '$C.@CheckBox - Toggle checkbox',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C.@CheckBox',
      checked: false,
      label: 'Option',
      anchor: { width: 150, height: 24 },
    },
  },
  {
    type: 'TextInput',
    label: 'Text Input',
    icon: '✏️',
    category: 'macro',
    description: '$C.@TextInput - Styled text input',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C.@TextInput',
      placeholder: 'Enter text...',
      anchor: { width: 200, height: 32 },
    },
  },
  {
    type: 'NumberInput',
    label: 'Number Input',
    icon: '#',
    category: 'macro',
    description: '$C.@NumberInput - Number input with min/max',
    canHaveChildren: false,
    defaultProperties: {
      macro: '$C.@NumberInput',
      value: '0',
      min: 0,
      max: 100,
      anchor: { width: 120, height: 32 },
    },
  },
];

// ─── Page Templates ───
export const PAGE_TEMPLATES: UITemplate[] = [
  {
    id: 'simple-page',
    name: 'Simple Page',
    description: 'Basic page with title and content area',
    category: 'page',
    root: {
      id: 'tpl-root',
      type: 'PageOverlay',
      name: 'PageOverlay',
      properties: { macro: '$C.@PageOverlay' },
      children: [
        {
          id: 'tpl-container',
          type: 'DecoratedContainer',
          name: 'Container',
          properties: { 
            macro: '$C.@DecoratedContainer',
            anchor: { width: 600, height: 400 },
          },
          children: [
            {
              id: 'tpl-title-wrapper',
              type: 'Group',
              name: 'Title',
              properties: {},
              children: [
                {
                  id: 'tpl-title',
                  type: 'Title',
                  name: 'Title',
                  properties: { macro: '$C.@Title', text: 'PAGE TITLE' },
                  children: [],
                },
              ],
            },
            {
              id: 'tpl-content',
              type: 'Group',
              name: 'Content',
              properties: { 
                layoutMode: 'Top',
                padding: { full: 15 },
              },
              children: [],
            },
          ],
        },
      ],
    },
    settings: {
      pageType: 'CustomUIPage',
      pageLifetime: 'CanDismiss',
    },
  },
  {
    id: 'scrollable-list',
    name: 'Scrollable List',
    description: 'Page with scrollable list for items/cards',
    category: 'page',
    root: {
      id: 'tpl-root',
      type: 'PageOverlay',
      name: 'PageOverlay',
      properties: { macro: '$C.@PageOverlay' },
      children: [
        {
          id: 'tpl-container',
          type: 'DecoratedContainer',
          name: 'Container',
          properties: { 
            macro: '$C.@DecoratedContainer',
            anchor: { width: 800, height: 600 },
          },
          children: [
            {
              id: 'tpl-title-wrapper',
              type: 'Group',
              name: 'Title',
              properties: {},
              children: [
                {
                  id: 'tpl-title',
                  type: 'Title',
                  name: 'Title',
                  properties: { macro: '$C.@Title', text: 'LIST PAGE' },
                  children: [],
                },
              ],
            },
            {
              id: 'tpl-content',
              type: 'Group',
              name: 'Content',
              properties: { 
                layoutMode: 'TopScrolling',
                scrollbarStyle: '$C.@DefaultScrollbarStyle',
                padding: { full: 15 },
              },
              children: [
                {
                  id: 'tpl-list',
                  type: 'Group',
                  name: 'ItemList',
                  properties: { layoutMode: 'Top' },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    settings: {
      pageType: 'CustomUIPage',
      pageLifetime: 'CanDismiss',
    },
  },
  {
    id: 'item-card',
    name: 'Item Card',
    description: 'Reusable card for list items',
    category: 'card',
    root: {
      id: 'tpl-card',
      type: 'Button',
      name: 'Card',
      properties: {
        anchor: { height: 80, bottom: 10 },
        padding: { full: 12 },
        background: { color: '#1a1a1a(0.7)' },
        layoutMode: 'Left',
        interactiveStyle: {
          hovered: { background: '#2a2a2a(0.85)' },
          pressed: { background: '#3a3a3a(0.95)' },
        },
      },
      children: [
        {
          id: 'tpl-icon',
          type: 'ItemIcon',
          name: 'CardIcon',
          properties: { anchor: { width: 64, height: 64 } },
          children: [],
        },
        {
          id: 'tpl-info',
          type: 'Group',
          name: 'CardInfo',
          properties: { 
            layoutMode: 'Top',
            anchor: { left: 15 },
            flexWeight: 1,
          },
          children: [
            {
              id: 'tpl-card-title',
              type: 'Label',
              name: 'CardTitle',
              properties: { 
                text: 'Item Title',
                style: { fontSize: 18, renderBold: true, textColor: '#ffffff' },
              },
              children: [],
            },
            {
              id: 'tpl-card-desc',
              type: 'Label',
              name: 'CardDescription',
              properties: { 
                text: 'Item description',
                style: { fontSize: 14, textColor: '#aaaaaa' },
                anchor: { top: 4 },
              },
              children: [],
            },
          ],
        },
      ],
    },
    settings: {},
  },
  {
    id: 'hud-element',
    name: 'HUD Element',
    description: 'Always-visible overlay for game HUD',
    category: 'hud',
    root: {
      id: 'tpl-hud',
      type: 'Group',
      name: 'HUD',
      properties: {
        layoutMode: 'Left',
      },
      children: [
        {
          id: 'tpl-hud-content',
          type: 'Group',
          name: 'Content',
          properties: {
            background: { texturePath: '../../Common/TooltipDefaultBackground.png', border: 15 },
            padding: { full: 12 },
            layoutMode: 'Top',
          },
          children: [
            {
              id: 'tpl-hud-main',
              type: 'Label',
              name: 'MainText',
              properties: { 
                text: 'HUD Text',
                style: { fontSize: 20, renderBold: true, textColor: '#ffffff' },
              },
              children: [],
            },
            {
              id: 'tpl-hud-sub',
              type: 'Label',
              name: 'SubText',
              properties: { 
                text: 'Subtitle',
                style: { fontSize: 14, textColor: '#aaaaaa' },
                anchor: { top: 4 },
              },
              children: [],
            },
          ],
        },
      ],
    },
    settings: {
      pageType: 'CustomUIHud',
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
    isMacro: false,
    defaultProperties: {},
    propertyFields: getCommonPropertyFields(),
  },
  Label: {
    type: 'Label',
    uiKeyword: 'Label',
    hyuimlTag: 'p',
    supportsChildren: false,
    isMacro: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getLabelPropertyFields()],
  },
  TimerLabel: {
    type: 'TimerLabel',
    uiKeyword: 'TimerLabel',
    hyuimlTag: 'span',
    supportsChildren: false,
    isMacro: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getLabelPropertyFields()],
  },
  Button: {
    type: 'Button',
    uiKeyword: 'Button',
    hyuimlTag: 'button',
    supportsChildren: true,
    isMacro: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getButtonPropertyFields()],
  },
  ColorPicker: {
    type: 'ColorPicker',
    uiKeyword: 'ColorPicker',
    hyuimlTag: 'div',
    supportsChildren: false,
    isMacro: false,
    defaultProperties: {},
    propertyFields: getCommonPropertyFields(),
  },
  RawButton: {
    type: 'RawButton',
    uiKeyword: 'RawButton',
    hyuimlTag: 'button',
    supportsChildren: false,
    isMacro: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getButtonPropertyFields()],
  },
  RawField: {
    type: 'RawField',
    uiKeyword: 'RawField',
    hyuimlTag: 'input',
    supportsChildren: false,
    isMacro: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getFieldPropertyFields()],
  },
  AssetImage: {
    type: 'AssetImage',
    uiKeyword: 'AssetImage',
    hyuimlTag: 'div',
    supportsChildren: false,
    isMacro: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getImagePropertyFields()],
  },
  ItemIcon: {
    type: 'ItemIcon',
    uiKeyword: 'ItemIcon',
    hyuimlTag: 'div',
    supportsChildren: false,
    isMacro: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getItemIconPropertyFields()],
  },
  ItemGrid: {
    type: 'ItemGrid',
    uiKeyword: 'ItemGrid',
    hyuimlTag: 'div',
    supportsChildren: false,
    isMacro: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getItemGridPropertyFields()],
  },
  ProgressBar: {
    type: 'ProgressBar',
    uiKeyword: 'ProgressBar',
    hyuimlTag: 'div',
    supportsChildren: false,
    isMacro: false,
    defaultProperties: {},
    propertyFields: [...getCommonPropertyFields(), ...getProgressBarPropertyFields()],
  },
  PageOverlay: {
    type: 'PageOverlay',
    uiKeyword: '$C.@PageOverlay',
    hyuimlTag: 'div',
    supportsChildren: true,
    isMacro: true,
    defaultProperties: { macro: '$C.@PageOverlay' },
    propertyFields: getCommonPropertyFields(),
  },
  DecoratedContainer: {
    type: 'DecoratedContainer',
    uiKeyword: '$C.@DecoratedContainer',
    hyuimlTag: 'div',
    supportsChildren: true,
    isMacro: true,
    defaultProperties: { macro: '$C.@DecoratedContainer' },
    propertyFields: getCommonPropertyFields(),
  },
  Title: {
    type: 'Title',
    uiKeyword: '$C.@Title',
    hyuimlTag: 'h1',
    supportsChildren: false,
    isMacro: true,
    defaultProperties: { macro: '$C.@Title' },
    propertyFields: [...getCommonPropertyFields(), { key: 'text', label: '@Text', type: 'string', group: 'Content' }],
  },
  ContainerPanel: {
    type: 'ContainerPanel',
    uiKeyword: '$C.@ContainerPanel',
    hyuimlTag: 'div',
    supportsChildren: true,
    isMacro: true,
    defaultProperties: { macro: '$C.@ContainerPanel' },
    propertyFields: getCommonPropertyFields(),
  },
  TextButton: {
    type: 'TextButton',
    uiKeyword: '$C.@TextButton',
    hyuimlTag: 'button',
    supportsChildren: false,
    isMacro: true,
    defaultProperties: { macro: '$C.@TextButton' },
    propertyFields: [...getCommonPropertyFields(), ...getButtonPropertyFields()],
  },
  CancelButton: {
    type: 'CancelButton',
    uiKeyword: '$C.@CancelButton',
    hyuimlTag: 'button',
    supportsChildren: false,
    isMacro: true,
    defaultProperties: { macro: '$C.@CancelButton' },
    propertyFields: [...getCommonPropertyFields(), ...getButtonPropertyFields()],
  },
  CheckBox: {
    type: 'CheckBox',
    uiKeyword: '$C.@CheckBox',
    hyuimlTag: 'input',
    supportsChildren: false,
    isMacro: true,
    defaultProperties: { macro: '$C.@CheckBox' },
    propertyFields: getCommonPropertyFields(),
  },
  TextInput: {
    type: 'TextInput',
    uiKeyword: '$C.@TextInput',
    hyuimlTag: 'input',
    supportsChildren: false,
    isMacro: true,
    defaultProperties: { macro: '$C.@TextInput' },
    propertyFields: [...getCommonPropertyFields(), ...getFieldPropertyFields()],
  },
  NumberInput: {
    type: 'NumberInput',
    uiKeyword: '$C.@NumberInput',
    hyuimlTag: 'input',
    supportsChildren: false,
    isMacro: true,
    defaultProperties: { macro: '$C.@NumberInput' },
    propertyFields: [...getCommonPropertyFields(), ...getFieldPropertyFields()],
  },
  BackButton: {
    type: 'BackButton',
    uiKeyword: '$C.@BackButton',
    hyuimlTag: 'button',
    supportsChildren: false,
    isMacro: true,
    defaultProperties: { macro: '$C.@BackButton' },
    propertyFields: [...getCommonPropertyFields(), ...getButtonPropertyFields()],
  },
  ScrollbarStyle: {
    type: 'ScrollbarStyle',
    uiKeyword: '$C.@DefaultScrollbarStyle',
    hyuimlTag: 'div',
    supportsChildren: false,
    isMacro: true,
    defaultProperties: { macro: '$C.@DefaultScrollbarStyle' },
    propertyFields: [],
  },
};

// ─── Property Field Helpers ───
function getCommonPropertyFields(): PropertyField[] {
  return [
    { key: 'visible', label: 'Visible', type: 'boolean', group: 'Identity' },
    { key: 'layoutMode', label: 'Layout Mode', type: 'select', group: 'Layout', options: [
      { value: 'None', label: 'None' },
      { value: 'Top', label: 'Top (Vertical)' },
      { value: 'Left', label: 'Left (Horizontal)' },
      { value: 'Middle', label: 'Middle' },
      { value: 'Bottom', label: 'Bottom' },
      { value: 'MiddleCenter', label: 'MiddleCenter' },
      { value: 'TopLeft', label: 'TopLeft' },
      { value: 'TopRight', label: 'TopRight' },
      { value: 'BottomLeft', label: 'BottomLeft' },
      { value: 'BottomRight', label: 'BottomRight' },
      { value: 'TopScrolling', label: 'TopScrolling (Vertical + Scroll)' },
      { value: 'LeftScrolling', label: 'LeftScrolling (Horizontal + Scroll)' },
    ]},
    { key: 'flexWeight', label: 'Flex Weight', type: 'number', group: 'Layout', description: 'Takes remaining space' },
    { key: 'anchor', label: 'Anchor', type: 'anchor', group: 'Anchor & Size' },
    { key: 'padding', label: 'Padding', type: 'padding', group: 'Padding' },
    { key: 'background.color', label: 'Background Color', type: 'color', group: 'Background', description: 'Use #RRGGBB or #RRGGBB(alpha)' },
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
    { key: 'style.renderItalic', label: 'Italic', type: 'boolean', group: 'Style' },
    { key: 'style.horizontalAlignment', label: 'Horizontal Align', type: 'select', group: 'Style', options: [
      { value: 'Left', label: 'Left' },
      { value: 'Center', label: 'Center' },
      { value: 'Right', label: 'Right' },
    ]},
  ];
}

function getButtonPropertyFields(): PropertyField[] {
  return [
    { key: 'text', label: 'Text', type: 'string', group: 'Content' },
    { key: 'interactiveStyle.hovered.background', label: 'Hover Background', type: 'color', group: 'States' },
    { key: 'interactiveStyle.pressed.background', label: 'Pressed Background', type: 'color', group: 'States' },
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
    { key: 'assetPath', label: 'Asset Path', type: 'string', group: 'Content', description: 'Path to Hytale asset' },
    { key: 'imageSrc', label: 'Preview Image', type: 'string', group: 'Content', description: 'For editor preview only' },
    { key: 'objectFit', label: 'Fit Mode', type: 'select', group: 'Content', options: [
      { value: 'contain', label: 'Contain (Fit)' },
      { value: 'cover', label: 'Cover (Fill)' },
      { value: 'fill', label: 'Stretch' },
      { value: 'none', label: 'None (Original)' },
      { value: 'scale-down', label: 'Scale Down' },
    ]},
    { key: 'tint', label: 'Tint Color', type: 'color', group: 'Style' },
  ];
}

function getItemIconPropertyFields(): PropertyField[] {
  return [
    { key: 'itemId', label: 'Item ID', type: 'string', group: 'Content', description: 'e.g., Weapon_Sword_Iron' },
    { key: 'showQuantity', label: 'Show Quantity', type: 'boolean', group: 'Content' },
    { key: 'quantity', label: 'Quantity', type: 'number', group: 'Content' },
  ];
}

function getItemGridPropertyFields(): PropertyField[] {
  return [
    { key: 'slotsPerRow', label: 'Slots Per Row', type: 'number', group: 'Content' },
    { key: 'renderItemQualityBackground', label: 'Show Quality BG', type: 'boolean', group: 'Content' },
    { key: 'infoDisplay', label: 'Info Display', type: 'select', group: 'Content', options: [
      { value: 'None', label: 'None' },
      { value: 'Tooltip', label: 'Tooltip' },
      { value: 'Overlay', label: 'Overlay' },
    ]},
    { key: 'slotSize', label: 'Slot Size', type: 'number', group: 'Style' },
    { key: 'slotSpacing', label: 'Slot Spacing', type: 'number', group: 'Style' },
    { key: 'slotIconSize', label: 'Icon Size', type: 'number', group: 'Style' },
  ];
}

function getProgressBarPropertyFields(): PropertyField[] {
  return [
    { key: 'value', label: 'Value (0-1)', type: 'number', group: 'Content' },
    { key: 'barTexturePath', label: 'Fill Texture', type: 'string', group: 'Content' },
    { key: 'fillColor', label: 'Fill Color', type: 'color', group: 'Style' },
    { key: 'backgroundColor', label: 'Background Color', type: 'color', group: 'Style' },
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

// ─── Create Element from Template ───
export function createElementFromTemplate(template: UITemplate): UIElement {
  // Deep clone with new IDs
  function cloneWithNewIds(element: UIElement): UIElement {
    return {
      ...element,
      id: generateId(),
      properties: { ...element.properties },
      children: element.children.map(cloneWithNewIds),
    };
  }
  return cloneWithNewIds(template.root);
}

// ─── Get Palette Item by Type ───
export function getPaletteItem(type: ElementType): PaletteItem | undefined {
  return PALETTE_ITEMS.find(item => item.type === type);
}

// ─── Check if Element Can Have Children ───
export function canHaveChildren(type: ElementType): boolean {
  const item = getPaletteItem(type);
  if (item) return item.canHaveChildren;
  const def = COMPONENT_DEFINITIONS[type];
  return def?.supportsChildren ?? false;
}

// ─── Get Template by ID ───
export function getTemplate(id: string): UITemplate | undefined {
  return PAGE_TEMPLATES.find(t => t.id === id);
}

// ─── Color Reference (from Hytale UI docs) ───
export const COLOR_REFERENCE = {
  white: '#ffffff',
  gray: '#aaaaaa',
  muted: '#666666',
  success: '#88ff88',
  error: '#ff4444',
  warning: '#ffaa00',
  accent: '#ffcc00',
  bgDark: '#1a1a1a(0.7)',
  bgDarkHover: '#2a2a2a(0.85)',
  bgDarkPressed: '#3a3a3a(0.95)',
};
