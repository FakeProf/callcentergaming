import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jfimhmaasapqfsjthglq.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export const getDatabase = () => {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Supabase URL und Key müssen in den Umgebungsvariablen konfiguriert sein')
    }
    return supabase
} 