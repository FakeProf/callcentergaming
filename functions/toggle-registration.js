import { getDatabase } from './util/db.js';

export const handler = async (event, context) => {
    // Prüfe Authentifizierung
    if (!context.clientContext?.user) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Nicht authentifiziert' })
        };
    }

    try {
        const { game, username, action } = JSON.parse(event.body);
        const supabase = getDatabase();

        if (action === 'register') {
            // Prüfe, ob das Spiel bereits voll ist
            const { data: currentRegistrations, error: fetchError } = await supabase
                .from('registrations')
                .select('username')
                .eq('game', game);

            if (fetchError) throw fetchError;

            if (currentRegistrations.length >= 8) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: 'Spiel ist bereits voll' })
                };
            }

            // Füge neue Registrierung hinzu
            const { error: insertError } = await supabase
                .from('registrations')
                .insert([{ game, username }]);

            if (insertError) throw insertError;

        } else if (action === 'unregister') {
            // Entferne Registrierung
            const { error: deleteError } = await supabase
                .from('registrations')
                .delete()
                .eq('game', game)
                .eq('username', username);

            if (deleteError) throw deleteError;
        }

        // Hole aktualisierte Liste der Registrierungen
        const { data: updatedRegistrations, error: finalError } = await supabase
            .from('registrations')
            .select('username')
            .eq('game', game);

        if (finalError) throw finalError;

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                registrations: updatedRegistrations.map(r => r.username)
            })
        };

    } catch (error) {
        console.error('Fehler:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Interner Serverfehler' })
        };
    }
}; 