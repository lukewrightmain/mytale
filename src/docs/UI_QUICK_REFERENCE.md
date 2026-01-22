# Hytale UI Quick Reference Card

## Essential Checklist

- [ ] `manifest.json` has `"IncludesAssetPack": true`
- [ ] UI files in `src/main/resources/Common/UI/Custom/Pages/`
- [ ] Template referenced correctly in Java code
- [ ] Rebuild JAR after any UI file changes
- [ ] Restart server to reload asset packs

---

## File Locations

```
src/main/resources/
├── manifest.json                    # Add: "IncludesAssetPack": true
└── Common/UI/Custom/
    ├── Pages/                       # Custom page templates
    │   └── MyPage.ui
    └── Hud/                         # Custom HUD templates
        └── MyHud.ui
```

---

## Minimal Page Template

```ui
$C = "../Common.ui";

$C.@PageOverlay {
  $C.@DecoratedContainer {
    Anchor: (Width: 600, Height: 400);

    #Title {
      Group {
        $C.@Title {
          @Text = "MY PAGE TITLE";
        }
      }
    }

    #Content {
      LayoutMode: Top;
      Padding: (Full: 15);

      Group #MyList {
        LayoutMode: Top;
      }
    }
  }
}

$C.@BackButton {}
```

---

## Minimal Card Template

```ui
Button {
  Anchor: (Height: 70, Bottom: 8);
  Padding: (Full: 10);
  Background: (Color: #1a1a1a(0.7));
  LayoutMode: Left;
  Style: (
    Hovered: (Background: #2a2a2a(0.85)),
    Pressed: (Background: #3a3a3a(0.95))
  );

  ItemIcon #Icon {
    Anchor: (Width: 48, Height: 48);
  }

  Group #Info {
    LayoutMode: Top;
    Anchor: (Left: 12);

    Label #Title {
      Style: (FontSize: 16, RenderBold: true, TextColor: #ffffff);
    }

    Label #Subtitle {
      Style: (FontSize: 12, TextColor: #aaaaaa);
      Anchor: (Top: 4);
    }
  }
}
```

---

## Minimal Java Page Class

```java
public class MyPage extends CustomUIPage {

    public MyPage(PlayerRef playerRef) {
        super(playerRef, CustomPageLifetime.CanDismiss);
    }

    @Override
    public void build(Ref<EntityStore> ref, UICommandBuilder ui,
                      UIEventBuilder events, Store<EntityStore> store) {

        ui.append("Pages/MyPage.ui");

        for (int i = 0; i < items.size(); i++) {
            ui.append("#MyList", "Pages/MyCard.ui");
            String sel = "#MyList[" + i + "]";

            ui.set(sel + " #Icon.ItemId", items.get(i).iconId);
            ui.set(sel + " #Title.Text", items.get(i).title);
            ui.set(sel + " #Subtitle.Text", items.get(i).subtitle);
        }
    }
}
```

---

## Opening a Page

```java
world.execute(() -> {
    Player player = store.getComponent(ref, Player.getComponentType());
    PlayerRef playerRef = store.getComponent(ref, PlayerRef.getComponentType());

    MyPage page = new MyPage(playerRef);
    player.getPageManager().openCustomPage(ref, store, page);
});
```

---

## Common UI Commands

| Command | Example |
|---------|---------|
| Load template | `ui.append("Pages/MyPage.ui")` |
| Add to list | `ui.append("#List", "Pages/Card.ui")` |
| Set text | `ui.set("#Label.Text", "Hello")` |
| Set item icon | `ui.set("#Icon.ItemId", "Weapon_Sword_Iron")` |
| Set visibility | `ui.set("#Element.Visible", true)` |
| Clear list | `ui.clear("#List")` |

---

## Common Selectors

| Selector | Meaning |
|----------|---------|
| `#MyElement` | Element with ID "MyElement" |
| `#MyElement.Text` | Text property |
| `#MyElement.Visible` | Visibility property |
| `#MyElement.ItemId` | Item icon property |
| `#List[0]` | First child of #List |
| `#List[0] #Name` | #Name inside first child |

---

## Color Reference

```
#ffffff - White (primary text)
#aaaaaa - Gray (secondary text)
#88ff88 - Green (success/positive)
#ff4444 - Red (error/negative)
#ffaa00 - Orange (warning)
#ffcc00 - Yellow (accent)
#1a1a1a(0.7) - Dark semi-transparent background
```

---

## Layout Modes

| Mode | Result |
|------|--------|
| `LayoutMode: Top;` | Vertical stacking |
| `LayoutMode: Left;` | Horizontal stacking |
| `LayoutMode: TopScrolling;` | Vertical with scroll |
| `LayoutMode: LeftScrolling;` | Horizontal with scroll |

---

## Common Errors

| Error | Solution |
|-------|----------|
| "Could not find document" | Add `IncludesAssetPack: true` to manifest |
| "Failed to load CustomUI documents" | Syntax error in .ui file |
| "Selector doesn't match property" | Wrong element type (e.g., ItemId on non-ItemIcon) |
| Page is empty | Check template path, add debug logging |

---

## Debug Tips

1. Check JAR contents: `unzip -l mod.jar | grep ".ui"`
2. Verify manifest: `unzip -p mod.jar manifest.json`
3. Add logging in `build()`: `System.out.println("Building page...")`
4. Test with simplest possible template first
5. Add elements one at a time to find syntax errors
