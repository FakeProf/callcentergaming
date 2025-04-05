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
    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
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
        if (event.httpMethod !== 'POST') {
            return {
                statusCode: 405,
                headers,
                body: JSON.stringify({
                    error: 'Methode nicht erlaubt'
                })
            };
        }

        const { gameDayId, participantId } = JSON.parse(event.body);

        if (!gameDayId || !participantId) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    error: 'Spieltag-ID und Teilnehmer-ID sind erforderlich'
                })
            };
        }

        const supabase = createSupabaseClient();

        // Aktuellen Spieltag laden
        const { data: gameDay, error: getDayError } = await supabase
            .from('game_days')
            .select('*')
            .eq('id', gameDayId)
            .single();

        if (getDayError) {
            console.error('Fehler beim Laden des Spieltags:', getDayError);
            if (getDayError.code === '42501') {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({
                        error: 'Keine Berechtigung zum Zugriff auf die Daten',
                        details: getDayError.message
                    })
                };
            }
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Fehler beim Laden des Spieltags',
                    details: getDayError.message
                })
            };
        }

        if (!gameDay) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({
                    error: 'Spieltag nicht gefunden'
                })
            };
        }

        // Registrierungen aktualisieren
        const registrations = gameDay.registrations || [];
        const isRegistered = registrations.includes(participantId);

        const updatedRegistrations = isRegistered
            ? registrations.filter(id => id !== participantId)
            : [...registrations, participantId];

        // Spieltag aktualisieren
        const { error: updateError } = await supabase
            .from('game_days')
            .update({ registrations: updatedRegistrations })
            .eq('id', gameDayId);

        if (updateError) {
            console.error('Fehler beim Aktualisieren der Registrierungen:', updateError);
            if (updateError.code === '42501') {
                return {
                    statusCode: 403,
                    headers,
                    body: JSON.stringify({
                        error: 'Keine Berechtigung zum Aktualisieren der Daten',
                        details: updateError.message
                    })
                };
            }
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    error: 'Fehler beim Aktualisieren der Registrierungen',
                    details: updateError.message
                })
            };
        }

        invalidateCache();

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                message: isRegistered ? 'Abmeldung erfolgreich' : 'Anmeldung erfolgreich',
                registrations: updatedRegistrations
            })
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