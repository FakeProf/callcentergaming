const { createSupabaseClient } = require('./supabase-config');

// Cache für Spieltage
let gameDaysCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60000; // 1 Minute Cache

// Hilfsfunktion zum Bereinigen von doppelten Spieltagen
function bereinigeSpieltage(spieltage) {
    const spieltageMap = new Map();
    
    // Gruppiere Spieltage nach Datum und behalte den mit der niedrigsten ID
    spieltage.forEach(tag => {
        const datum = tag.date;
        if (!spieltageMap.has(datum) || spieltageMap.get(datum).id > tag.id) {
            spieltageMap.set(datum, tag);
        }
    });
    
    return Array.from(spieltageMap.values());
}

exports.handler = async function(event, context) {
    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle OPTIONS request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        const supabase = createSupabaseClient();

        console.log('Lade Spieltage aus der Datenbank...');
        const { data: spieltage, error } = await supabase
            .from('game_days')
            .select('*')
            .order('date', { ascending: true });

        if (error) {
            console.error('Datenbankfehler:', error);
            if (error.code === '42501') {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({
                        error: 'Keine Berechtigung zum Zugriff auf die Daten',
                        details: error.message
                    })
                };
            }
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Fehler beim Laden der Spieltage',
                    details: error.message
                })
            };
        }

        if (!spieltage) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify([])
            };
        }

        console.log('Geladene Spieltage:', spieltage);
        
        // Bereinige doppelte Spieltage
        const bereinigteSpieldage = bereinigeSpieltage(spieltage);
        console.log('Bereinigte Spieltage:', bereinigteSpieldage);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(bereinigteSpieldage)
        };
    } catch (error) {
        console.error('Serverfehler:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                error: 'Interner Serverfehler',
                details: error.message
            })
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