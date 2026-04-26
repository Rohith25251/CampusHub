-- SUPABASE SQL SCHEMA FOR CAMPUS EVENT MANAGEMENT SYSTEM (CEMS)

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    role TEXT CHECK (role IN ('admin', 'user')) DEFAULT 'user',
    phone_number TEXT,
    department TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    category TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 0,
    attendee_count INTEGER DEFAULT 0,
    status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
    image TEXT,
    organizer TEXT,
    ticket_price NUMERIC DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Events Policies
CREATE POLICY "Events are viewable by everyone" ON public.events
    FOR SELECT USING (true);

CREATE POLICY "Admins can create events" ON public.events
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can update events" ON public.events
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete events" ON public.events
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 3. Attendees (Registrations) Table
CREATE TABLE IF NOT EXISTS public.attendees (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    registered_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(event_id, user_id)
);

-- Enable RLS on attendees
ALTER TABLE public.attendees ENABLE ROW LEVEL SECURITY;

-- Attendees Policies
CREATE POLICY "Attendees are viewable by event organizers and the attendee themselves" ON public.attendees
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Users can register for events" ON public.attendees
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their own registration" ON public.attendees
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all attendees" ON public.attendees
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- 4. Function to update attendee count
CREATE OR REPLACE FUNCTION update_attendee_count()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE public.events
        SET attendee_count = attendee_count + 1
        WHERE id = NEW.event_id;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE public.events
        SET attendee_count = attendee_count - 1
        WHERE id = OLD.event_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for attendee count
CREATE TRIGGER tr_update_attendee_count
AFTER INSERT OR DELETE ON public.attendees
FOR EACH ROW EXECUTE FUNCTION update_attendee_count();

-- 5. Trigger for profile creation on Auth Sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'), 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- DEMO DATA (Run these after creating users in Supabase Auth Dashboard)
/*
-- Note: Replace UUIDs with actual user IDs from your Supabase Auth dashboard

-- To make a user an Admin:
UPDATE public.profiles SET role = 'admin' WHERE email = 'kosh@gmail.com';

-- Sample Event:
INSERT INTO public.events (title, description, date, time, location, category, capacity, image, organizer, ticket_price)
VALUES (
    'Annual Tech Summit 2024', 
    'A comprehensive tech summit featuring latest innovations', 
    '2024-05-26', 
    '09:00 AM', 
    'Main Auditorium', 
    'Conference', 
    500, 
    'https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop', 
    'Tech Club', 
    50
);
*/
