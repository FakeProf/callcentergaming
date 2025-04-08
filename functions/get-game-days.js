const { createSupabaseClient } = require('./supabase-config');

// Cache für Spieltage
let gameDaysCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 Minute Cache

// Hilfsfunktion zum Bereinigen von Spieltagen
function bereinigeSpieltage(spieltage) {
    if (!Array.isArray(spieltage)) {
        console.error('Ungültiges Format für Spieltage:', spieltage);
        return [];
    }

    // Sortiere nach Datum
    spieltage.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Entferne Duplikate basierend auf Datum
    const bereinigteSpieltage = spieltage.reduce((acc, current) => {
        const exists = acc.find(item => item.date === current.date);
        if (!exists) {
            acc.push(current);
        }
        return acc;
    }, []);

    return bereinigteSpieltage;
}

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

// Hilfsfunktion für Beispieldaten
function getBeispieldaten() {
    return [
        {
            id: 1,
            date: '2025-04-07',
            description: 'Counter Strike 2 - 5v5 Competitive',
            registrations: []
        },
        {
            id: 2,
            date: '2025-04-08',
            description: 'Combat Master - 4v4 Team Deathmatch',
            registrations: []
        },
        {
            id: 3,
            date: '2025-04-09',
            description: 'Valorant - 5v5 Competitive',
            registrations: []
        },
        {
            id: 4,
            date: '2025-04-10',
            description: 'RedMatch 2 - Team Deathmatch',
            registrations: []
        }
    ];
} 