# Character Images Setup

## Issues Fixed

1. **Image API Route** - Updated to:
   - Check for direct image files first (webp, jpg, png)
   - Extract base64 images from HTML files with improved regex
   - Handle slug variations (boa-hancock → boahancock, usopp → ussop)

2. **Character Avatar Component** - Fetches images from API and handles:
   - Direct image files
   - Base64 data URLs from HTML files
   - Loading states
   - Fallback gradients

## To Fix Remaining Issues

### 1. Re-seed Database (to get all characters)
Run this command to add all new characters:
```bash
npm run db:seed
```

This will add the new characters:
- Fujitora
- Gaban
- Imu
- Loki
- Rocks D. Xebec
- Gol D. Roger
- Shamrock

### 2. Verify Images Are Working
The image API should now:
- Serve zoro.jpg, chopper.webp, sanji.webp directly
- Extract base64 images from HTML files for other characters
- Show fallback gradients for characters without images

### 3. Chart Images
The chart legend uses CharacterAvatar component which should now work. If images still don't show:
- Check browser console for API errors
- Verify the API route is working: `/api/character-image/[slug]`
- Make sure HTML files are in `public/images/characters/`

## File Structure
```
public/images/characters/
  - zoro.jpg
  - chopper.webp
  - sanji.webp
  - *.htm (27 HTML files with base64 images)
```

## Testing
Test the image API:
```bash
curl http://localhost:3000/api/character-image/brook
curl http://localhost:3000/api/character-image/zoro
curl http://localhost:3000/api/character-image/chopper
```
