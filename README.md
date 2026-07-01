# AuraChat

> A privacy-focused, real-time messaging application with a Signal-inspired minimalist interface. Secure, scalable, and built for modern communication patterns — one-to-one, one-to-many, and many-to-many sessions.

## Features

- **Multi-Strategy Authentication** — Sign in with Google, Facebook, or Email/Password
- **Flexible Sessions** — One-to-one DMs, one-to-many broadcasts, many-to-many group rooms
- **Group Management** — Create, invite, moderate, and manage group conversations
- **Real-Time Messaging** — Instant message delivery, typing indicators, and read receipts via Socket.io
- **Signal-Inspired UI** — Three-pane desktop layout with minimal chrome, vast whitespace, and cryptographic visual signifiers
- **Full Internationalization** — i18n-ready with `i18next` and `react-i18next`
- **Dark & Light Modes** — System-aware theming via Material UI
- **Secure by Default** — Helmet security headers, locked-down CORS, payload sanitization, and JWT-based sessions

## Tech Stack

### Frontend (`client/`)

| Technology | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Zustand | 5 | Global state management |
| Material UI | 9 | Structured component library |
| Tailwind CSS | 4 | Utility-first styling |
| Socket.io Client | 4 | Real-time communication |
| i18next / react-i18next | 26 / 17 | Internationalization |
| React Router | 7 | Client-side routing |
| Vite | 8 | Build tool and dev server |
| clsx + tailwind-merge | — | Conditional class merging |

### Backend (`server/`)

| Technology | Version | Purpose |
|---|---|---|
| Express | 5 | HTTP server framework |
| Mongoose | 9 | MongoDB ODM |
| Socket.io | 4 | WebSocket real-time engine |
| Helmet | 8 | Security headers |
| Multer | 2 | File upload handling |
| JSON Web Token | 9 | Stateless authentication |
| bcryptjs | 3 | Password hashing |
| CORS | 2 | Cross-origin policy |
| dotenv | 17 | Environment variable management |
| nodemon | 3 | Development auto-reload |

## Project Structure

```
AuraChat/
├── client/                  # React frontend
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
├── server/                  # Express backend
│   ├── server.js
│   └── package.json
├── AGENTS.md                # AI agent behavioral rules
├── DESIGN.md                # Visual identity & design system
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **MongoDB** (local or Atlas)
- **pnpm** >= 8 (`npm install -g pnpm`)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/aura-chat.git
cd aura-chat

# Install client dependencies
cd client && pnpm install

# Install server dependencies
cd ../server && pnpm install
```

### Environment Variables

Create a `.env` file in `server/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aurachat
JWT_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
CLIENT_URL=http://localhost:5173
```

### Development

```bash
# Start the server (with auto-reload)
cd server && pnpm start

# Start the client (Vite dev server)
cd client && pnpm dev
```

## Design Philosophy

AuraChat follows a **Signal-like design language** — extreme clarity, low cognitive load, and high security representation. The full design system is documented in [`DESIGN.md`](./DESIGN.md) including color palette, typography scale, component anatomy, and motion specs.

## Agent Rules

AI agent behavioral constraints and development conventions are defined in [`AGENTS.md`](./AGENTS.md). Covers line limits, state hygiene, security middleware precedence, error handling, and more.

## Resources

- [React Documentation](https://react.dev)
- [Zustand Documentation](https://zustand.docs.pmnd.rs/)
- [Material UI Documentation](https://mui.com/material-ui/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Socket.io Documentation](https://socket.io/docs/v4/)
- [Express Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [i18next Documentation](https://www.i18next.com/)
- [Signal Design Inspiration](https://signal.org/blog/)
