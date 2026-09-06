-- =========================================================
-- Supabase Authentication & Database Storage Setup Schema
-- Run this in your Supabase SQL Editor (https://app.supabase.com)
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Public Profiles Table linked to Auth Users
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('student', 'company', 'admin')),
  name TEXT,
  college TEXT,
  degree TEXT,
  branch TEXT,
  year TEXT,
  location TEXT,
  company_name TEXT,
  website TEXT,
  industry TEXT,
  description TEXT,
  skills JSONB DEFAULT '{}'::jsonb,
  enrolled_courses JSONB DEFAULT '[]'::jsonb,
  completed_courses JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create Security Policies
-- Anyone can view profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 5. Trigger Function to automatically populate profiles table on Sign Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    role,
    name,
    college,
    degree,
    branch,
    year,
    location,
    company_name,
    website,
    industry,
    description
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'role', 'student'),
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'college',
    new.raw_user_meta_data->>'degree',
    new.raw_user_meta_data->>'branch',
    new.raw_user_meta_data->>'year',
    new.raw_user_meta_data->>'location',
    new.raw_user_meta_data->>'companyName',
    new.raw_user_meta_data->>'website',
    new.raw_user_meta_data->>'industry',
    new.raw_user_meta_data->>'description'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Attach Trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
