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