const { createClient } = require('@supabase/supabase-js');

function createSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase Umgebungsvariablen fehlen');
    }

    console.log('Supabase URL:', supabaseUrl);
    console.log('Supabase Key vorhanden:', !!supabaseKey);

    const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        },
        db: {
            schema: 'public'
        },
        global: {
            headers: {
                'x-application-name': 'callcenter-tournament',
                'apikey': supabaseKey
            }
        }
    });

    return supabase;
}

module.exports = {
    createSupabaseClient
}; 