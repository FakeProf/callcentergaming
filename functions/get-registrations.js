const { createSupabaseClient } = require('./supabase-config');

// Cache für Registrierungen
let registrationsCache = null;
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
        
        // Registrierungen aus der Datenbank laden
        const { data: gameDays, error } = await supabase
            .from('game_days')
            .select('id, registrations')
            .order('date', { ascending: true });

        if (error) {
            console.error('Fehler beim Laden der Registrierungen:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Fehler beim Laden der Registrierungen' })
            };
        }

        // Registrierungen verarbeiten
        const registrations = {};
        gameDays.forEach(day => {
            try {
                registrations[day.id] = Array.isArray(day.registrations) ? day.registrations : [];
            } catch (e) {
                console.error('Fehler beim Verarbeiten der Registrierungen für Tag', day.id, e);
                registrations[day.id] = [];
            }
        });

        console.log('Verarbeitete Registrierungen:', registrations);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify(registrations)
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
    return {
        '1': [],
        '2': [],
        '3': [],
        '4': []
    };
} 