# 9Watch Movie & TV Show Aggregator

A web application for browsing and watching movies and TV shows.

## Project Structure

This project is organized as follows:

- `frontend/`: Contains the React frontend application
- `backend/`: Contains the backend API server
- Configuration files at the root level control both frontend and backend

## Configuration Files

The project uses the following configuration files:

- `vite.config.js`: Main Vite configuration for the frontend
- `tailwind.config.js`: Tailwind CSS configuration
- `postcss.config.js`: PostCSS configuration for processing CSS

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

This will start both the frontend and backend servers concurrently.

## Available Scripts

- `npm run dev`: Start both frontend and backend development servers
- `npm run dev:frontend`: Start only the frontend development server
- `npm run dev:backend`: Start only the backend development server
- `npm run build`: Build the frontend for production
- `npm run lint`: Run ESLint to check for code issues
- `npm run preview`: Preview the production build locally

## Styling

The project uses Tailwind CSS for styling. The main configuration is in:

- `tailwind.config.js`: Defines theme colors and content paths
- `frontend/index.css`: Contains Tailwind directives and custom CSS

## Development Notes

- The frontend is served from the `frontend/` directory
- Static assets are served from the `public/` directory
- The build output is generated in the `dist/` directory
