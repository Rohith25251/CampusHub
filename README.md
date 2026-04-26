# Campus Event Management System (CEMS)

A complete, production-ready Campus Event Management System built with React 18, Vite, and Tailwind CSS.

## Features

### Core Features
- **Event Management**: Create, read, update, and delete campus events
- **Attendee Management**: Register and manage event attendees with detailed information
- **Dashboard**: Real-time statistics and analytics overview
- **Event Categories**: Organize events by category (Conference, Sports, Entertainment, etc.)
- **Capacity Tracking**: Monitor event capacity utilization in real-time
- **Search & Filter**: Powerful search and filtering capabilities
- **Premium Loading Animations**: Beautiful, glassmorphism-based loading states for all data transitions
- **Authentication**: Secure user and admin authentication with Supabase Auth

### Analytics & Reporting
- **Revenue Analytics**: Track ticket sales and revenue by event
- **Capacity Utilization**: Visualize event capacity usage with charts
- **Event Statistics**: Category-wise event distribution
- **Attendee Reports**: Export attendee data to CSV format

### Technical Features
- **State Management**: Context API with useReducer for global state
- **Persistent Storage**: localStorage backend for data persistence
- **Real-time Notifications**: react-hot-toast for user feedback
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Interactive Charts**: recharts for data visualization
- **Icon Library**: lucide-react for consistent UI icons
- **Form Validation**: Built-in validation for all forms
- **Routing**: React Router v6 for smooth navigation

## Tech Stack

- **Frontend**: React 18+
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Icons**: lucide-react
- **Notifications**: react-hot-toast
- **Charts**: recharts
- **State Management**: Context API + useReducer
- **Data Storage**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth

## Project Structure

```
cems/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx      # Navigation bar
│   │   ├── Footer.jsx      # Footer component
│   │   ├── EventCard.jsx   # Event card display
│   │   ├── EventForm.jsx   # Event creation/edit form
│   │   ├── AttendeeForm.jsx # Attendee registration form
│   │   ├── StatsCard.jsx   # Statistics display card
│   │   └── index.js        # Component exports
│   ├── context/
│   │   ├── EventContext.jsx    # Context definition
│   │   └── EventProvider.jsx   # Context provider with state
│   ├── pages/              # Page components
│   │   ├── Dashboard.jsx   # Main dashboard
│   │   ├── Events.jsx      # Events listing
│   │   ├── EventDetail.jsx # Event details
│   │   ├── Attendees.jsx   # Attendees management
│   │   ├── Analytics.jsx   # Analytics dashboard
│   │   └── index.js        # Page exports
│   ├── api/
│   │   └── mockApi.js      # Mock API with localStorage
│   ├── utils/
│   │   └── helpers.js      # Utility functions
│   ├── App.jsx             # Main app component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

## Installation

1. **Clone or Extract the Project**
```bash
cd cems
```

2. **Install Dependencies**
```bash
npm install
```

3. **Start Development Server**
```bash
npm run dev
```

The application will open at `http://localhost:3000` by default.

## Available Scripts

### Development
```bash
npm run dev
```
Starts the Vite development server with hot module reloading.

### Build for Production
```bash
npm run build
```
Creates an optimized production build in the `dist` directory.

### Preview Production Build
```bash
npm run preview
```
Serves the production build locally for testing.

## Usage Guide

### Dashboard
- View overall statistics and metrics
- See upcoming events for the next 7 days
- Quick access to event creation

### Events Management
- **View Events**: Browse all events with filters and search
- **Create Event**: Add new campus events with details
- **Edit Event**: Update event information
- **Delete Event**: Remove events from the system
- **Filter**: By category and date
- **Search**: Full-text search across events

### Event Details
- Complete event information
- Real-time capacity tracking with visual progress bar
- Manage event attendees
- Add new attendees
- Remove attendees from the event
- Event actions (edit, delete)

