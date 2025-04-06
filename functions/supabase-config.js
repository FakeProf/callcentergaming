const { createClient } = require('@supabase/supabase-js');

function createSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('Fehlende Supabase-Konfiguration:', {
            url: supabaseUrl ? 'vorhanden' : 'fehlt',
            key: supabaseKey ? 'vorhanden' : 'fehlt'
        });
        throw new Error('Supabase-Konfiguration unvollständig');
    }

    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key vorhanden:', !!supabaseKey);

    return createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        },
        global: {
            headers: {
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Content-Type': 'application/json'
            }
        },
        db: {
            schema: 'public'
        }
    });
}

module.exports = { createSupabaseClient }; 