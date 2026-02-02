# 🎵 Oscillations Records

A modern, full-stack music record label platform built with Next.js 15, featuring artist management, music cataloging, analytics dashboard, and a beautiful responsive UI.

## 🚀 Features

### Public Features
- **Home Page** - Showcase of the label with hero section, new music, and artist highlights
- **Artists Page** - Browse all artists with detailed profiles
- **Releases Page** - View all albums, EPs, and singles
- **About Page** - Learn about Oscillations Records
- **Contact Page** - Get in touch with the label
- **Music Player** - Built-in audio player for streaming music
- **Responsive Design** - Fully optimized for mobile, tablet, and desktop

### Authentication
- **Google OAuth** - Secure authentication using NextAuth.js
- **User Profiles** - Personalized user experience
- **Protected Routes** - Secure access to authenticated content
- **Session Management** - Seamless session handling

### Admin Dashboard
- **Analytics Dashboard** - Comprehensive insights into:
  - Total plays and unique listeners
  - Top performing content (singles, albums, EPs)
  - User demographics (age, gender, location)
  - Content performance metrics
  - Play completion rates
- **Catalog Management** - Full CRUD operations for:
  - Artists (create, read, update, delete)
  - Singles (create, manage, organize)
  - Albums (create with multiple songs, manage releases)
  - EPs (create extended plays, manage tracks)
- **Bulk Operations** - Efficient bulk upload and management
- **Content Organization** - Link artists to releases, manage features

### API Features
- **RESTful APIs** - Well-structured API endpoints
- **Fast Response Times** - Optimized database queries
- **File Upload** - AWS S3 integration for media storage
- **Presigned URLs** - Secure file uploads
- **Analytics Tracking** - Real-time play event tracking
- **User Demographics** - Collect and analyze user data

## 🎯 Key Points

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: NextAuth.js v4 with Google OAuth
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React, React Icons
- **File Storage**: AWS S3
- **Development**: Turbopack for faster builds

### Architecture
- **Server Components** - Optimized server-side rendering
- **Client Components** - Interactive UI elements
- **API Routes** - RESTful backend endpoints
- **Middleware** - Route protection and authentication
- **Context API** - Global state management for music player
- **Type Safety** - Full TypeScript coverage

### Database Schema
- **Users** - Authentication and user management
- **Artists** - Artist profiles with social links
- **Singles** - Individual tracks
- **Albums** - Album collections with multiple songs
- **EPs** - Extended play collections
- **Play Events** - Analytics and tracking data
- **User Profiles** - Demographics and preferences

## 📱 Responsive Design

### Mobile-First Approach
- **Breakpoints**: 
  - Mobile: `sm:` (640px+)
  - Tablet: `md:` (768px+)
  - Desktop: `lg:` (1024px+)
  - Large Desktop: `xl:` (1280px+)

### Responsive Components
- **Navbar** - Collapsible mobile menu with hamburger icon
- **Admin Navbar** - Mobile-responsive admin navigation
- **Grid Layouts** - Adaptive columns (1 on mobile, up to 4 on desktop)
- **Typography** - Scalable text sizes across devices
- **Images** - Responsive image sizing with Next.js Image
- **Forms** - Mobile-optimized input fields and buttons
- **Cards** - Flexible card layouts for artists and music

### Responsive Features
- Touch-friendly interactions
- Optimized spacing and padding
- Readable font sizes on all devices
- Efficient use of screen real estate
- Smooth transitions and animations

## 🎨 Modern UI

### Design Principles
- **Minimalist Design** - Clean, uncluttered interfaces
- **Modern Typography** - Light fonts with tight tracking
- **Smooth Animations** - Motion library for fluid transitions
- **Dark Theme** - Elegant dark color scheme
- **Glass Morphism** - Backdrop blur effects on navigation
- **Card-Based Layout** - Modern card components
- **Icon System** - Consistent iconography throughout

### UI Components
- **Custom Button Components** - Variants and sizes
- **Dropdown Menus** - Radix UI dropdowns
- **Dialogs** - Modal dialogs for confirmations
- **Input Fields** - Icon-enhanced inputs
- **Music Cards** - Beautiful music display cards
- **Artist Cards** - Profile cards with images
- **Navigation** - Sticky navbar with backdrop blur

