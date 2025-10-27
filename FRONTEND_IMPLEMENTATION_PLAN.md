Frontend Implementation Plan

Phase 1: Foundation Setup

1.1 Install Required Dependencies
pnpm add react-router-dom @tanstack/react-query zustand --filter @travel-management-system/frontend
pnpm add -D @types/react-router-dom --filter @travel-management-system/frontend

Dependencies Rationale:

- react-router-dom - Client-side routing for navigation
- @tanstack/react-query - Already used in api-client package, powerful data fetching/caching
- zustand - Lightweight state management (simpler than Redux, better than Context for complex state)

  1.2 Configure Vite Proxy for Backend
  Update apps/frontend/vite.config.ts to proxy API requests to NestJS backend:
  server: {
  proxy: {
  '/api': {
  target: 'http://localhost:3000',
  changeOrigin: true,
  }
  }
  }

  1.3 Set Up Environment Variables
  Create .env files for backend URL configuration:

- .env - Default values
- .env.development - Local development (backend on localhost:3000)
- .env.production - Production backend URL

Phase 2: Architecture Setup

2.1 Folder Structure
apps/frontend/src/
├── assets/ # Images, icons
├── components/
│ ├── layout/ # Layout components (Header, Sidebar, Layout)
│ ├── common/ # Reusable components (LoadingSpinner, ErrorBoundary)
│ └── forms/ # Form components (FormField, FormSelect)
├── features/ # Feature-based modules
│ ├── airports/ # Airport CRUD
│ │ ├── components/ # Airport-specific components
│ │ ├── hooks/ # Airport-specific hooks
│ │ ├── pages/ # AirportList, AirportDetail, AirportForm
│ │ └── types.ts # Airport-specific types
│ ├── airlines/ # Airline CRUD
│ └── routes/ # Route CRUD
├── lib/ # Utilities, helpers
│ ├── api.ts # API client setup
│ ├── queryClient.ts # React Query configuration
│ └── utils.ts # Utility functions
├── hooks/ # Global custom hooks
├── store/ # Zustand stores
├── router/ # Routing configuration
│ └── index.tsx # Route definitions
├── types/ # Global TypeScript types
├── App.tsx # Main app with providers
└── main.tsx # Entry point

2.2 Set Up API Client
Configure the existing @travel-management-system/api-client package for frontend use.

2.3 Set Up React Query Provider
Wrap app with QueryClientProvider for server state management.

2.4 Set Up Router
Create main router with layout and feature routes:

- / - Dashboard/Home
- /airports - Airport list
- /airports/new - Create airport
- /airports/:id - Airport detail
- /airports/:id/edit - Edit airport
- /airlines - Similar structure
- /routes - Similar structure

Phase 3: Core Components

3.1 Layout Components

- MainLayout - Header + Sidebar + Content area
- Header - Navigation, branding
- Sidebar - Navigation menu (Airports, Airlines, Routes)

  3.2 Common Components

- DataTable - Reusable table with sorting, pagination
- LoadingSpinner - Loading state indicator
- ErrorMessage - Error display
- ConfirmDialog - Delete confirmation
- PageHeader - Page title + actions
- EmptyState - Empty data state

  3.3 Form Components

- FormInput - Text input with validation
- FormSelect - Dropdown select
- FormTextarea - Multi-line text
- FormCheckbox - Checkbox input
- MultiSelect - Multiple selection (for airport-airline relationships)

Phase 4: Feature Implementation (Priority Order)

4.1 Airports Module (Start Here - Simplest)

Pages:

1. AirportListPage - Display airports in table with pagination
   - Columns: Code, Name, Country, City, GPS Location
   - Actions: View, Edit, Delete buttons
   - Top action: Create New button
   - Filters: Search by name, filter by country

2. AirportDetailPage - View single airport details
   - Display all airport info
   - Show related airlines (serviced by)
   - Show routes (from/to this airport)
   - Actions: Edit, Delete buttons

3. AirportFormPage - Create/Edit form
   - Fields: code, name, country, city, latitude, longitude
   - Validation using Zod schemas from @travel-management-system/schemas
   - Success/error handling

Components:

- AirportTable - Table component
- AirportCard - Card view for detail page
- AirportForm - Form component

Hooks:

- useAirports() - Fetch paginated airports
- useAirport(id) - Fetch single airport
- useCreateAirport() - Create mutation
- useUpdateAirport() - Update mutation
- useDeleteAirport() - Delete mutation

  4.2 Airlines Module (Next - Adds Relationships)

Pages:

