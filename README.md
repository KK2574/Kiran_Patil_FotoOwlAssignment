# FotoOwl React Native Intern Assignment

A React Native (Expo + TypeScript) app implementing user authentication, an image gallery
dashboard with search/filter/infinite-scroll, favorites, image details with download-to-gallery,
and profile management.

## Tech Stack

- **React Native** (Expo SDK 51, managed workflow)
- **TypeScript**
- **React Navigation 6** (native-stack + bottom-tabs)
- **Zustand** — centralized state management (auth + favorites), with persistence middleware
- **AsyncStorage** — local persistence for registered users, session, and favorites
- **expo-media-library / expo-file-system** — downloading images to the device gallery

## Project Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo dev server
npx expo start

# 3. Run on a device/emulator
#    - Press "a" for Android, "i" for iOS, or scan the QR code with Expo Go
```

### Building an APK

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

This produces a downloadable `.apk` link from Expo's build servers.

## Folder Structure

```
├── App.tsx                      # Root navigator, auth-based routing
├── app.json                     # Expo config (permissions, plugins)
├── src/
│   ├── screens/                 # All app screens
│   │   ├── LoginScreen.tsx
│   │   ├── RegisterScreen.tsx
│   │   ├── HomeScreen.tsx       # Gallery: search, filter, pagination, favorites
│   │   ├── FavoritesScreen.tsx
│   │   ├── ImageDetailsScreen.tsx  # Full-screen view + download
│   │   └── ProfileScreen.tsx
│   ├── navigation/
│   │   └── MainTabs.tsx         # Bottom tab navigator (Home / Favorites / Profile)
│   ├── store/                   # Zustand stores (centralized state)
│   │   ├── authStore.ts         # Registered users, session, profile updates
│   │   └── favoritesStore.ts    # Favorite images, persisted locally
│   ├── hooks/                   # Custom hooks
│   │   ├── useImageGallery.ts   # API fetching, pagination, loading/error state
│   │   └── useDebounce.ts       # Debounced search (bonus)
│   ├── components/              # Reusable UI components
│   │   ├── FormInput.tsx
│   │   ├── RadioGroup.tsx
│   │   └── ImageCard.tsx
│   ├── utils/
│   │   └── validation.ts        # Form validation logic
│   └── types/
│       └── index.ts             # Shared TypeScript types
```

## Features Implemented

- **Registration** — Full Name, Email, Gender, Mobile, Address, City (dropdown), Password,
  Confirm Password, with full field validation (email format, 10-digit mobile, password length,
  password match).
- **Login** — validated against locally stored registered users.
- **Session persistence** — login state persists across app restarts via AsyncStorage.
- **Gallery (Home)** — fetches from `picsum.photos/v2/list`, FlatList rendering, loading state,
  graceful error handling with retry, pull-to-refresh, infinite scroll pagination.
- **Search** — case-insensitive, real-time (debounced), filters by author name.
- **Filter** — All / Author A–M / Author N–Z, works together with search.
- **Favorites** — mark/unmark from gallery or favorites screen, persisted across restarts,
  own search within Favorites.
- **Image Details** — full-size image, author, ID, download button that saves to the device's
  actual photo gallery (via `expo-media-library`).
- **Profile** — view and edit user info, changes reflected immediately app-wide.
- **Logout**.
- **Centralized state** — Zustand stores for auth and favorites (no prop drilling).

### Bonus features included
- Debounced search (`useDebounce` hook)
- Reusable components (`FormInput`, `RadioGroup`, `ImageCard`)
- Custom hooks for API/pagination and debouncing
- Pull-to-refresh duplicate-call prevention (via `isFetching` ref lock in `useImageGallery`)
- Dark Mode support — toggle in the Profile screen, preference persisted via AsyncStorage
  (`themeStore.ts`), applied across navigation, screens, and components via a `useTheme` hook

## Assumptions

- "User authentication" is implemented fully client-side (no backend), per the assignment's
  scope — registered users and credentials are stored locally via AsyncStorage. This is not
  intended for production use (passwords are not hashed) but demonstrates the required
  register/login/session flow.
- The Picsum API has no true "author search" endpoint, so search/filter are applied client-side
  against the currently loaded pages. Pagination continues to fetch new pages from the API in
  the background; search/filter apply to all images loaded so far.
- City list for the dropdown is a fixed set of major Indian cities for demo purposes.
- Downloaded images require photo library permission, requested at download time.

## Known Limitations

- Since search/filter operate on already-fetched pages (not a server-side search), searching
  for an author not yet loaded may require scrolling to load more pages first.
- No automated test suite was included given the assignment timeline; manual testing was
  performed across registration, login, gallery interactions, and profile editing.
