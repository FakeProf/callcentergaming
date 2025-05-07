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
let participants = []; // Neue Variable für Teilnehmer aus der Datenbank

// DOM-Elemente
const loginContainer = document.getElementById('login-container');
const tournamentContainer = document.getElementById('tournament-container');
const gameDaysContainer = document.getElementById('game-days-container');
const errorMessage = document.getElementById('error-message');
const participantSelect = document.getElementById('participantSelect');
const selectParticipantBtn = document.getElementById('selectParticipant');

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

    // Konvertiere die ID zu einer Nummer, da die IDs in der Datenbank numerisch sind
    const selectedParticipant = participants.find(p => p.id === parseInt(selectedId));
    if (selectedParticipant) {
        currentUser = selectedParticipant;
        updateUI();
        updateLeaderboard(); // Aktualisiere auch die Rangliste
    } else {
        showError('Teilnehmer nicht gefunden');
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
            
            // Berechne die Anzahl der Anmeldungen für diesen Spieltag
            const anmeldungen = registrations[day.id] || [];
            const anmeldeCount = anmeldungen.length;
            
            dayElement.innerHTML = `
                <h3>${day.description || formatDate(day.date)}</h3>
                <p>Datum: ${formatDate(day.date)}</p>
                <div class="registration-counter">
                    <span class="counter-label">Anmeldungen:</span>
                    <span class="counter-value">${anmeldeCount}</span>
                </div>
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
        // Lade Teilnehmer aus der Datenbank
        const response = await fetch('/.netlify/functions/get-participants');
        if (!response.ok) {
            throw new Error('Fehler beim Laden der Teilnehmer');
        }
        participants = await response.json();
        
        // Teilnehmerliste in Select-Element laden
        participantSelect.innerHTML = '<option value="">Bitte wähle deinen Namen</option>';
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

function updateGameDaysUI(gameDays, registrations) {
    const gameDaysContainer = document.getElementById('game-days-container');
    if (!gameDaysContainer) {
        console.error('Spieltage-Container nicht gefunden');
        return;
    }

    gameDaysContainer.innerHTML = '';
    
    gameDays.forEach(gameDay => {
        const gameDayElement = document.createElement('div');
        gameDayElement.className = 'game-day';
        
        // Berechne die Gesamtzahl der Anmeldungen für diesen Spieltag
        const totalRegistrations = registrations[gameDay.id] ? registrations[gameDay.id].length : 0;
        
        gameDayElement.innerHTML = `
            <h3>${formatDate(gameDay.date)}</h3>
            <p>${gameDay.description}</p>
            <div class="registration-info">
                <span class="registration-count">Anmeldungen: ${totalRegistrations}</span>
                <button class="toggle-registration" data-game-day-id="${gameDay.id}">
                    ${registrations[gameDay.id]?.includes(currentUser) ? 'Abmelden' : 'Anmelden'}
                </button>
            </div>
        `;
        
        gameDaysContainer.appendChild(gameDayElement);
    });
}

// Funktion zum Aktualisieren der Rangliste
async function updateLeaderboard() {
    try {
        const response = await fetch('/.netlify/functions/get-participants');
        if (!response.ok) {
            throw new Error('Fehler beim Laden der Teilnehmer');
        }
        const participants = await response.json();
        
        const ranglisteContainer = document.querySelector('.rangliste-container');
        if (!ranglisteContainer) return;

        ranglisteContainer.innerHTML = '';
        
        // Sortiere Teilnehmer nach Punkten
        const sortedParticipants = participants.sort((a, b) => b.points - a.points);
        
        sortedParticipants.forEach((participant, index) => {
            const ranglisteItem = document.createElement('div');
            ranglisteItem.className = 'rangliste-item';
            
            const platz = document.createElement('span');
            platz.className = `platz ${index < 3 ? `platz-${index + 1}` : ''}`;
            platz.textContent = `${index + 1}. ${participant.name}:`;
            
            const punkte = document.createElement('span');
            punkte.className = 'punkte';
            punkte.textContent = `${participant.points} Punkte`;
            
            // Füge Bearbeitungsfunktionen für Julian hinzu
            if (currentUser && currentUser.name === 'Julian') {
                const editButton = document.createElement('button');
                editButton.className = 'edit-points-button';
                editButton.textContent = 'Bearbeiten';
                editButton.onclick = () => editPoints(participant.name, participant.points);
                
                ranglisteItem.appendChild(platz);
                ranglisteItem.appendChild(punkte);
                ranglisteItem.appendChild(editButton);
            } else {
                ranglisteItem.appendChild(platz);
                ranglisteItem.appendChild(punkte);
            }
            
            ranglisteContainer.appendChild(ranglisteItem);
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Rangliste:', error);
        showError('Fehler beim Laden der Rangliste');
    }
}

// Funktion zum Bearbeiten der Punkte
async function editPoints(participantName, currentPoints) {
    if (!currentUser || currentUser.name !== 'Julian') return;
    
    const newPoints = prompt(`Neue Punktzahl für ${participantName}:`, currentPoints);
    if (newPoints === null) return;
    
    const points = parseInt(newPoints);
    if (isNaN(points) || points < 0) {
        showError('Bitte geben Sie eine gültige Punktzahl ein');
        return;
    }
    
    try {
        const response = await fetch('/.netlify/functions/update-points', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userName: currentUser.name,
                participantName,
                points
            })
        });
        
        if (!response.ok) {
            throw new Error('Fehler beim Aktualisieren der Punkte');
        }
        
        await updateLeaderboard();
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Punkte:', error);
        showError('Fehler beim Aktualisieren der Punkte');
    }
}

// Aktualisiere die Rangliste beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    updateLeaderboard();
});