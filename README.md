# Smooth Money Mock APIs

## Getting Started

```bash
pnpm install
pnpm run dev
```

The development server listens on `http://localhost:3000` by default.

## Vision Endpoints

- `GET /vision` — returns paginated vision board data. Supports `page` and `limit` query parameters (defaults: `page=1`, `limit=10`).

  ```bash
  curl "http://localhost:3000/vision?page=1&limit=5"
  ```

- `GET /vision/image/:fileName` — streams a static image from the `assets` directory. Place your files in `assets/` (or subdirectories) and request them by filename.

  ```bash
  curl "http://localhost:3000/vision/image/sample.jpg" --output sample.jpg
  ```

  If the file is missing, the endpoint responds with `404`.

