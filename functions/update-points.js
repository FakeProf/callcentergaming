const { createSupabaseClient } = require('./supabase-config');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Methode nicht erlaubt' })
        };
    }

    try {
        const { userName, participantName, points } = JSON.parse(event.body);

        // Überprüfe, ob der Benutzer Julian ist
        if (userName !== 'Julian') {
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Keine Berechtigung für diese Aktion' })
            };
        }

        const supabase = createSupabaseClient();
        const { data, error } = await supabase
            .from('participants')
            .update({ points: points })
            .eq('name', participantName)
            .select();

        if (error) throw error;

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, data })
        };
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Punkte:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Interner Serverfehler' })
        };
    }
}; 