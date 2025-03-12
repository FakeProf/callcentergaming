const teilnehmerListe = [
    {
        name: "Albaner",
        spiele: ["Counter Strike 2", "Rocket League", "Rainbow Six Siege", "Combat Master", "Krunker", "RedMatch 2"],
        punkte: 0
    },
    {
        name: "JJ",
        spiele: ["Counter Strike 2", "Brawlhalla", "Clash Royal", "Stick Fight", "Just Act Natural", "Golf It"],
        punkte: 0
    },
    {
        name: "Julian",
        spiele: ["Counter Strike 2", "Rainbow Six Siege", "Rocket League", "Bean Battles", "Golf It", "Combat Master"],
        punkte: 0
    },
    {
        name: "Juelsk",
        spiele: ["Counter Strike 2", "Rocket League", "Brawlhalla", "RedMatch 2", "Krunker", "Just Act Natural"],
        punkte: 0
    },
    {
        name: "MalaAri",
        spiele: ["Counter Strike 2", "Rainbow Six Siege", "Clash Royal", "Stick Fight", "Bean Battles", "Golf It"],
        punkte: 0
    },
    {
        name: "mu7asa4",
        spiele: ["Counter Strike 2", "Combat Master", "Krunker", "RedMatch 2", "Brawlhalla", "Rocket League"],
        punkte: 0
    },
    {
        name: "The Fog182",
        spiele: ["Counter Strike 2", "Rainbow Six Siege", "Clash Royal", "Just Act Natural", "Golf It", "Stick Fight"],
        punkte: 0
    },
    {
        name: "Yassumx",
        spiele: ["Counter Strike 2", "Rocket League", "Combat Master", "Brawlhalla", "Bean Battles", "RedMatch 2"],
        punkte: 0
    }
];

