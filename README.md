# FotoOwl RN Assignment

A React Native (Expo) app implementing user authentication, a searchable/filterable image gallery, favorites, image details with gallery download, and profile management — built for the FotoOwl React Native Mobile Engineer Intern assignment.

## Tech Stack

- React Native + Expo (SDK 54)
- TypeScript
- React Navigation (native-stack + bottom-tabs)
- Zustand (with AsyncStorage persistence middleware) for centralized state management
- AsyncStorage for local data persistence (users, session, favorites, theme)
- `expo-media-library` + `expo-file-system` for downloading images to the device gallery
- `@react-native-picker/picker` for the City dropdown

## Features Implemented

- **Registration** — full name, email, gender (radio), mobile, address, city (dropdown), password/confirm, with full client-side validation (required fields, email format, 10-digit mobile, 6+ char password, password match).
- **Login** — validated against locally stored registered users.
- **Session persistence** — login state persists across app restarts via Zustand + AsyncStorage.
- **Home / Image Gallery**
  - Fetches from `https://picsum.photos/v2/list`, rendered with `FlatList`.
  - Loading state, pull-to-refresh, and graceful error handling with a retry banner.
  - **Debounced search** (400ms) by author name, case-insensitive.
  - **Filter** by author name: All / A–M / N–Z, combined seamlessly with search.
  - **Infinite scroll pagination**, with a ref-based in-flight guard to prevent duplicate concurrent fetches (also protects pull-to-refresh from firing overlapping requests).
- **Favorites** — add/remove from the gallery or the dedicated Favorites screen, in-favorites search, persisted across restarts.
- **Image Details / Full-Screen Viewer** — full-size image, author, image ID, and a Download button that saves the image to the device gallery (via `expo-media-library`), with permission handling.
- **Profile** — view and edit stored profile fields; changes save and reflect immediately across the app.
- **Logout**.
- **Bonus:** Dark mode (toggleable, theme persisted), debounced search, and custom hooks (`useImageGallery` for fetch/pagination/refresh logic, `useDebounce`, `useTheme`).

## Project Setup

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go, or run on an emulator/simulator. Note: the gallery-download feature depends on `expo-media-library`, a native module not included in the standard Expo Go client — to test that specific feature you'll need a development build:

```bash
eas build --profile development --platform android
npx expo start --dev-client
```

To produce a release APK:

```bash
eas build --platform android --profile preview
```

## Folder Structure

```
src/
  app/            Root layout / entry (Expo Router entry files)
  components/     Reusable UI components (FormInput, RadioGroup, ImageCard)
  hooks/          Custom hooks (useImageGallery, useDebounce, useTheme)
  navigation/      Bottom tab navigator setup
  screens/        Screen components (Login, Register, Home, Favorites, ImageDetails, Profile)
  store/          Zustand stores (auth, favorites, theme) with AsyncStorage persistence
  theme/          Light/dark color palettes
  types/          Shared TypeScript types
  utils/          Validation helpers
```

## Assumptions

- Cities available in the dropdown are a fixed list (Pune, Mumbai, Bengaluru, Delhi, Hyderabad, Chennai, Kolkata) rather than fetched from an external API, since the assignment doesn't specify a source.
- "Filter by Author Name A–M / N–Z" is applied against the first letter of the author's name, case-insensitively.
- Since the Picsum API doesn't support server-side author search/filtering, search and filter are applied client-side against currently loaded pages; infinite scroll pagination is paused while a search query or non-"All" filter is active, to avoid mixing paginated raw results with filtered views.
- User accounts and profile data are stored locally only (AsyncStorage) — there is no backend; "registration" and "login" are simulated against locally persisted user records.