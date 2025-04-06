const teilnehmerListe = [
    {
        name: "Albaner",
        spiele: ["Counter Strike 2", "Rocket League", "Rainbow Six Siege", "Combat Master", "Krunker", "RedMatch 2", "Valorant"],
        punkte: 0
    },
    {
        name: "JJ",
        spiele: ["Counter Strike 2", "Brawlhalla", "Clash Royal", "Stick Fight", "Just Act Natural", "Golf It", "Valorant"],
        punkte: 0
    },
    {
        name: "Julian",
        spiele: ["Counter Strike 2", "Rainbow Six Siege", "Rocket League", "Bean Battles", "Golf It", "Combat Master", "Valorant"],
        punkte: 0
    },
    {
        name: "Juelsk",
        spiele: ["Counter Strike 2", "Rocket League", "Brawlhalla", "RedMatch 2", "Krunker", "Just Act Natural", "Valorant"],
        punkte: 0
    },
    {
        name: "MalaAri",
        spiele: ["Counter Strike 2", "Rainbow Six Siege", "Clash Royal", "Stick Fight", "Bean Battles", "Golf It", "Valorant"],
        punkte: 0
    },
    {
        name: "mu7asa4",
        spiele: ["Counter Strike 2", "Combat Master", "Krunker", "RedMatch 2", "Brawlhalla", "Rocket League", "Valorant"],
        punkte: 0
    },
    {
        name: "The Fog182",
        spiele: ["Counter Strike 2", "Rainbow Six Siege", "Clash Royal", "Just Act Natural", "Golf It", "Stick Fight", "Valorant"],
        punkte: 0
    },
    {
        name: "Yassumx",
        spiele: ["Counter Strike 2", "Rocket League", "Combat Master", "Brawlhalla", "Bean Battles", "RedMatch 2", "Valorant"],
        punkte: 0
    }
];

const turnierSpielplan = {
    woche1: {
        name: "FPS-Woche",
        spiele: [
            {
                tag: "Montag",
                datum: "07.04.2025",
                spiel: "Counter Strike 2",
                uhrzeit: "19:00 - 19:45",
                status: "ausstehend"
            },
            {
                tag: "Dienstag",
                datum: "08.04.2025",
                spiel: "Combat Master",
                uhrzeit: "19:00 - 19:30",
                status: "ausstehend"
            },
            {
                tag: "Mittwoch",
                datum: "09.04.2025",
                spiel: "Valorant",
                uhrzeit: "19:00 - 19:45",
                status: "ausstehend"
            },
            {
                tag: "Donnerstag",
                datum: "10.04.2025",
                spiel: "RedMatch 2",
                uhrzeit: "19:00 - 19:25",
                status: "ausstehend"
            }
        ]
    },
    woche2: {
        name: "Party-Spiele Woche",
        spiele: [
            {
                tag: "Montag",
                datum: "14.04.2025",
                spiel: "Stick Fight",
                uhrzeit: "19:00 - 19:20",
                status: "ausstehend"
            },
            {
                tag: "Dienstag",
                datum: "15.04.2025",
                spiel: "Just Act Natural",
                uhrzeit: "19:00 - 19:25",
                status: "ausstehend"
            },
            {
                tag: "Mittwoch",
                datum: "16.04.2025",
                spiel: "Bean Battles",
                uhrzeit: "19:00 - 19:20",
                status: "ausstehend"
            },
            {
                tag: "Donnerstag",
                datum: "17.04.2025",
                spiel: "Golf It",
                uhrzeit: "19:00 - 19:30",
                status: "ausstehend"
            }
        ]
    },
    woche3: {
        name: "Competitive Woche",
        spiele: [
            {
                tag: "Montag",
                datum: "21.04.2025",
                spiel: "Rocket League",
                uhrzeit: "19:00 - 19:25",
                status: "ausstehend"
            },
            {
                tag: "Dienstag",
                datum: "22.04.2025",
                spiel: "Clash Royal",
                uhrzeit: "19:00 - 19:20",
                status: "ausstehend"
            },
            {
                tag: "Mittwoch",
                datum: "23.04.2025",
                spiel: "Rainbow Six Siege",
                uhrzeit: "19:00 - 19:40",
                status: "ausstehend"
            },
            {
                tag: "Donnerstag",
                datum: "24.04.2025",
                spiel: "Brawlhalla",
                uhrzeit: "19:00 - 19:15",
                status: "ausstehend"
            }
        ]
    }
};

// Globale Variablen
let currentUser = null;
let gameDays = [];
let registrations = {};

// DOM-Elemente
const loginContainer = document.getElementById('login-container');
const tournamentContainer = document.getElementById('tournament-container');
const gameDaysContainer = document.getElementById('game-days-container');
const errorMessage = document.getElementById('error-message');
const participantSelect = document.getElementById('participantSelect');
const selectParticipantBtn = document.getElementById('selectParticipant');

