---
name: update_music
description: Add a new album or song to the music portfolio website. handles validation of required assets (audio, cover) and updates both the music list and album detail pages.
---

# Update Music Skill

This skill guides you through the process of adding a new music album or song to the website. It involves updating two main files: the music list page and the album detail page.

## 1. Validation Phase

**CRITICAL**: Before making any code changes, verify that the user has provided ALL of the following information/assets. If ANY is missing, STOP and ask the user for the missing details.

### Required Assets (Check `public/` folder):
1.  **Audio File**: verify existence in `public/audio/<folder>/`.
    -   *Action*: Use `list_dir` or `find_by_name` to confirm the file exists.
2.  **Cover Image**: verify existence in `public/images/`.
    -   *Action*: Use `list_dir` or `find_by_name` to confirm the file exists.

### Required Metadata:
1.  **Album Title** (e.g., "Winter Village")
2.  **Song Title** (often same as Album for singles)
3.  **Release Date** (Format: YYYY-MM-DD or similar)
4.  **Duration** (Format: MM:SS)
5.  **Description** (Short text description)
6.  **Lyrics** (Full lyrics text)

## 2. ID Determination

1.  Read `src/app/music/page.tsx` to find the current highest **Album ID**.
2.  Read `src/app/music/page.tsx` or `src/app/music/album/[id]/page.tsx` to find the current highest **Song ID**.
    -   *Note*: Song IDs must be unique across the entire project, not just within the album.
3.  **New Album ID** = Last Album ID + 1.
4.  **New Song ID** = Last Song ID + 1.

## 3. Implementation

### Step 3.1: Update Music List Page
**Target File**: `src/app/music/page.tsx`

Add a new object to the `albums` array.

```typescript
{
  id: <New_Album_ID>,
  title: '<Album_Title>',
  artist: '<Release_Date>', // Note: in this file, 'artist' field is used for Date
  cover: '/images/<Cover_Image_Filename>',
  songs: [
    { id: <New_Song_ID>, title: '<Song_Title>', duration: '<Duration>', src: '/audio/<path_to_file>' }
  ]
}
```

### Step 3.2: Update Album Detail Page
**Target File**: `src/app/music/album/[id]/page.tsx`

Add a new entry to the `albumsData` object.

```typescript
<New_Album_ID>: {
  id: <New_Album_ID>,
  title: '<Album_Title>',
  artist: '张嗣泳', // Fixed artist name usually
  cover: '/images/<Cover_Image_Filename>',
  year: '<Year_From_Release_Date>',
  description: '<Description>',
  songs: [
    { 
      id: <New_Song_ID>, 
      title: '<Song_Title>', 
      duration: '<Duration>',
      src: '/audio/<path_to_file>',
      lyrics: `<Lyrics_Content>` // Use backticks for multi-line lyrics
    }
  ]
}
```

## 4. Final Review

1.  Confirm that the Song ID used in `src/app/music/page.tsx` matches the one used in `src/app/music/album/[id]/page.tsx`.
2.  Confirm that the Audio and Image paths are correct and match the files in `public/`.
3.  Ask the user if they would like to commit and push the changes (using `gitpush` flow if requested).
