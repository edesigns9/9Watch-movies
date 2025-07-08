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
  posterUrl: { type: String, required: true }, // URL to poster image (e.g., /w500/path.jpg)
  heroUrl: { type: String, required: true },   // URL to backdrop image (e.g., /w1280/path.jpg)
  featured: { type: Boolean, default: false }, // Indicates if media is featured on homepage carousel
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

### 5.1 Completed Features & Fixes

*   **Full-Stack Integration:**
    *   Backend API endpoints for authentication, media browsing, and user profiles are implemented and functional.
    *   Frontend is integrated with the backend API for data fetching and user interactions (login, registration, profile).
    *   CORS configuration is in place to allow frontend-backend communication.
    *   Root `package.json` uses `concurrently` to run both frontend and backend servers.
*   **TMDB API Integration & Database Seeding:**
    *   Database seeding script (`backend/seed.ts`) is implemented to fetch popular movies from TMDB, transform data, and populate the MongoDB database.
    *   `TMDB_API_KEY` and `MONGO_URI` are configured via `.env` file.
    *   Media model (`backend/models/Media.ts`) includes `featured`, `posterUrl`, and `heroUrl` fields.
    *   Seed script correctly populates `featured` and `heroUrl` with fallbacks.
    *   Backend media controller (`backend/controllers/mediaController.ts`) supports filtering by `featured` status.
    *   Seed script now fetches up to 100 movies across multiple TMDB pages for more diverse content.
*   **Homepage Content Display:**
    *   `HeroCarousel` is functional and displays content from the first collection returned by the API.
    *   Multiple content rows (`ContentRow`) are displayed on the homepage, fetching data for various categories (Featured, Trending Now, Recently Added, Action, Critically Acclaimed TV, Sci-Fi, Horror, Romance, Drama, Thriller, Documentary, Comedy, Fantasy, Adventure, History, War, Crime, Reality, Sport, Mystery, Cyberpunk, African & Black Cinema, Made in Africa).
    *   `MediaCard` component correctly displays movie posters and details using `posterUrl` and `heroUrl`.
*   **Frontend Enhancements:**
    *   UI Bug Fix (Hover Effect) resolved.
    *   Resolved Linter Error (`browseableMedia`).
    *   Stale Linter State addressed.

### 5.2 Known Issues & Remaining Tasks

*   **Initial Load Data Display:** On initial page load, content (carousel and categories) does not appear immediately and requires a manual refresh to display. This indicates a race condition or timing issue during frontend-backend startup.
*   **Carousel Featured Content:** The `HeroCarousel` currently displays content from the first collection, not necessarily the "featured" content as intended. The logic to specifically populate the carousel with `featured: true` items needs to be re-implemented and debugged.
*   **Video Sources:** `videoSources` are currently mocked in the seed script and need to be manually added by an admin for full functionality.
*   **User Watch History & Watchlist:** Backend endpoints and frontend integration for user watch history and watchlist are implemented but require thorough testing.
*   **Browse Page Filtering/Sorting:** The frontend's Browse Page needs to fully integrate with the backend's filtering and sorting capabilities.
*   **Media Detail Page:** Needs full integration with backend API for dynamic data loading.
*   **Video Player Page:** Needs full integration with backend API for dynamic video sources and watch history updates.
*   **Authentication Flow:** Thorough testing of login/register pages and authentication persistence.
*   **Error Handling & UI Feedback:** Improve error handling and user feedback mechanisms across the application.
