# Hytale Custom UI Development Guide

A comprehensive guide to creating custom user interfaces for Hytale server mods.

## Table of Contents

1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Manifest Configuration](#manifest-configuration)
4. [UI Template Syntax](#ui-template-syntax)
5. [Common UI Elements](#common-ui-elements)
6. [Creating a Custom Page](#creating-a-custom-page)
7. [Creating a Custom HUD](#creating-a-custom-hud)
8. [Java Integration](#java-integration)
9. [Styling and Theming](#styling-and-theming)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)
12. [Examples](#examples)

---

## Overview

Hytale uses a custom UI markup language (`.ui` files) combined with Java server code to create dynamic user interfaces. The system consists of:

- **UI Templates** (`.ui` files) - Define the visual structure
- **Java Classes** - Control logic and data binding
- **Asset Pack** - Distributes UI files to clients

### Key Concepts

| Concept | Description |
|---------|-------------|
| **CustomUIPage** | Modal dialog/page that overlays the game |
| **CustomUIHud** | Always-visible overlay on the game screen |
| **UICommandBuilder** | Java class to send UI commands (append, set, clear) |
| **UIEventBuilder** | Java class to bind UI events to server handlers |

---

## File Structure

```
your-mod/
├── src/main/java/
│   └── com/yourmod/
│       ├── YourPlugin.java
│       └── ui/
│           └── YourCustomPage.java
├── src/main/resources/
│   ├── manifest.json              # Must include "IncludesAssetPack": true
│   ├── config.json
│   └── Common/
│       └── UI/
│           └── Custom/
│               ├── Pages/         # Custom page templates
│               │   ├── MyPage.ui
│               │   └── MyCard.ui
│               └── Hud/           # Custom HUD templates
│                   └── MyHud.ui
└── build.gradle.kts
```

### Important Paths

| Path | Purpose |
|------|---------|
| `Common/UI/Custom/Pages/` | Custom page templates |
| `Common/UI/Custom/Hud/` | Custom HUD templates |
| `Common/UI/Common.ui` | Hytale's built-in common components (reference only) |

---

## Manifest Configuration

Your `manifest.json` **MUST** include `"IncludesAssetPack": true` for custom UI templates to be distributed to clients:

```json
{
  "Group": "YourGroup",
  "Name": "YourMod",
  "Description": "Your mod description",
  "Version": "1.0.0",
  "Main": "com.yourmod.YourPlugin",
  "ServerVersion": "*",
  "Dependencies": {
    "Hytale:EntityModule": "*"
  },
  "IncludesAssetPack": true
}
```

**Without `IncludesAssetPack: true`, clients will crash with "Could not find document" errors!**

---

## UI Template Syntax

### Basic Structure

```ui
// Variable assignment - reference common components
$C = "../Common.ui";

// Use a template from Common.ui
$C.@PageOverlay {

  // Nested elements
  $C.@DecoratedContainer {
    Anchor: (Width: 800, Height: 600);

    // Named element with ID
    Group #MyContainer {
      LayoutMode: Top;
    }
  }
}
```

### Syntax Rules

1. **Comments**: Use `//` for single-line comments
2. **Element IDs**: Prefix with `#` (e.g., `#MyButton`)
3. **Properties**: `PropertyName: value;`
4. **Nested Objects**: `PropertyName: (Key: value, Key2: value2);`
5. **Colors**: `#RRGGBB` or `#RRGGBB(alpha)` where alpha is 0.0-1.0
6. **Template Variables**: `$VAR = "path";` then use `$VAR.@TemplateName`
7. **Template Parameters**: `@ParamName = value;`

### Property Types

| Type | Example |
|------|---------|
| Integer | `Width: 100` |
| Float | `Opacity: 0.5` |
| Boolean | `Visible: true` |
| String | `Text: "Hello"` |
| Color | `TextColor: #ffffff` or `Color: #1a1a1a(0.7)` |
| Anchor | `Anchor: (Width: 64, Height: 64, Top: 10)` |
| Padding | `Padding: (Full: 12)` or `Padding: (Horizontal: 10, Vertical: 5)` |

---

## Common UI Elements

### Group

Container for organizing elements:

```ui
Group #MyGroup {
  LayoutMode: Top;           // Top, Left, TopScrolling, LeftScrolling
  Padding: (Full: 10);
  Background: (Color: #000000(0.5));
  Anchor: (Width: 200, Height: 100);
}
```

### Label

Text display:

```ui
Label #MyLabel {
  Style: (
    FontSize: 18,
    RenderBold: true,
    TextColor: #ffffff,
    HorizontalAlignment: Center    // Left, Center, Right
  );
  Anchor: (Top: 5);
}
```

### Button

Clickable element:

```ui
Button #MyButton {
  Anchor: (Width: 150, Height: 40);
  Background: (Color: #2a2a2a(0.8));
  Style: (
    Hovered: (
      Background: #3a3a3a(0.9),
    ),
    Pressed: (
      Background: #4a4a4a(1.0),
    )
  );

  Label #ButtonText {
    Style: (FontSize: 14, TextColor: #ffffff);
  }
}
```

### ItemIcon

Display game items:

```ui
ItemIcon #MyItemIcon {
  Anchor: (Width: 64, Height: 64);
  Visible: true;
}
```

In Java, set the item:
```java
commandBuilder.set("#MyItemIcon.ItemId", "Weapon_Sword_Iron");
```

### ItemGrid

Display multiple items in a grid:

```ui
ItemGrid #MyGrid {
  SlotsPerRow: 9;
  RenderItemQualityBackground: true;
  InfoDisplay: None;
  Style: (
    SlotSize: 32,
    SlotSpacing: 0,
    SlotIconSize: 32
  );
}
```

### ProgressBar

Show progress:

```ui
ProgressBar #MyProgress {
  Value: 0.5;
  BarTexturePath: "path/to/fill.png";
}
```

---

## Creating a Custom Page

### Step 1: Create the UI Template

**`Common/UI/Custom/Pages/MyPage.ui`**:

```ui
$C = "../Common.ui";

$C.@PageOverlay {
  $C.@DecoratedContainer {
    Anchor: (Width: 800, Height: 600);

    #Title {
      Group {
        $C.@Title {
          @Text = "MY CUSTOM PAGE";
        }
      }
    }

    #Content {
      LayoutMode: TopScrolling;
      ScrollbarStyle: $C.@DefaultScrollbarStyle;
      Padding: (Full: 15);

      Group #ItemList {
        LayoutMode: Top;
      }
    }
  }
}

$C.@BackButton {}
```

### Step 2: Create Item Card Template (Optional)

**`Common/UI/Custom/Pages/MyCard.ui`**:

```ui
Button {
  Anchor: (Height: 80, Bottom: 10);
  Padding: (Full: 12);
  Background: (Color: #1a1a1a(0.7));
  LayoutMode: Left;
  Style: (
    Hovered: (Background: #2a2a2a(0.85)),
    Pressed: (Background: #3a3a3a(0.95))
  );

  ItemIcon #CardIcon {
    Anchor: (Width: 64, Height: 64);
  }

  Group #CardInfo {
    LayoutMode: Top;
    Anchor: (Left: 15);
    FlexWeight: 1;

    Label #CardTitle {
      Style: (FontSize: 18, RenderBold: true, TextColor: #ffffff);
    }

    Label #CardDescription {
      Style: (FontSize: 14, TextColor: #aaaaaa);
      Anchor: (Top: 4);
    }
  }
}
```

### Step 3: Create Java Page Class

```java
package com.yourmod.ui;

import com.hypixel.hytale.component.Ref;
import com.hypixel.hytale.component.Store;
import com.hypixel.hytale.protocol.packets.interface_.CustomPageLifetime;
import com.hypixel.hytale.server.core.entity.entities.player.pages.CustomUIPage;
import com.hypixel.hytale.server.core.ui.builder.UICommandBuilder;
import com.hypixel.hytale.server.core.ui.builder.UIEventBuilder;
import com.hypixel.hytale.server.core.universe.PlayerRef;
import com.hypixel.hytale.server.core.universe.world.storage.EntityStore;

import javax.annotation.Nonnull;
import java.util.List;

public class MyCustomPage extends CustomUIPage {

    private final List<MyData> items;

    public MyCustomPage(@Nonnull PlayerRef playerRef, List<MyData> items) {
        super(playerRef, CustomPageLifetime.CanDismiss);
        this.items = items;
    }

    @Override
    public void build(@Nonnull Ref<EntityStore> ref,
                      @Nonnull UICommandBuilder ui,
                      @Nonnull UIEventBuilder events,
                      @Nonnull Store<EntityStore> store) {

        // Load the main page template
        ui.append("Pages/MyPage.ui");

        // Build dynamic content
        for (int i = 0; i < items.size(); i++) {
            MyData item = items.get(i);

            // Append a card for each item
            ui.append("#ItemList", "Pages/MyCard.ui");

            // Build selector for this card
            String sel = "#ItemList[" + i + "]";

            // Set card properties
            ui.set(sel + " #CardIcon.ItemId", item.getIconId());
            ui.set(sel + " #CardTitle.Text", item.getTitle());
            ui.set(sel + " #CardDescription.Text", item.getDescription());
        }
    }
}
```

### Step 4: Open the Page from a Command

```java
@Override
protected void executeSync(@Nonnull CommandContext context) {
    if (!context.isPlayer()) return;

    Ref<EntityStore> ref = context.senderAsPlayerRef();
    Store<EntityStore> store = ref.getStore();
    World world = store.getExternalData().getWorld();

    world.execute(() -> {
        Player player = store.getComponent(ref, Player.getComponentType());
        PlayerRef playerRef = store.getComponent(ref, PlayerRef.getComponentType());

        if (player != null && playerRef != null) {
            MyCustomPage page = new MyCustomPage(playerRef, myDataList);
            player.getPageManager().openCustomPage(ref, store, page);
        }
    });
}
```

---

## Creating a Custom HUD

HUDs are always-visible overlays that update every frame.

### Step 1: Create HUD Template

**`Common/UI/Custom/Hud/MyHud.ui`**:

```ui
Group #MyHud {
  LayoutMode: Left;

  Group #Content {
    Background: (TexturePath: "../../Common/TooltipDefaultBackground.png", Border: 15);
    Padding: (Full: 12);
    LayoutMode: Top;

    Label #MainText {
      Style: (FontSize: 20, RenderBold: true, TextColor: #ffffff);
    }

    Label #SubText {
      Style: (FontSize: 14, TextColor: #aaaaaa);
      Anchor: (Top: 4);
    }
  }
}
```

### Step 2: Create HUD Class

```java
public class MyHud extends CustomUIHud {

    private String mainText = "";
    private String subText = "";

    public MyHud(@Nonnull PlayerRef playerRef) {
        super(playerRef);
    }

    public void updateData(String main, String sub) {
        this.mainText = main;
        this.subText = sub;
    }

    @Override
    protected void build(@Nonnull UICommandBuilder ui) {
        if (!mainText.isEmpty()) {
            ui.append("Hud/MyHud.ui");

            // Position the HUD (top-left corner, 20px from edges)
            AnchorBuilder anchor = new AnchorBuilder()
                .setTop(20)
                .setLeft(20);

            ui.set("#MainText.Text", mainText);
            ui.set("#SubText.Text", subText);
            ui.setObject("#MyHud.Anchor", anchor.build());
        }
    }
}
```

### Step 3: Update HUD Every Tick

```java
public class MyHudSystem extends EntityTickingSystem<EntityStore> {

    private final Map<UUID, MyHud> huds = new HashMap<>();

    @Override
    public void tick(float dt, int index, ArchetypeChunk<EntityStore> chunk,
                    Store<EntityStore> store, CommandBuffer<EntityStore> buffer) {

        PlayerRef playerRef = chunk.getComponent(index, PlayerRef.getComponentType());
        Player player = chunk.getComponent(index, Player.getComponentType());

        if (playerRef == null || player == null) return;

        MyHud hud = huds.computeIfAbsent(playerRef.getUuid(), uuid -> {
            MyHud newHud = new MyHud(playerRef);
            return newHud;
        });

        // Update HUD data
        hud.updateData("Hello World", "Subtitle here");

        // Show the HUD
        player.getHudManager().setCustomHud(playerRef, hud);
    }

    @Override
    public Query<EntityStore> getQuery() {
        return Query.and(Player.getComponentType());
    }
}
```

---

## Java Integration

### UICommandBuilder Methods

| Method | Description | Example |
|--------|-------------|---------|
| `append(template)` | Add template to root | `ui.append("Pages/MyPage.ui")` |
| `append(selector, template)` | Add template to element | `ui.append("#List", "Pages/Card.ui")` |
| `appendInline(selector, markup)` | Add inline UI markup | `ui.appendInline("#List", "Label { Text: Hello; }")` |
| `set(selector, value)` | Set element property | `ui.set("#Title.Text", "Hello")` |
| `setObject(selector, object)` | Set complex property | `ui.setObject("#El.Anchor", anchor)` |
| `clear(selector)` | Remove all children | `ui.clear("#List")` |

### Selector Syntax

```java
// Direct element
"#MyElement"

// Property of element
"#MyElement.Text"
"#MyElement.Visible"
"#MyElement.ItemId"

// Nested element
"#Parent #Child"

// Array index (for dynamically added elements)
"#List[0]"
"#List[0] #Name"
"#Grid[row][col]"
```

### Event Binding (Interactive Pages)

For pages that need to handle clicks/input, extend `InteractiveCustomUIPage<T>`:

```java
public class MyInteractivePage extends InteractiveCustomUIPage<MyEventData> {

    public MyInteractivePage(PlayerRef playerRef) {
        super(playerRef, CustomPageLifetime.CanDismiss, MyEventData.CODEC);
    }

    @Override
    public void build(...) {
        ui.append("Pages/MyPage.ui");

        // Bind click event
        events.addEventBinding(
            CustomUIEventBindingType.Activating,  // Click event
            "#MyButton",                          // Element selector
            EventData.of("action", "buttonClick"), // Data to send
            false                                  // Not buffered
        );
    }

    @Override
    public void handleDataEvent(Ref<EntityStore> ref, Store<EntityStore> store,
                                MyEventData data) {
        if ("buttonClick".equals(data.action)) {
            // Handle button click
        }
    }

    public static class MyEventData {
        public static final BuilderCodec<MyEventData> CODEC = ...;
        private String action;
    }
}
```

---

## Styling and Theming

### Color Palette Example

```ui
// Semi-transparent dark backgrounds
Background: (Color: #1a1a1a(0.7));   // Normal
Background: #2a2a2a(0.85);           // Hovered
Background: #3a3a3a(0.95);           // Pressed

// Text colors
TextColor: #ffffff     // White - primary text
TextColor: #aaaaaa     // Gray - secondary text
TextColor: #88ff88     // Green - positive/success
TextColor: #ff4444     // Red - negative/error
TextColor: #ffaa00     // Orange - warning/highlight
TextColor: #ffcc00     // Yellow - accent
```

### Common Layout Patterns

**Horizontal Layout (Left to Right):**
```ui
Group {
  LayoutMode: Left;
  // Children arranged horizontally
}
```

**Vertical Layout (Top to Bottom):**
```ui
Group {
  LayoutMode: Top;
  // Children arranged vertically
}
```

**Scrollable Content:**
```ui
Group {
  LayoutMode: TopScrolling;
  ScrollbarStyle: $C.@DefaultScrollbarStyle;
}
```

**Flexible Sizing:**
```ui
Group #Flexible {
  FlexWeight: 1;  // Takes remaining space
}
```

---

## Best Practices

### DO:

1. **Always set `IncludesAssetPack: true`** in manifest.json
2. **Use descriptive element IDs** (`#TierProgress` not `#P1`)
3. **Keep templates modular** - separate card templates from page templates
4. **Test incrementally** - add one element at a time
5. **Use semi-transparent backgrounds** for better visibility
6. **Provide visual feedback** for interactive elements (hover/press states)

### DON'T:

1. **Don't reference non-existent templates** - causes client crashes
2. **Don't use invalid property names** - causes parse errors
3. **Don't forget the semicolon** after property values
4. **Don't use absolute paths** for textures in mod templates
5. **Don't create deeply nested selectors** - keep it simple

### Performance Tips:

1. **Minimize UI updates** - only update when data changes
2. **Use `clear()` before rebuilding lists** to avoid duplicates
3. **Cache HUD instances** per player instead of recreating
4. **Batch UI commands** - set all properties before sending update

---

## Troubleshooting

### "Could not find document Pages/MyPage.ui"

**Cause:** Template not distributed to client

**Solution:**
1. Ensure `"IncludesAssetPack": true` in manifest.json
2. Verify file is at `src/main/resources/Common/UI/Custom/Pages/MyPage.ui`
3. Check file is included in JAR: `unzip -l your-mod.jar | grep ".ui"`
4. Restart server (asset packs cached on startup)

### "Failed to load CustomUI documents"

**Cause:** Syntax error in UI template

**Solution:**
1. Check for missing semicolons
2. Verify parentheses are balanced
3. Remove unused/broken template files
4. Simplify template and add complexity gradually

### "Selector doesn't match a markup property"

**Cause:** Setting property on wrong element type

**Solution:**
- `#Icon.ItemId` only works on `ItemIcon` elements, not `Image`
- `#Label.Text` only works on `Label` elements
- Check the element type in your template

### Page opens but is empty

**Cause:** Template path mismatch or build() not called

**Solution:**
1. Verify template path matches file location
2. Add debug logging in `build()` method
3. Check that `openCustomPage()` is called on world thread

---

## Examples

### Example 1: Simple Info Page

```ui
// Pages/InfoPage.ui
$C = "../Common.ui";

$C.@PageOverlay {
  $C.@DecoratedContainer {
    Anchor: (Width: 400, Height: 300);

    #Title {
      Group {
        $C.@Title {
          @Text = "INFORMATION";
        }
      }
    }

    #Content {
      Padding: (Full: 20);
      LayoutMode: Top;

      Label #InfoText {
        Style: (FontSize: 16, TextColor: #ffffff);
      }
    }
  }
}

$C.@BackButton {}
```

### Example 2: Grid-Based Inventory Display

```ui
// Pages/InventoryPage.ui
$C = "../Common.ui";

$C.@PageOverlay {
  $C.@DecoratedContainer {
    Anchor: (Width: 600, Height: 400);

    #Title {
      Group {
        $C.@Title {
          @Text = "INVENTORY";
        }
      }
    }

    #Content {
      Padding: (Full: 15);

      ItemGrid #InventoryGrid {
        SlotsPerRow: 9;
        RenderItemQualityBackground: true;
        Style: (SlotSize: 48, SlotSpacing: 4, SlotIconSize: 44);
      }
    }
  }
}

$C.@BackButton {}
```

### Example 3: Two-Column Layout

```ui
// Pages/TwoColumnPage.ui
$C = "../Common.ui";

$C.@PageOverlay {
  $C.@DecoratedContainer {
    Anchor: (Width: 900, Height: 600);

    #Title {
      Group {
        $C.@Title {
          @Text = "TWO COLUMNS";
        }
      }
    }

    #Content {
      LayoutMode: Left;
      Padding: (Full: 15);

      Group #LeftColumn {
        Anchor: (Width: 300);
        LayoutMode: TopScrolling;
        ScrollbarStyle: $C.@DefaultScrollbarStyle;

        Group #LeftList {
          LayoutMode: Top;
        }
      }

      Group #RightColumn {
        FlexWeight: 1;
        Anchor: (Left: 15);
        LayoutMode: Top;

        Label #DetailTitle {
          Style: (FontSize: 20, RenderBold: true, TextColor: #ffffff);
        }

        Label #DetailText {
          Style: (FontSize: 14, TextColor: #aaaaaa);
          Anchor: (Top: 10);
        }
      }
    }
  }
}

$C.@BackButton {}
```

---

## Quick Reference

### Common Template Components

| Component | Usage |
|-----------|-------|
| `$C.@PageOverlay` | Full-screen overlay container |
| `$C.@DecoratedContainer` | Styled panel with border |
| `$C.@Title` | Page title with `@Text` parameter |
| `$C.@BackButton` | Back/close button |
| `$C.@DefaultScrollbarStyle` | Standard scrollbar styling |
| `$C.@HeaderSearch` | Search input field |

### Layout Modes

| Mode | Description |
|------|-------------|
| `Top` | Stack children vertically |
| `Left` | Stack children horizontally |
| `TopScrolling` | Vertical with scrollbar |
| `LeftScrolling` | Horizontal with scrollbar |

### Anchor Properties

| Property | Description |
|----------|-------------|
| `Width` | Fixed width in pixels |
| `Height` | Fixed height in pixels |
| `Top` | Margin from top |
| `Bottom` | Margin from bottom |
| `Left` | Margin from left |
| `Right` | Margin from right |
| `Full` | Margin on all sides |

---

## Further Reading

- Examine existing Hytale mods for more patterns:
  - **EyeSpy** - HUD implementation
  - **Advanced-Item-Info** - Interactive page with search
- Decompile Hytale server JAR to see built-in UI templates
- Check `Common/UI/` in game assets for more template examples

---

*This guide was created based on reverse-engineering Hytale's UI system and successful implementations in the Killstreaks mod.*
