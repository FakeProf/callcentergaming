-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    game TEXT NOT NULL,
    username TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(game, username)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_registrations_game ON registrations(game);

-- Set up Row Level Security (RLS)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read registrations
CREATE POLICY "Allow authenticated users to read registrations"
    ON registrations FOR SELECT
    TO authenticated
    USING (true);

-- Create policy to allow authenticated users to insert their own registrations
CREATE POLICY "Allow authenticated users to insert their own registrations"
    ON registrations FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Create policy to allow users to delete their own registrations
CREATE POLICY "Allow users to delete their own registrations"
    ON registrations FOR DELETE
    TO authenticated
    USING (true); 