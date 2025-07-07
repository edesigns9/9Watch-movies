# Product Requirements Document (PRD): 9Watch

## 1.0 Overview & Strategy

**Project Name:** 9Watch

**Objective:** To build a full-stack web application that is a functional clone of MovieBox.ng, acting as a curated aggregator for movies and TV shows from externally hosted sources.

**Core Philosophy:**
- **Aggregator Model:** The application will not host any video content. It stores metadata and links to external video streams.
- **Server-Side Persistence:** All user-specific data (accounts, watch history) will be stored in a server-side database to ensure data persistence and synchronization.

**Development Strategy:**
- **Frontend-First with Mocking:** The entire frontend UI will be built first, using local mock JSON files that simulate the backend API responses. This allows for complete UI development and testing before the backend is implemented. The API "contract" defined in this PRD must be strictly followed by both the mock data and the final backend.

**Technology Stack:**
- **Frontend:** Next.js, Tailwind CSS, and shadcn/ui.
- **Backend:** Node.js with Express.js.
- **Database:** MongoDB (using MongoDB Atlas for cloud hosting).
- **Authentication:** JWT (jsonwebtoken library), bcrypt.js (for password hashing).

---

## 2.0 Database Schemas (MongoDB with Mongoose)

This section defines the data structures for the entire application.

### 2.1 User Schema
Stores user account information and personalized data.

```javascript
// File: models/User.js
{
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true }, // Must be hashed with bcrypt
  createdAt: { type: Date, default: Date.now },
  watchHistory: [
    {
      media: { type: mongoose.Schema.Types.ObjectId, ref: 'Media', required: true },
      seasonNumber: { type: Number },  // Only for TV shows
      episodeNumber: { type: Number }, // Only for TV shows
      progressPercent: { type: Number, min: 0, max: 100, default: 0 },
      lastWatchedAt: { type: Date, default: Date.now }
    }
  ],
  watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }]
}
```

### 2.2 Media Schema (formerly Movie)
Stores all media content metadata, sourced from an external API (like TMDB) and curated by an admin.

```javascript
// File: models/Media.js
{
  tmdbId: { type: String, required: true, unique: true }, // The ID from The Movie Database
  title: { type: String, required: true },
  type: { type: String, enum: ['movie', 'tv-show'], required: true },
  releaseYear: { type: Number },
  synopsis: { type: String },
  posterImageUrl: { type: String }, // URL to poster image (e.g., /w500/path.jpg)
  heroImageUrl: { type: String },   // URL to backdrop image (e.g., /w1280/path.jpg)
  genres: [String],
  rating: { type: Number },
  cast: [
    {
      actorName: String,
      characterName: String,
      profileImageUrl: String
    }
  ],
  // Manually added external video links
  videoSources: [
    {
      quality: String,          // e.g., "1080p", "720p"
      url: String,              // EXTERNAL video stream URL (.mp4, .m3u8)
      format: String,           // "mp4" or "hls"
      sourceDomain: String,     // e.g., "tzmvoies.cms"
      sourceUploadedBy: String  // e.g., "Misha ✨"
    }
  ],
  // Only for type: 'tv-show'
  seasons: [
    {
      seasonNumber: Number,
      episodes: [
        {
          episodeNumber: Number,
          title: String,
          synopsis: String,
          videoSources: [ { /* Same structure as root videoSources */ } ]
        }
      ]
    }
  ]
}
```

### 2.3 Collection Schema
Defines the curated rows on the homepage (e.g., "Trending Now").

```javascript
// File: models/Collection.js
{
  title: { type: String, required: true }, // "Invincible Superheroes!"
  slug: { type: String, required: true, unique: true }, // "invincible-superheroes"
  items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }]
}
```

---

## 3.0 Backend Requirements (Node.js with Express.js API)

This is the API "contract" to be implemented after the frontend is built.

### 3.1 Authentication Endpoints (`/api/auth`)
- **POST `/register`**: Public. Body: `{ username, email, password }`. Hashes password, creates a new user, returns a JWT.
- **POST `/login`**: Public. Body: `{ email, password }`. Validates credentials, returns a JWT.
- **GET `/me`**: Protected (requires JWT). Returns the logged-in user's data (excluding password).

