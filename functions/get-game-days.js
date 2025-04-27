const { createSupabaseClient } = require('./supabase-config');

exports.handler = async function(event, context) {
    // CORS-Header setzen
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, OPTIONS'
    };

    // OPTIONS-Anfrage für CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const supabase = createSupabaseClient();
        
        // Spieltage aus der Datenbank laden
        const { data: gameDays, error } = await supabase
            .from('game_days')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            console.error('Fehler beim Laden der Spieltage:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Fehler beim Laden der Spieltage' })
            };
        }

        // Wenn keine Spieltage in der Datenbank sind, füge die Standard-Spieltage hinzu
        if (!gameDays || gameDays.length === 0) {
            const defaultGameDays = [
                { date: '2025-05-12', description: 'Counter Strike 2 - 1 Match gewinnen mit aufgeteilten Teams' },
                { date: '2025-05-13', description: 'Combat Master - Alle gegen alle und Bombe' },
                { date: '2025-05-14', description: 'Valorant - Custom Ranked mit Random Teams' },
                { date: '2025-05-15', description: 'RedMatch 2 - Die meisten Kills nach Zeit' },
                { date: '2025-05-19', description: 'Stickfight the Game - Erste Person mit 10 Wins gewinnt' },
                { date: '2025-05-20', description: 'Just Act Natural - Nach 30 Minuten die meisten Punkte' },
                { date: '2025-05-21', description: 'Bean Battles - 2-3 Wins' },
                { date: '2025-05-22', description: 'Golf It - Beste Runde gewinnt' },
                { date: '2025-05-26', description: 'Rocket League - Custom mit zufälligen Team-Wechseln nach jedem Match' },
                { date: '2025-05-27', description: 'Clash Royale - Alle in einem Clan, normales Team-System' },
                { date: '2025-05-28', description: 'Rainbow Six Siege - Custom Game bis 7-8 Runden' },
                { date: '2025-05-29', description: 'Brawlhalla - Custom Team Fights' }
            ];

            // Füge die Standard-Spieltage in die Datenbank ein
            const { data: insertedGameDays, error: insertError } = await supabase
                .from('game_days')
                .insert(defaultGameDays)
                .select();

            if (insertError) {
                console.error('Fehler beim Einfügen der Standard-Spieltage:', insertError);
                return {
                    statusCode: 500,
                    headers,
                    body: JSON.stringify({ error: 'Fehler beim Einfügen der Standard-Spieltage' })
                };
            }

            gameDays = insertedGameDays;
        }

        // Spieltage bereinigen und formatieren
        const bereinigteSpieltage = gameDays.map(day => ({
            id: day.id,
            date: day.date,
            description: day.description || `${new Date(day.date).toLocaleDateString('de-DE', { weekday: 'long' })} - Spieltag`,
            registrations: day.registrations || []
        }));

        console.log('Bereinigte Spieltage:', bereinigteSpieltage);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(bereinigteSpieltage)
        };
    } catch (error) {
        console.error('Unerwarteter Fehler:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Ein unerwarteter Fehler ist aufgetreten' })
        };
    }
}; 