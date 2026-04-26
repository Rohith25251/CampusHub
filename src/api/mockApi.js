const EVENTS_KEY = 'cems_events';
const ATTENDEES_KEY = 'cems_attendees';
const DATA_VERSION = '1.0';
const VERSION_KEY = 'cems_version';

// Generate a simple unique ID (browser-compatible)
const generateId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
};

// Initialize with sample data
const initializeSampleData = () => {
  const currentVersion = localStorage.getItem(VERSION_KEY);
  if (!localStorage.getItem(EVENTS_KEY) || currentVersion !== DATA_VERSION) {
    const sampleEvents = [
      {
        id: generateId(),
        title: 'Annual Tech Summit 2024',
        description: 'A comprehensive tech summit featuring latest innovations',
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        time: '09:00 AM',
        location: 'Main Auditorium',
        category: 'Conference',
        capacity: 500,
        attendeeCount: 234,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        organizer: 'Tech Club',
        ticketPrice: 50,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Campus Sports Day',
        description: 'Interactive sports events and competitions',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:00 AM',
        location: 'Sports Complex',
        category: 'Sports',
        capacity: 1000,
        attendeeCount: 456,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&h=300&fit=crop',
        organizer: 'Sports Board',
        ticketPrice: 10,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Music Festival',
        description: 'Live performances from popular artists',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        time: '06:00 PM',
        location: 'Open Ground',
        category: 'Entertainment',
        capacity: 2000,
        attendeeCount: 1200,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=300&fit=crop',
        organizer: 'Cultural Club',
        ticketPrice: 25,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'AI & Machine Learning Workshop',
        description: 'Hands-on workshop on AI and ML applications in real-world scenarios',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        time: '02:00 PM',
        location: 'Tech Lab Building',
        category: 'Workshop',
        capacity: 150,
        attendeeCount: 89,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
        organizer: 'AI Society',
        ticketPrice: 35,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Business Networking Seminar',
        description: 'Connect with industry leaders and entrepreneurs',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        time: '11:00 AM',
        location: 'Business Conference Hall',
        category: 'Seminar',
        capacity: 300,
        attendeeCount: 245,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        organizer: 'Business Club',
        ticketPrice: 15,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Photography Exhibition',
        description: 'Showcase of student photography from around the world',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        time: '04:00 PM',
        location: 'Art Gallery',
        category: 'Exhibition',
        capacity: 200,
        attendeeCount: 156,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1578301978162-7aae4d755744?w=500&h=300&fit=crop',
        organizer: 'Photography Club',
        ticketPrice: 5,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Debate Championship Finals',
        description: 'Ultimate face-off between top debate teams',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        time: '07:00 PM',
        location: 'Main Auditorium',
        category: 'Competition',
        capacity: 600,
        attendeeCount: 512,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        organizer: 'Debate Society',
        ticketPrice: 12,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Web Development Bootcamp',
        description: 'Intensive 2-week bootcamp on full-stack web development',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        time: '10:00 AM',
        location: 'Tech Lab Building',
        category: 'Workshop',
        capacity: 80,
        attendeeCount: 78,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
        organizer: 'Code Cadets',
        ticketPrice: 100,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Literary Fest 2024',
        description: 'Celebrating literature with poetry reading and author talks',
        date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
        time: '05:00 PM',
        location: 'Library Auditorium',
        category: 'Cultural',
        capacity: 250,
        attendeeCount: 143,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-150784272343-583f20270319?w=500&h=300&fit=crop',
        organizer: 'Literature Club',
        ticketPrice: 8,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Robotics Competition',
        description: 'Inter-college robotics challenge with exciting prizes',
        date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
        time: '08:00 AM',
        location: 'Engineering Complex',
        category: 'Competition',
        capacity: 400,
        attendeeCount: 287,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500&h=300&fit=crop',
        organizer: 'Robotics Club',
        ticketPrice: 20,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Startup Pitch Day',
        description: 'Innovative startups pitch to investors and venture capitalists',
        date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
        time: '03:00 PM',
        location: 'Innovation Hub',
        category: 'Seminar',
        capacity: 350,
        attendeeCount: 298,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop',
        organizer: 'Entrepreneurship Club',
        ticketPrice: 30,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Dance Battle 2024',
        description: 'High-energy dance competition with live DJ and prizes',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString(),
        time: '06:30 PM',
        location: 'Open Ground',
        category: 'Entertainment',
        capacity: 800,
        attendeeCount: 645,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=300&fit=crop',
        organizer: 'Dance Club',
        ticketPrice: 15,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Environmental Awareness Campaign',
        description: 'Join us for seminars and activities promoting sustainability',
        date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        time: '09:00 AM',
        location: 'Campus Grounds',
        category: 'Workshop',
        capacity: 300,
        attendeeCount: 212,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=500&h=300&fit=crop',
        organizer: 'Green Club',
        ticketPrice: 0,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Data Science Bootcamp',
        description: 'Learn data analytics, visualization, and machine learning',
        date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
        time: '01:00 PM',
        location: 'Data Science Lab',
        category: 'Workshop',
        capacity: 100,
        attendeeCount: 92,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop',
        organizer: 'Data Analytics Club',
        ticketPrice: 75,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Film Festival',
        description: 'Screening of best student films and documentaries',
        date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString(),
        time: '07:00 PM',
        location: 'Main Theater',
        category: 'Entertainment',
        capacity: 500,
        attendeeCount: 378,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=500&h=300&fit=crop',
        organizer: 'Film Society',
        ticketPrice: 10,
        createdAt: new Date().toISOString(),
      },
      {
        id: generateId(),
        title: 'Hackathon 2024',
        description: '24-hour coding challenge with prizes and networking',
        date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
        time: '09:00 AM',
        location: 'Tech Hub',
        category: 'Competition',
        capacity: 200,
        attendeeCount: 178,
        status: 'scheduled',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
        organizer: 'Code Club',
        ticketPrice: 40,
        createdAt: new Date().toISOString(),
      },
    ];
    localStorage.setItem(EVENTS_KEY, JSON.stringify(sampleEvents));
    localStorage.setItem(VERSION_KEY, DATA_VERSION);
  }

  if (!localStorage.getItem(ATTENDEES_KEY)) {
    const sampleAttendees = [];
    localStorage.setItem(ATTENDEES_KEY, JSON.stringify(sampleAttendees));
  }
};

