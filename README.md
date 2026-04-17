# Brain Drain Wall — Interactive Map

## Stack

- **React 19** + **TypeScript** + **Vite**
- **React Leaflet** — interactive map (OpenStreetMap tiles)
- **Supabase** — backend (stickers & threads data)
- **SCSS** — styling
- **dayjs** — date formatting

## Project Structure

```
src/
├── assets/               # Images (stickers, pins, backgrounds, icons)
├── components/
│   ├── GDPCounter/       # Live GDP loss display widget
│   ├── MapBoard/         # Leaflet map with stickers and threads
│   └── StickerModal/     # Modal for sticker detail view
└── lib/
    ├── supabase.ts        # Supabase client
    └── stickerIcon.ts     # Leaflet DivIcon factory for sticker/pin markers
```

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A Supabase project with `stickers` and `threads` tables

### Install

```bash
npm install
```

### Environment

Create `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

### Run

```bash
npm run dev       # dev server
npm run build     # production build
npm run preview   # preview production build
npm run lint      # lint
```

## Database Schema

### `stickers`

| Column           | Type    | Description                               |
|------------------|---------|-------------------------------------------|
| `id`             | uuid    | Primary key                               |
| `type`           | text    | `photo` or `text`                         |
| `size`           | text    | `large`, `medium`, `small`, `extra_small` |
| `lat`            | float   | Latitude                                  |
| `lng`            | float   | Longitude                                 |
| `title`          | text?   | Sticker title                             |
| `text`           | text?   | Sticker body text                         |
| `photo_url`      | text?   | Thumbnail photo URL                       |
| `photo_url_full` | text?   | Full-size photo URL                       |
| `date_of_leaving`| date?   | Date of leaving                           |

### `threads`

| Column           | Type | Description                    |
|------------------|------|--------------------------------|
| `id`             | uuid | Primary key                    |
| `from_sticker_id`| uuid | FK → stickers.id               |
| `to_sticker_id`  | uuid | FK → stickers.id               |
