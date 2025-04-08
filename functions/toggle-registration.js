const { createSupabaseClient } = require('./supabase-config');

// Cache invalidieren
function invalidateCache() {
    // Setze die Cache-Zeitstempel zurück
    if (typeof global.gameDaysCache !== 'undefined') {
        global.gameDaysCache = null;
    }
    if (typeof global.registrationsCache !== 'undefined') {
        global.registrationsCache = null;
    }
    if (typeof global.lastFetchTime !== 'undefined') {
        global.lastFetchTime = 0;
    }
}

// Hilfsfunktion zum Bereinigen doppelter Spieltage
function bereinigeSpieltage(spieltage) {
    const bereinigteSpieltage = [];
    const verwendeteDaten = new Set();

    spieltage.forEach(spieltag => {
        const datum = spieltag.date;
        if (!verwendeteDaten.has(datum)) {
            verwendeteDaten.add(datum);
            bereinigteSpieltage.push(spieltag);
        }
    });

    return bereinigteSpieltage;
}

exports.handler = async function(event, context) {
    // CORS-Header setzen
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
        
        // Request-Body parsen
        const { gameDayId, participantId } = JSON.parse(event.body);
        
        if (!gameDayId || !participantId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ error: 'Spieltag-ID und Teilnehmer-ID sind erforderlich' })
            };
        }

        // Aktuelle Registrierungen laden
        const { data: currentGameDay, error: loadError } = await supabase
            .from('game_days')
            .select('registrations')
            .eq('id', gameDayId)
            .single();

        if (loadError) {
            console.error('Fehler beim Laden des Spieltags:', loadError);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Fehler beim Laden des Spieltags' })
            };
        }

        // Registrierungen aktualisieren
        let updatedRegistrations = currentGameDay.registrations || [];
        const isRegistered = updatedRegistrations.includes(participantId);

        if (isRegistered) {
            // Teilnehmer abmelden
            updatedRegistrations = updatedRegistrations.filter(id => id !== participantId);
        } else {
            // Teilnehmer anmelden
            updatedRegistrations.push(participantId);
        }

        // Datenbank aktualisieren
        const { error: updateError } = await supabase
            .from('game_days')
            .update({ registrations: updatedRegistrations })
            .eq('id', gameDayId);

        if (updateError) {
            console.error('Fehler beim Aktualisieren der Registrierungen:', updateError);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Fehler beim Aktualisieren der Registrierungen' })
            };
        }

        invalidateCache();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: isRegistered ? 'Erfolgreich abgemeldet' : 'Erfolgreich angemeldet',
                registrations: updatedRegistrations
            })
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