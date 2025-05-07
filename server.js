const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const { createSupabaseClient } = require('./functions/supabase-config');

// Setze Supabase-Umgebungsvariablen
process.env.SUPABASE_URL = 'https://jfimhmaasapqfsjthglq.supabase.co';
process.env.SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmY2RkY2RkY2RkY2RkY2RkY2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTk5OTk5OTksImV4cCI6MjAxNTU3NTk5OX0.YOUR_JWT_TOKEN';

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.'));

// Datei für die Speicherung der Anmeldungen
const REGISTRATIONS_FILE = 'registrations.json';

// Hilfsfunktion zum Lesen der Anmeldungen
async function readRegistrations() {
    try {
        const data = await fs.readFile(REGISTRATIONS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {};
    }
}

// Hilfsfunktion zum Speichern der Anmeldungen
async function saveRegistrations(registrations) {
    await fs.writeFile(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2));
}

// API-Endpunkt zum Abrufen aller Anmeldungen
app.get('/api/registrations', async (req, res) => {
    try {
        const registrations = await readRegistrations();
        res.json(registrations);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Anmeldungen' });
    }
});

// API-Endpunkt zum Anmelden/Abmelden für ein Spiel
app.post('/api/registrations/:game', async (req, res) => {
    try {
        const { game } = req.params;
        const { username, action } = req.body;

        const registrations = await readRegistrations();
        
        if (!registrations[game]) {
            registrations[game] = [];
        }

        if (action === 'register') {
            if (!registrations[game].includes(username)) {
                registrations[game].push(username);
            }
        } else if (action === 'unregister') {
            registrations[game] = registrations[game].filter(user => user !== username);
        }

        await saveRegistrations(registrations);
        res.json({ success: true, registrations: registrations[game] });
    } catch (error) {
        res.status(500).json({ error: 'Fehler bei der Anmeldung/Abmeldung' });
    }
});

// Funktion zur Überprüfung der Admin-Berechtigung
function isAdmin(userName) {
    return userName === 'Julian';
}

// Endpunkt zum Aktualisieren der Punkte eines Teilnehmers
app.post('/api/update-points', async (req, res) => {
    const { userName, participantName, points } = req.body;

    if (!isAdmin(userName)) {
        return res.status(403).json({ error: 'Keine Berechtigung für diese Aktion' });
    }

    try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
            .from('participants')
            .update({ points: points })
            .eq('name', participantName)
            .select();

        if (error) throw error;
        res.json({ success: true, data });
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Punkte:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// Endpunkt zum Abrufen aller Teilnehmer mit Punkten
app.get('/api/participants', async (req, res) => {
    try {
        const supabase = createSupabaseClient();
        const { data, error } = await supabase
            .from('participants')
            .select('*')
            .order('points', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error('Fehler beim Abrufen der Teilnehmer:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
});

// Initialisiere die registrations.json, falls sie nicht existiert
fs.access(REGISTRATIONS_FILE)
    .catch(() => saveRegistrations({}))
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server läuft auf Port ${PORT}`);
        });
    }); 