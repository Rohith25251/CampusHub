# Campus Event Management System - Development Guide

## Project Overview

A production-ready Campus Event Management System built with React 18, Vite, Tailwind CSS, and localStorage backend. The system provides complete event management, attendee tracking, and analytics capabilities.

## Tech Stack

- **Frontend**: React 18+ with Vite
- **Styling**: Tailwind CSS with PostCSS
- **Routing**: React Router DOM v6
- **State**: Context API + useReducer
- **Data**: localStorage (Mock API)
- **UI Components**: lucide-react for icons
- **Notifications**: react-hot-toast
- **Charts**: recharts for analytics

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Project Structure

- `src/components/` - Reusable UI components
- `src/pages/` - Page components (Dashboard, Events, etc.)
- `src/context/` - Context API setup for state management
- `src/api/` - Mock API with localStorage backend
- `src/utils/` - Helper functions and utilities
- `src/index.css` - Global Tailwind styles

## Key Features

1. **Event Management** - Create, edit, delete, and view events
2. **Attendee Tracking** - Register and manage attendees
3. **Analytics Dashboard** - Revenue, capacity, and statistics
4. **Real-time Search & Filter** - Find events by various criteria
5. **CSV Export** - Export attendee data
6. **Responsive Design** - Mobile-first UI
7. **Data Persistence** - localStorage backend

## Development Guidelines

### Adding New Features

1. Create components in `src/components/`
2. Create pages in `src/pages/` if needed
3. Add API functions in `src/api/mockApi.js`
4. Use Context API for state management
5. Add helper functions in `src/utils/helpers.js`

### Component Structure

All components should follow this pattern:
```jsx
import React from 'react';
// imports

export const ComponentName = ({ props }) => {
  return (
    // JSX
  );
};
```

### Styling

- Use Tailwind CSS classes for styling
- Follow the color scheme defined in `tailwind.config.js`
- Use responsive classes (sm:, md:, lg:)
- Reference colors: primary (blue), secondary (purple), success (green)

### State Management

- Use `useEvents()` hook from EventContext for global state
- Local state with useState for component-specific state
- EventProvider manages all event and attendee data

## Common Tasks

### Creating a New Event
Use the `createEvent()` function from EventProvider with event data object.

### Managing Attendees
Use `addAttendee()` and `removeAttendee()` functions from EventProvider.

### Getting Analytics
Access `stats` object from EventProvider for pre-calculated metrics.

### Form Validation
Use helper functions like `validateEmail()` and `validatePhoneNumber()`.

## Performance Considerations

- Use useMemo for expensive calculations
- Implement proper loading states
- Optimize list renders with keys
- Lazy load images when possible
- Use localStorage efficiently

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile-responsive design
- Touch-friendly interfaces

## Common Issues & Solutions

**Q: Data not persisting?**
A: Check if localStorage is enabled. Clear cache and try again.

**Q: Port 3000 already in use?**
A: Vite will automatically use the next available port.

**Q: Styles not loading?**
A: Run `npm install` and ensure Tailwind is configured properly.

## Testing

### Manual Testing Checklist
- [ ] Create and delete events
- [ ] Add/remove attendees
- [ ] Search and filter events
- [ ] Export attendee data
- [ ] View analytics charts
- [ ] Test on mobile devices
- [ ] Test responsiveness

## Deployment

Build for production:
```bash
npm run build
```

Deploy the `dist/` folder to any static hosting service (Vercel, Netlify, GitHub Pages, etc.).

## Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [React Router](https://reactrouter.com)
- [Recharts](https://recharts.org)

---

For more details, see README.md
