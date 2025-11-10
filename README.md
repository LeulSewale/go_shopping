# Zemenay Gebya - Modern eCommerce Application

A modern, full-featured eCommerce application built with Next.js, TypeScript, Tailwind CSS, and Redux Toolkit. This project demonstrates real-world frontend development practices with a complete product management system.

## 🚀 Features

### Core Features
- **Product Listing Page** - Browse products with pagination, search, and filtering
- **Product Details Page** - View detailed product information with image gallery
- **Favorites System** - User-specific favorites with localStorage persistence
- **CRUD Operations** - Create, Read, Update, and Delete products (requires authentication)
- **Search Functionality** - Real-time product search with URL parameter sync
- **Advanced Filtering** - Filter by category, price range, and rating
- **Sorting** - Sort products by title, price, rating, stock, or brand
- **Protected Routes** - Authentication required for favorites and product management

### Bonus Features
- **Toast Notifications** - Beautiful toast notifications using Sonner (top-center, color-coded)
- **Loading States** - Skeleton loaders matching the UI design
- **Error Handling** - Comprehensive error states with retry options
- **Responsive Design** - Fully responsive layout for all screen sizes
- **Dark Mode** - Theme toggle with persistent storage (survives page refresh)
- **Authentication** - Mock authentication with login page, token refresh, and session persistence
- **Environment Variables** - Configurable API base URL and app name via `.env` files
- **User-Specific Data** - Each user has their own favorites list that persists across sessions

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **API**: [DummyJSON](https://dummyjson.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

## 🏃 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables (optional):
```bash
cp .env.example .env
```

Edit `.env` to configure:
- `NEXT_PUBLIC_API_BASE_URL` - API base URL (default: https://dummyjson.com)
- `NEXT_PUBLIC_APP_NAME` - Application name (default: Zemenay Gebya)

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home/Product listing page
│   ├── favorites/          # Favorites page
│   ├── login/              # Login page
│   └── product/            # Product pages
│       ├── [id]/           # Product details
│       └── [id]/edit/      # Edit product
├── components/             # React components
│   ├── ui/                 # Shadcn UI components
│   ├── Navigation.tsx      # Main navigation bar
│   ├── ProductCard.tsx     # Product card component
│   └── ProductCardSkeleton.tsx  # Loading skeleton
├── store/                  # Redux store
│   ├── slices/             # Redux slices
│   │   ├── authSlice.ts    # Authentication state
│   │   ├── favoritesSlice.ts # Favorites state
│   │   └── themeSlice.ts   # Theme state
│   └── store.ts            # Store configuration
├── lib/                     # Utilities and API
│   ├── api.ts              # API client and endpoints
│   └── utils.ts            # Utility functions
└── hooks/                   # Custom React hooks
    └── useTokenRefresh.ts   # Token refresh hook
```

## 🔌 API Endpoints

The application uses the [DummyJSON API](https://dummyjson.com/docs/products):

- `GET /products` - Get all products
- `GET /products/search?q=query` - Search products
- `GET /products/:id` - Get product by ID
- `GET /products/categories` - Get all categories
- `GET /products/category/:category` - Get products by category
- `POST /products/add` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## 🎨 Features in Detail

### Product Listing
- Infinite scroll pagination
- Real-time search with URL sync
- Advanced filtering (category, price, rating)
- Multi-field sorting
- Responsive grid layout

### Product Management
- Create products with validation
- Edit existing products
- Delete products with confirmation dialog
- Image gallery with thumbnail navigation

### User Experience
- **User-Specific Favorites** - Each user has their own favorites list stored in localStorage
- **Persistent Favorites** - Favorites persist across page refreshes and logout/login sessions
- **Dark Mode** - Theme toggle with localStorage persistence (survives page refresh)
- **Toast Notifications** - Color-coded toast notifications (green for success, red for errors)
- **Loading Skeletons** - Beautiful skeleton loaders matching UI design
- **Error States** - Comprehensive error handling with retry functionality
- **Protected Actions** - Authentication required for favorites, create, update, and delete operations

### Authentication
- **Login Page** - Form validation with error handling
- **JWT Token Management** - Secure token storage in localStorage
- **Automatic Token Refresh** - Background token refresh to maintain sessions
- **Persistent Sessions** - User stays logged in across page refreshes
- **Protected Routes** - Automatic redirect to login with return URL for protected pages
- **User-Specific Data** - Each user's favorites are isolated and persist per user ID

## 🔐 Demo Credentials

For testing the login functionality:
- **Username**: `emilys`
- **Password**: `emilyspass`

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- **Mobile**: Default (< 640px) - Single column layout, mobile navigation
- **Tablet**: `sm:` (640px+) - Two column grid, expanded navigation
- **Desktop**: `md:` (768px+) - Three column grid, full navigation
- **Large Desktop**: `lg:` (1024px+) - Four column grid
- **XL Desktop**: `xl:` (1280px+) - Five column grid
- **2XL Desktop**: `2xl:` (1536px+) - Maximum width layout

## 🔒 Authentication & Authorization

### Protected Actions

The following actions require authentication:
- **Viewing Favorites** - Redirects to login if not authenticated
- **Adding to Favorites** - Shows error toast and redirects to login
- **Creating Products** - Requires authentication
- **Editing Products** - Requires authentication
- **Deleting Products** - Requires authentication

### Login Flow

1. User attempts protected action → Redirected to `/login?returnUrl=<original-url>`
2. User logs in → Automatically redirected back to original page
3. Session persists → User stays logged in across page refreshes

## 🎯 Key Features Implementation

- **State Management**: Redux Toolkit for global state (favorites, theme, auth)
- **LocalStorage Persistence**: User-specific favorites stored with key `favorites_${userId}`
- **URL State**: Search parameters for filters and search query
- **Optimistic Updates**: Immediate UI feedback with Redux
- **Error Boundaries**: Comprehensive error handling
- **Performance**: Code splitting, lazy loading, and optimized images
- **Hydration Safety**: Proper handling of client-side state to prevent hydration mismatches
- **Environment Configuration**: Configurable API endpoints and app settings via environment variables

## 🔖 Favorites System

The favorites system is user-specific and persistent:

- **Storage**: Product IDs stored in localStorage with user-specific keys (`favorites_${userId}`)
- **Persistence**: Favorites persist across page refreshes and logout/login sessions
- **User Isolation**: Each user has their own favorites list
- **Authentication Required**: Users must be logged in to add/view favorites
- **Automatic Loading**: Favorites are automatically loaded when user logs in
- **Product Fetching**: Product details are fetched on-demand when viewing favorites page

### How It Works

1. User clicks bookmark → Product ID saved to localStorage with user ID key
2. On page load → Favorites loaded from localStorage for current user
3. On favorites page → Product details fetched based on saved IDs
4. On logout → Redux state cleared, but localStorage preserved
5. On login → Favorites automatically restored from localStorage

## 📝 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com

# Application Configuration
NEXT_PUBLIC_APP_NAME=Zemenay Gebya

# Environment
NODE_ENV=development
```

See `.env.example` for reference.

## 🚢 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📄 License

This project is private and for educational purposes.

## 👨‍💻 Development

Built with modern React patterns and best practices:
- **Server and Client Components** - Optimal rendering strategy
- **TypeScript** - Full type safety throughout the application
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - Modern Redux with simplified API
- **Axios** - HTTP client for API requests
- **Next.js App Router** - Latest Next.js routing system
- **Shadcn UI** - Accessible component library
- **Sonner** - Toast notification system

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [DummyJSON API Documentation](https://dummyjson.com/docs)

---

Made with ❤️ using Next.js and modern web technologies.