### 3.2 Content/Media Endpoints (`/api/media`)
- **GET `/homepage`**: Public. Fetches a predefined list of Collection documents, populates `items` with media details, and returns the structured JSON for the homepage.
- **GET `/`**: Public. The main browsing/searching endpoint. Must support query parameters for filtering (`?type=movie`, `?genre=action`, `?year=2023`) and sorting (`?sortBy=rating`). Returns a paginated list of Media documents.
- **GET `/:id`**: Public. Fetches a single Media document by its `_id` and returns all detailed information.

### 3.3 User Profile Endpoints (`/api/users`)
- **GET `/me/history`**: Protected. Returns the logged-in user's `watchHistory` array, populated with media details and sorted by `lastWatchedAt`.
- **PUT `/me/history`**: Protected. An "upsert" operation. Body: `{ mediaId, seasonNumber, episodeNumber, progressPercent }`. Finds the corresponding history item for the user and updates its progress, or creates a new one.
- **DELETE `/me/history`**: Protected. Clears the user's entire `watchHistory` array.

### 3.4 Admin/Data Management
- **Seed Script:** A one-off Node.js script (`seed.js`) must be created to populate the database. It will use an external API (like TMDB) to fetch metadata, transform it to match the Media schema, and save it. `videoSources` will initially be empty and must be added manually by an admin.

---

## 4.0 Frontend Requirements (Next.js & shadcn/ui)

This will be built first, using mock data that matches the API contract above.

### 4.1 Global Components & Layout
- **`<Layout>`**: Main wrapper containing the Sidebar and Main Content area.
- **`<Sidebar>`**: Left navigation bar with links.
- **`<Header>`**: Top bar with a hamburger menu toggle, search input, and user buttons.
- **`<SearchInput>`**: A shadcn/ui input component for searching.
- **Global State**: Use Zustand or React Context for managing user authentication status.

### 4.2 Pages & Key Components
- **Homepage (`/`)**
  - **Components**: `<HeroCarousel>` (using shadcn/ui Carousel), `<ContentRow>`.
  - **Data**: Mocked from a local `homepage.json` file.
- **Browse Page (`/browse`)**
  - **Components**: `<FilterControls>` (using shadcn/ui Buttons/Toggles), `<MediaGrid>`, `<MediaCard>`.
  - **Data**: Mocked from a local `media-list.json` file. State will manage filter selections.
- **Media Detail Page (`/media/[id]`)**
  - **Components**: `<MediaInfoBlock>`, `<CastCarousel>`, `<RecommendationsRow>`.
  - **Data**: Dynamically loaded from a mock file based on the `[id]` parameter (e.g., `media-detail-123.json`).
- **Video Player Page (`/player/[id]`)**
  - **Components**: `<VideoPlayer>` (using ReactPlayer), `<RightSidebar>`, `<EpisodeSelector>`.
  - **Data & Logic**: Fetches mock data. The `type` field in the mock data will conditionally render the `<EpisodeSelector>`. The player will use the external `url` from the mock `videoSources`. The `onProgress` function will log to the console to simulate calls to the history API.
- **Login/Register Pages (`/login`, `/register`)**
  - **Components**: Standard forms using shadcn/ui Input and Button.
  - **Data & Logic**: Will have placeholder functions that simulate successful/failed login attempts to test UI state changes (e.g., showing user info in the header).

## 5.0 Development Progress & Issues

### 5.1 Frontend Enhancements (Phase 1 Completion)

*   **Homepage Categories:** Added "Horror, Thrillers, Romance, African & Black" categories to the homepage by updating `data/mockData.ts`.
*   **UI Bug Fix (Hover Effect):** Resolved a UI bug where hovering over a single media card highlighted all cards in the row by introducing named Tailwind CSS groups (`group/card` and `group/row`) in `components/MediaCard.tsx` and `components/ContentRow.tsx`.
*   **Resolved Linter Error (`browseableMedia`):** Addressed an unused variable linter error in `data/mockData.ts` by correctly exporting `browseableMedia`.
*   **Stale Linter State:** Encountered and bypassed persistent linter errors related to `item.id` vs `item._id` in various frontend components, which were determined to be a result of stale linter state rather than actual code issues, as `_id` was correctly defined in `types.ts`.