// Teilnehmerliste
const participants = [
    { id: '1', name: 'Albaner' },
    { id: '2', name: 'JJ' },
    { id: '3', name: 'Julian' },
    { id: '4', name: 'Juelsk' },
    { id: '5', name: 'MalaAri' },
    { id: '6', name: 'mu7asa4' },
    { id: '7', name: 'The Fog182' },
    { id: '8', name: 'Yassumx' }
];

// Hilfsfunktionen
function showError(message) {
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    } else {
        console.error(message);
    }
}

function hideError() {
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    document.body.appendChild(successDiv);
    setTimeout(() => successDiv.remove(), 5000);
}

// Teilnehmerauswahl verarbeiten
function handleParticipantSelection() {
    const selectedId = participantSelect.value;
    if (!selectedId) {
        showError('Bitte wähle einen Teilnehmer aus');
        return;
    }

    const selectedParticipant = participants.find(p => p.id === selectedId);
    if (selectedParticipant) {
        currentUser = selectedParticipant;
        updateUI();
    }
}

// UI-Aktualisierung
function updateUI() {
    if (!loginContainer || !tournamentContainer) {
        console.error('Erforderliche Container nicht gefunden');
        return;
    }

    if (currentUser) {
        loginContainer.style.display = 'none';
        tournamentContainer.style.display = 'block';
    } else {
        loginContainer.style.display = 'block';
        tournamentContainer.style.display = 'none';
    }

    if (gameDaysContainer) {
        gameDaysContainer.innerHTML = '';
        if (!Array.isArray(gameDays) || gameDays.length === 0) {
            gameDaysContainer.innerHTML = '<p>Keine Spieltage verfügbar.</p>';
            return;
        }

        gameDays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'game-day';
            dayElement.innerHTML = `
                <h3>${day.description || formatDate(day.date)}</h3>
                <p>Datum: ${formatDate(day.date)}</p>
                <button onclick="toggleRegistration(${day.id})" class="register-button ${isRegistered(day.id) ? 'registered' : ''}">
                    ${isRegistered(day.id) ? 'Abmelden' : 'Anmelden'}
                    </button>
            `;
            gameDaysContainer.appendChild(dayElement);
        });
    }
}

// Datum formatieren
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('de-DE', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Registrierungsstatus prüfen
function isRegistered(gameDayId) {
    return registrations[gameDayId]?.includes(currentUser?.id) || false;
}

// Spieltage laden
async function loadGameDays() {
    try {
        const response = await fetch('/.netlify/functions/get-game-days');
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Fehler beim Laden der Spieltage');
        }
        const data = await response.json();
        if (!data || !Array.isArray(data)) {
            throw new Error('Ungültiges Datenformat für Spieltage');
        }
        gameDays = data;
        console.log('Geladene Spieltage:', gameDays);
        updateUI();
    } catch (error) {
        console.error('Fehler beim Laden der Spieltage:', error);
        showError('Fehler beim Laden der Spieltage: ' + error.message);
    }
}

// Registrierungen laden
async function loadRegistrations() {
    try {
        const response = await fetch('/.netlify/functions/get-registrations');
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Fehler beim Laden der Registrierungen');
        }
        registrations = await response.json();
        console.log('Geladene Registrierungen:', registrations);
        updateUI();
    } catch (error) {
        console.error('Fehler beim Laden der Registrierungen:', error);
        showError('Fehler beim Laden der Registrierungen: ' + error.message);
    }
}

// Registrierung umschalten
async function toggleRegistration(gameDayId) {
    if (!currentUser) {
        showError('Bitte melden Sie sich zuerst an');
        return;
    }

    try {
        console.log('Sende Anmeldung für Spieltag:', gameDayId, 'Teilnehmer:', currentUser.id);
        const requestBody = {
            gameDayId,
            participantId: currentUser.id
        };
        console.log('Request Body:', requestBody);

        const response = await fetch('/.netlify/functions/toggle-registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        console.log('Server Response Status:', response.status);
        const result = await response.json();
        console.log('Server Response:', result);

        if (!response.ok) {
            throw new Error(result.error || 'Fehler bei der Registrierung');
        }

        if (result.error) {
            throw new Error(result.error);
        }

        if (!result.registrations) {
            throw new Error('Keine Registrierungsdaten vom Server erhalten');
        }

        registrations[gameDayId] = result.registrations;
        updateUI();
        showSuccess(result.message);
    } catch (error) {
        console.error('Fehler bei der Registrierung:', error);
        showError(error.message || 'Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.');
    }
}

// Initialisierung
async function initialize() {
    try {
        // Teilnehmerliste in Select-Element laden
        participants.forEach(participant => {
            const option = document.createElement('option');
            option.value = participant.id;
            option.textContent = participant.name;
            participantSelect.appendChild(option);
        });

        // Event Listener für Teilnehmerauswahl
        selectParticipantBtn.addEventListener('click', handleParticipantSelection);

        await Promise.all([
            loadGameDays(),
            loadRegistrations()
        ]);
    } catch (error) {
        console.error('Initialisierungsfehler:', error);
        showError('Fehler bei der Initialisierung: ' + error.message);
    }
}

// Event-Listener
document.addEventListener('DOMContentLoaded', initialize);