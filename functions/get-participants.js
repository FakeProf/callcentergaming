const { createSupabaseClient } = require('./supabase-config');

exports.handler = async function(event, context) {
    try {
        const supabase = createSupabaseClient();
        
        // Debug: Zeige alle Teilnehmer an
        const { data: allParticipants, error: debugError } = await supabase
            .from('participants')
            .select('*');
            
        console.log('Alle Teilnehmer in der Datenbank:', allParticipants);
        
        // Entferne Duplikate direkt in der Funktion
        const uniqueParticipants = allParticipants.reduce((acc, current) => {
            const existingParticipant = acc.find(p => p.name === current.name);
            if (!existingParticipant) {
                acc.push(current);
            }
            return acc;
        }, []);
        
        // Sortiere nach Punkten
        const sortedParticipants = uniqueParticipants.sort((a, b) => b.points - a.points);
        
        console.log('Bereinigte Teilnehmer:', sortedParticipants);

        return {
            statusCode: 200,
            body: JSON.stringify(sortedParticipants)
        };
    } catch (error) {
        console.error('Fehler beim Abrufen der Teilnehmer:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Interner Serverfehler' })
        };
    }
}; 