1. AirlineListPage - Display airlines with filters
   - Columns: Name, Base Country, Serviced Airports count
   - Filters: Search by name, filter by country

2. AirlineDetailPage - View airline details
   - Display airline info
   - List of serviced airports (with ability to add/remove)
   - List of routes operated by this airline

3. AirlineFormPage - Create/Edit form
   - Fields: name, baseCountry
   - Multi-select for serviced airports (use the MultiSelect component)
   - Shows relationship management

New Components:

- AirportMultiSelect - Special multi-select for airport relationships
- AirlineTable
- AirlineCard
- AirlineForm

Hooks:

- useAirlines()
- useAirline(id)
- useCreateAirline()
- useUpdateAirline()
- useDeleteAirline()

  4.3 Routes Module (Last - Most Complex)

Pages:

1. RouteListPage - Display routes with filters
   - Columns: From Airport, To Airport, Airline, Distance (km)
   - Filters: Filter by airline, from/to airport, distance range

2. RouteDetailPage - View route details
   - Display route info with airport and airline details
   - Show distance calculation

3. RouteFormPage - Create/Edit form
   - From airport select (dropdown with search)
   - To airport select (dropdown with search)
   - Airline select
   - Distance input (or auto-calculate if optional feature)

Components:

- RouteTable
- RouteCard
- RouteForm
- AirportSelect - Searchable airport dropdown

Hooks:

- useRoutes()
- useRoute(id)
- useCreateRoute()
- useUpdateRoute()
- useDeleteRoute()

Phase 5: Optional Enhancements

5.1 Map Integration (High Value)

- Install react-leaflet or Google Maps React
- Add map component to airport form
- Allow clicking map to select GPS coordinates
- Show airport locations on map in detail view

  5.2 Enhanced Search & Filtering

- Debounced search inputs
- Advanced filter panel
- Filter presets (e.g., "Airports in Europe")

  5.3 Data Visualization

- Charts showing routes by airline
- Map visualization of route network
- Statistics dashboard

  5.4 Responsive Design

- Mobile-friendly layouts
- Responsive tables (switch to cards on mobile)
- Touch-friendly interactions

  5.5 User Experience

- Toast notifications for actions
- Optimistic UI updates
- Skeleton loaders
- Keyboard shortcuts

Phase 6: Polish & Testing

6.1 Error Handling

- Global error boundary
- API error handling
- Form validation errors
- Network error recovery

  6.2 Loading States

- Skeleton loaders
- Suspense boundaries
- Loading indicators

  6.3 Accessibility

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support

  6.4 Performance

- Code splitting by route
- Image optimization
- Bundle size analysis
- React Query caching strategy

---

Implementation Order Recommendation

Step 1: Foundation

1. Install dependencies and configure Vite proxy
2. Set up router structure
3. Create layout components (Header, Sidebar, MainLayout)
4. Set up API client and React Query
5. Create common components (DataTable, LoadingSpinner, etc.)

Step 2: Airports Feature (Complete)

1. Create Airport pages (List, Detail, Form)
2. Implement Airport hooks for API calls
3. Build Airport-specific components
4. Add validation and error handling
5. Test full CRUD flow

Step 3: Airlines Feature

1. Create Airlines pages following airports pattern
2. Implement multi-select for airport relationships
3. Build airline-specific components
4. Test relationship management

Step 4: Routes Feature

1. Create Routes pages
2. Implement airport/airline selection dropdowns
3. Build route-specific components
4. Test route creation with relationships

Step 5: Polish & Optional Features

1. Map integration for airports
2. Enhanced search/filtering
3. Responsive design improvements
4. Performance optimization

---

Key Technical Decisions

State Management Strategy:

- Server State: React Query (already in api-client package)
  - Handles data fetching, caching, background updates
  - Automatic refetching on window focus
  - Optimistic updates for mutations
- UI State: Zustand
  - Modal open/close states
  - Selected items
  - Filter preferences
  - Theme preferences
- Form State: React Hook Form + Zod
  - Type-safe forms
  - Validation using existing Zod schemas
  - Good performance with uncontrolled components

Styling Approach:

- Tailwind CSS for utility-first styling
- Shared UI components from @travel-management-system/ui
- CSS modules for complex component styles
- Responsive design with Tailwind breakpoints

Data Fetching Pattern:

- Custom hooks wrapping React Query
- Example:
  export function useAirports(query: AirportQueryDto) {
  return useQuery({
  queryKey: ['airports', query],
  queryFn: () => apiClient.airports.findAll(query),
  });
  }