// Events API
export const getAllEvents = () => {
  initializeSampleData();
  const events = localStorage.getItem(EVENTS_KEY);
  return events ? JSON.parse(events) : [];
};

export const getEventById = (id) => {
  const events = getAllEvents();
  return events.find(e => e.id === id);
};

export const createEvent = (eventData) => {
  const events = getAllEvents();
  const newEvent = {
    ...eventData,
    id: generateId(),
    attendeeCount: 0,
    status: 'scheduled',
    createdAt: new Date().toISOString(),
  };
  events.push(newEvent);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return newEvent;
};

export const updateEvent = (id, eventData) => {
  const events = getAllEvents();
  const index = events.findIndex(e => e.id === id);
  if (index === -1) throw new Error('Event not found');
  
  const updatedEvent = {
    ...events[index],
    ...eventData,
    id,
  };
  events[index] = updatedEvent;
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  return updatedEvent;
};

export const deleteEvent = (id) => {
  const events = getAllEvents();
  const filtered = events.filter(e => e.id !== id);
  localStorage.setItem(EVENTS_KEY, JSON.stringify(filtered));
  
  // Also remove attendees for this event
  const attendees = getAllAttendees();
  const filteredAttendees = attendees.filter(a => a.eventId !== id);
  localStorage.setItem(ATTENDEES_KEY, JSON.stringify(filteredAttendees));
};

// Attendees API
export const getAllAttendees = () => {
  initializeSampleData();
  const attendees = localStorage.getItem(ATTENDEES_KEY);
  return attendees ? JSON.parse(attendees) : [];
};

export const getEventAttendees = (eventId) => {
  const attendees = getAllAttendees();
  return attendees.filter(a => a.eventId === eventId);
};

export const addAttendee = (eventId, attendeeData) => {
  const attendees = getAllAttendees();
  const newAttendee = {
    ...attendeeData,
    id: generateId(),
    eventId,
    registeredAt: new Date().toISOString(),
  };
  attendees.push(newAttendee);
  localStorage.setItem(ATTENDEES_KEY, JSON.stringify(attendees));

  // Update event attendee count
  const events = getAllEvents();
  const eventIndex = events.findIndex(e => e.id === eventId);
  if (eventIndex !== -1) {
    events[eventIndex].attendeeCount = (events[eventIndex].attendeeCount || 0) + 1;
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }

  return newAttendee;
};

export const removeAttendee = (attendeeId) => {
  const attendees = getAllAttendees();
  const attendee = attendees.find(a => a.id === attendeeId);
  
  if (attendee) {
    const events = getAllEvents();
    const eventIndex = events.findIndex(e => e.id === attendee.eventId);
    if (eventIndex !== -1 && events[eventIndex].attendeeCount > 0) {
      events[eventIndex].attendeeCount -= 1;
      localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }
  }

  const filtered = attendees.filter(a => a.id !== attendeeId);
  localStorage.setItem(ATTENDEES_KEY, JSON.stringify(filtered));
};

// Statistics API
export const getEventStats = () => {
  const events = getAllEvents();
  const attendees = getAllAttendees();

  const stats = {
    totalEvents: events.length,
    totalAttendees: attendees.length,
    scheduledEvents: events.filter(e => e.status === 'scheduled').length,
    completedEvents: events.filter(e => e.status === 'completed').length,
    cancelledEvents: events.filter(e => e.status === 'cancelled').length,
    eventsByCategory: events.reduce((acc, event) => {
      acc[event.category] = (acc[event.category] || 0) + 1;
      return acc;
    }, {}),
    capacityUtilization: events.map(e => ({
      title: e.title,
      utilization: e.capacity > 0 ? Math.round((e.attendeeCount / e.capacity) * 100) : 0,
      attendees: e.attendeeCount,
      capacity: e.capacity,
    })),
    revenueByEvent: events.map(e => ({
      title: e.title,
      revenue: (e.ticketPrice || 0) * (e.attendeeCount || 0),
      attendees: e.attendeeCount,
      ticketPrice: e.ticketPrice || 0,
    })),
  };

  return stats;
};

export const searchEvents = (query) => {
  const events = getAllEvents();
  const lowerQuery = query.toLowerCase();
  return events.filter(e =>
    e.title.toLowerCase().includes(lowerQuery) ||
    e.description.toLowerCase().includes(lowerQuery) ||
    e.location.toLowerCase().includes(lowerQuery) ||
    e.category.toLowerCase().includes(lowerQuery)
  );
};

export const filterEventsByCategory = (category) => {
  const events = getAllEvents();
  return events.filter(e => e.category === category);
};

export const getUpcomingEvents = (days = 30) => {
  const events = getAllEvents();
  const now = new Date();
  const futureDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate >= now && eventDate <= futureDate;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));
};
