import React, { useReducer, useCallback, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { supabase } from '../lib/supabase';

const initialState = {
  isAuthenticated: false,
  user: null,
  loading: true,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: true, error: null };

    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
        loading: false,
        error: null,
      };

    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      };

    case 'SET_ERROR':
      return { ...state, loading: false, error: action.payload };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Fetch profile data from the profiles table
  const fetchProfile = async (userId) => {
    if (!userId) return null;
    console.log('Fetching profile for userId:', userId);
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Profile fetch timed out')), 5000)
    );

    try {
      const fetchPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) {
        console.warn('Profile fetch warning:', error.message);
        return null;
      }
      
      const profile = {
        ...data,
        phoneNumber: data.phone_number,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      console.log('Profile fetched and normalized:', profile);
      return profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error.message);
      return null;
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    let lastUserId = null;
    let isMounted = true;
    console.log('Setting up onAuthStateChange listener');
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session) {
        const userId = session.user.id;

        // 1. Immediately log in with basic user data (non-blocking)
        if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { ...session.user },
          });
        }

        // 2. Fetch profile in background if user ID changed
        if (userId !== lastUserId) {
          lastUserId = userId;
          fetchProfile(userId).then(profile => {
            if (isMounted && profile) {
              dispatch({
                type: 'LOGIN_SUCCESS',
                payload: { ...session.user, ...profile },
              });
            }
          });
        }
      } else {
        lastUserId = null;
        dispatch({ type: 'LOGOUT' });
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);



  const login = useCallback(async (email, password) => {
    console.log('AuthProvider: Starting login for', email);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('AuthProvider: Login error:', error.message);
        throw error;
      }
      
      return data.user;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, []);



  const signup = useCallback(async (email, password, name, role = 'user') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }, []);


  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  }, []);

  const updateProfile = useCallback(async (updatedData) => {
    dispatch({ type: 'SET_LOADING' });
    try {
      // Map camelCase to snake_case for the database
      const dbData = {
        name: updatedData.name,
        email: updatedData.email,
        phone_number: updatedData.phoneNumber,
        department: updatedData.department,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(dbData)
        .eq('id', state.user.id)
        .select()
        .single();

      if (error) throw error;
      
      // Normalize result back to camelCase
      const normalizedData = {
        ...data,
        phoneNumber: data.phone_number,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      };
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: { ...state.user, ...normalizedData } });
      return normalizedData;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.user]);


  const changePassword = useCallback(async (currentPassword, newPassword) => {
    try {
      // 1. Verify current password first for security
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: state.user.email,
        password: currentPassword,
      });
      
      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // 2. Update to new password
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (error) throw error;
      return true;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  }, [state.user?.email]);


  const value = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

