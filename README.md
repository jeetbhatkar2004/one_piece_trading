# One Piece Trading Sim

A virtual trading platform where you can trade One Piece characters like tokens using an Automated Market Maker (AMM) system.

## Features

- 🏴‍☠️ Trade 30+ One Piece characters as tokens
- 💰 Start with 1,000 berries (virtual currency)
- 📊 Real-time price charts and market data
- 📈 Portfolio tracking with P/L calculations
- 🏆 Leaderboard rankings
- 🔒 Secure authentication and transaction handling

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth.js
- **Charts**: Recharts
- **State Management**: TanStack Query (React Query)

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd one_piece_trading_sim
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL:
```
DATABASE_URL="postgresql://user:password@localhost:5432/one_piece_trading?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

4. Set up the database:
```bash
# Push Prisma schema to database
npm run db:push

# Seed the database with characters and pools
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── characters/     # Character market data
│   │   ├── quote/          # Trade quotes
│   │   ├── trade/          # Trade execution
│   │   ├── portfolio/      # User portfolio
│   │   └── leaderboard/    # Leaderboard rankings
│   ├── c/[slug]/           # Character market pages
│   ├── login/              # Login page
│   ├── register/           # Registration page
│   ├── portfolio/          # Portfolio page
│   └── leaderboard/        # Leaderboard page
├── components/             # React components
├── lib/                    # Utility functions
│   ├── amm.ts             # AMM math functions
│   ├── auth.ts            # NextAuth configuration
│   ├── prisma.ts          # Prisma client
│   ├── trade-execution.ts # Trade execution logic
│   └── validation.ts       # Zod schemas
├── prisma/                 # Prisma files
│   ├── schema.prisma      # Database schema
│   └── seed.ts            # Database seed script
└── types/                 # TypeScript type definitions
```

## AMM (Automated Market Maker) Design

The platform uses a constant product AMM formula:

- **Formula**: `k = Rb * Rt` (constant product)
- **Spot Price**: `P = Rb / Rt` (berries per token)
- **Trading Fee**: 1% (100 basis points)

### Trading Flow

1. User requests a quote with desired amount and slippage tolerance
2. System calculates expected output using AMM formula
3. User confirms trade
4. Transaction executes atomically:
   - Updates pool reserves
   - Updates user wallet balance
   - Updates user position
   - Records trade in ledger
   - Updates price candles

## Database Schema

- **users**: User accounts
- **wallets**: User berry balances
- **characters**: One Piece characters
- **pools**: AMM pools (one per character)
- **positions**: User token holdings
- **trades**: Append-only trade ledger
- **price_candles**: OHLC price data (5-minute buckets)
- **leaderboard_snapshots**: Leaderboard rankings
- **seasons**: Trading seasons

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (via NextAuth)

### Market Data
- `GET /api/characters` - List all characters with prices
- `GET /api/characters/[slug]` - Get character details and chart data

### Trading
- `POST /api/quote` - Get trade quote
- `POST /api/trade` - Execute trade

### User Data
- `GET /api/portfolio` - Get user portfolio
- `GET /api/leaderboard` - Get leaderboard rankings

## Security Features

- ✅ Server-authoritative accounting (all balances updated on backend)
- ✅ Transaction-based trade execution (atomic updates)
- ✅ Idempotency keys for trade requests
- ✅ Input validation with Zod
- ✅ Password hashing with bcrypt
- ✅ CSRF protection (NextAuth default)

## Development

### Database Commands

```bash
# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
npm run db:seed
```

### Building for Production

```bash
npm run build
npm start
```

## License

MIT
