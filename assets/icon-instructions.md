# App Icon Instructions

## Burger Icon Creation

To create the burger app icon, you'll need to generate the following icon files and place them in the `assets` directory:

### Required Icon Files:

1. **icon.png** (1024x1024) - Main app icon
2. **adaptive-icon.png** (1024x1024) - Android adaptive icon foreground
3. **splash-icon.png** (1024x1024) - Splash screen icon
4. **favicon.png** (16x16 or 32x32) - Web favicon

### Burger Icon Design Specifications:

- **Style**: Flat, modern design
- **Colors**:
  - Top bun: #D2691E (saddle brown)
  - Lettuce: #32CD32 (lime green)  
  - Patty: #8B4513 (dark brown)
  - Cheese: #FFD700 (gold)
  - Bottom bun: #DEB887 (burlywood)
- **Background**: White (#FFFFFF)
- **Padding**: 10% margin from edges

### Design Tools:

You can create the icon using:
1. **Figma/Sketch** - Vector design tools
2. **Canva** - Online design platform
3. **GIMP/Photoshop** - Image editing software
4. **AI Tools** - DALL-E, Midjourney, etc.

### Manual Creation Steps:

1. Create a 1024x1024 canvas with white background
2. Draw burger layers from top to bottom:
   - Rounded top bun (70% width)
   - Thin lettuce layer (65% width)
   - Thick meat patty (68% width) 
   - Thin cheese layer (65% width)
   - Flat bottom bun (70% width)
3. Center all layers vertically and horizontally
4. Export as PNG with transparent or white background
5. Copy to all required icon file names

### Alternative: Use BurgerIcon Component

The project includes a `BurgerIcon.tsx` component that renders a burger using React Native Views. You can:

1. Screenshot this component at high resolution
2. Crop and resize to create icon files
3. Use this as a fallback until custom icons are created

### Expo Icon Generation:

Once you have the main icon.png file, Expo can automatically generate other sizes:

```bash
npx expo install expo-app-icon-utils
npx expo-app-icon-utils generate
```
