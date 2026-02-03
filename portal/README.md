# Partner Portal

A Next.js application for partners to review and approve marketing content before it's published.

## Features

- **Content Calendar View**: See all scheduled content in a calendar or feed view
- **Partner Filtering**: Filter content by partner/posting account
- **Review Workflow**: Approve, edit, or request revisions on copy
- **Image Preview**: View AI-generated images with carousel support
- **Two-Way Airtable Sync**: Changes sync back to your Airtable content calendar
- **Authentication**: Secure login with role-based access (admin/user)
- **Password Reset**: Email-based password recovery

## Quick Start

1. **Install dependencies**:
   ```bash
   cd portal
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

3. **Set up database**:
   ```bash
   npm run db:push
   ```

4. **Create admin user**:
   ```bash
   npm run user
   # Follow prompts
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Configuration

The portal loads partner configuration from `../config/partners.json`. Make sure this file exists with your partners configured.

Example `config/partners.json`:
```json
{
  "accounts": {
    "partner1": ["Partner1 LinkedIn"],
    "company": ["Company LinkedIn"]
  },
  "names": {
    "all": "All Partners",
    "partner1": "Partner One Name",
    "company": "Company Name"
  },
  "initials": {
    "partner1": "P1",
    "company": "CO"
  },
  "colors": {
    "partner1": {
      "border": "border-l-blue-500",
      "bg": "bg-blue-500",
      "text": "text-blue-600"
    },
    "company": {
      "border": "border-l-emerald-500",
      "bg": "bg-emerald-500",
      "text": "text-emerald-600"
    }
  }
}
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL or SQLite connection string | Yes |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js sessions | Yes |
| `NEXTAUTH_URL` | Your portal URL | Yes |
| `AIRTABLE_API_KEY` | Airtable personal access token | Yes |
| `AIRTABLE_BASE_ID` | Your Airtable base ID | Yes |
| `AIRTABLE_CONTENT_CALENDAR_TABLE_ID` | Content Calendar table ID | Yes |
| `RESEND_API_KEY` | Resend API key for emails | For password reset |
| `EMAIL_FROM` | From address for emails | For password reset |

## Usage

### For Partners

1. Log in with your credentials
2. Review posts assigned to your accounts
3. For each post, you can:
   - **Approve**: Mark the post as approved (pushes to Airtable)
   - **Edit**: Submit copy changes (admin reviews)
   - **Request Revision**: Add notes for what needs to change

### For Admin

1. Log in with admin credentials
2. Go to `/admin`
3. Click "Sync from Airtable" to pull latest content
4. Review pending feedback from partners
5. Apply or dismiss partner edits
6. Changes are automatically pushed back to Airtable

## Project Structure

```
portal/
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── dev.db            # SQLite database (generated)
├── src/
│   ├── app/
│   │   ├── page.tsx      # Home - partner selector
│   │   ├── review/       # Partner review pages
│   │   ├── admin/        # Admin dashboard
│   │   └── auth/         # Login and password reset
│   ├── components/       # React components
│   └── lib/
│       ├── actions.ts    # Server actions
│       ├── airtable.ts   # Airtable API client
│       ├── constants.ts  # Partner config (loads from config/partners.json)
│       └── db.ts         # Prisma client
└── .env.example          # Environment template
```

## Data Flow

```
Airtable (Source of Truth)
    ↓ Pull on sync
Local Database (Prisma)
    ↓ Display
Partner Review UI
    ↓ Submit feedback
PartnerFeedback table
    ↓ Admin applies
Push to Airtable
```

### Feedback Learning Flow
```
Partner Feedback → FeedbackBatch (grouping) → FeedbackLearning (patterns)
                                                       ↓
                                              Image Generation Prompts
                                              Content Generation Rules
```

## Database Models

| Model | Purpose |
|-------|---------|
| `AirtablePost` | Synced content from Airtable with review tracking |
| `PartnerFeedback` | Partner approvals, edits, revision requests, image feedback |
| `FeedbackBatch` | Groups related feedback items for batch processing |
| `FeedbackLearning` | ML-extracted patterns from feedback to improve future content |
| `Partner` | Partner accounts and configuration |
| `SyncLog` | Airtable sync history |
| `User` | Authentication and role management |
| `PasswordResetToken` | Password recovery tokens |

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run db:push` | Push schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run user` | Create a new user |

## Production Deployment

### Vercel (Recommended)

1. Connect your repo to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Auth**: NextAuth.js v5 (beta)
- **Database**: Prisma ORM (PostgreSQL/SQLite)
- **Styling**: Tailwind CSS
- **Email**: Resend
