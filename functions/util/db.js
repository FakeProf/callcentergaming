const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Fehlende Umgebungsvariablen:', {
        url: supabaseUrl ? 'Vorhanden' : 'Fehlt',
        key: supabaseKey ? 'Vorhanden' : 'Fehlt'
    });
    throw new Error('SUPABASE_URL und SUPABASE_ANON_KEY müssen in den Umgebungsvariablen gesetzt sein');
}

const supabase = createClient(supabaseUrl, supabaseKey);

function getDatabase() {
    return supabase;
}

module.exports = { getDatabase }; 