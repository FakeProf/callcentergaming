const { getDatabase } = require('./util/db');

exports.handler = async function(event, context) {
    // Überprüfe, ob der Benutzer authentifiziert ist
    if (!context.clientContext?.user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Nicht authentifiziert' })
        };
    }

    const db = getDatabase();
    const user = context.clientContext.user;

    // GET-Anfrage: Hole alle Anmeldungen
    if (event.httpMethod === 'GET') {
        try {
            const { data: registrations, error } = await db
                .from('registrations')
                .select('*');

            if (error) throw error;

            // Formatiere die Daten in das erwartete Format
            const formattedRegistrations = {};
            registrations.forEach(reg => {
                if (!formattedRegistrations[reg.game]) {
                    formattedRegistrations[reg.game] = [];
                }
                formattedRegistrations[reg.game].push(reg.username);
            });

            return {
                statusCode: 200,
                body: JSON.stringify(formattedRegistrations)
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Fehler beim Abrufen der Anmeldungen' })
            };
        }
    }

    // POST-Anfrage: Toggle Anmeldung
    if (event.httpMethod === 'POST') {
        try {
            const { game, username, action } = JSON.parse(event.body);

            // Hole aktuelle Anmeldungen
            const { data: currentRegistrations, error: fetchError } = await db
                .from('registrations')
                .select('*')
                .eq('game', game);

            if (fetchError) throw fetchError;

            // Prüfe, ob das Spiel bereits voll ist
            if (currentRegistrations.length >= 8) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Spiel ist bereits voll' })
                };
            }

            // Prüfe, ob der Benutzer bereits angemeldet ist
            const isRegistered = currentRegistrations.some(reg => reg.username === username);

            if (isRegistered) {
                // Abmelden
                const { error: deleteError } = await db
                    .from('registrations')
                    .delete()
                    .eq('game', game)
                    .eq('username', username);

                if (deleteError) throw deleteError;
            } else {
                // Anmelden
                const { error: insertError } = await db
                    .from('registrations')
                    .insert([{ game, username }]);

                if (insertError) throw insertError;
            }

            // Hole aktualisierte Anmeldungen
            const { data: updatedRegistrations, error: updateError } = await db
                .from('registrations')
                .select('*')
                .eq('game', game);

            if (updateError) throw updateError;

            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    registrations: updatedRegistrations.map(reg => reg.username)
                })
            };
        } catch (error) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Fehler beim Aktualisieren der Anmeldung' })
            };
        }
    }

    return {
        statusCode: 405,
        body: JSON.stringify({ error: 'Methode nicht erlaubt' })
    };
}; 