#!/usr/bin/env node

/**
 * Generate placeholder icons for the extension
 * Run with: npm run build:icons
 *
 * For production, replace with actual icons designed in:
 * - Adobe XD, Figma, or similar design tool
 * - Use MS Fluent Design System colors
 * - Icon sizes: 16px, 48px, 128px
 * - Format: PNG with transparency
 */

const fs = require('fs');
const path = require('path');

// Ensure icons directory exists
const iconsDir = path.join(__dirname, '..', 'icons');
if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

// Simple SVG icons - will be converted to PNG
const svgIcon = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="128" height="128" rx="20" fill="#0078D4"/>
  <g transform="translate(32, 32)">
    <!-- D365 Icon representation -->
    <rect x="0" y="0" width="64" height="64" rx="4" fill="white" opacity="0.1"/>
    <g fill="white">
      <!-- Table/Grid representation -->
      <rect x="8" y="8" width="48" height="8" rx="1"/>
      <rect x="8" y="20" width="48" height="8" rx="1" opacity="0.7"/>
      <rect x="8" y="32" width="48" height="8" rx="1" opacity="0.5"/>
      <!-- Comparison arrows -->
      <path d="M 30 48 L 26 52 L 34 52" fill="white" opacity="0.8"/>
      <path d="M 34 52 L 30 56" stroke="white" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
    </g>
  </g>
</svg>`;

console.log('Generating placeholder icons...');

// Save SVG as template
const svgPath = path.join(iconsDir, 'icon-template.svg');
fs.writeFileSync(svgPath, svgIcon, 'utf-8');
console.log(`✓ Created ${svgPath}`);

// Create base64 PNG placeholders for each size
// These are minimal 1x1 blue PNG files - replace with actual images
const createPlaceholderPNG = (width, height) => {
    // Simple PNG header for a solid blue square (simplified base64)
    // In production, use actual PNG images
    // This is just a placeholder
    const buffer = Buffer.from([
        137, 80, 78, 71, 13, 10, 26, 10, // PNG signature
        0, 0, 0, 13, 73, 72, 68, 82,     // IHDR chunk
        0, 0, 0, width,
        0, 0, 0, height,
        8, 2, 0, 0, 0, 144, 145, 79, 223, // bit depth, color type, etc
        0, 0, 0, 10, 73, 68, 65, 84,     // IDAT chunk
        120, 156, 63, 0, 1, 0, 0, 5,
        0, 1, 13, 10, 45, 181,           // chunk data
        0, 0, 0, 0, 73, 69, 78, 68,      // IEND chunk
        174, 66, 96, 130                 // CRC
    ]);
    return buffer;
};

const sizes = [
    { name: 'icon-16.png', width: 16, height: 16 },
    { name: 'icon-48.png', width: 48, height: 48 },
    { name: 'icon-128.png', width: 128, height: 128 }
];

sizes.forEach(({ name, width, height }) => {
    const iconPath = path.join(iconsDir, name);

    // For now, copy template or create with placeholder
    // In production, these should be proper PNG files
    const placeholder = createPlaceholderPNG(width, height);
    fs.writeFileSync(iconPath, placeholder);
    console.log(`✓ Created placeholder ${iconPath} (${width}x${height})`);
    console.log(`  → Replace with actual PNG icon in Fluent Design style`);
});

console.log('\n✅ Icon generation complete!');
console.log('\n📝 Next steps:');
console.log('1. Create proper 16x16, 48x48, and 128x128 PNG icons');
console.log('2. Use MS Fluent Design System colors (e.g., #0078D4)');
console.log('3. Include transparency for better appearance');
console.log('4. Save as PNG files in the icons/ directory');
console.log('5. Recommended: Use design tools like:');
console.log('   - Adobe XD (D365-themed icon pack available)');
console.log('   - Figma (Fluent UI icons)');
console.log('   - Inkscape (open source SVG editor)');
console.log('\n🎨 Icon guidelines:');
console.log('- Main color: #0078D4 (Microsoft blue)');
console.log('- Accent: #50E6FF (Light blue)');
console.log('- Avoid white text on icons');
console.log('- Ensure 1px clearance on all sides');
