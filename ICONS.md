# Icon Setup Guide

The extension needs proper PNG icons to display in the Chrome Web Store and browser UI.

## 📦 Current Status

- ✅ SVG template created: `icons/icon.svg`
- ⏳ PNG icons needed: 16x16, 48x48, 128x128
- 📝 Icon script ready: `scripts/generate-icons.js`

## 🎨 Creating Icons

### Option 1: Use Design Tools (Recommended)

#### **Figma** (Free, cloud-based)
1. Create new 128x128 project
2. Import `icons/icon.svg` as starting point
3. Design using Fluent Design System colors:
   - Primary: `#0078D4` (Microsoft Blue)
   - Accent: `#50E6FF` (Light Blue)
4. Export as PNG for each size:
   - 16x16 → `icon-16.png`
   - 48x48 → `icon-48.png`
   - 128x128 → `icon-128.png`

#### **Adobe XD** (30-day free trial)
1. Create 128x128 artboard
2. Use Fluent Icon library
3. Design configuration/database theme
4. Export to PNG multiple sizes

#### **Canva** (Online, free tier available)
1. Create custom logo design
2. Download as PNG
3. Resize for each needed size

### Option 2: Online PNG Converters

1. Take `icons/icon.svg`
2. Go to [CloudConvert](https://cloudconvert.com/) or [Online-Convert](https://image.online-convert.com/)
3. Convert SVG → PNG
4. Create separate files for each size (16, 48, 128)

### Option 3: Use ImageMagick (CLI)

If you have ImageMagick installed:

```bash
# Install ImageMagick (if needed)
# macOS: brew install imagemagick
# Windows: choco install imagemagick
# Linux: sudo apt-get install imagemagick

# Convert SVG to PNG at different sizes
convert -density 150 icons/icon.svg -resize 16x16 icons/icon-16.png
convert -density 150 icons/icon.svg -resize 48x48 icons/icon-48.png
convert -density 150 icons/icon.svg -resize 128x128 icons/icon-128.png
```

### Option 4: Node.js Script

Run the provided icon generation script:

```bash
npm install
npm run build:icons
```

Note: Requires additional setup with image libraries.

## 📐 Icon Design Specifications

### General Requirements:
- Format: PNG with transparent background
- Sizes needed: 16x16, 48x48, 128x128 pixels
- Color space: RGBA (with alpha channel)
- DPI: 72-96 DPI

### Design Guidelines:

#### Color Palette (Fluent Design):
```
Primary Blue:     #0078D4
Light Blue:       #50E6FF
Dark Blue:        #003DA5
Gray:             #7FBA00
White:            #FFFFFF (text/accents)
```

#### Visual Elements to Include:
- Database or table icon (represents configuration data)
- Comparison arrows (shows comparison capability)
- Multiple elements (represents multiple LEs)

#### Icon Style:
- Modern, clean design
- 1px clearance on all edges
- Minimal, not cluttered
- Professional appearance for B2B use

#### Don't Include:
- Complex gradients (may not scale well at 16x16)
- Very thin lines (hard to see at small sizes)
- Too much color variation
- Trademarked symbols

## ✅ Placement

Once created, place PNG files here:

```
Dynamics365Finance/
└── icons/
    ├── icon.svg          (template - keep as reference)
    ├── icon-16.png       ← Place 16x16 here
    ├── icon-48.png       ← Place 48x48 here
    └── icon-128.png      ← Place 128x128 here
```

## 🔍 Verification

After adding icons:

1. Open `chrome://extensions/`
2. Load/reload the extension
3. Verify icon displays in:
   - Extension toolbar
   - Extensions menu
   - Extension details page
4. Check each size displays cleanly:
   - 16x16: Toolbar icon
   - 48x48: Extension menu dropdown
   - 128x128: Chrome Web Store

## 📋 Checklist

- [ ] PNG icons created for sizes: 16, 48, 128
- [ ] Icons use Fluent Design colors
- [ ] Transparent background (no white background)
- [ ] Professional, clean design
- [ ] Icons placed in `icons/` folder
- [ ] Manifest.json references correct paths
- [ ] Extension reloaded in browser
- [ ] Icons display properly in toolbar
- [ ] Icons look good at each size

## 🎯 Design Inspiration

Browse these for design ideas:

- **Microsoft Fluent Icons**: [fluenticons.co](https://fluenticons.co)
- **Dynamics 365 Design**: Microsoft's official D365 icon set
- **Data/Configuration Icons**: Search "database icons" on Noun Project
- **Comparison UI**: Icons showing before/after or comparison

## 📤 Next Steps After Creating Icons

1. **Test in Chrome**: Load extension, verify icons display
2. **Test in Edge**: Load extension, verify icons display
3. **Prepare for distribution**:
   - Create high-res screenshot of extension
   - Write privacy policy if publishing
   - Get legal approval for distribution
4. **Submit to Web Store** (if publishing publicly):
   - Chrome Web Store submission
   - Edge Add-ons submission
   - Requires account and initial fee

## 🚀 Using Default Icons (Temporary)

Until custom icons are ready:

1. Leave `icon.svg` in place
2. Or use any of these placeholder approaches:
   - Generic D365 icon from Microsoft
   - Simple blue square with "D365"
   - Your organization's logo

## 📞 Icon Design Services

If you want professional design:

- **Fiverr**: Search "D365 extension icon" ($30-100)
- **99designs**: Custom design contest ($200+)
- **Your graphic designer**: Provide design brief above
- **Your IT department**: May have design resources

---

**Icons are important for user experience!** Take time to create professional-looking icons that represent your extension's purpose.
