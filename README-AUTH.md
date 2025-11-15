# NextAuth v4 with Google Authentication Setup

This project uses NextAuth v4 with Google authentication, Prisma, and MongoDB Atlas.

## Setup Instructions

1. Create a `.env.local` file in the root directory with the following variables:

```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

2. Replace the placeholder values with your actual credentials:
   - `NEXTAUTH_SECRET`: Generate a random string (e.g., using `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Obtain from the [Google Cloud Console](https://console.cloud.google.com/)
   - `DATABASE_URL`: Your MongoDB Atlas connection string

## Authentication Flow

- Public routes: `/login`, `/signup`
- Protected routes: `/`, `/about`, `/releases`, `/contact`, `/artists`
- Non-authenticated users trying to access protected routes will be redirected to `/login`
- After successful login, users are redirected to `/`

## Implementation Details

The authentication system consists of:

1. **Prisma Schema**: Configured for MongoDB Atlas with NextAuth tables
2. **NextAuth Configuration**: Set up in `lib/auth.ts` with Google provider
3. **API Route Handler**: Located at `app/api/auth/[...nextauth]/route.ts`
4. **Middleware**: Protects routes and handles redirections using JWT tokens
5. **Login/Signup Pages**: Includes Google authentication buttons

## Usage

- To sign in: Use the Google authentication button on the login page
- To sign out: Use the `SignOutButton` component

## Development

- Run `npx prisma generate` to generate the Prisma client
- Run `npx prisma db push` to push the schema to your MongoDB database
- Start the development server with `npm run dev`