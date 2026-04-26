import React, { useReducer, useCallback, useEffect } from 'react';
import { EventContext } from './EventContext';
import { supabase } from '../lib/supabase';

const initialState = {
  events: [],
  attendees: [],
  loading: false,
  error: null,
  stats: null,
};

const eventReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload, error: null };
    
    case 'SET_EVENTS':
      return { ...state, events: action.payload, loading: false, error: null };
    
    case 'SET_ATTENDEES':
      return { ...state, attendees: action.payload, loading: false, error: null };
    
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload], error: null };
    
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(e => e.id === action.payload.id ? action.payload : e),
        error: null,
      };
    
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(e => e.id !== action.payload),
        error: null,
      };
    
    case 'ADD_ATTENDEE':
      return { ...state, attendees: [...state.attendees, action.payload], error: null };
    
    case 'REMOVE_ATTENDEE':
      return {
        ...state,
        attendees: state.attendees.filter(a => a.id !== action.payload),
        error: null,
      };
    
    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };
    
    default:
      return state;
  }
};

export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  const fetchStats = useCallback(async (events, attendees) => {
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
    dispatch({ type: 'SET_STATS', payload: stats });
  }, []);

  const fetchData = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      // Fetch both events and attendees in parallel for maximum speed
      const [eventsRes, attendeesRes] = await Promise.all([
        supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase
          .from('attendees')
          .select('*')
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (attendeesRes.error) throw attendeesRes.error;

      // Normalize events data
      const events = eventsRes.data.map(e => ({
        ...e,
        attendeeCount: e.attendee_count,
        ticketPrice: e.ticket_price,
        createdBy: e.created_by,
        createdAt: e.created_at
      }));

      // Normalize attendees data
      const attendees = attendeesRes.data.map(a => ({
        ...a,
        eventId: a.event_id,
        userId: a.user_id,
        registeredAt: a.registered_at
      }));

      dispatch({ type: 'SET_EVENTS', payload: events });
      dispatch({ type: 'SET_ATTENDEES', payload: attendees });
      fetchStats(events, attendees);
    } catch (error) {
      console.error('EventProvider: Error fetching data:', error.message);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchStats]);


  // Load initial data
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateEvent = useCallback(async (eventData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data: { user } } = await supabase.auth.getUser();
      
      const payload = {
        title: eventData.title,
        description: eventData.description,
        date: eventData.date,
        time: eventData.time,
        location: eventData.location,
        category: eventData.category,
        capacity: eventData.capacity,
        image: eventData.image,
        organizer: eventData.organizer,
        ticket_price: eventData.ticketPrice,
        created_by: user.id
      };

      const { data, error } = await supabase
        .from('events')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      
      const normalized = {
        ...data,
        attendeeCount: data.attendee_count,
        ticketPrice: data.ticket_price,
        createdBy: data.created_by,
        createdAt: data.created_at
      };

      dispatch({ type: 'ADD_EVENT', payload: normalized });
      fetchData(); 
      return normalized;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchData]);

  const handleUpdateEvent = useCallback(async (id, eventData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const payload = { ...eventData };
      if (payload.ticketPrice !== undefined) {
        payload.ticket_price = payload.ticketPrice;
        delete payload.ticketPrice;
      }
      if (payload.attendeeCount !== undefined) {
        payload.attendee_count = payload.attendeeCount;
        delete payload.attendeeCount;
      }

      const { data, error } = await supabase
        .from('events')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      const normalized = {
        ...data,
        attendeeCount: data.attendee_count,
        ticketPrice: data.ticket_price,
        createdBy: data.created_by,
        createdAt: data.created_at
      };

      dispatch({ type: 'UPDATE_EVENT', payload: normalized });
      fetchData();
      return normalized;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchData]);

  const handleDeleteEvent = useCallback(async (id) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      dispatch({ type: 'DELETE_EVENT', payload: id });
      fetchData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchData]);

  const handleAddAttendee = useCallback(async (eventId, attendeeData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('attendees')
        .insert([{ 
          event_id: eventId, 
          user_id: user.id,
          name: attendeeData.userName || attendeeData.name,
          email: attendeeData.userEmail || attendeeData.email
        }])
        .select()
        .single();

      if (error) throw error;
      
      const normalized = {
        ...data,
        eventId: data.event_id,
        userId: data.user_id,
        registeredAt: data.registered_at
      };

      dispatch({ type: 'ADD_ATTENDEE', payload: normalized });
      fetchData();
      return normalized;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchData]);

  const handleRemoveAttendee = useCallback(async (attendeeId) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const { error } = await supabase
        .from('attendees')
        .delete()
        .eq('id', attendeeId);

      if (error) throw error;
      
      dispatch({ type: 'REMOVE_ATTENDEE', payload: attendeeId });
      fetchData();
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [fetchData]);


  const value = {
    ...state,
    createEvent: handleCreateEvent,
    updateEvent: handleUpdateEvent,
    deleteEvent: handleDeleteEvent,
    addAttendee: handleAddAttendee,
    removeAttendee: handleRemoveAttendee,
    refreshData: fetchData,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

