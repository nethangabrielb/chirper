# Chirper

> A full-featured Twitter/X clone with real-time messaging, notifications, Google OAuth, and a guest mode — built as a pnpm monorepo.

![GitHub last commit](https://img.shields.io/github/last-commit/nethangabrielb/chirper)
![GitHub repo size](https://img.shields.io/github/repo-size/nethangabrielb/chirper)

---

## 🚀 Live Demo

**[View Live App]({https://chirper-frontend.vercel.app/})**

<img width="1919" height="1050" alt="image" src="https://github.com/user-attachments/assets/2a23f92a-133b-485c-8e1b-e9e9bc49bea3" />
<img width="1919" height="1053" alt="image" src="https://github.com/user-attachments/assets/a8134070-bc09-46e0-90b5-8ca26cd971d8" />


> 💡 **No account needed** — click **Continue as Guest** on the landing page for instant read-only access.
---

## 📖 About the Project

Chirper is a fullstack Twitter/X-inspired social media application that replicates the core social experience: composing posts, following users, liking and replying to content, sending direct messages in real time, and receiving live notifications — all inside a responsive, dark/light-mode UI.

The project is structured as a **pnpm monorepo** with three workspaces: a Node.js/Express backend, a Next.js 16 frontend, and a shared TypeScript types package consumed by both ends.

### Why I Built This

I wanted to cap off The Odin Project's Node.js curriculum with something I'd actually be proud to show — not just a checkbox project, but a realistic, production-leaning social media application. The challenge was to take an open-ended brief and make deliberate decisions about scope, architecture, and polish without losing momentum.

> 📚 Built in partial fulfillment of [The Odin Project – Odin-Book](https://www.theodinproject.com/lessons/node-path-nodejs-odin-book), the **final project** of the Full Stack JavaScript / NodeJS Course. All core requirements are met, and every extra credit item was implemented and then some.

### What I Learned

- How to design and scale a **pnpm monorepo** with shared TypeScript types across frontend and backend workspaces.
- How to implement a strict **Controller → Service → Repository** layered architecture across 10 domains, keeping business logic cleanly separated from HTTP and database concerns.
- How to layer multiple auth strategies — email/password, **Google OIDC via Passport.js**, and a **read-only guest mode** — all sharing the same JWT cookie flow.
- How to integrate **Socket.IO** for real-time chat and live notifications (likes, replies, follows) including connection state recovery and per-socket auth validation.
- How to model a complex social graph in Prisma — self-referential posts for replies, implicit many-to-many room membership, soft deletes, and cursor-based pagination.
- How to handle **multipart file uploads** with `multer` and wire them to **Supabase object storage**, including cleanup of old avatars on update.
- How to build a fully responsive UI across mobile, tablet, and desktop breakpoints using Next.js App Router, TailwindCSS 4, and Radix UI primitives.
- How to deploy a containerized application to the cloud by provisioning a **DigitalOcean Droplet**,
  running the backend via Docker, and wiring it up to a live domain.

---

## Features

- [x] Authentication — Email/password, Google OAuth (OIDC), and guest read-only mode
- [x] Post creation — Text (280 char limit) + optional image upload with emoji picker
- [x] Feed — "For You" and "Following" tabs with infinite scroll and cursor-based pagination
- [x] Replies — Threaded replies via self-referential Prisma relation, sorted by like count
- [x] Likes — Toggle like/unlike with optimistic UI updates
- [x] Bookmarks — Save/unsave posts with a dedicated bookmarks page
- [x] Follow system — Follow/unfollow with "Who to Follow" suggestions panel
- [x] User profiles — Avatar + cover photo upload, edit dialog, posts/replies/likes tabs
- [x] Real-time direct messaging — Socket.IO rooms, message persistence, unread badge tracking
- [x] Real-time notifications — Live push for likes, replies, and follows with nav badge counts
- [x] Profile hover cards — Radix hover cards with follower/following stats preview
- [x] Dark / light mode — System-aware theming via `next-themes`
- [x] Guest mode — Fully read-only session, blocked writes surfaced via dialog prompt
- [x] Soft delete — Posts flagged with `deleted: boolean` rather than hard-removed
- [x] Docker — Multi-stage backend Dockerfile with health check
- [x] Seeding — Faker.js scripts for users, social graph, and data cleanup

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 16 (App Router + Turbopack)** — React framework and routing
- **React 19** — UI library
- **TypeScript** — Type safety
- **TailwindCSS 4** — Utility-first styling
- **Radix UI** — Headless accessible primitives (dialogs, dropdowns, hover cards, tooltips)
- **TanStack React Query** — Server state, caching, and infinite scroll queries
- **Zustand** — Lightweight client state (auth user, unread counts, guest dialog)
- **React Hook Form + Zod** — Form handling and schema validation
- **Socket.IO Client** — Real-time messaging and notifications
- **emoji-mart** — In-post emoji picker
- **Sonner** — Toast notifications
- **next-themes** — Dark/light mode
- **date-fns** — Date formatting
- **Lucide React** — Icon set

### Backend
- **Node.js + Express 5** — HTTP server
- **TypeScript** — Compiled with `tsc`, dev via `tsx watch`
- **Prisma 6** — ORM and migrations (PostgreSQL)
- **Socket.IO** — Real-time messaging and notification events with connection state recovery
- **Passport.js + passport-google-oidc** — Google OpenID Connect authentication
- **JWT + httpOnly cookies** — Session-less auth with 14-day expiry
- **bcryptjs** — Password hashing
- **multer** — Multipart file upload handling
- **express-validator** — Request validation
- **compression** — gzip response compression

### Database & Storage
- **PostgreSQL** — Primary relational database (9 Prisma models)
- **Supabase Storage** — Object storage for post images, avatars, and cover photos

### DevOps & Tooling
- **pnpm 10 + pnpm workspaces** — Monorepo package management
- **Docker + Docker Compose** — Multi-stage backend containerization
- **ESLint 9 (flat config) + Prettier** — Linting and formatting
- **@faker-js/faker** — Seed scripts for development data

---

## Architecture
```
pnpm monorepo
├── apps/backend      Express API  ──► Controller → Service → Repository
├── apps/frontend     Next.js App Router
└── packages/shared   TypeScript interfaces shared across workspaces
```

The backend follows a strict layered pattern across 10 domains (auth, users, posts, comments, follows, likes, rooms, messages, bookmarks, notifications). REST handles all CRUD operations; Socket.IO handles real-time events on a separate connection authenticated via the same JWT cookie.
```
Client (Next.js)
    │  REST (credentials: include)
    │  Socket.IO (cookie auth)
    ▼
Express 5 API
    ├── authMiddleware (JWT cookie verify)
    ├── guestAuthMiddleware (blocks writes for guest sessions)
    ├── Controller → Service → Repository (per domain)
    ├── Prisma ORM → PostgreSQL
    ├── multer → Supabase Storage
    └── Socket.IO Server (connection state recovery, 2-min window)
```

---

## Getting Started

### Prerequisites

- Node.js >= 20.x
- pnpm >= 10.x
- PostgreSQL >= 15
- A Supabase project (for object storage)
- A Google Cloud project with OAuth 2.0 credentials (optional)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/{github_username}/twitter-clone.git
cd twitter-clone

# 2. Install all workspace dependencies
pnpm install

# 3. Set up environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 4. Run database migrations
cd apps/backend
npx prisma migrate dev

# 5. (Optional) Seed with fake data
pnpm seed:users
pnpm seed:social

# 6. Start both frontend and backend in parallel
cd ../..
pnpm dev
```

### Environment Variables

**`apps/backend/.env`**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/chirper
JWT_SECRET=your_jwt_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_service_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:3000
PORT=5000
```

**`apps/frontend/.env`**
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## API Reference

The backend exposes a REST API under `/api` split into guest (public) and authenticated routes. A full table of all 40+ endpoints is available below.

<details>
<summary>View all endpoints</summary>

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|:----:|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login (`?guest=true` for guest mode) | ❌ |
| POST | `/api/auth/logout` | Clear JWT cookie | ✅ |
| GET | `/api/auth/login/google` | Initiate Google OAuth | ❌ |
| GET | `/api/auth/user` | Validate Bearer token | ❌ |
| GET | `/api/users/` | Get users / search / current user | ✅ |
| GET | `/api/users/:id` | Get user by ID | ✅ |
| PUT | `/api/users/:id` | Update profile (avatar + cover upload) | ✅ |
| DELETE | `/api/users/:id` | Delete user | ✅ |
| GET | `/api/posts/` | Feed with cursor pagination | ✅ |
| GET | `/api/posts/:id` | Single post with replies + likes | ✅ |
| POST | `/api/posts/` | Create post (optional image) | ✅ |
| DELETE | `/api/posts/:id` | Soft-delete a post | ✅ |
| POST | `/api/comments/` | Create reply | ✅ |
| DELETE | `/api/comments/:id` | Delete reply | ✅ |
| POST | `/api/follows/` | Follow a user | ✅ |
| DELETE | `/api/follows/:id` | Unfollow | ✅ |
| POST | `/api/likes/posts/:id` | Like a post | ✅ |
| DELETE | `/api/likes/posts/:id` | Unlike a post | ✅ |
| POST | `/api/bookmarks/` | Bookmark a post | ✅ |
| DELETE | `/api/bookmarks/:id` | Remove bookmark | ✅ |
| POST | `/api/rooms/` | Create chat room | ✅ |
| GET | `/api/rooms/users/:id` | Get rooms for a user | ✅ |
| GET | `/api/messages/:roomId` | Get messages in a room | ✅ |
| PATCH | `/api/messages/:roomId` | Mark messages as read | ✅ |
| GET | `/api/notifications/` | Get notifications for current user | ✅ |

</details>

### Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `newMessage` | Client → Server → Room | Persist and broadcast a chat message |
| `joinRoom` | Client → Server | Join a socket room (DB-validated) |
| `leaveRoom` | Client → Server | Leave a socket room |
| `notification` | Client → Server → Broadcast | Create and broadcast a like/reply/follow notification |

---

## Folder Structure
```
twitter-clone/
├── pnpm-workspace.yaml
├── apps/
│   ├── backend/
│   │   ├── DockerFile
│   │   ├── prisma/schema.prisma       (9 models)
│   │   └── src/
│   │       ├── controllers/           (10 controllers)
│   │       ├── services/              (9 services)
│   │       ├── repositories/          (9 repositories)
│   │       ├── routes/                (10 route files)
│   │       ├── middlewares/           (JWT auth + guest middleware)
│   │       ├── sockets/               (Socket.IO init + handlers)
│   │       ├── supabase/              (storage client)
│   │       ├── config/passport.ts     (Google OIDC strategy)
│   │       ├── validators/            (express-validator rules)
│   │       └── seeder/                (Faker seed scripts)
│   └── frontend/
│       └── src/
│           ├── app/                   (14 page routes)
│           ├── components/            (15 custom + 15 UI primitives)
│           ├── hooks/                 (7 custom hooks)
│           ├── stores/                (3 Zustand stores)
│           ├── providers/             (4 providers)
│           ├── lib/api/               (9 API modules)
│           ├── schemas/               (8 Zod schemas)
│           └── socket/                (client + 2 event handlers)
└── packages/
    └── shared/index.ts                (shared TypeScript interfaces)
```

---

## Roadmap

- [x] All 12 core Odin-Book requirements
- [x] Post image uploads via Supabase (extra credit)
- [x] Profile photo updates (extra credit)
- [x] Guest sign-in mode (extra credit)
- [x] Real-time chat (Socket.IO — beyond the brief)
- [x] Real-time notifications (Socket.IO — beyond the brief)
- [x] Google OAuth via Passport.js (beyond the brief)
- [x] Docker + health check (beyond the brief)
- [x] Faker.js seeding scripts
- [x] Infinite scroll on notifications page, posts feed page, users page

---

## Contributing

This is a personal project, but feedback and suggestions are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## Contact

**Nethan Gabriel B. Bagasbas**

- GitHub: [@nethangabrielb](https://github.com/nethangabrielb)
- LinkedIn: [linkedin.com/in/nethangabrielb](https://www.linkedin.com/in/nethangabrielb)
- Email: [bagasbas.nethangabriel@gmail.com](mailto:bagasbas.nethangabriel@gmail.com)

---

## Acknowledgements

- [The Odin Project](https://www.theodinproject.com/) — for the curriculum and the final push
- [Prisma](https://www.prisma.io/) — for making relational modeling enjoyable
- [shadcn/ui](https://ui.shadcn.com/) — for the Radix + Tailwind component patterns
- [Socket.IO](https://socket.io/) — for making real-time surprisingly approachable
- [Supabase](https://supabase.com/) — for storage that just works
