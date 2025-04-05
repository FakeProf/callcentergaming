const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

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

// Initialisiere die registrations.json, falls sie nicht existiert
fs.access(REGISTRATIONS_FILE)
    .catch(() => saveRegistrations({}))
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server läuft auf Port ${PORT}`);
        });
    }); 