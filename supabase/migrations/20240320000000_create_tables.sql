-- Lösche zuerst alle existierenden Tabellen und Funktionen
DROP TABLE IF EXISTS public.game_days CASCADE;
DROP TABLE IF EXISTS public.participants CASCADE;
DROP FUNCTION IF EXISTS public.delete_duplicate_participants() CASCADE;

-- Erstelle die game_days Tabelle
CREATE TABLE IF NOT EXISTS public.game_days (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    description TEXT NOT NULL,
    registrations JSONB DEFAULT '[]'::jsonb
);

-- Erstelle die participants Tabelle mit UNIQUE Constraint
CREATE TABLE IF NOT EXISTS public.participants (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    points INTEGER DEFAULT 0,
    CONSTRAINT unique_participant_name UNIQUE (name)
);

-- Erstelle eine Funktion zum Löschen von Duplikaten
CREATE OR REPLACE FUNCTION public.delete_duplicate_participants()
RETURNS void AS $$
BEGIN
    -- Lösche alle Duplikate außer dem Eintrag mit der niedrigsten ID
    DELETE FROM participants a
    USING participants b
    WHERE a.name = b.name
    AND a.id > b.id;
END;
$$ LANGUAGE plpgsql;

-- Füge Beispieldaten für game_days ein
INSERT INTO public.game_days (date, description) VALUES
    ('2025-04-07', 'Counter Strike 2 - 5v5 Competitive'),
    ('2025-04-08', 'Combat Master - 4v4 Team Deathmatch'),
    ('2025-04-09', 'Valorant - 5v5 Competitive'),
    ('2025-04-10', 'RedMatch 2 - Team Deathmatch');

-- Lösche zuerst alle existierenden Teilnehmer
DELETE FROM public.participants;

-- Füge Beispieldaten für participants ein
INSERT INTO public.participants (name) VALUES
    ('Albaner'),
    ('JJ'),
    ('Julian'),
    ('Juelsk'),
    ('MalaAri'),
    ('mu7asa4'),
    ('The Fog182'),
    ('Yassumx')
ON CONFLICT (name) DO NOTHING; 