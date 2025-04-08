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
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
    };

    // OPTIONS-Request für CORS
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

        // Lösche zuerst alle bestehenden Spieltage
        const { error: deleteError } = await supabase
            .from('game_days')
            .delete()
            .neq('id', 0);

        if (deleteError) {
            console.error('Fehler beim Löschen der Spieltage:', deleteError);
            throw deleteError;
        }

        // Erstelle neue Spieltage ab dem 14.04.2025
        const spieltage = [
            {
                date: '2025-04-14',
                description: 'Counter Strike 2 - 5v5 Competitive'
            },
            {
                date: '2025-04-15',
                description: 'Combat Master - 4v4 Team Deathmatch'
            },
            {
                date: '2025-04-16',
                description: 'Valorant - 5v5 Competitive'
            },
            {
                date: '2025-04-17',
                description: 'RedMatch 2 - Team Deathmatch'
            }
        ];

        // Füge die Spieltage in die Datenbank ein
        const { data: insertedData, error: insertError } = await supabase
            .from('game_days')
            .insert(spieltage)
            .select();

        if (insertError) {
            console.error('Fehler beim Einfügen der Spieltage:', insertError);
            throw insertError;
        }

        console.log('Geladene Spieltage:', insertedData);
        const bereinigteSpieltage = bereinigeSpieltage(insertedData);
        console.log('Bereinigte Spieltage:', bereinigteSpieltage);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(bereinigteSpieltage)
        };
    } catch (error) {
        console.error('Fehler beim Laden der Spieltage:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Interner Serverfehler beim Laden der Spieltage' })
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