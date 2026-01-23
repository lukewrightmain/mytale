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
    description: 'Container to hold other elements. Use for rows, columns, sections. Set LayoutMode to "Top" for vertical, "Left" for horizontal.',
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
    description: 'Display text. Use for titles, descriptions, stats. Change "Text" in properties to set content.',
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
    description: 'Clickable element. Can contain other elements like icons + text. Add click events in Java code.',
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
    description: 'Display images. Set "Asset Path" to your texture path (e.g., "Textures/MyMod/icon.png") or upload a preview image.',
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
    description: 'Display game items like swords, potions. Set the item dynamically in Java: uiBuilder.set("#Icon.ItemId", itemId);',
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
    description: 'Inventory-style grid for multiple items. Set slots per row and bind items in Java code.',
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
    description: 'Show progress from 0 to 1. Great for XP bars, health, loading. Update value in Java.',
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
    description: 'Countdown timer display. Set duration in Java and it auto-updates.',
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
    description: 'Let players choose a color. Get selected color via events in Java.',
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
    description: 'Text input for player typing. Get entered text via events in Java. Set placeholder text.',
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
    description: 'START HERE! Full-screen backdrop with darkening. Put DecoratedContainer inside this.',
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
    description: 'Main content panel with nice border. Put inside PageOverlay. Add your content here!',
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
    description: 'Pre-styled page title. Great for panel headers. Change text in properties.',
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
    description: 'Styled clickable button with text. Use for Buy, Confirm, Cancel. Bind events in Java.',
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
    description: 'Standard close/back button. Place at bottom of page. Auto-closes page when clicked.',
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
    description: 'Toggle on/off option. Use for settings. Get checked state via events in Java.',
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
    description: 'Styled text input field. For player names, search. Get typed text via events in Java.',
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
    description: 'Number input with +/- buttons. Set min/max. Use for quantities, settings.',
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
  // COMPLETE EXAMPLES - Ready-to-use fully populated UIs
  // ════════════════════════════════════════════════════════════════════════
  
  // Example 1: Killstreak Rewards (like in Hytale)
  {
    id: 'example-killstreak',
    name: 'Killstreak Rewards',
    description: 'Complete rewards page with tier icons, progression, and status',
    category: 'example',
    preview: '⚔️',
    root: {
      id: 'ks-root',
      type: 'PageOverlay',
      name: 'PageOverlay',
      properties: { macro: '$C.@PageOverlay' },
      children: [
        {
          id: 'ks-container',
          type: 'DecoratedContainer',
          name: 'Container',
          properties: { 
            macro: '$C.@DecoratedContainer',
            anchor: { width: 650, height: 520 },
            layoutMode: 'Top',
          },
          children: [
            // Header with title
            {
              id: 'ks-header',
              type: 'Group',
              name: 'Header',
              properties: { 
                layoutMode: 'MiddleCenter',
                anchor: { height: 50 },
                padding: { full: 10 },
              },
              children: [
                {
                  id: 'ks-title',
                  type: 'Label',
                  name: 'Title',
                  properties: { 
                    text: 'KILLSTREAK REWARDS',
                    alignment: 'Center',
                    style: { fontSize: 22, renderBold: true, textColor: '#d4af37' },
                  },
                  children: [],
                },
              ],
            },
            // Scrollable rewards list
            {
              id: 'ks-scrollarea',
              type: 'Group',
              name: 'ScrollArea',
              properties: { 
                layoutMode: 'TopScrolling',
                scrollbarStyle: '$C.@DefaultScrollbarStyle',
                flexWeight: 1,
                padding: { left: 15, right: 15 },
              },
              children: [
                // Tier 1: Kringla
                {
                  id: 'ks-tier1',
                  type: 'Button',
                  name: 'Tier1',
                  properties: {
                    anchor: { height: 70, bottom: 8 },
                    padding: { full: 10 },
                    background: { color: '#1a3050(0.8)' },
                    layoutMode: 'Left',
                    interactiveStyle: {
                      hovered: { background: '#2a4060(0.9)' },
                      pressed: { background: '#3a5070(0.95)' },
                    },
                  },
                  children: [
                    {
                      id: 'ks-tier1-icon',
                      type: 'AssetImage',
                      name: 'Icon',
                      properties: { 
                        anchor: { width: 48, height: 48 },
                        imageSrc: '/images/ui-builder/killstreakicons/tier1.png',
                        objectFit: 'contain',
                      },
                      children: [],
                    },
                    {
                      id: 'ks-tier1-info',
                      type: 'Group',
                      name: 'Info',
                      properties: { 
                        layoutMode: 'Top',
                        flexWeight: 1,
                        padding: { left: 12 },
                      },
                      children: [
                        {
                          id: 'ks-tier1-name',
                          type: 'Label',
                          name: 'Name',
                          properties: { 
                            text: 'Kringla',
                            style: { fontSize: 16, renderBold: true, textColor: '#ffffff' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier1-desc',
                          type: 'Label',
                          name: 'Desc',
                          properties: { 
                            text: '(Circle/Beginning) Random Copper Weapon',
                            style: { fontSize: 11, textColor: '#888888' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier1-progress',
                          type: 'Label',
                          name: 'Progress',
                          properties: { 
                            text: '0/3 Kills - 3 more needed',
                            style: { fontSize: 11, textColor: '#66aaff' },
                            anchor: { top: 2 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'ks-tier1-status',
                      type: 'Label',
                      name: 'Status',
                      properties: { 
                        text: 'LOCKED',
                        style: { fontSize: 12, textColor: '#ff6666' },
                      },
                      children: [],
                    },
                  ],
                },
                // Tier 2: Einherjar
                {
                  id: 'ks-tier2',
                  type: 'Button',
                  name: 'Tier2',
                  properties: {
                    anchor: { height: 70, bottom: 8 },
                    padding: { full: 10 },
                    background: { color: '#1a3050(0.8)' },
                    layoutMode: 'Left',
                    interactiveStyle: {
                      hovered: { background: '#2a4060(0.9)' },
                      pressed: { background: '#3a5070(0.95)' },
                    },
                  },
                  children: [
                    {
                      id: 'ks-tier2-icon',
                      type: 'AssetImage',
                      name: 'Icon',
                      properties: { 
                        anchor: { width: 48, height: 48 },
                        imageSrc: '/images/ui-builder/killstreakicons/tier2.png',
                        objectFit: 'contain',
                      },
                      children: [],
                    },
                    {
                      id: 'ks-tier2-info',
                      type: 'Group',
                      name: 'Info',
                      properties: { 
                        layoutMode: 'Top',
                        flexWeight: 1,
                        padding: { left: 12 },
                      },
                      children: [
                        {
                          id: 'ks-tier2-name',
                          type: 'Label',
                          name: 'Name',
                          properties: { 
                            text: 'Einherjar',
                            style: { fontSize: 16, renderBold: true, textColor: '#ffffff' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier2-desc',
                          type: 'Label',
                          name: 'Desc',
                          properties: { 
                            text: '(Single Fighter) +10% Speed + Bronze Weapon',
                            style: { fontSize: 11, textColor: '#888888' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier2-progress',
                          type: 'Label',
                          name: 'Progress',
                          properties: { 
                            text: '0/5 Kills - 5 more needed',
                            style: { fontSize: 11, textColor: '#66aaff' },
                            anchor: { top: 2 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'ks-tier2-status',
                      type: 'Label',
                      name: 'Status',
                      properties: { 
                        text: 'LOCKED',
                        style: { fontSize: 12, textColor: '#ff6666' },
                      },
                      children: [],
                    },
                  ],
                },
                // Tier 3: Berserkr
                {
                  id: 'ks-tier3',
                  type: 'Button',
                  name: 'Tier3',
                  properties: {
                    anchor: { height: 70, bottom: 8 },
                    padding: { full: 10 },
                    background: { color: '#1a3050(0.8)' },
                    layoutMode: 'Left',
                    interactiveStyle: {
                      hovered: { background: '#2a4060(0.9)' },
                      pressed: { background: '#3a5070(0.95)' },
                    },
                  },
                  children: [
                    {
                      id: 'ks-tier3-icon',
                      type: 'AssetImage',
                      name: 'Icon',
                      properties: { 
                        anchor: { width: 48, height: 48 },
                        imageSrc: '/images/ui-builder/killstreakicons/tier3.png',
                        objectFit: 'contain',
                      },
                      children: [],
                    },
                    {
                      id: 'ks-tier3-info',
                      type: 'Group',
                      name: 'Info',
                      properties: { 
                        layoutMode: 'Top',
                        flexWeight: 1,
                        padding: { left: 12 },
                      },
                      children: [
                        {
                          id: 'ks-tier3-name',
                          type: 'Label',
                          name: 'Name',
                          properties: { 
                            text: 'Berserkr',
                            style: { fontSize: 16, renderBold: true, textColor: '#ffffff' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier3-desc',
                          type: 'Label',
                          name: 'Desc',
                          properties: { 
                            text: '(Berserker) +20% Attack, +15% Speed',
                            style: { fontSize: 11, textColor: '#888888' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier3-progress',
                          type: 'Label',
                          name: 'Progress',
                          properties: { 
                            text: '0/10 Kills - 10 more needed',
                            style: { fontSize: 11, textColor: '#66aaff' },
                            anchor: { top: 2 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'ks-tier3-status',
                      type: 'Label',
                      name: 'Status',
                      properties: { 
                        text: 'LOCKED',
                        style: { fontSize: 12, textColor: '#ff6666' },
                      },
                      children: [],
                    },
                  ],
                },
                // Tier 4: Drengr
                {
                  id: 'ks-tier4',
                  type: 'Button',
                  name: 'Tier4',
                  properties: {
                    anchor: { height: 70, bottom: 8 },
                    padding: { full: 10 },
                    background: { color: '#1a3050(0.8)' },
                    layoutMode: 'Left',
                    interactiveStyle: {
                      hovered: { background: '#2a4060(0.9)' },
                      pressed: { background: '#3a5070(0.95)' },
                    },
                  },
                  children: [
                    {
                      id: 'ks-tier4-icon',
                      type: 'AssetImage',
                      name: 'Icon',
                      properties: { 
                        anchor: { width: 48, height: 48 },
                        imageSrc: '/images/ui-builder/killstreakicons/tier4.png',
                        objectFit: 'contain',
                      },
                      children: [],
                    },
                    {
                      id: 'ks-tier4-info',
                      type: 'Group',
                      name: 'Info',
                      properties: { 
                        layoutMode: 'Top',
                        flexWeight: 1,
                        padding: { left: 12 },
                      },
                      children: [
                        {
                          id: 'ks-tier4-name',
                          type: 'Label',
                          name: 'Name',
                          properties: { 
                            text: 'Drengr',
                            style: { fontSize: 16, renderBold: true, textColor: '#ffffff' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier4-desc',
                          type: 'Label',
                          name: 'Desc',
                          properties: { 
                            text: '(Warrior) +15% Defense + Iron Weapon',
                            style: { fontSize: 11, textColor: '#888888' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier4-progress',
                          type: 'Label',
                          name: 'Progress',
                          properties: { 
                            text: '0/15 Kills - 15 more needed',
                            style: { fontSize: 11, textColor: '#66aaff' },
                            anchor: { top: 2 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'ks-tier4-status',
                      type: 'Label',
                      name: 'Status',
                      properties: { 
                        text: 'LOCKED',
                        style: { fontSize: 12, textColor: '#ff6666' },
                      },
                      children: [],
                    },
                  ],
                },
                // Tier 5: Ulfhednar
                {
                  id: 'ks-tier5',
                  type: 'Button',
                  name: 'Tier5',
                  properties: {
                    anchor: { height: 70, bottom: 8 },
                    padding: { full: 10 },
                    background: { color: '#1a3050(0.8)' },
                    layoutMode: 'Left',
                    interactiveStyle: {
                      hovered: { background: '#2a4060(0.9)' },
                      pressed: { background: '#3a5070(0.95)' },
                    },
                  },
                  children: [
                    {
                      id: 'ks-tier5-icon',
                      type: 'AssetImage',
                      name: 'Icon',
                      properties: { 
                        anchor: { width: 48, height: 48 },
                        imageSrc: '/images/ui-builder/killstreakicons/tier5.png',
                        objectFit: 'contain',
                      },
                      children: [],
                    },
                    {
                      id: 'ks-tier5-info',
                      type: 'Group',
                      name: 'Info',
                      properties: { 
                        layoutMode: 'Top',
                        flexWeight: 1,
                        padding: { left: 12 },
                      },
                      children: [
                        {
                          id: 'ks-tier5-name',
                          type: 'Label',
                          name: 'Name',
                          properties: { 
                            text: 'Ulfhednar',
                            style: { fontSize: 16, renderBold: true, textColor: '#ffffff' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier5-desc',
                          type: 'Label',
                          name: 'Desc',
                          properties: { 
                            text: '(Wolf-Warrior) All Buffs + Steel Sword',
                            style: { fontSize: 11, textColor: '#888888' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier5-progress',
                          type: 'Label',
                          name: 'Progress',
                          properties: { 
                            text: '0/20 Kills - 20 more needed',
                            style: { fontSize: 11, textColor: '#66aaff' },
                            anchor: { top: 2 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'ks-tier5-status',
                      type: 'Label',
                      name: 'Status',
                      properties: { 
                        text: 'LOCKED',
                        style: { fontSize: 12, textColor: '#ff6666' },
                      },
                      children: [],
                    },
                  ],
                },
                // Tier 6: Ragnarok
                {
                  id: 'ks-tier6',
                  type: 'Button',
                  name: 'Tier6',
                  properties: {
                    anchor: { height: 70, bottom: 8 },
                    padding: { full: 10 },
                    background: { color: '#3a1a1a(0.8)' },
                    layoutMode: 'Left',
                    interactiveStyle: {
                      hovered: { background: '#4a2a2a(0.9)' },
                      pressed: { background: '#5a3a3a(0.95)' },
                    },
                  },
                  children: [
                    {
                      id: 'ks-tier6-icon',
                      type: 'AssetImage',
                      name: 'Icon',
                      properties: { 
                        anchor: { width: 48, height: 48 },
                        imageSrc: '/images/ui-builder/killstreakicons/tier6.png',
                        objectFit: 'contain',
                      },
                      children: [],
                    },
                    {
                      id: 'ks-tier6-info',
                      type: 'Group',
                      name: 'Info',
                      properties: { 
                        layoutMode: 'Top',
                        flexWeight: 1,
                        padding: { left: 12 },
                      },
                      children: [
                        {
                          id: 'ks-tier6-name',
                          type: 'Label',
                          name: 'Name',
                          properties: { 
                            text: 'Ragnarök',
                            style: { fontSize: 16, renderBold: true, textColor: '#ffcc00' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier6-desc',
                          type: 'Label',
                          name: 'Desc',
                          properties: { 
                            text: '(End of Days) Ultimate Power + Legendary Weapon',
                            style: { fontSize: 11, textColor: '#888888' },
                          },
                          children: [],
                        },
                        {
                          id: 'ks-tier6-progress',
                          type: 'Label',
                          name: 'Progress',
                          properties: { 
                            text: '0/30 Kills - 30 more needed',
                            style: { fontSize: 11, textColor: '#ffaa00' },
                            anchor: { top: 2 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'ks-tier6-status',
                      type: 'Label',
                      name: 'Status',
                      properties: { 
                        text: 'LOCKED',
                        style: { fontSize: 12, textColor: '#ff6666' },
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            // Footer with back button
            {
              id: 'ks-footer',
              type: 'Group',
              name: 'Footer',
              properties: { 
                layoutMode: 'MiddleCenter',
                padding: { full: 10 },
                anchor: { height: 50 },
              },
              children: [
                {
                  id: 'ks-back',
                  type: 'BackButton',
                  name: 'BackButton',
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
      className: 'KillstreakRewardsPage',
      uiFilePath: 'Pages/KillstreakRewards.ui',
    },
  },

  // Example 2: Item Shop
  {
    id: 'example-shop',
    name: 'Item Shop',
    description: 'Complete shop with items, prices, and buy buttons',
    category: 'example',
    preview: '🛒',
    root: {
      id: 'shop-root',
      type: 'PageOverlay',
      name: 'PageOverlay',
      properties: { macro: '$C.@PageOverlay' },
      children: [
        {
          id: 'shop-container',
          type: 'DecoratedContainer',
          name: 'Container',
          properties: { 
            macro: '$C.@DecoratedContainer',
            anchor: { width: 700, height: 500 },
            layoutMode: 'Top',
          },
          children: [
            // Header
            {
              id: 'shop-header',
              type: 'Group',
              name: 'Header',
              properties: { 
                layoutMode: 'Left',
                anchor: { height: 60 },
                padding: { full: 15 },
              },
              children: [
                {
                  id: 'shop-title',
                  type: 'Label',
                  name: 'Title',
                  properties: { 
                    text: '🏪 ITEM SHOP',
                    style: { fontSize: 24, renderBold: true, textColor: '#ffffff' },
                  },
                  children: [],
                },
                {
                  id: 'shop-gold',
                  type: 'Group',
                  name: 'GoldDisplay',
                  properties: { 
                    layoutMode: 'Left',
                    anchor: { right: 0 },
                  },
                  children: [
                    {
                      id: 'shop-gold-icon',
                      type: 'Label',
                      name: 'GoldIcon',
                      properties: { 
                        text: '💰',
                        style: { fontSize: 18 },
                      },
                      children: [],
                    },
                    {
                      id: 'shop-gold-amount',
                      type: 'Label',
                      name: 'GoldAmount',
                      properties: { 
                        text: '1,250 Gold',
                        style: { fontSize: 16, textColor: '#ffcc00' },
                        anchor: { left: 5 },
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            // Items grid
            {
              id: 'shop-items',
              type: 'Group',
              name: 'ItemsGrid',
              properties: { 
                layoutMode: 'Left',
                flexWeight: 1,
                padding: { full: 15 },
              },
              children: [
                // Item 1: Sword
                {
                  id: 'shop-item1',
                  type: 'Button',
                  name: 'Item1',
                  properties: {
                    anchor: { width: 150, height: 180, right: 15 },
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
                      id: 'shop-item1-icon',
                      type: 'ItemIcon',
                      name: 'Icon',
                      properties: { anchor: { width: 64, height: 64 }, itemId: 'Weapon_Sword_Iron' },
                      children: [],
                    },
                    {
                      id: 'shop-item1-name',
                      type: 'Label',
                      name: 'Name',
                      properties: { 
                        text: 'Iron Sword',
                        style: { fontSize: 14, renderBold: true, textColor: '#ffffff' },
                        alignment: 'Center',
                        anchor: { top: 8 },
                      },
                      children: [],
                    },
                    {
                      id: 'shop-item1-price',
                      type: 'Label',
                      name: 'Price',
                      properties: { 
                        text: '💰 100',
                        style: { fontSize: 12, textColor: '#ffcc00' },
                        alignment: 'Center',
                        anchor: { top: 4 },
                      },
                      children: [],
                    },
                    {
                      id: 'shop-item1-buy',
                      type: 'TextButton',
                      name: 'BuyBtn',
                      properties: { 
                        macro: '$C.@TextButton',
                        text: 'Buy',
                        anchor: { width: 80, height: 28, top: 8 },
                      },
                      children: [],
                    },
                  ],
                },
                // Item 2: Shield
                {
                  id: 'shop-item2',
                  type: 'Button',
                  name: 'Item2',
                  properties: {
                    anchor: { width: 150, height: 180, right: 15 },
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
                      id: 'shop-item2-icon',
                      type: 'ItemIcon',
                      name: 'Icon',
                      properties: { anchor: { width: 64, height: 64 }, itemId: 'Armor_Shield_Wood' },
                      children: [],
                    },
                    {
                      id: 'shop-item2-name',
                      type: 'Label',
                      name: 'Name',
                      properties: { 
                        text: 'Wooden Shield',
                        style: { fontSize: 14, renderBold: true, textColor: '#ffffff' },
                        alignment: 'Center',
                        anchor: { top: 8 },
                      },
                      children: [],
                    },
                    {
                      id: 'shop-item2-price',
                      type: 'Label',
                      name: 'Price',
                      properties: { 
                        text: '💰 75',
                        style: { fontSize: 12, textColor: '#ffcc00' },
                        alignment: 'Center',
                        anchor: { top: 4 },
                      },
                      children: [],
                    },
                    {
                      id: 'shop-item2-buy',
                      type: 'TextButton',
                      name: 'BuyBtn',
                      properties: { 
                        macro: '$C.@TextButton',
                        text: 'Buy',
                        anchor: { width: 80, height: 28, top: 8 },
                      },
                      children: [],
                    },
                  ],
                },
                // Item 3: Potion
                {
                  id: 'shop-item3',
                  type: 'Button',
                  name: 'Item3',
                  properties: {
                    anchor: { width: 150, height: 180, right: 15 },
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
                      id: 'shop-item3-icon',
                      type: 'ItemIcon',
                      name: 'Icon',
                      properties: { anchor: { width: 64, height: 64 }, itemId: 'Consumable_Potion_Health' },
                      children: [],
                    },
                    {
                      id: 'shop-item3-name',
                      type: 'Label',
                      name: 'Name',
                      properties: { 
                        text: 'Health Potion',
                        style: { fontSize: 14, renderBold: true, textColor: '#ff6666' },
                        alignment: 'Center',
                        anchor: { top: 8 },
                      },
                      children: [],
                    },
                    {
                      id: 'shop-item3-price',
                      type: 'Label',
                      name: 'Price',
                      properties: { 
                        text: '💰 25',
                        style: { fontSize: 12, textColor: '#ffcc00' },
                        alignment: 'Center',
                        anchor: { top: 4 },
                      },
                      children: [],
                    },
                    {
                      id: 'shop-item3-buy',
                      type: 'TextButton',
                      name: 'BuyBtn',
                      properties: { 
                        macro: '$C.@TextButton',
                        text: 'Buy',
                        anchor: { width: 80, height: 28, top: 8 },
                      },
                      children: [],
                    },
                  ],
                },
                // Item 4: Arrow
                {
                  id: 'shop-item4',
                  type: 'Button',
                  name: 'Item4',
                  properties: {
                    anchor: { width: 150, height: 180 },
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
                      id: 'shop-item4-icon',
                      type: 'ItemIcon',
                      name: 'Icon',
                      properties: { anchor: { width: 64, height: 64 }, itemId: 'Weapon_Bow_Wood' },
                      children: [],
                    },
                    {
                      id: 'shop-item4-name',
                      type: 'Label',
                      name: 'Name',
                      properties: { 
                        text: 'Wooden Bow',
                        style: { fontSize: 14, renderBold: true, textColor: '#8b4513' },
                        alignment: 'Center',
                        anchor: { top: 8 },
                      },
                      children: [],
                    },
                    {
                      id: 'shop-item4-price',
                      type: 'Label',
                      name: 'Price',
                      properties: { 
                        text: '💰 150',
                        style: { fontSize: 12, textColor: '#ffcc00' },
                        alignment: 'Center',
                        anchor: { top: 4 },
                      },
                      children: [],
                    },
                    {
                      id: 'shop-item4-buy',
                      type: 'TextButton',
                      name: 'BuyBtn',
                      properties: { 
                        macro: '$C.@TextButton',
                        text: 'Buy',
                        anchor: { width: 80, height: 28, top: 8 },
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            // Footer
            {
              id: 'shop-footer',
              type: 'Group',
              name: 'Footer',
              properties: { 
                layoutMode: 'MiddleCenter',
                padding: { full: 15 },
                anchor: { height: 60 },
              },
              children: [
                {
                  id: 'shop-back',
                  type: 'BackButton',
                  name: 'BackButton',
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
      className: 'ItemShopPage',
      uiFilePath: 'Pages/ItemShop.ui',
    },
  },

  // Example 3: Leaderboard
  {
    id: 'example-leaderboard',
    name: 'Leaderboard',
    description: 'Player rankings with scores and positions',
    category: 'example',
    preview: '🏆',
    root: {
      id: 'lb-root',
      type: 'PageOverlay',
      name: 'PageOverlay',
      properties: { macro: '$C.@PageOverlay' },
      children: [
        {
          id: 'lb-container',
          type: 'DecoratedContainer',
          name: 'Container',
          properties: { 
            macro: '$C.@DecoratedContainer',
            anchor: { width: 500, height: 480 },
            layoutMode: 'Top',
          },
          children: [
            // Header
            {
              id: 'lb-header',
              type: 'Group',
              name: 'Header',
              properties: { 
                layoutMode: 'MiddleCenter',
                anchor: { height: 60 },
                padding: { full: 15 },
              },
              children: [
                {
                  id: 'lb-title',
                  type: 'Label',
                  name: 'Title',
                  properties: { 
                    text: '🏆 LEADERBOARD',
                    style: { fontSize: 24, renderBold: true, textColor: '#ffcc00' },
                    alignment: 'Center',
                  },
                  children: [],
                },
              ],
            },
            // Leaderboard entries
            {
              id: 'lb-list',
              type: 'Group',
              name: 'LeaderboardList',
              properties: { 
                layoutMode: 'Top',
                flexWeight: 1,
                padding: { left: 15, right: 15 },
              },
              children: [
                // 1st Place
                {
                  id: 'lb-entry1',
                  type: 'Group',
                  name: 'Entry1',
                  properties: {
                    anchor: { height: 50, bottom: 8 },
                    padding: { left: 15, right: 15 },
                    background: { color: '#ffd700(0.2)' },
                    layoutMode: 'Left',
                  },
                  children: [
                    {
                      id: 'lb-entry1-rank',
                      type: 'Label',
                      name: 'Rank',
                      properties: { 
                        text: '🥇',
                        style: { fontSize: 24 },
                        anchor: { width: 40 },
                      },
                      children: [],
                    },
                    {
                      id: 'lb-entry1-name',
                      type: 'Label',
                      name: 'Name',
                      properties: { 
                        text: 'DragonSlayer99',
                        style: { fontSize: 16, renderBold: true, textColor: '#ffd700' },
                        anchor: { left: 10 },
                      },
                      children: [],
                    },
                    {
                      id: 'lb-entry1-score',
                      type: 'Label',
                      name: 'Score',
                      properties: { 
                        text: '15,420 pts',
                        style: { fontSize: 14, textColor: '#ffffff' },
                        anchor: { right: 0 },
                      },
                      children: [],
                    },
                  ],
                },
                // 2nd Place
                {
                  id: 'lb-entry2',
                  type: 'Group',
                  name: 'Entry2',
                  properties: {
                    anchor: { height: 50, bottom: 8 },
                    padding: { left: 15, right: 15 },
                    background: { color: '#c0c0c0(0.2)' },
                    layoutMode: 'Left',
                  },
                  children: [
                    {
                      id: 'lb-entry2-rank',
                      type: 'Label',
                      name: 'Rank',
                      properties: { 
                        text: '🥈',
                        style: { fontSize: 24 },
                        anchor: { width: 40 },
                      },
                      children: [],
                    },
                    {
                      id: 'lb-entry2-name',
                      type: 'Label',
                      name: 'Name',
                      properties: { 
                        text: 'ShadowNinja',
                        style: { fontSize: 16, renderBold: true, textColor: '#c0c0c0' },
                        anchor: { left: 10 },
                      },
                      children: [],
                    },
                    {
                      id: 'lb-entry2-score',
                      type: 'Label',
                      name: 'Score',
                      properties: { 
                        text: '12,850 pts',
                        style: { fontSize: 14, textColor: '#ffffff' },
                        anchor: { right: 0 },
                      },
                      children: [],
                    },
                  ],
                },
                // 3rd Place
                {
                  id: 'lb-entry3',
                  type: 'Group',
                  name: 'Entry3',
                  properties: {
                    anchor: { height: 50, bottom: 8 },
                    padding: { left: 15, right: 15 },
                    background: { color: '#cd7f32(0.2)' },
                    layoutMode: 'Left',
                  },
                  children: [
                    {
                      id: 'lb-entry3-rank',
                      type: 'Label',
                      name: 'Rank',
                      properties: { 
                        text: '🥉',
                        style: { fontSize: 24 },
                        anchor: { width: 40 },
                      },
                      children: [],
                    },
                    {
                      id: 'lb-entry3-name',
                      type: 'Label',
                      name: 'Name',
                      properties: { 
                        text: 'MysticMage',
                        style: { fontSize: 16, renderBold: true, textColor: '#cd7f32' },
                        anchor: { left: 10 },
                      },
                      children: [],
                    },
                    {
                      id: 'lb-entry3-score',
                      type: 'Label',
                      name: 'Score',
                      properties: { 
                        text: '10,200 pts',
                        style: { fontSize: 14, textColor: '#ffffff' },
                        anchor: { right: 0 },
                      },
                      children: [],
                    },
                  ],
                },
                // 4th Place
                {
                  id: 'lb-entry4',
                  type: 'Group',
                  name: 'Entry4',
                  properties: {
                    anchor: { height: 45, bottom: 6 },
                    padding: { left: 15, right: 15 },
                    background: { color: '#1a1a1a(0.5)' },
                    layoutMode: 'Left',
                  },
                  children: [
                    {
                      id: 'lb-entry4-rank',
                      type: 'Label',
                      name: 'Rank',
                      properties: { 
                        text: '#4',
                        style: { fontSize: 16, textColor: '#888888' },
                        anchor: { width: 40 },
                      },
                      children: [],
                    },
                    {
                      id: 'lb-entry4-name',
                      type: 'Label',
                      name: 'Name',
                      properties: { 
                        text: 'SwiftArcher',
                        style: { fontSize: 14, textColor: '#ffffff' },
                        anchor: { left: 10 },
                      },
                      children: [],
                    },
                    {
                      id: 'lb-entry4-score',
                      type: 'Label',
                      name: 'Score',
                      properties: { 
                        text: '8,750 pts',
                        style: { fontSize: 14, textColor: '#aaaaaa' },
                        anchor: { right: 0 },
                      },
                      children: [],
                    },
                  ],
                },
                // 5th Place
                {
                  id: 'lb-entry5',
                  type: 'Group',
                  name: 'Entry5',
                  properties: {
                    anchor: { height: 45, bottom: 6 },
                    padding: { left: 15, right: 15 },
                    background: { color: '#1a1a1a(0.5)' },
                    layoutMode: 'Left',
                  },
                  children: [
                    {
                      id: 'lb-entry5-rank',
                      type: 'Label',
                      name: 'Rank',
                      properties: { 
                        text: '#5',
                        style: { fontSize: 16, textColor: '#888888' },
                        anchor: { width: 40 },
                      },
                      children: [],
                    },
                    {
                      id: 'lb-entry5-name',
                      type: 'Label',
                      name: 'Name',
                      properties: { 
                        text: 'StoneGuard',
                        style: { fontSize: 14, textColor: '#ffffff' },
                        anchor: { left: 10 },
                      },
                      children: [],
                    },
                    {
                      id: 'lb-entry5-score',
                      type: 'Label',
                      name: 'Score',
                      properties: { 
                        text: '7,100 pts',
                        style: { fontSize: 14, textColor: '#aaaaaa' },
                        anchor: { right: 0 },
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            // Footer
            {
              id: 'lb-footer',
              type: 'Group',
              name: 'Footer',
              properties: { 
                layoutMode: 'MiddleCenter',
                padding: { full: 15 },
                anchor: { height: 60 },
              },
              children: [
                {
                  id: 'lb-back',
                  type: 'BackButton',
                  name: 'BackButton',
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
      className: 'LeaderboardPage',
      uiFilePath: 'Pages/Leaderboard.ui',
    },
  },

  // Example 4: Quest Log
  {
    id: 'example-quests',
    name: 'Quest Log',
    description: 'Quest list with objectives and progress',
    category: 'example',
    preview: '📜',
    root: {
      id: 'q-root',
      type: 'PageOverlay',
      name: 'PageOverlay',
      properties: { macro: '$C.@PageOverlay' },
      children: [
        {
          id: 'q-container',
          type: 'DecoratedContainer',
          name: 'Container',
          properties: { 
            macro: '$C.@DecoratedContainer',
            anchor: { width: 550, height: 450 },
            layoutMode: 'Top',
          },
          children: [
            // Header
            {
              id: 'q-header',
              type: 'Group',
              name: 'Header',
              properties: { 
                layoutMode: 'MiddleCenter',
                anchor: { height: 55 },
                padding: { full: 15 },
              },
              children: [
                {
                  id: 'q-title',
                  type: 'Label',
                  name: 'Title',
                  properties: { 
                    text: '📜 QUEST LOG',
                    style: { fontSize: 22, renderBold: true, textColor: '#ffffff' },
                    alignment: 'Center',
                  },
                  children: [],
                },
              ],
            },
            // Quest list
            {
              id: 'q-list',
              type: 'Group',
              name: 'QuestList',
              properties: { 
                layoutMode: 'TopScrolling',
                scrollbarStyle: '$C.@DefaultScrollbarStyle',
                flexWeight: 1,
                padding: { left: 15, right: 15 },
              },
              children: [
                // Quest 1: Active
                {
                  id: 'q-quest1',
                  type: 'Button',
                  name: 'Quest1',
                  properties: {
                    anchor: { height: 85, bottom: 10 },
                    padding: { full: 12 },
                    background: { color: '#1a3a1a(0.8)' },
                    layoutMode: 'Top',
                    interactiveStyle: {
                      hovered: { background: '#2a4a2a(0.9)' },
                      pressed: { background: '#3a5a3a(0.95)' },
                    },
                  },
                  children: [
                    {
                      id: 'q-quest1-header',
                      type: 'Group',
                      name: 'Header',
                      properties: { layoutMode: 'Left' },
                      children: [
                        {
                          id: 'q-quest1-name',
                          type: 'Label',
                          name: 'Name',
                          properties: { 
                            text: '⚔️ Defeat the Forest Wolves',
                            style: { fontSize: 15, renderBold: true, textColor: '#88ff88' },
                          },
                          children: [],
                        },
                        {
                          id: 'q-quest1-status',
                          type: 'Label',
                          name: 'Status',
                          properties: { 
                            text: 'ACTIVE',
                            style: { fontSize: 10, textColor: '#88ff88' },
                            anchor: { right: 0 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'q-quest1-obj',
                      type: 'Label',
                      name: 'Objective',
                      properties: { 
                        text: 'Kill 5 wolves in the Dark Forest',
                        style: { fontSize: 12, textColor: '#aaaaaa' },
                        anchor: { top: 4 },
                      },
                      children: [],
                    },
                    {
                      id: 'q-quest1-progress',
                      type: 'Group',
                      name: 'Progress',
                      properties: { layoutMode: 'Left', anchor: { top: 6 } },
                      children: [
                        {
                          id: 'q-quest1-bar',
                          type: 'ProgressBar',
                          name: 'ProgressBar',
                          properties: { 
                            anchor: { width: 150, height: 12 },
                            value: 0.6,
                            fillColor: '#88ff88',
                            backgroundColor: '#333333',
                          },
                          children: [],
                        },
                        {
                          id: 'q-quest1-count',
                          type: 'Label',
                          name: 'Count',
                          properties: { 
                            text: '3/5',
                            style: { fontSize: 11, textColor: '#ffffff' },
                            anchor: { left: 8 },
                          },
                          children: [],
                        },
                      ],
                    },
                  ],
                },
                // Quest 2: Available
                {
                  id: 'q-quest2',
                  type: 'Button',
                  name: 'Quest2',
                  properties: {
                    anchor: { height: 85, bottom: 10 },
                    padding: { full: 12 },
                    background: { color: '#1a1a3a(0.8)' },
                    layoutMode: 'Top',
                    interactiveStyle: {
                      hovered: { background: '#2a2a4a(0.9)' },
                      pressed: { background: '#3a3a5a(0.95)' },
                    },
                  },
                  children: [
                    {
                      id: 'q-quest2-header',
                      type: 'Group',
                      name: 'Header',
                      properties: { layoutMode: 'Left' },
                      children: [
                        {
                          id: 'q-quest2-name',
                          type: 'Label',
                          name: 'Name',
                          properties: { 
                            text: '💎 Collect Ancient Gems',
                            style: { fontSize: 15, renderBold: true, textColor: '#8888ff' },
                          },
                          children: [],
                        },
                        {
                          id: 'q-quest2-status',
                          type: 'Label',
                          name: 'Status',
                          properties: { 
                            text: 'AVAILABLE',
                            style: { fontSize: 10, textColor: '#8888ff' },
                            anchor: { right: 0 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'q-quest2-obj',
                      type: 'Label',
                      name: 'Objective',
                      properties: { 
                        text: 'Find 10 gems in the Crystal Caves',
                        style: { fontSize: 12, textColor: '#aaaaaa' },
                        anchor: { top: 4 },
                      },
                      children: [],
                    },
                    {
                      id: 'q-quest2-reward',
                      type: 'Label',
                      name: 'Reward',
                      properties: { 
                        text: 'Reward: 💰 500 Gold + Magic Ring',
                        style: { fontSize: 11, textColor: '#ffcc00' },
                        anchor: { top: 6 },
                      },
                      children: [],
                    },
                  ],
                },
                // Quest 3: Completed
                {
                  id: 'q-quest3',
                  type: 'Button',
                  name: 'Quest3',
                  properties: {
                    anchor: { height: 70, bottom: 10 },
                    padding: { full: 12 },
                    background: { color: '#2a2a2a(0.5)' },
                    layoutMode: 'Top',
                    interactiveStyle: {
                      hovered: { background: '#3a3a3a(0.6)' },
                      pressed: { background: '#4a4a4a(0.7)' },
                    },
                  },
                  children: [
                    {
                      id: 'q-quest3-header',
                      type: 'Group',
                      name: 'Header',
                      properties: { layoutMode: 'Left' },
                      children: [
                        {
                          id: 'q-quest3-name',
                          type: 'Label',
                          name: 'Name',
                          properties: { 
                            text: '✅ Talk to the Village Elder',
                            style: { fontSize: 15, textColor: '#666666' },
                          },
                          children: [],
                        },
                        {
                          id: 'q-quest3-status',
                          type: 'Label',
                          name: 'Status',
                          properties: { 
                            text: 'COMPLETED',
                            style: { fontSize: 10, textColor: '#888888' },
                            anchor: { right: 0 },
                          },
                          children: [],
                        },
                      ],
                    },
                    {
                      id: 'q-quest3-obj',
                      type: 'Label',
                      name: 'Objective',
                      properties: { 
                        text: 'Speak with Elder Thornwood',
                        style: { fontSize: 12, textColor: '#555555' },
                        anchor: { top: 4 },
                      },
                      children: [],
                    },
                  ],
                },
              ],
            },
            // Footer
            {
              id: 'q-footer',
              type: 'Group',
              name: 'Footer',
              properties: { 
                layoutMode: 'MiddleCenter',
                padding: { full: 12 },
                anchor: { height: 55 },
              },
              children: [
                {
                  id: 'q-back',
                  type: 'BackButton',
                  name: 'BackButton',
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
      className: 'QuestLogPage',
      uiFilePath: 'Pages/QuestLog.ui',
    },
  },

  // Example 5: Character Stats
  {
    id: 'example-stats',
    name: 'Character Stats',
    description: 'Player stats with progress bars and attributes',
    category: 'example',
    preview: '📊',
    root: {
      id: 'st-root',
      type: 'PageOverlay',
      name: 'PageOverlay',
      properties: { macro: '$C.@PageOverlay' },
      children: [
        {
          id: 'st-container',
          type: 'DecoratedContainer',
          name: 'Container',
          properties: { 
            macro: '$C.@DecoratedContainer',
            anchor: { width: 400, height: 450 },
            layoutMode: 'Top',
            padding: { full: 20 },
          },
          children: [
            // Header with name and level
            {
              id: 'st-header',
              type: 'Group',
              name: 'Header',
              properties: { 
                layoutMode: 'MiddleCenter',
                anchor: { height: 60 },
              },
              children: [
                {
                  id: 'st-name',
                  type: 'Label',
                  name: 'PlayerName',
                  properties: { 
                    text: '⚔️ Hero Knight',
                    style: { fontSize: 22, renderBold: true, textColor: '#ffffff' },
                    alignment: 'Center',
                  },
                  children: [],
                },
                {
                  id: 'st-level',
                  type: 'Label',
                  name: 'Level',
                  properties: { 
                    text: 'Level 24 Warrior',
                    style: { fontSize: 14, textColor: '#ffcc00' },
                    alignment: 'Center',
                    anchor: { top: 5 },
                  },
                  children: [],
                },
              ],
            },
            // XP Bar
            {
              id: 'st-xp',
              type: 'Group',
              name: 'XPSection',
              properties: { 
                layoutMode: 'Top',
                anchor: { height: 50 },
                padding: { top: 10 },
              },
              children: [
                {
                  id: 'st-xp-label',
                  type: 'Label',
                  name: 'XPLabel',
                  properties: { 
                    text: 'Experience',
                    style: { fontSize: 12, textColor: '#aaaaaa' },
                  },
                  children: [],
                },
                {
                  id: 'st-xp-bar',
                  type: 'ProgressBar',
                  name: 'XPBar',
                  properties: { 
                    anchor: { width: 320, height: 18, top: 4 },
                    value: 0.65,
                    fillColor: '#66ffcc',
                    backgroundColor: '#333333',
                  },
                  children: [],
                },
                {
                  id: 'st-xp-text',
                  type: 'Label',
                  name: 'XPText',
                  properties: { 
                    text: '6,500 / 10,000 XP',
                    style: { fontSize: 11, textColor: '#888888' },
                    anchor: { top: 2 },
                  },
                  children: [],
                },
              ],
            },
            // Stats
            {
              id: 'st-stats',
              type: 'Group',
              name: 'StatsSection',
              properties: { 
                layoutMode: 'Top',
                flexWeight: 1,
                padding: { top: 15 },
              },
              children: [
                // Health
                {
                  id: 'st-health',
                  type: 'Group',
                  name: 'Health',
                  properties: { layoutMode: 'Left', anchor: { height: 35, bottom: 10 } },
                  children: [
                    {
                      id: 'st-health-icon',
                      type: 'Label',
                      name: 'Icon',
                      properties: { text: '❤️', style: { fontSize: 16 }, anchor: { width: 30 } },
                      children: [],
                    },
                    {
                      id: 'st-health-label',
                      type: 'Label',
                      name: 'Label',
                      properties: { text: 'Health', style: { fontSize: 14, textColor: '#ffffff' }, anchor: { width: 80 } },
                      children: [],
                    },
                    {
                      id: 'st-health-bar',
                      type: 'ProgressBar',
                      name: 'Bar',
                      properties: { anchor: { width: 150, height: 14 }, value: 0.85, fillColor: '#ff4444', backgroundColor: '#333333' },
                      children: [],
                    },
                    {
                      id: 'st-health-val',
                      type: 'Label',
                      name: 'Value',
                      properties: { text: '850/1000', style: { fontSize: 12, textColor: '#aaaaaa' }, anchor: { left: 10 } },
                      children: [],
                    },
                  ],
                },
                // Mana
                {
                  id: 'st-mana',
                  type: 'Group',
                  name: 'Mana',
                  properties: { layoutMode: 'Left', anchor: { height: 35, bottom: 10 } },
                  children: [
                    {
                      id: 'st-mana-icon',
                      type: 'Label',
                      name: 'Icon',
                      properties: { text: '💧', style: { fontSize: 16 }, anchor: { width: 30 } },
                      children: [],
                    },
                    {
                      id: 'st-mana-label',
                      type: 'Label',
                      name: 'Label',
                      properties: { text: 'Mana', style: { fontSize: 14, textColor: '#ffffff' }, anchor: { width: 80 } },
                      children: [],
                    },
                    {
                      id: 'st-mana-bar',
                      type: 'ProgressBar',
                      name: 'Bar',
                      properties: { anchor: { width: 150, height: 14 }, value: 0.45, fillColor: '#4488ff', backgroundColor: '#333333' },
                      children: [],
                    },
                    {
                      id: 'st-mana-val',
                      type: 'Label',
                      name: 'Value',
                      properties: { text: '225/500', style: { fontSize: 12, textColor: '#aaaaaa' }, anchor: { left: 10 } },
                      children: [],
                    },
                  ],
                },
                // Attack
                {
                  id: 'st-attack',
                  type: 'Group',
                  name: 'Attack',
                  properties: { layoutMode: 'Left', anchor: { height: 35, bottom: 10 } },
                  children: [
                    {
                      id: 'st-attack-icon',
                      type: 'Label',
                      name: 'Icon',
                      properties: { text: '⚔️', style: { fontSize: 16 }, anchor: { width: 30 } },
                      children: [],
                    },
                    {
                      id: 'st-attack-label',
                      type: 'Label',
                      name: 'Label',
                      properties: { text: 'Attack', style: { fontSize: 14, textColor: '#ffffff' }, anchor: { width: 80 } },
                      children: [],
                    },
                    {
                      id: 'st-attack-val',
                      type: 'Label',
                      name: 'Value',
                      properties: { text: '156', style: { fontSize: 16, renderBold: true, textColor: '#ff8844' } },
                      children: [],
                    },
                  ],
                },
                // Defense
                {
                  id: 'st-defense',
                  type: 'Group',
                  name: 'Defense',
                  properties: { layoutMode: 'Left', anchor: { height: 35, bottom: 10 } },
                  children: [
                    {
                      id: 'st-defense-icon',
                      type: 'Label',
                      name: 'Icon',
                      properties: { text: '🛡️', style: { fontSize: 16 }, anchor: { width: 30 } },
                      children: [],
                    },
                    {
                      id: 'st-defense-label',
                      type: 'Label',
                      name: 'Label',
                      properties: { text: 'Defense', style: { fontSize: 14, textColor: '#ffffff' }, anchor: { width: 80 } },
                      children: [],
                    },
                    {
                      id: 'st-defense-val',
                      type: 'Label',
                      name: 'Value',
                      properties: { text: '98', style: { fontSize: 16, renderBold: true, textColor: '#44aaff' } },
                      children: [],
                    },
                  ],
                },
                // Speed
                {
                  id: 'st-speed',
                  type: 'Group',
                  name: 'Speed',
                  properties: { layoutMode: 'Left', anchor: { height: 35, bottom: 10 } },
                  children: [
                    {
                      id: 'st-speed-icon',
                      type: 'Label',
                      name: 'Icon',
                      properties: { text: '⚡', style: { fontSize: 16 }, anchor: { width: 30 } },
                      children: [],
                    },
                    {
                      id: 'st-speed-label',
                      type: 'Label',
                      name: 'Label',
                      properties: { text: 'Speed', style: { fontSize: 14, textColor: '#ffffff' }, anchor: { width: 80 } },
                      children: [],
                    },
                    {
                      id: 'st-speed-val',
                      type: 'Label',
                      name: 'Value',
                      properties: { text: '72', style: { fontSize: 16, renderBold: true, textColor: '#ffff44' } },
                      children: [],
                    },
                  ],
                },
              ],
            },
            // Footer
            {
              id: 'st-footer',
              type: 'Group',
              name: 'Footer',
              properties: { 
                layoutMode: 'MiddleCenter',
                anchor: { height: 50 },
              },
              children: [
                {
                  id: 'st-back',
                  type: 'BackButton',
                  name: 'BackButton',
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
      className: 'CharacterStatsPage',
      uiFilePath: 'Pages/CharacterStats.ui',
    },
  },

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