const turnierSpielplan = {
    woche1: {
        name: "FPS-Woche",
        spiele: [
            {
                tag: "Montag",
                datum: "01.04.2024",
                spiel: "Counter Strike 2",
                uhrzeit: "19:00 - 19:45",
                status: "ausstehend",
                ergebnisse: []
            },
            {
                tag: "Dienstag",
                datum: "02.04.2024",
                spiel: "Combat Master",
                uhrzeit: "19:00 - 19:30",
                status: "ausstehend",
                ergebnisse: []
            },
            {
                tag: "Mittwoch",
                datum: "03.04.2024",
                spiel: "Krunker",
                uhrzeit: "19:00 - 19:20",
                status: "ausstehend",
                ergebnisse: []
            },
            {
                tag: "Donnerstag",
                datum: "04.04.2024",
                spiel: "RedMatch 2",
                uhrzeit: "19:00 - 19:25",
                status: "ausstehend",
                ergebnisse: []
            }
        ]
    },
    woche2: {
        name: "Party-Spiele Woche",
        spiele: [
            {
                tag: "Montag",
                datum: "08.04.2024",
                spiel: "Stick Fight",
                uhrzeit: "19:00 - 19:20",
                status: "ausstehend",
                ergebnisse: []
            },
            {
                tag: "Dienstag",
                datum: "09.04.2024",
                spiel: "Just Act Natural",
                uhrzeit: "19:00 - 19:25",
                status: "ausstehend",
                ergebnisse: []
            },
            {
                tag: "Mittwoch",
                datum: "10.04.2024",
                spiel: "Bean Battles",
                uhrzeit: "19:00 - 19:20",
                status: "ausstehend",
                ergebnisse: []
            },
            {
                tag: "Donnerstag",
                datum: "11.04.2024",
                spiel: "Golf It",
                uhrzeit: "19:00 - 19:30",
                status: "ausstehend",
                ergebnisse: []
            }
        ]
    },
    woche3: {
        name: "Competitive Woche",
        spiele: [
            {
                tag: "Montag",
                datum: "15.04.2024",
                spiel: "Rocket League",
                uhrzeit: "19:00 - 19:25",
                status: "ausstehend",
                ergebnisse: []
            },
            {
                tag: "Dienstag",
                datum: "16.04.2024",
                spiel: "Clash Royal",
                uhrzeit: "19:00 - 19:20",
                status: "ausstehend",
                ergebnisse: []
            },
            {
                tag: "Mittwoch",
                datum: "17.04.2024",
                spiel: "Rainbow Six Siege",
                uhrzeit: "19:00 - 19:40",
                status: "ausstehend",
                ergebnisse: []
            },
            {
                tag: "Donnerstag",
                datum: "18.04.2024",
                spiel: "Brawlhalla",
                uhrzeit: "19:00 - 19:15",
                status: "ausstehend",
                ergebnisse: []
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
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginButton = document.querySelector('#login-form button');
    
    // Button-Status während Login
    loginButton.disabled = true;
    loginButton.textContent = 'Anmeldung läuft...';

    try {
        const result = await authService.login(username, password);
        
        if (result.success) {
            updateLoginStatus(true, result.user);
            schliesseLoginModal();
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        } else {
            showError(result.error);
        }
    } catch (error) {
        showError('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = 'Einloggen';
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
    } else {
        userInfo.textContent = '';
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
    }

    // Anmeldungssektion nach Login/Logout aktualisieren
    updateAnmeldungSection();
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

// Funktion zum Aktualisieren der Rangliste
function aktualisiereRangliste() {
    const ranglisteContainer = document.getElementById('rangliste-container');
    ranglisteContainer.innerHTML = '';

    // Sortiere Teilnehmer nach Punkten
    const sortierteTeilnehmer = [...teilnehmerListe]
        .sort((a, b) => b.punkte - a.punkte);

    sortierteTeilnehmer.forEach((teilnehmer, index) => {
        const ranglisteItem = document.createElement('div');
        ranglisteItem.className = 'rangliste-item';
        ranglisteItem.innerHTML = `
            <span>${index + 1}. ${teilnehmer.name}</span>
            <span>${teilnehmer.punkte} Punkte</span>
        `;
        ranglisteContainer.appendChild(ranglisteItem);
    });
}

// Funktion zum Anzeigen des Spielplans
function aktualisiereSpielplan() {
    const spielplanContainer = document.getElementById('spielplan');
    spielplanContainer.innerHTML = `
        <h2>Turnierplan</h2>
        <div class="spielplan-tabs">
            <button class="tab-button active" onclick="zeigeWoche('woche1')">Woche 1</button>
            <button class="tab-button" onclick="zeigeWoche('woche2')">Woche 2</button>
            <button class="tab-button" onclick="zeigeWoche('woche3')">Woche 3</button>
        </div>
        <div id="spielplan-content"></div>
    `;
    zeigeWoche('woche1');
}

function zeigeWoche(wochenId) {
    const woche = turnierSpielplan[wochenId];
    const content = document.getElementById('spielplan-content');
    
    // Tabs aktualisieren
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active');
    });
    event.target.classList.add('active');

    let html = `
        <div class="woche-container">
            <h3>${woche.name}</h3>
            <div class="spiele-grid">
    `;

    woche.spiele.forEach((spiel, index) => {
        html += `
            <div class="spiel-karte ${spiel.status}">
                <div class="spiel-header">
                    <h4>${spiel.tag}</h4>
                    <span class="datum">${spiel.datum}</span>
                </div>
                <div class="spiel-details">
                    <p class="spiel-name">${spiel.spiel}</p>
                    <p class="spiel-zeit">${spiel.uhrzeit}</p>
                    <p class="spiel-status">${spiel.status}</p>
                </div>
                <div class="teilnehmer-liste">
                    <p>Teilnehmende Spieler:</p>
                    ${getTeilnehmerFuerSpiel(spiel.spiel)}
                </div>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;
    
    content.innerHTML = html;
}

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

// Neue Funktion für die Anmeldungssektion
function updateAnmeldungSection() {
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

    let html = `
        <div class="spieltag-anmeldung">
            <div class="wochen-tabs">
                <button class="tab-button active" onclick="zeigeSpieltagAnmeldung('woche1')">Woche 1</button>
                <button class="tab-button" onclick="zeigeSpieltagAnmeldung('woche2')">Woche 2</button>
                <button class="tab-button" onclick="zeigeSpieltagAnmeldung('woche3')">Woche 3</button>
            </div>
            <div id="spieltag-container"></div>
        </div>
    `;

    anmeldungContainer.innerHTML = html;
    zeigeSpieltagAnmeldung('woche1');
}

function zeigeSpieltagAnmeldung(wochenId) {
    const spieltagContainer = document.getElementById('spieltag-container');
    const woche = turnierSpielplan[wochenId];
    const session = JSON.parse(localStorage.getItem('currentSession'));
    const anmeldungen = JSON.parse(localStorage.getItem('spieltagAnmeldungen')) || {};

    // Aktualisiere Tab-Buttons
    document.querySelectorAll('.wochen-tabs .tab-button').forEach(button => {
        button.classList.remove('active');
        if (button.textContent.toLowerCase().includes(wochenId)) {
            button.classList.add('active');
        }
    });

    let html = `
        <div class="woche-anmeldung">
            <h3>${woche.name}</h3>
            <div class="spieltage-grid">
    `;

    woche.spiele.forEach(spiel => {
        const istAngemeldet = anmeldungen[spiel.spiel] && 
                             anmeldungen[spiel.spiel].includes(session.username);
        
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
                    </div>
                <button onclick="toggleSpieltagAnmeldung('${spiel.spiel}')" 
                        class="anmeldung-button ${istAngemeldet ? 'angemeldet' : ''}">
                    ${istAngemeldet ? 'Abmelden' : 'Anmelden'}
                </button>
            </div>
        `;
    });

    html += `
            </div>
        </div>
    `;

    spieltagContainer.innerHTML = html;
}

function toggleSpieltagAnmeldung(spielName) {
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (!session || !session.isActive) {
        alert('Bitte melde dich zuerst an!');
        return;
    }

    let anmeldungen = JSON.parse(localStorage.getItem('spieltagAnmeldungen')) || {};
    if (!anmeldungen[spielName]) {
        anmeldungen[spielName] = [];
    }

    const index = anmeldungen[spielName].indexOf(session.username);
    if (index === -1) {
        // Anmelden
        if (anmeldungen[spielName].length >= 8) {
            alert('Dieser Spieltag ist bereits voll!');
            return;
        }
        anmeldungen[spielName].push(session.username);
    } else {
        // Abmelden
        anmeldungen[spielName].splice(index, 1);
    }

    localStorage.setItem('spieltagAnmeldungen', JSON.stringify(anmeldungen));
    zeigeSpieltagAnmeldung(getCurrentWoche());
}

function getCurrentWoche() {
    // Gibt die aktuell angezeigte Woche zurück
    const activeTab = document.querySelector('.wochen-tabs .tab-button.active');
    return activeTab ? activeTab.textContent.toLowerCase().replace(' ', '') : 'woche1';
}

// Event Listener für das Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    // Lade gespeicherte Daten
    const gespeicherteTeilnehmer = localStorage.getItem('teilnehmerListe');
    if (gespeicherteTeilnehmer) {
        teilnehmerListe.splice(0, teilnehmerListe.length, ...JSON.parse(gespeicherteTeilnehmer));
    }
    
    // Lade gespeicherten Spieler
    aktuellerSpieler = localStorage.getItem('aktuellerSpieler');
    
    // Initialisiere die Anzeige
    spielerAnmeldung();
    aktualisiereSpielplan();
    aktualisiereRangliste();

    // Event Listener für das Anmeldeformular
    document.getElementById('anmeldung-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Anmeldefunktion noch in Entwicklung');
    });

    // Navigation Event Listener
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sektionId = e.target.getAttribute('href').substring(1);
            zeigeSektion(sektionId);
            
            // Aktiven Link hervorheben
            document.querySelectorAll('nav a').forEach(a => 
                a.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Standardmäßig Spielplan anzeigen
    zeigeSektion('spielplan');

    // Login Form Handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Schließe Modal wenn außerhalb geklickt wird
    window.onclick = function(event) {
        const modal = document.getElementById('login-modal');
        if (event.target === modal) {
            schliesseLoginModal();
        }
    };

    // Prüfe bestehende Session
    const session = JSON.parse(localStorage.getItem('currentSession'));
    if (session && session.isActive) {
        updateLoginStatus(true, session.username);
    }

    // Anmeldungssektion aktualisieren wenn Login-Status sich ändert
    updateAnmeldungSection();
}); 
