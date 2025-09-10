# Product Requirements Document (PRD)

**Title:** Photo Menu (Expo / React Native Android)

**Author:** Sami

**Date:** 2025-09-07

---

## 1. Purpose / Summary

Photo Menu is a lightweight Android app built with Expo and React Native that allows users to capture photos with the device camera and view them locally. Photos are saved only on the device (no cloud sync). The main screen shows photos in a two-column grid by default, with an alternate list view. Tapping a photo opens it full-screen with a back arrow. The Android app icon is a burger. Do not show existing gallery photos, it should only show photos captured through the app. It is not a general photo gallery app.

## 2. Objectives & Success Metrics

* **Primary objective:** enable quick capture and local viewing of photos in a simple, fast, offline-first gallery which was captured using the app itself.
* **Success metrics:**

  * App installs -> target N/A for PRD
  * Usability: user can capture and see captured photo within 3 taps.
  * Stability: no crashes on common Android 9+ devices.
  * Offline behavior: 100% of captured photos persist after app restart.

## 3. Target Audience

Casual users who want a simple camera-to-local-gallery experience without cloud sync or account setup.

## 4. Key Features (MVP)

1. **Home screen — Two-column grid**

   * Default view shows all saved photos(captured from the app) in a 2-column responsive grid.
   * Each grid cell shows a cropped thumbnail preserving aspect ratio.

2. **Alternate List view**

   * Tappable icon toggles between grid and list view.
   * List view shows a single column of full-width thumbnails and basic metadata (timestamp).

3. **Add new photo (Camera)**

   * Floating Action Button (FAB) or header button to open camera.
   * Camera component uses device camera through Expo Camera APIs.
   * After capture, user can confirm/save or discard retake.
   * On save, photo is stored locally and appears in the gallery instantly.

4. **Full-screen photo viewer**

   * Tap any thumbnail to open the original photo in full-screen modal/screen.
   * Top-left back arrow returns to the gallery.
   * Support pinch-to-zoom and double-tap to zoom (if feasible for MVP; otherwise basic zoom/pan).

5. **Local persistence**

   * Store photo files in app’s local file storage (Expo FileSystem) and keep metadata (id, filename, URI, timestamp, orientation) in persistent storage (AsyncStorage or SQLite if needed).
   * Photos survive app restarts and device reboots.

6. **Permissions & Privacy**

   * Request CAMERA permissions on first camera action.
   * Request FILESYSTEM access if required for writing files (handled by Expo FileSystem).
   * No network permission required; no data is uploaded.

7. **App Icon**

   * Android launcher icon should depict a burger (flat/modern style). Provide a high-resolution PNG (or adaptive icon) and include in Expo app.json.

## 6. User Flows

1. **Open app (first time)**

   * Home grid is empty with a friendly call-to-action card: "Tap camera to add your first photo."
   * Camera button visible FAB and header icons for view toggle.

2. **Capture photo**

   * User taps FAB -> open camera
   * Capture -> preview -> Save or Retake
   * Save: write file, update metadata store, show in gallery

3. **View photo full-screen**

   * Tap thumbnail -> full-screen view opens, top-left back arrow -> tap returns to gallery

4. **Switch views**

   * Tap header icon to toggle grid/list; chosen layout persists across sessions.

## 7. UI / Wireframes (textual)

* **Header (top bar)**

  * Left: App title/logo
  * Right: two icons: *Grid/List toggle* and *List/Grid toggle* (toggles between views). Use stateful icon (highlight active).

* **Body**

  * Grid view: 2-column masonry-like grid (uniform rows) with square thumbnails.
  * List view: vertical list with each item full width, thumbnail left or top and timestamp below.

* **FAB (bottom-right)**

  * Round camera button.

* **Full-screen view**

  * Photo centered, top-left back arrow, optionally top-right overflow for Delete/Share (non-MVP).

## 8. Data Model

```json
{
  "id": "uuid",
  "fileName": "photo-20250907-123456.jpg",
  "uri": "https://i.pinimg.com/736x/91/cf/81/91cf81a5aea83434b8c432f297742c8b.jpg",
  "timestamp": 1694067890000,
  "width": 4032,
  "height": 3024
}
```

Store an array of these objects in AsyncStorage under a key (e.g. `@photogrid:photos`). Photo files saved to FileSystem.documentDirectory + `/photos/`.

## 9. Technical Stack & Libraries

* **Framework:** Expo (managed workflow)
* **Language:** TypeScript (recommended) or JavaScript
* **Primary libs:**

  * `expo-camera` (camera capture)
  * `expo-file-system` (store photo files)
  * `@react-native-async-storage/async-storage` (metadata persistence)
  * `react-navigation` (stack navigation for full-screen viewer)
  * `react-native-gesture-handler` + `react-native-reanimated` (optional, for gestures/zoom)
  * `expo-image-manipulator` (optional: resize/compress on save)

## 10. Permissions

* `CAMERA` (runtime) — request via `expo-camera`
* `WRITE_EXTERNAL_STORAGE` / storage access if targeting older Android APIs and writing to shared directories (prefer app internal storage to avoid extra permissions)

## 11. Performance & Storage Considerations

* Compress/rescale camera captures before saving to conserve space (optional): when saving, resize longest edge to e.g. 2048px and save JPEG at quality 0.8.
* Manage storage: show storage usage (non-MVP) and prevent app from silently filling device.

## 12. Error Handling & Edge Cases

* Handle permission denial: show rationales and fallback (disable camera button, show message with link to app settings).
* Low storage: show an error if writing fails.
* Corrupted/missing file URIs: skip on load and remove metadata entry.

## 13. Security & Privacy

* Photos stored locally only.
* No network permission or analytics by default.
* If integrated later, require opt-in.

## 14. Acceptance Criteria

* User can capture and save a photo using device camera.
* Saved photo appears in gallery immediately and after app restart.
* User can toggle between grid (2-column) and list views and the state persists.
* Tapping any photo opens it full-screen and the back arrow returns to the gallery.
* App icon uses the burger image and shows correctly on Android launcher.

## 15. QA / Testing

* Manual testing on Android API levels 26, 29, 33 (representative older/modern versions).
* Test permission denial flows and re-enabling.
* Test storage failure scenario (simulate low disk).
* Performance check for 100+ photos.

## 16. Deliverables

* Expo app source code (Git repo) with README for dev and build instructions
* App icon assets (adaptive icons)
* Test notes and known issues

## 17. Risks

* Device fragmentation (camera APIs differ across devices): mitigate by using Expo Camera and testing multiple devices.
* Large photos causing storage problems: mitigate with optional compression and educating the user.

---

Write everything we did so far to progress.md, ensure to note the approach we're taking, the steps we've done so far, and the current failure we're working on
