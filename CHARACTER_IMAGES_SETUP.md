# Character Images Setup

All character avatars are served from `public/images/characters/` as PNG files.

## Structure
```
public/images/
  characters/     # PNG avatars (one per character, ~1.7MB each)
  one_piece_map_outline.png   # Background map (MangaBackground)
```

## Adding New Character Images
1. Add the PNG to `public/images/characters/` (use character slug as filename, e.g. `luffy.png`)
2. For slugs with hyphens (e.g. `big-mom`), add a mapping in `lib/character-image-paths.ts`
3. Restart dev server - the API will serve the new image

## API
The `/api/character-image/[slug]` route resolves slugs to image paths. It uses the static map in `lib/character-image-paths.ts` (no filesystem access in production).