### Visual Elements
- **SVG Graphics** - Custom illustrations
- **Gradient Backgrounds** - Subtle gradients
- **Shadow Effects** - Depth and elevation
- **Hover States** - Interactive feedback
- **Loading States** - Skeleton loaders and spinners

## ⚡ Fast UI & APIs

### Performance Optimizations
- **Next.js Image Optimization** - Automatic image optimization
- **Server-Side Rendering** - Fast initial page loads
- **Code Splitting** - Automatic route-based code splitting
- **Turbopack** - Lightning-fast development builds
- **Static Generation** - Pre-rendered pages where possible
- **API Route Optimization** - Efficient database queries

### Fast APIs
- **Optimized Queries** - Prisma query optimization
- **Indexed Fields** - Database indexes on frequently queried fields
- **Parallel Fetching** - Promise.all for concurrent requests
- **Caching Strategies** - Efficient data caching
- **Minimal Payloads** - Reduced response sizes
- **Error Handling** - Graceful error responses

### API Endpoints

#### Artists
- `GET /api/artists` - Get all artists
- `POST /api/artists` - Create new artist
- `GET /api/artists/[artistId]` - Get artist by ID
- `PUT /api/artists/[artistId]` - Update artist
- `DELETE /api/artists/[artistId]` - Delete artist
- `GET /api/artists/[artistId]/albums` - Get artist albums
- `GET /api/artists/[artistId]/eps` - Get artist EPs
- `GET /api/artists/[artistId]/singles` - Get artist singles

#### Music Content
- `GET /api/singles` - Get all singles
- `POST /api/singles` - Create new single
- `GET /api/albums` - Get all albums
- `POST /api/albums` - Create new album
- `GET /api/eps` - Get all EPs
- `POST /api/eps` - Create new EP
- `GET /api/releases` - Get all releases (albums + EPs)
- `GET /api/releases/[releaseId]` - Get release by ID
- `GET /api/songs/latest` - Get latest songs
- `POST /api/songs/bulk` - Bulk create songs

#### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/content/[contentId]` - Get content analytics
- `POST /api/analytics/track-play` - Track play event
- `GET /api/analytics/user-profile` - Get user profile
- `POST /api/analytics/user-profile` - Update user profile

#### File Upload
- `POST /api/upload/presigned-urls` - Get presigned URLs for upload
- `POST /api/upload/presigned-urls-bulk` - Bulk presigned URLs
- `POST /api/upload/presigned-url-image` - Image upload URL

#### Authentication
- `GET /api/auth/[...nextauth]` - NextAuth endpoints
- `POST /api/auth/signout` - Sign out endpoint

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB database (MongoDB Atlas recommended)
- AWS S3 bucket (for file storage)
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd oscillations-records
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # AWS S3
   AWS_ACCESS_KEY_ID="your-aws-access-key"
   AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
   AWS_REGION="your-aws-region"
   AWS_S3_BUCKET_NAME="your-bucket-name"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database

## 🏗️ Project Structure

```
oscillations-records/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Authentication routes
│   ├── (main)/             # Main public routes
│   ├── admin/              # Admin dashboard
│   └── api/                 # API routes
├── components/              # React components
│   ├── admin/              # Admin components
│   ├── local-ui/            # UI components
│   ├── sections/           # Page sections
│   └── ui/                  # Base UI components
├── lib/                     # Utility libraries
├── prisma/                  # Database schema
├── public/                  # Static assets
└── types/                   # TypeScript types
```

## 🔒 Security Features

- **Authentication Middleware** - Route protection
- **Session Management** - Secure session handling
- **CSRF Protection** - Built-in Next.js protection
- **Environment Variables** - Secure credential management
- **Presigned URLs** - Secure file uploads
- **Input Validation** - Server-side validation

## 📊 Analytics Features

- **Play Tracking** - Track every play event
- **User Demographics** - Age, gender, location data
- **Content Performance** - Top singles, albums, EPs
- **Completion Rates** - Track full play completion
- **Dashboard Insights** - Comprehensive analytics view

## 🎵 Music Features

- **Audio Streaming** - Built-in music player
- **Playlist Support** - Albums and EPs as playlists
- **Artist Profiles** - Detailed artist information
- **Social Links** - Connect with artists on social media
- **Release Management** - Organize releases by date

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Prisma for the excellent ORM
- Radix UI for accessible components
- Tailwind CSS for the utility-first CSS framework

---

Built with ❤️ for music lovers and artists worldwide.
