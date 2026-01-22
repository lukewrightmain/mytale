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

// ─── Complete Page Templates (Production-Ready) ───
export const PAGE_TEMPLATES: UITemplate[] = [
  // ════════════════════════════════════════════════════════════════════════
  // TEMPLATE 1: Simple Page - Basic dialog with title, content, buttons
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'simple-page',
    name: 'Simple Page',
    description: 'Basic page with title and content area',
    category: 'page',
    preview: '📄',
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
            anchor: { width: 500, height: 350 },
            layoutMode: 'Top',
            padding: { full: 20 },
          },
          children: [
            {
              id: 'tpl-title',
              type: 'Title',
              name: 'PageTitle',
              properties: { 
                macro: '$C.@Title', 
                text: 'My Dialog',
              },
              children: [],
            },
            {
              id: 'tpl-content',
              type: 'Group',
              name: 'Content',
              properties: { 
                layoutMode: 'Top',
                flexWeight: 1,
                padding: { top: 20, bottom: 20 },
              },
              children: [
                {
                  id: 'tpl-message',
                  type: 'Label',
                  name: 'Message',
                  properties: { 
                    text: 'This is your content area. Add elements here!',
                    alignment: 'Center',
                    style: { textColor: '#aaaaaa', fontSize: 14 },
                  },
                  children: [],
                },
              ],
            },
            {
              id: 'tpl-buttons',
              type: 'Group',
              name: 'ButtonRow',
              properties: { 
                layoutMode: 'MiddleCenter',
                anchor: { height: 50 },
              },
              children: [
                {
                  id: 'tpl-ok-btn',
                  type: 'TextButton',
                  name: 'OkButton',
                  properties: { 
                    macro: '$C.@TextButton',
                    text: 'Confirm',
                    anchor: { width: 120, height: 36, right: 10 },
                  },
                  children: [],
                },
                {
                  id: 'tpl-cancel-btn',
                  type: 'TextButton',
                  name: 'CancelButton',
                  properties: { 
                    macro: '$C.@TextButton',
                    text: 'Cancel',
                    anchor: { width: 120, height: 36 },
                  },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    settings: {
      pageType: 'InteractiveCustomUIPage',
      pageLifetime: 'CanDismiss',
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  // TEMPLATE 2: Scrollable List - For rewards, shop items, leaderboards
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'scrollable-list',
    name: 'Scrollable List',
    description: 'Page with scrollable list for items/cards',
    category: 'page',
    preview: '📋',
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
            anchor: { width: 600, height: 500 },
            layoutMode: 'Top',
          },
          children: [
            {
              id: 'tpl-header',
              type: 'Group',
              name: 'Header',
              properties: { 
                layoutMode: 'Left',
                padding: { full: 15 },
                anchor: { height: 60 },
              },
              children: [
                {
                  id: 'tpl-title',
                  type: 'Title',
                  name: 'Title',
                  properties: { 
                    macro: '$C.@Title', 
                    text: 'REWARDS',
                  },
                  children: [],
                },
              ],
            },
            {
              id: 'tpl-scrollarea',
              type: 'Group',
              name: 'ScrollArea',
              properties: { 
                layoutMode: 'TopScrolling',
                scrollbarStyle: '$C.@DefaultScrollbarStyle',
                flexWeight: 1,
                padding: { left: 15, right: 15 },
              },
              children: [
                // Sample Card 1
                {
                  id: 'tpl-card1',
                  type: 'Button',
                  name: 'RewardCard1',
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
                      id: 'tpl-card1-icon',
                      type: 'ItemIcon',
                      name: 'Icon',
                      properties: { 
                        anchor: { width: 56, height: 56 },
                        itemId: 'Weapon_Sword_Diamond',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-card1-info',
                      type: 'Group',
                      name: 'Info',
                      properties: { 
                        layoutMode: 'Top',
                        flexWeight: 1,
                        padding: { left: 15 },
                      },
                      children: [
                        {
                          id: 'tpl-card1-title',
                          type: 'Label',
                          name: 'Title',
                          properties: { 
                            text: 'Diamond Sword',
                            style: { fontSize: 16, renderBold: true, textColor: '#ffffff' },
                          },
                          children: [],
                        },
                        {
                          id: 'tpl-card1-desc',
                          type: 'Label',
                          name: 'Description',
                          properties: { 
                            text: 'A powerful weapon for skilled warriors',
                            style: { fontSize: 12, textColor: '#888888' },
                            anchor: { top: 4 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'tpl-card1-claim',
                      type: 'TextButton',
                      name: 'ClaimButton',
                      properties: { 
                        macro: '$C.@TextButton',
                        text: 'Claim',
                        anchor: { width: 80, height: 32 },
                      },
                      children: [],
                    },
                  ],
                },
                // Sample Card 2
                {
                  id: 'tpl-card2',
                  type: 'Button',
                  name: 'RewardCard2',
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
                      id: 'tpl-card2-icon',
                      type: 'ItemIcon',
                      name: 'Icon',
                      properties: { 
                        anchor: { width: 56, height: 56 },
                        itemId: 'Armor_Shield_Gold',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-card2-info',
                      type: 'Group',
                      name: 'Info',
                      properties: { 
                        layoutMode: 'Top',
                        flexWeight: 1,
                        padding: { left: 15 },
                      },
                      children: [
                        {
                          id: 'tpl-card2-title',
                          type: 'Label',
                          name: 'Title',
                          properties: { 
                            text: 'Golden Shield',
                            style: { fontSize: 16, renderBold: true, textColor: '#ffcc00' },
                          },
                          children: [],
                        },
                        {
                          id: 'tpl-card2-desc',
                          type: 'Label',
                          name: 'Description',
                          properties: { 
                            text: 'Legendary protection from ancient times',
                            style: { fontSize: 12, textColor: '#888888' },
                            anchor: { top: 4 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'tpl-card2-claim',
                      type: 'TextButton',
                      name: 'ClaimButton',
                      properties: { 
                        macro: '$C.@TextButton',
                        text: 'Claim',
                        anchor: { width: 80, height: 32 },
                      },
                      children: [],
                    },
                  ],
                },
                // Sample Card 3
                {
                  id: 'tpl-card3',
                  type: 'Button',
                  name: 'RewardCard3',
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
                      id: 'tpl-card3-icon',
                      type: 'ItemIcon',
                      name: 'Icon',
                      properties: { 
                        anchor: { width: 56, height: 56 },
                        itemId: 'Consumable_Potion_Health',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-card3-info',
                      type: 'Group',
                      name: 'Info',
                      properties: { 
                        layoutMode: 'Top',
                        flexWeight: 1,
                        padding: { left: 15 },
                      },
                      children: [
                        {
                          id: 'tpl-card3-title',
                          type: 'Label',
                          name: 'Title',
                          properties: { 
                            text: 'Health Potion x5',
                            style: { fontSize: 16, renderBold: true, textColor: '#ff6666' },
                          },
                          children: [],
                        },
                        {
                          id: 'tpl-card3-desc',
                          type: 'Label',
                          name: 'Description',
                          properties: { 
                            text: 'Restores health when consumed',
                            style: { fontSize: 12, textColor: '#888888' },
                            anchor: { top: 4 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'tpl-card3-claim',
                      type: 'TextButton',
                      name: 'ClaimButton',
                      properties: { 
                        macro: '$C.@TextButton',
                        text: 'Claim',
                        anchor: { width: 80, height: 32 },
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              id: 'tpl-footer',
              type: 'Group',
              name: 'Footer',
              properties: { 
                layoutMode: 'MiddleCenter',
                padding: { full: 15 },
                anchor: { height: 60 },
              },
              children: [
                {
                  id: 'tpl-close-btn',
                  type: 'BackButton',
                  name: 'CloseButton',
                  properties: { macro: '$C.@BackButton' },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    settings: {
      pageType: 'InteractiveCustomUIPage',
      pageLifetime: 'CanDismiss',
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  // TEMPLATE 3: Form Page - Settings, character creation, input forms
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'form-page',
    name: 'Form Page',
    description: 'Page with text inputs, checkboxes, and buttons',
    category: 'page',
    preview: '📝',
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
            anchor: { width: 450, height: 420 },
            layoutMode: 'Top',
            padding: { full: 25 },
          },
          children: [
            {
              id: 'tpl-title',
              type: 'Title',
              name: 'Title',
              properties: { 
                macro: '$C.@Title', 
                text: 'SETTINGS',
              },
              children: [],
            },
            {
              id: 'tpl-form',
              type: 'Group',
              name: 'FormContent',
              properties: { 
                layoutMode: 'Top',
                flexWeight: 1,
                padding: { top: 20 },
              },
              children: [
                // Username Field
                {
                  id: 'tpl-username-row',
                  type: 'Group',
                  name: 'UsernameRow',
                  properties: { 
                    layoutMode: 'Left',
                    anchor: { height: 45, bottom: 15 },
                  },
                  children: [
                    {
                      id: 'tpl-username-label',
                      type: 'Label',
                      name: 'UsernameLabel',
                      properties: { 
                        text: 'Username:',
                        style: { fontSize: 14, textColor: '#aaaaaa' },
                        anchor: { width: 100 },
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-username-input',
                      type: 'TextInput',
                      name: 'UsernameInput',
                      properties: { 
                        macro: '$C.@TextInput',
                        placeholder: 'Enter username...',
                        anchor: { width: 250, height: 32 },
                      },
                      children: [],
                    },
                  ],
                },
                // Volume Slider Row
                {
                  id: 'tpl-volume-row',
                  type: 'Group',
                  name: 'VolumeRow',
                  properties: { 
                    layoutMode: 'Left',
                    anchor: { height: 45, bottom: 15 },
                  },
                  children: [
                    {
                      id: 'tpl-volume-label',
                      type: 'Label',
                      name: 'VolumeLabel',
                      properties: { 
                        text: 'Volume:',
                        style: { fontSize: 14, textColor: '#aaaaaa' },
                        anchor: { width: 100 },
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-volume-bar',
                      type: 'ProgressBar',
                      name: 'VolumeBar',
                      properties: { 
                        anchor: { width: 200, height: 16 },
                        value: 0.7,
                        fillColor: '#88ccff',
                        backgroundColor: '#333333',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-volume-value',
                      type: 'Label',
                      name: 'VolumeValue',
                      properties: { 
                        text: '70%',
                        style: { fontSize: 12, textColor: '#888888' },
                        anchor: { left: 10, width: 40 },
                      },
                      children: [],
                    },
                  ],
                },
                // Checkbox options
                {
                  id: 'tpl-options',
                  type: 'Group',
                  name: 'Options',
                  properties: { 
                    layoutMode: 'Top',
                    padding: { top: 10 },
                  },
                  children: [
                    {
                      id: 'tpl-check1',
                      type: 'CheckBox',
                      name: 'EnableNotifications',
                      properties: { 
                        macro: '$C.@CheckBox',
                        label: 'Enable notifications',
                        anchor: { height: 30, bottom: 8 },
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-check2',
                      type: 'CheckBox',
                      name: 'ShowTips',
                      properties: { 
                        macro: '$C.@CheckBox',
                        label: 'Show gameplay tips',
                        anchor: { height: 30, bottom: 8 },
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-check3',
                      type: 'CheckBox',
                      name: 'AutoSave',
                      properties: { 
                        macro: '$C.@CheckBox',
                        label: 'Auto-save progress',
                        anchor: { height: 30, bottom: 8 },
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              id: 'tpl-buttons',
              type: 'Group',
              name: 'ButtonRow',
              properties: { 
                layoutMode: 'MiddleCenter',
                anchor: { height: 50 },
              },
              children: [
                {
                  id: 'tpl-save-btn',
                  type: 'TextButton',
                  name: 'SaveButton',
                  properties: { 
                    macro: '$C.@TextButton',
                    text: 'Save',
                    anchor: { width: 100, height: 36, right: 10 },
                  },
                  children: [],
                },
                {
                  id: 'tpl-cancel-btn',
                  type: 'BackButton',
                  name: 'CancelButton',
                  properties: { macro: '$C.@BackButton' },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    settings: {
      pageType: 'InteractiveCustomUIPage',
      pageLifetime: 'CanDismiss',
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  // TEMPLATE 4: Image Gallery - Cards with images
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'image-gallery',
    name: 'Image Gallery',
    description: 'Grid of image cards with descriptions',
    category: 'page',
    preview: '🖼️',
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
            anchor: { width: 700, height: 500 },
            layoutMode: 'Top',
          },
          children: [
            {
              id: 'tpl-header',
              type: 'Group',
              name: 'Header',
              properties: { 
                layoutMode: 'MiddleCenter',
                padding: { full: 15 },
                anchor: { height: 60 },
              },
              children: [
                {
                  id: 'tpl-title',
                  type: 'Title',
                  name: 'Title',
                  properties: { 
                    macro: '$C.@Title', 
                    text: 'GALLERY',
                  },
                  children: [],
                },
              ],
            },
            {
              id: 'tpl-grid',
              type: 'Group',
              name: 'ImageGrid',
              properties: { 
                layoutMode: 'Left',
                flexWeight: 1,
                padding: { full: 20 },
              },
              children: [
                // Image Card 1
                {
                  id: 'tpl-imgcard1',
                  type: 'Button',
                  name: 'ImageCard1',
                  properties: {
                    anchor: { width: 200, height: 250, right: 15 },
                    padding: { full: 10 },
                    background: { color: '#1a1a1a(0.8)' },
                    layoutMode: 'Top',
                    interactiveStyle: {
                      hovered: { background: '#2a2a2a(0.9)' },
                      pressed: { background: '#3a3a3a(0.95)' },
                    },
                  },
                  children: [
                    {
                      id: 'tpl-img1',
                      type: 'AssetImage',
                      name: 'Image',
                      properties: { 
                        anchor: { width: 180, height: 150 },
                        assetPath: 'Textures/MyImage1.png',
                        objectFit: 'cover',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-img1-title',
                      type: 'Label',
                      name: 'Title',
                      properties: { 
                        text: 'Forest Scene',
                        style: { fontSize: 14, renderBold: true, textColor: '#ffffff' },
                        anchor: { top: 10 },
                        alignment: 'Center',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-img1-desc',
                      type: 'Label',
                      name: 'Description',
                      properties: { 
                        text: 'A peaceful forest clearing',
                        style: { fontSize: 11, textColor: '#888888' },
                        anchor: { top: 5 },
                        alignment: 'Center',
                      },
                      children: [],
                    },
                  ],
                },
                // Image Card 2
                {
                  id: 'tpl-imgcard2',
                  type: 'Button',
                  name: 'ImageCard2',
                  properties: {
                    anchor: { width: 200, height: 250, right: 15 },
                    padding: { full: 10 },
                    background: { color: '#1a1a1a(0.8)' },
                    layoutMode: 'Top',
                    interactiveStyle: {
                      hovered: { background: '#2a2a2a(0.9)' },
                      pressed: { background: '#3a3a3a(0.95)' },
                    },
                  },
                  children: [
                    {
                      id: 'tpl-img2',
                      type: 'AssetImage',
                      name: 'Image',
                      properties: { 
                        anchor: { width: 180, height: 150 },
                        assetPath: 'Textures/MyImage2.png',
                        objectFit: 'cover',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-img2-title',
                      type: 'Label',
                      name: 'Title',
                      properties: { 
                        text: 'Mountain View',
                        style: { fontSize: 14, renderBold: true, textColor: '#ffffff' },
                        anchor: { top: 10 },
                        alignment: 'Center',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-img2-desc',
                      type: 'Label',
                      name: 'Description',
                      properties: { 
                        text: 'Snow-capped peaks at dawn',
                        style: { fontSize: 11, textColor: '#888888' },
                        anchor: { top: 5 },
                        alignment: 'Center',
                      },
                      children: [],
                    },
                  ],
                },
                // Image Card 3
                {
                  id: 'tpl-imgcard3',
                  type: 'Button',
                  name: 'ImageCard3',
                  properties: {
                    anchor: { width: 200, height: 250 },
                    padding: { full: 10 },
                    background: { color: '#1a1a1a(0.8)' },
                    layoutMode: 'Top',
                    interactiveStyle: {
                      hovered: { background: '#2a2a2a(0.9)' },
                      pressed: { background: '#3a3a3a(0.95)' },
                    },
                  },
                  children: [
                    {
                      id: 'tpl-img3',
                      type: 'AssetImage',
                      name: 'Image',
                      properties: { 
                        anchor: { width: 180, height: 150 },
                        assetPath: 'Textures/MyImage3.png',
                        objectFit: 'cover',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-img3-title',
                      type: 'Label',
                      name: 'Title',
                      properties: { 
                        text: 'Castle Ruins',
                        style: { fontSize: 14, renderBold: true, textColor: '#ffffff' },
                        anchor: { top: 10 },
                        alignment: 'Center',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-img3-desc',
                      type: 'Label',
                      name: 'Description',
                      properties: { 
                        text: 'Ancient stone walls remain',
                        style: { fontSize: 11, textColor: '#888888' },
                        anchor: { top: 5 },
                        alignment: 'Center',
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              id: 'tpl-footer',
              type: 'Group',
              name: 'Footer',
              properties: { 
                layoutMode: 'MiddleCenter',
                padding: { full: 15 },
                anchor: { height: 60 },
              },
              children: [
                {
                  id: 'tpl-close',
                  type: 'BackButton',
                  name: 'CloseButton',
                  properties: { macro: '$C.@BackButton' },
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

  // ════════════════════════════════════════════════════════════════════════
  // TEMPLATE 5: Inventory Page - Item grids with slots
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'inventory-page',
    name: 'Inventory Page',
    description: 'Item grid with slots and equipment',
    category: 'page',
    preview: '🎒',
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
            anchor: { width: 550, height: 450 },
            layoutMode: 'Top',
            padding: { full: 20 },
          },
          children: [
            {
              id: 'tpl-title',
              type: 'Title',
              name: 'Title',
              properties: { 
                macro: '$C.@Title', 
                text: 'INVENTORY',
              },
              children: [],
            },
            {
              id: 'tpl-main',
              type: 'Group',
              name: 'MainContent',
              properties: { 
                layoutMode: 'Left',
                flexWeight: 1,
                padding: { top: 15 },
              },
              children: [
                // Left: Character/Equipment preview
                {
                  id: 'tpl-equipment',
                  type: 'Group',
                  name: 'EquipmentSlots',
                  properties: { 
                    layoutMode: 'Top',
                    anchor: { width: 150 },
                    padding: { full: 10 },
                    background: { color: '#1a1a1a(0.5)' },
                  },
                  children: [
                    {
                      id: 'tpl-equip-label',
                      type: 'Label',
                      name: 'EquipLabel',
                      properties: { 
                        text: 'Equipment',
                        style: { fontSize: 14, renderBold: true, textColor: '#aaaaaa' },
                        alignment: 'Center',
                        anchor: { bottom: 10 },
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-helmet-slot',
                      type: 'ItemIcon',
                      name: 'HelmetSlot',
                      properties: { 
                        anchor: { width: 56, height: 56, bottom: 8 },
                        itemId: 'Armor_Helmet_Iron',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-chest-slot',
                      type: 'ItemIcon',
                      name: 'ChestSlot',
                      properties: { 
                        anchor: { width: 56, height: 56, bottom: 8 },
                        itemId: 'Armor_Chest_Iron',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-weapon-slot',
                      type: 'ItemIcon',
                      name: 'WeaponSlot',
                      properties: { 
                        anchor: { width: 56, height: 56 },
                        itemId: 'Weapon_Sword_Iron',
                      },
                      children: [],
                    },
                  ],
                },
                // Right: Item Grid
                {
                  id: 'tpl-items',
                  type: 'Group',
                  name: 'ItemsArea',
                  properties: { 
                    layoutMode: 'Top',
                    flexWeight: 1,
                    padding: { left: 20 },
                  },
                  children: [
                    {
                      id: 'tpl-items-label',
                      type: 'Label',
                      name: 'ItemsLabel',
                      properties: { 
                        text: 'Items',
                        style: { fontSize: 14, renderBold: true, textColor: '#aaaaaa' },
                        anchor: { bottom: 10 },
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-item-grid',
                      type: 'ItemGrid',
                      name: 'InventoryGrid',
                      properties: { 
                        slotsPerRow: 6,
                        slotSize: 48,
                        slotSpacing: 4,
                        slotIconSize: 44,
                        renderItemQualityBackground: true,
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            {
              id: 'tpl-footer',
              type: 'Group',
              name: 'Footer',
              properties: { 
                layoutMode: 'Left',
                anchor: { height: 50 },
                padding: { top: 10 },
              },
              children: [
                {
                  id: 'tpl-gold',
                  type: 'Group',
                  name: 'GoldDisplay',
                  properties: { 
                    layoutMode: 'Left',
                    flexWeight: 1,
                  },
                  children: [
                    {
                      id: 'tpl-gold-icon',
                      type: 'ItemIcon',
                      name: 'GoldIcon',
                      properties: { 
                        anchor: { width: 24, height: 24, right: 8 },
                        itemId: 'Currency_Gold',
                      },
                      children: [],
                    },
                    {
                      id: 'tpl-gold-amount',
                      type: 'Label',
                      name: 'GoldAmount',
                      properties: { 
                        text: '1,250',
                        style: { fontSize: 16, textColor: '#ffcc00' },
                      },
                      children: [],
                    },
                  ],
                },
                {
                  id: 'tpl-close',
                  type: 'BackButton',
                  name: 'CloseButton',
                  properties: { macro: '$C.@BackButton' },
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
    settings: {
      pageType: 'InteractiveCustomUIPage',
      pageLifetime: 'CanDismiss',
    },
  },

  // ════════════════════════════════════════════════════════════════════════
  // TEMPLATE 6: HUD Element - Always-visible overlay
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'hud-element',
    name: 'HUD Element',
    description: 'Always-visible overlay for game HUD',
    category: 'hud',
    preview: '🎮',
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

  // ════════════════════════════════════════════════════════════════════════
  // REUSABLE CARDS (for building your own pages)
  // ════════════════════════════════════════════════════════════════════════
  {
    id: 'item-card',
    name: 'Item Card',
    description: 'Reusable card for list items with icon, title, and description',
    category: 'card',
    preview: '🃏',
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
          properties: { anchor: { width: 56, height: 56 } },
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
                text: 'Item description goes here',
                style: { fontSize: 13, textColor: '#888888' },
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

// ─── Background Presets for Canva-like selection ───
export const BACKGROUND_PRESETS = [
  { name: 'Dark Gray', color: '#2a2a2a' },
  { name: 'Charcoal', color: '#1a1a1a' },
  { name: 'Deep Blue', color: '#1a2633' },
  { name: 'Dark Green', color: '#1a2a1a' },
  { name: 'Purple', color: '#2a1a33' },
  { name: 'Dark Red', color: '#2a1a1a' },
  { name: 'Transparent', color: 'transparent' },
];
