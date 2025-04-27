-- Lösche alle bestehenden Einträge
DELETE FROM public.game_days;

-- Füge neue Spieltage ein (Montag bis Donnerstag ab 12. Mai)
INSERT INTO public.game_days (date, description) VALUES
    ('2025-05-12', 'Counter Strike 2 - 1 Match gewinnen mit aufgeteilten Teams'),
    ('2025-05-13', 'Combat Master - Alle gegen alle und Bombe'),
    ('2025-05-14', 'Valorant - Custom Ranked mit Random Teams'),
    ('2025-05-15', 'RedMatch 2 - Die meisten Kills nach Zeit'),
    ('2025-05-19', 'Stickfight the Game - Erste Person mit 10 Wins gewinnt'),
    ('2025-05-20', 'Just Act Natural - Nach 30 Minuten die meisten Punkte'),
    ('2025-05-21', 'Bean Battles - 2-3 Wins'),
    ('2025-05-22', 'Golf It - Beste Runde gewinnt'),
    ('2025-05-26', 'Rocket League - Custom mit zufälligen Team-Wechseln nach jedem Match'),
    ('2025-05-27', 'Clash Royale - Alle in einem Clan, normales Team-System'),
    ('2025-05-28', 'Rainbow Six Siege - Custom Game bis 7-8 Runden'),
    ('2025-05-29', 'Brawlhalla - Custom Team Fights'); 