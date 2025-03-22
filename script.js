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

// Globale Variable für den aktuell eingeloggten Spieler
let aktuellerSpieler = null;

// Benutzerverwaltung
const initialUsers = {
    "Albaner": { password: "gaming2025", games: [] },
    "JJ": { password: "gaming2025", games: [] },
    "Julian": { password: "gaming2025", games: [] },
    "Juelsk": { password: "gaming2025", games: [] },
    "MalaAri": { password: "gaming2025", games: [] },
    "mu7asa4": { password: "gaming2025", games: [] },
    "The Fog182": { password: "gaming2025", games: [] },
    "Yassumx": { password: "gaming2025", games: [] }
};

// Login Modal Funktionen
function zeigeLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.error('Login Modal nicht gefunden');
    }
}

function schliesseLoginModal() {
    const modal = document.getElementById('login-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fehler-Handling Funktionen
function showError(message) {
    const errorDiv = document.getElementById('login-error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    // Fehler nach 5 Sekunden ausblenden
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Vorbereitung für Server-Integration
class AuthService {
    constructor() {
        // Später für Server-URL
        this.baseUrl = 'https://api.yourserver.com';
        
        // Temporär: Lokale Benutzerdaten
        this.users = {
            "Albaner": { password: "gaming2025", games: [] },
            "JJ": { password: "gaming2025", games: [] },
            "Julian": { password: "gaming2025", games: [] },
            "Juelsk": { password: "gaming2025", games: [] },
            "MalaAri": { password: "gaming2025", games: [] },
            "mu7asa4": { password: "gaming2025", games: [] },
            "The Fog182": { password: "gaming2025", games: [] },
            "Yassumx": { password: "gaming2025", games: [] }
        };
    }

    // Für spätere Server-Integration vorbereitet
    async login(username, password) {
        try {
            // Später: Server-Anfrage
            // const response = await fetch(`${this.baseUrl}/auth/login`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ username, password })
            // });
            
            // Temporär: Lokale Überprüfung
            const user = this.users[username];
            
            if (!user) {
                throw new Error('Benutzer nicht gefunden');
            }
            
            if (user.password !== password) {
                throw new Error('Falsches Passwort');
            }

            // Erfolgreicher Login
            const sessionData = {
                username: username,
                loginTime: new Date().toISOString(),
                isActive: true
            };

            localStorage.setItem('currentSession', JSON.stringify(sessionData));
            return { success: true, user: username };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Für spätere Server-Integration
    async logout() {
        try {
            // Später: Server-Anfrage
            // await fetch(`${this.baseUrl}/auth/logout`, {
            //     method: 'POST',
            //     headers: {
            //         'Authorization': `Bearer ${this.getToken()}`
            //     }
            // });

            localStorage.removeItem('currentSession');
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Instanz des Auth-Services
const authService = new AuthService();

// Login-Funktion aktualisieren
async function handleLogin(event) {
    event.preventDefault();
    if (window.netlifyIdentity) {
        window.netlifyIdentity.open('login');
    } else {
        console.error('Netlify Identity Widget nicht geladen');
    }
}

function handleLogout() {
    if (window.netlifyIdentity) {
        window.netlifyIdentity.open('logout');
    } else {
        console.error('Netlify Identity Widget nicht geladen');
    }
}

function updateLoginStatus(isLoggedIn, username = null) {
    const userInfo = document.getElementById('user-info');
    const loginButton = document.getElementById('login-button');
    const logoutButton = document.getElementById('logout-button');

    if (isLoggedIn && username) {
        userInfo.textContent = `Eingeloggt als: ${username}`;
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
        renderAnmeldungBereich();
    } else {
        userInfo.textContent = '';
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
        renderAnmeldungBereich();
    }
}

// Funktion zum Anzeigen und Verwalten der Spieleanmeldungen
function showUserGames(username) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users[username];
    const anmeldungSection = document.getElementById('anmeldung');

    let html = `
        <h2>Spieleverwaltung für ${username}</h2>
        <div class="games-management">
            <div class="games-grid">
    `;

    // Alle verfügbaren Spiele anzeigen
    Object.keys(turnierSpielplan).forEach(woche => {
        turnierSpielplan[woche].spiele.forEach(spiel => {
            const isRegistered = user.games.includes(spiel.spiel);
        html += `
                <div class="game-registration-card">
                    <h3>${spiel.spiel}</h3>
                    <p>Datum: ${spiel.datum}</p>
                    <p>Zeit: ${spiel.uhrzeit}</p>
                    <button 
                        onclick="toggleGameRegistration('${username}', '${spiel.spiel}')"
                        class="registration-button ${isRegistered ? 'registered' : ''}"
                    >
                        ${isRegistered ? 'Abmelden' : 'Anmelden'}
                    </button>
            </div>
        `;
        });
    });

    html += `
            </div>
        </div>
    `;
    
    anmeldungSection.innerHTML = html;
}

// Funktion zum An-/Abmelden für Spiele
function toggleGameRegistration(username, game) {
    const users = JSON.parse(localStorage.getItem('users'));
    const user = users[username];

    if (user.games.includes(game)) {
        user.games = user.games.filter(g => g !== game);
    } else {
        user.games.push(game);
    }

    users[username] = user;
    localStorage.setItem('users', JSON.stringify(users));
    showUserGames(username); // Aktualisiere die Anzeige
    aktualisiereSpielplan(); // Aktualisiere den Spielplan
}

// Vereinfachte Ranglisten-Funktionalität
const spielerListe = [
    "Albaner",
    "JJ",
    "Julian",
    "Juelsk",
    "MalaAri",
    "mu7asa4",
    "The Fog182",
    "Yassumx"
];

function initializeRangliste() {
    const ranglisteContainer = document.getElementById('rangliste-eintraege');
    if (!ranglisteContainer) {
        console.error('Rangliste-Container nicht gefunden');
        return;
    }

    let html = '';
    spielerListe.sort().forEach((spieler, index) => {
        html += `
            <div class="rangliste-zeile ${index < 3 ? 'top-' + (index + 1) : ''}">
                <div class="rang">${index + 1}</div>
                <div class="name">${spieler}</div>
                <div class="punkte">0</div>
        </div>
    `;
    });

    ranglisteContainer.innerHTML = html;
}

// Führe die Initialisierung sofort aus
document.addEventListener('DOMContentLoaded', initializeRangliste);
function getTeilnehmerFuerSpiel(spielName) {
    const verfügbareSpieler = teilnehmerListe.filter(t => 
        t.spiele.includes(spielName)
    );
    
    return verfügbareSpieler.map(spieler => 
        `<span class="teilnehmer-badge">${spieler.name}</span>`
    ).join('');
}

// Funktion zum Generieren der Spiele-Checkboxen im Anmeldeformular
function generiereSpielCheckboxen() {
    const checkboxContainer = document.getElementById('spiele-checkboxen');
    spieleListe.forEach(spiel => {
        const checkbox = document.createElement('div');
        checkbox.innerHTML = `
            <label>
                <input type="checkbox" name="spiele" value="${spiel.name}">
                ${spiel.name}
            </label>
        `;
        checkboxContainer.appendChild(checkbox);
    });
}

// Funktion zum Umschalten der Sichtbarkeit der Sektionen
function zeigeSektion(sektionId) {
    // Alle Sektionen ausblenden
    const sektionen = document.querySelectorAll('main > section');
    sektionen.forEach(sektion => {
        sektion.style.display = 'none';
    });

    // Gewählte Sektion einblenden
    document.getElementById(sektionId).style.display = 'block';
}

// Funktion für die Anmeldung
function spielerAnmeldung() {
    const anmeldungContainer = document.getElementById('anmeldung');
    anmeldungContainer.innerHTML = `
        <h2>Turnier-Anmeldung</h2>
        ${aktuellerSpieler ? spielerVerwaltungAnzeigen() : spielerAuswahlAnzeigen()}
    `;
}

function spielerAuswahlAnzeigen() {
    return `
        <div class="spieler-auswahl">
            <h3>Wähle deinen Namen</h3>
            <select id="spieler-select" class="spieler-dropdown">
                <option value="">Bitte wählen...</option>
                ${teilnehmerListe.map(spieler => 
                    `<option value="${spieler.name}">${spieler.name}</option>`
                ).join('')}
            </select>
            <button onclick="spielerEinloggen()" class="anmelde-button">Anmelden</button>
        </div>
    `;
}

function spielerVerwaltungAnzeigen() {
    const spieler = teilnehmerListe.find(s => s.name === aktuellerSpieler);
    return `
        <div class="spieler-verwaltung">
            <h3>Angemeldet als: ${aktuellerSpieler}</h3>
            <div class="spiele-grid">
                ${spieleListe.map(spiel => `
                    <div class="spiel-checkbox-container">
                        <label class="spiel-checkbox">
                            <input type="checkbox" 
                                   value="${spiel.name}" 
                                   ${spieler.spiele.includes(spiel.name) ? 'checked' : ''}
                                   onchange="spieleAktualisieren(this)">
                            <span class="checkbox-text">${spiel.name}</span>
                        </label>
                    </div>
                `).join('')}
            </div>
            <div class="button-container">
                <button onclick="spieleSpeichern()" class="save-button">Änderungen speichern</button>
                <button onclick="spielerAusloggen()" class="logout-button">Abmelden</button>
            </div>
        </div>
    `;
}

function spielerEinloggen() {
    const select = document.getElementById('spieler-select');
    if (select.value) {
        aktuellerSpieler = select.value;
        spielerAnmeldung();
        speicherAktuellenSpieler();
    } else {
        alert('Bitte wähle einen Spieler aus!');
    }
}

function spielerAusloggen() {
    aktuellerSpieler = null;
    localStorage.removeItem('aktuellerSpieler');
    spielerAnmeldung();
}

function spieleAktualisieren(checkbox) {
    const spieler = teilnehmerListe.find(s => s.name === aktuellerSpieler);
    if (checkbox.checked) {
        if (!spieler.spiele.includes(checkbox.value)) {
            spieler.spiele.push(checkbox.value);
        }
    } else {
        spieler.spiele = spieler.spiele.filter(spiel => spiel !== checkbox.value);
    }
}

function spieleSpeichern() {
    // Speichern in localStorage
    localStorage.setItem('teilnehmerListe', JSON.stringify(teilnehmerListe));
    alert('Deine Spielauswahl wurde gespeichert!');
    aktualisiereSpielplan(); // Aktualisiert den Spielplan mit den neuen Anmeldungen
}

function speicherAktuellenSpieler() {
    localStorage.setItem('aktuellerSpieler', aktuellerSpieler);
}

// Anmeldungsfunktionalität
document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
    updateAnmeldungSection();
    aktualisiereRangliste();
});

function renderAnmeldungBereich() {
    const anmeldungContainer = document.getElementById('anmeldung-container');
    const session = JSON.parse(localStorage.getItem('currentSession'));

    if (!session || !session.isActive) {
        anmeldungContainer.innerHTML = `
            <div class="anmeldung-info">
                <p>Bitte melde dich zuerst an, um dich für Spieltage registrieren zu können.</p>
            </div>
        `;
        return;
    }

    anmeldungContainer.innerHTML = `
        <div class="spieltag-anmeldung">
            <div class="wochen-tabs">
                <button class="tab-button active" data-woche="woche1">Woche 1: FPS-Woche</button>
                <button class="tab-button" data-woche="woche2">Woche 2: Party-Spiele</button>
                <button class="tab-button" data-woche="woche3">Woche 3: Competitive</button>
            </div>
            <div id="spieltag-container"></div>
        </div>
    `;

    // Event Listener für Tabs
    document.querySelectorAll('.tab-button').forEach(button => {
        button.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            renderSpieltagListe(e.target.dataset.woche);
        });
    });

    // Initial erste Woche anzeigen
    renderSpieltagListe('woche1');
}

async function renderSpieltagListe(wochenId) {
    const spieltagContainer = document.getElementById('spieltag-container');
    const woche = turnierSpielplan[wochenId];
    const session = JSON.parse(localStorage.getItem('currentSession'));

    try {
        const response = await fetch('http://localhost:3000/api/registrations');
        const anmeldungen = await response.json();

        let html = `
            <div class="woche-anmeldung">
                <h3>${woche.name}</h3>
                <div class="spieltage-grid">
        `;

        woche.spiele.forEach(spiel => {
            const istAngemeldet = anmeldungen[spiel.spiel] && 
                                 anmeldungen[spiel.spiel].includes(session?.username);
            
            html += `
                <div class="spieltag-karte ${istAngemeldet ? 'angemeldet' : ''}">
                    <div class="spieltag-header">
                        <h4>${spiel.spiel}</h4>
                        <span class="datum">${spiel.tag}, ${spiel.datum}</span>
                    </div>
                    <div class="spieltag-details">
                        <p>Uhrzeit: ${spiel.uhrzeit}</p>
                        <p>Status: ${spiel.status}</p>
                        <div class="teilnehmer-count">
                            Angemeldete Spieler: ${(anmeldungen[spiel.spiel] || []).length}/8
                        </div>
                        <div class="teilnehmer-liste">
                            <h5>Angemeldete Spieler:</h5>
                            ${(anmeldungen[spiel.spiel] || []).map(player => 
                                `<span class="teilnehmer-badge">${player}</span>`
                            ).join('')}
                        </div>
                    </div>
                    ${session?.isActive ? `
                        <button onclick="toggleAnmeldung('${spiel.spiel}')" 
                                class="anmeldung-button ${istAngemeldet ? 'angemeldet' : ''}">
                            ${istAngemeldet ? 'Abmelden' : 'Anmelden'}
                        </button>
                    ` : ''}
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `