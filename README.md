# 🚗 Ride Booking Platform - Frontend
A modern, full-featured ride-sharing application frontend built with React, TypeScript, and Redux Toolkit. This platform connects riders with drivers in real-time, providing seamless booking experience with comprehensive dashboards for both user types.

## 📋 Project Overview

This is the frontend application for a ride booking platform similar to Uber/Pathao. The application provides two distinct user experiences:

- **Riders** can book rides, track drivers in real-time, view ride history, and manage payments
- **Drivers** can accept ride requests, manage availability, track earnings, and view performance analytics

The application features a clean, modern UI built with Tailwind CSS and shadcn/ui components, with real-time updates and comprehensive state management using Redux Toolkit.

## ✨ Key Features

### 🎯 Core Functionality

#### For Riders
- **Instant Ride Booking**
  - Enter pickup and drop-off locations
  - Real-time fare calculation
  - Multiple payment methods (Cash, Card, Wallet)
  - Instant driver matching

- **Ride Tracking**
  - Live driver location updates
  - Estimated arrival time
  - Real-time ride status notifications
  - In-app communication with driver

- **Rider Dashboard**
  - Overview of recent rides
  - Quick booking access
  - Favorite locations
  - Ride statistics

- **Ride History & Management**
  - Complete ride history with filters
  - Search by location or date
  - Ride details and receipts
  - Rate and review drivers
  - Cancel rides when needed

#### For Drivers
- **Smart Request Management**
  - Real-time incoming ride requests (auto-polling every 5 seconds)
  - Detailed request information (pickup, destination, fare, distance)
  - Rider contact information
  - Accept/reject requests instantly
  - Request time tracking

- **Driver Dashboard**
  - Real-time online/offline status
  - Active ride alerts with quick access
  - Earnings overview (Today, Week, Month, Total)
  - Performance metrics (Rating, Total Rides)
  - Recent rides quick view
  - Quick action shortcuts

- **Comprehensive Earnings Analytics**
  - Daily, weekly, and monthly earnings breakdowns
  - Interactive charts (Bar charts for earnings, Line charts for rides)
  - Payment method distribution (Pie chart visualization)
  - Earnings comparison with percentage changes
  - Average earnings per ride
  - Recent transactions list
  - Downloadable earnings reports

- **Complete Ride History**
  - Filterable ride list (All, Completed, Cancelled, etc.)
  - Advanced search by location or rider name
  - Pagination for large datasets
  - Detailed ride information
  - Earnings breakdown per ride
  - Payment method tracking

- **Availability Management**
  - One-click online/offline toggle
  - Offline mode with clear status indicators
  - Automatic request blocking when offline
  - Status reflected in real-time

### 🎨 UI/UX Features

- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Modern Interface** - Clean, intuitive design with Tailwind CSS
- **Real-time Updates** - Live data fetching with RTK Query polling
- **Loading States** - Smooth loading indicators and skeleton screens
- **Error Handling** - User-friendly error messages with retry options
- **Toast Notifications** - Instant feedback for user actions
- **Interactive Charts** - Visual data representation with Recharts
- **Status Badges** - Color-coded status indicators
- **Empty States** - Helpful messages when no data available

### 🔐 Authentication & Security

- **JWT-based Authentication** - Secure token-based auth
- **Role-based Access Control** - Separate interfaces for riders and drivers
- **Protected Routes** - Automatic redirection based on auth state
- **Persistent Sessions** - Token stored securely in localStorage
- **Auto-logout** - Session management

---

## 🛠️ Technology Stack

### Core Technologies

- **React 18.3** - Latest React with concurrent features
- **TypeScript 5.5** - Type-safe development
- **Vite 5.4** - Lightning-fast build tool
- **Redux Toolkit 2.2** - State management
- **RTK Query** - Data fetching and caching

### UI & Styling

- **Tailwind CSS 3.4** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **class-variance-authority** - Dynamic component variants

### Data Visualization

- **Recharts 2.12** - Composable charting library
  - Bar charts for earnings
  - Line charts for ride trends
  - Pie charts for payment distribution

### Form Handling

- **React Hook Form 7.53** - Performant form management
- **Zod 3.23** - TypeScript-first schema validation

### Routing & Navigation

- **React Router DOM 6.26** - Client-side routing
- **Protected routes** - Auth-based navigation

### Utilities

- **date-fns 3.6** - Modern date utility library
- **React Hot Toast 2.4** - Beautiful toast notifications
- **clsx & tailwind-merge** - Conditional className management

### Development Tools

- **ESLint 9.9** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **Vite Plugins** - React Fast Refresh

---

## 📁 Project Structure

```
ride-booking-frontend/
├── src/
│   ├── components/
│   │   ├── common/              # Reusable components
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Sidebar.tsx
│   │   └── ui/                  # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── badge.tsx
│   │       └── ...
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── rider/
│   │   │   ├── RiderDashboard.tsx
│   │   │   ├── BookRide.tsx
│   │   │   ├── RideTracking.tsx
│   │   │   └── RiderHistory.tsx
│   │   └── driver/
│   │       ├── DriverDashboard.tsx      # Main dashboard with stats
│   │       ├── IncomingRequests.tsx     # Request management
│   │       ├── DriverEarnings.tsx       # Earnings analytics
│   │       ├── DriverRideHistory.tsx    # Ride history
│   │       └── ActiveRide.tsx           # Current ride tracking
│   │
│   ├── store/
│   │   ├── api/
│   │   │   ├── authApi.ts              # Authentication endpoints
│   │   │   ├── rideApi.ts              # Ride management endpoints
│   │   │   └── driverApi.ts            # Driver-specific endpoints
│   │   ├── slices/
│   │   │   └── authSlice.ts            # Auth state management
│   │   └── index.ts                     # Store configuration
│   │
│   ├── types/
│   │   └── index.ts                     # TypeScript type definitions
│   │
│   ├── lib/
│   │   └── utils.ts                     # Utility functions
│   │
│   ├── hooks/                           # Custom React hooks
│   ├── App.tsx                          # Main app component
│   └── main.tsx                         # Entry point
│
├── public/                              # Static assets
├── .env.example                         # Environment variables template
├── package.json                         # Dependencies
├── tsconfig.json                        # TypeScript configuration
├── tailwind.config.js                   # Tailwind CSS configuration
├── vite.config.ts                       # Vite configuration
└── README.md                            # This file
```

---

## 🚀 Setup Instructions

### Prerequisites

Make sure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ride-booking-frontend.git
cd ride-booking-frontend
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Configuration

Create a `.env` file in the root directory:

```env
# API Base URL (Backend server)
VITE_API_BASE_URL=http://localhost:5000/api

# App Configuration
VITE_APP_NAME=Ride Booking Platform
VITE_APP_VERSION=1.0.0

# Optional: Map API Keys (if using maps)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_key_here
VITE_MAPBOX_TOKEN=your_mapbox_token_here
```

### Step 4: Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will start at `http://localhost:5173`

### Step 5: Build for Production

```bash
npm run build
# or
yarn build
```

The production-ready files will be in the `dist/` directory.

### Step 6: Preview Production Build

```bash
npm run preview
# or
yarn preview
```

