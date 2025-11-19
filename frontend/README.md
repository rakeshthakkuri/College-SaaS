# Frontend Setup

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The build files will be in the `dist` directory.

## Development

- The frontend uses Vite for fast development
- Hot module replacement is enabled
- API proxy is configured to forward `/api` requests to `http://localhost:5000`

Make sure the backend server is running before starting the frontend.

