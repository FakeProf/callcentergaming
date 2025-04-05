-- Erstelle die game_days Tabelle
CREATE TABLE IF NOT EXISTS public.game_days (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    registrations JSONB DEFAULT '[]'::jsonb
);

-- Erstelle die participants Tabelle
CREATE TABLE IF NOT EXISTS public.participants (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    points INTEGER DEFAULT 0
);

-- Füge Beispieldaten für game_days ein
INSERT INTO public.game_days (date, description) VALUES
    ('2025-04-07', 'Counter Strike 2 - 5v5 Competitive'),
    ('2025-04-08', 'Combat Master - 4v4 Team Deathmatch'),
    ('2025-04-09', 'Valorant - 5v5 Competitive'),
    ('2025-04-10', 'RedMatch 2 - Team Deathmatch');

-- Füge Beispieldaten für participants ein
INSERT INTO public.participants (name) VALUES
    ('Albaner'),
    ('JJ'),
    ('Julian'),
    ('Juelsk'),
    ('MalaAri'),
    ('mu7asa4'),
    ('The Fog182'),
    ('Yassumx'); 