### 5.2 Backend Scaffolding & Initial Integration (Phase 2 Progress)

*   **Git Initialization:** Initialized a Git repository for the project and pushed existing frontend changes to a new GitHub repository.
*   **Backend Directory Setup:** Created a `backend` directory, initialized `package.json`, and installed necessary core (`express`, `mongoose`, `dotenv`, `cors`) and development dependencies (`typescript`, `ts-node`, `nodemon`, `@types/*`).
*   **TypeScript Configuration:** Configured `tsconfig.json` for the backend.
*   **Basic Express Server:** Created `backend/index.ts` with a basic Express server and MongoDB connection logic.
*   **MongoDB Connection:** Implemented MongoDB connection in `backend/index.ts`, requiring the user to manually create a `backend/.env` file with `MONGO_URI` and `PORT`.
*   **User Model:** Defined the Mongoose User schema in `backend/models/User.ts`.
*   **Authentication Endpoints (`/api/auth`):**
    *   Implemented user registration (`/register`) and login (`/login`) in `backend/routes/auth.ts` and `backend/controllers/authController.ts`.
    *   Installed `bcryptjs` for password hashing and `jsonwebtoken` for token management.
    *   Required user to add `JWT_SECRET` to `backend/.env`.
    *   Added protected `GET /api/auth/me` route and `getMe` controller.
*   **Express Type Mismatch Fix:** Resolved a persistent `TS2740` TypeScript error related to `express` types by downgrading `express` and `@types/express` to v4.x from v5.x due to version incompatibility.
*   **Authentication Middleware:** Created `backend/middleware/auth.ts` for JWT protection.
*   **Media Model & Routes:** Created `backend/models/Media.ts`, `backend/routes/media.ts`, and `backend/controllers/mediaController.ts` for browsing and fetching media.
*   **Type Safety in Media Controller:** Fixed `any` type linter errors in `mediaController.ts` by introducing `MediaFilter` and `SortOptions` interfaces.
*   **User Profile & History Routes:** Created `backend/routes/user.ts` and `backend/controllers/userController.ts` for user profiles and watch history.

### 5.3 Full-Stack Integration (Phase 3 Progress)

*   **API Service Overhaul:** Refactored `services/api.ts` to use `fetch` calls to the new backend API, including `apiFetch` helper, `getAuthToken`, `getBrowseMedia`, `getMediaDetails`, `getMyProfile`, and `updateUserWatchHistory`.
*   **Authentication Context Integration:** Updated `AuthContext.tsx` to use the real API for login, registration, and watch history updates.
*   **Frontend Page Updates:** Updated `RegisterPage.tsx`, `LoginPage.tsx`, `BrowsePage.tsx`, and `ProfilePage.tsx` to integrate with the new asynchronous `AuthContext` functions, handling loading states, toast notifications, and paginated responses.
*   **Deployment & Current Issue:** Configured the root `package.json` to use `concurrently` to run both frontend and backend servers.

### 5.4 Current Issue: Backend Compilation Error (`TS2322`)

*   **Problem Description:** The backend server is currently failing to start due to a TypeScript compilation error in `backend/controllers/userController.ts` at line 53. The error message is `TSError: ⨯ Unable to compile TypeScript: controllers/userController.ts(53,17): error TS2322: Type 'unknown' is not assignable to type 'ObjectId'.`
*   **Attempts to Resolve:**
    *   Initial attempts involved explicitly importing `mongoose` and removing `as any` casts to ensure type correctness.
    *   Despite these efforts, the `ts-node` compiler is still inferring `media._id` as type `unknown` when it's assigned to `user.watchHistory[historyIndex].mediaId`, which is defined as `mongoose.Schema.Types.ObjectId`.
*   **Impact:** This compilation error prevents the backend server from successfully starting, which in turn means the frontend cannot communicate with the API, resulting in a non-functional application despite the frontend server (Vite) running successfully.
*   **Next Steps:** The core of the problem lies in TypeScript's interpretation of `media._id` as `unknown` in this specific assignment context. We need to find a way to explicitly tell TypeScript the correct type or ensure the type inference works as expected. This might involve a more explicit type assertion or re-evaluating the `mongoose` and `@types/mongoose` versions for potential subtle incompatibilities that manifest in this specific scenario.
