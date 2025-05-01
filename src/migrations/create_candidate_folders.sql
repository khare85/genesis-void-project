
-- Create a table for candidate folders
CREATE TABLE IF NOT EXISTS public.candidate_folders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_default BOOLEAN DEFAULT false,
  color TEXT DEFAULT '#3b82f6',
  candidate_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add a folder_id column to the applications table
ALTER TABLE public.applications 
ADD COLUMN IF NOT EXISTS folder_id UUID REFERENCES public.candidate_folders(id);

-- Default folder for uncategorized candidates
INSERT INTO public.candidate_folders (name, description, is_default, color) 
VALUES ('Default Folder', 'Default folder contains uncategorized candidates', true, '#3b82f6')
ON CONFLICT (id) WHERE is_default = true DO NOTHING;

-- Sample folders for testing
INSERT INTO public.candidate_folders (name, description, color) 
VALUES 
  ('Employee Referral', 'Candidates referred by employees', '#ef4444'),
  ('SAP Basis', 'Contains list of SAP Basis candidates', '#22c55e'),
  ('Cloud Networking', 'Contains candidates with Cloud Networking Experience', '#06b6d4'),
  ('Linux Administrator', 'Contains candidates with Linux admin Experience', '#8b5cf6')
ON CONFLICT (name) DO NOTHING;