---

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Type checking
npm run type-check
```

---

## 🌐 API Integration

### Backend Requirements

This frontend application requires a backend API with the following endpoints:

#### Authentication Endpoints
```
POST   /api/auth/login          # User login
POST   /api/auth/register       # User registration
GET    /api/auth/me             # Get current user
PUT    /api/auth/profile        # Update profile
POST   /api/auth/logout         # Logout
```

#### Ride Endpoints
```
POST   /api/rides               # Create new ride (rider)
GET    /api/rides               # Get all rides (with filters)
GET    /api/rides/user/:userId  # Get user's rides
GET    /api/rides/driver/:driverId  # Get driver's rides
GET    /api/rides/:id           # Get ride details
PUT    /api/rides/:id/accept    # Accept ride (driver)
PUT    /api/rides/:id/status    # Update ride status
PUT    /api/rides/:id/cancel    # Cancel ride
PUT    /api/rides/:id/complete  # Complete ride
POST   /api/rides/:id/rate      # Rate ride
```

#### Driver Endpoints
```
GET    /api/drivers/:id         # Get driver profile
PUT    /api/drivers/:id/availability  # Update availability
GET    /api/drivers/:id/stats   # Get driver statistics
```

### API Response Format

All API responses should follow this format:

```typescript
{
  success: boolean;
  message: string;
  data: any;
}
```

---

## 🎨 UI Components

This project uses **shadcn/ui** components. To add new components:

```bash
# Example: Add a new component
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add tabs
```

Available components used:
- Button
- Card
- Input
- Badge
- Select
- Tabs
- Dialog
- Toast
- And more...

---

## 📊 State Management

### Redux Store Structure

```typescript
store/
├── api/
│   ├── authApi      # Authentication queries/mutations
│   ├── rideApi      # Ride management queries/mutations
│   └── driverApi    # Driver-specific queries/mutations
└── slices/
    └── authSlice    # Auth state (user, token, isAuthenticated)
```

### RTK Query Features Used

- **Automatic Caching** - Data cached automatically
- **Polling** - Real-time updates (e.g., ride requests every 5s)
- **Optimistic Updates** - Instant UI feedback
- **Tag-based Invalidation** - Smart cache management

---

## 🎯 Key Features Implementation

### Real-time Ride Requests (Incoming Requests Page)

```typescript
// Auto-polling every 5 seconds for new requests
useGetAllRidesQuery(
  { status: 'REQUESTED' },
  { pollingInterval: 5000 }
);
```

### Earnings Analytics (Driver Earnings Page)

- **Daily View**: Last 7 days bar chart
- **Weekly View**: Current week summary
- **Monthly View**: Current month overview
- **Payment Distribution**: Pie chart showing Cash/Card/Wallet split

### Advanced Filtering (Ride History)

- Search by location or rider name
- Filter by status (All, Completed, Cancelled, etc.)
- Pagination (10 items per page)
- Responsive pagination UI

---

## 🐛 Troubleshooting

### Common Issues

**1. Port 5173 already in use**
```bash
# Kill the process
npx kill-port 5173

# Or change port in vite.config.ts
export default defineConfig({
  server: {
    port: 3000
  }
})
```

**2. API connection errors**
- Check if backend server is running
- Verify `VITE_API_BASE_URL` in `.env`
- Check CORS settings on backend

**3. Build errors**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**4. TypeScript errors**
```bash
# Run type checking
npm run type-check

# Check tsconfig.json settings
```

---

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🔒 Environment Variables


## 📝 Important Notes

### Authentication Flow

1. User logs in → JWT token received
2. Token stored in `localStorage`
3. Token sent in `Authorization` header for all API requests
4. Protected routes check token validity
5. Auto-redirect to login if token invalid

### Role-Based Access

- **Riders** → `/rider/*` routes
- **Drivers** → `/driver/*` routes
- **Admin** → `/admin/*` routes (if implemented)

### Data Polling

Ride requests page uses **polling** (5-second interval) for real-time updates. This can be changed:

```typescript
// Change polling interval in IncomingRequests.tsx
pollingInterval: 10000 // 10 seconds
```

### Performance Optimization

- Code splitting with React.lazy()
- Image optimization
- Bundle size optimization with Vite
- RTK Query caching reduces API calls

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `VITE_API_BASE_URL`
4. Deploy

### Deploy to Netlify

1. Build the project: `npm run build`
2. Deploy `dist/` folder
3. Add environment variables in Netlify dashboard
4. Configure redirects for SPA:

Create `public/_redirects`:
```
/*    /index.html   200
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Code Style

- Use TypeScript for all components
- Follow existing naming conventions
- Add proper type definitions
- Write meaningful commit messages
- Comment complex logic

---

## 📄 License

This project is licensed under the MIT License.

---

## 👥 Authors

- **Your Name** - Avijitsaha94

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful UI components
- **Redux Toolkit** - State management
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Lucide React** - Icon library

---

## 📞 Support

For support or questions:
- **Email**: avijitsh94@gmail.com


---