### Attendees Management
- View all registered attendees across all events
- Search by name, email, or department
- Sort by various fields
- Export attendee data to CSV format
- View attendee registration details

### Analytics
- **Revenue Dashboard**: Track total revenue and by-event breakdown
- **Capacity Analysis**: Visualize capacity utilization across events
- **Event Distribution**: See events categorized by type
- **Performance Metrics**: Key performance indicators
- **Revenue Breakdown**: Detailed revenue by event with percentages

## Data Persistence

The application uses **Supabase (PostgreSQL)** for production-grade data persistence and authentication. 
- **Events Table**: Stores all campus event details
- **Attendees Table**: Manages participant registrations
- **Profiles Table**: Stores user-specific information and roles

## Deployment

### Deploy to Vercel

This project is optimized for deployment on [Vercel](https://vercel.com/).

1. Push your code to a GitHub repository.
2. Connect your GitHub repository to Vercel.
3. Configure the following environment variables in the Vercel dashboard:
   - `VITE_SUPABASE_URL`: Your Supabase Project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase Anonymous Key
4. Vercel will automatically detect Vite and deploy your application.

## Sample Data

The application comes with pre-loaded sample events:
1. **Annual Tech Summit 2024** - Conference event
2. **Campus Sports Day** - Sports event
3. **Music Festival** - Entertainment event

You can modify or delete these events and create your own.

## Form Validation

### Event Form
- Title: Required
- Date: Required, must be a valid date
- Location: Required
- Capacity: Must be a positive number
- Ticket Price: Must be a valid decimal

### Attendee Form
- Name: Required
- Email: Required, must be valid email format
- Phone: Optional, must be valid phone number if provided

## Key Components

### EventProvider
Manages global state for events, attendees, and statistics using Context API and useReducer.

### Mock API (mockApi.js)
Provides functions for CRUD operations on events and attendees, using localStorage as backend:
- `getAllEvents()` - Fetch all events
- `createEvent(data)` - Create new event
- `updateEvent(id, data)` - Update event
- `deleteEvent(id)` - Delete event
- `getAllAttendees()` - Fetch all attendees
- `addAttendee(eventId, data)` - Register attendee
- `removeAttendee(id)` - Remove attendee
- `getEventStats()` - Get analytics data

### Helper Functions
Utility functions for formatting, validation, and data transformation:
- `formatDate()` - Format dates
- `validateEmail()` - Email validation
- `calculateCapacityPercentage()` - Capacity calculations
- And more...

## Customization

### Adding New Event Categories
Edit `tailwind.config.js` and the category select in `EventForm.jsx`.

### Changing Colors
Modify the color variables in `tailwind.config.js`:
```javascript
colors: {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  // ...
}
```

### Modifying Sample Data
Edit the `initializeSampleData()` function in `src/api/mockApi.js`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

The application is optimized for:
- Fast initial load time
- Smooth animations and transitions
- Efficient state management
- Responsive UI with no layout shifts

## Accessibility

Features accessibility considerations:
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance

## Future Enhancements

Potential features for future versions:
- Authentication and authorization
- Multi-user role support
- Event notifications and reminders
- Email integration
- Payment gateway integration
- PDF report generation
- Calendar view for events
- Seat selection system
- Event feedback and reviews

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, Vite will automatically use the next available port.

### Data Not Persisting
Check that localStorage is enabled in your browser. Clearing browser data will reset all application data.

### Charts Not Displaying
Ensure recharts is properly installed: `npm install recharts`

### Styling Issues
Clear browser cache or run `npm install` again to ensure all dependencies are properly installed.

## License

This project is open source and available for educational and commercial use.

## Support

For issues or questions:
1. Check the component comments in the code
2. Review the helper functions for available utilities
3. Consult the API documentation in mockApi.js

## Credits

Built with:
- React 18
- Vite
- Tailwind CSS
- lucide-react
- react-hot-toast
- recharts

---

**Happy event managing!** 🎉
