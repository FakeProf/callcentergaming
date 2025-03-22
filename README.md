# Call-Center Gaming Championship 2025

Eine Webanwendung für die Verwaltung des Call-Center Gaming Championship Turniers 2025.

## Features

- Turnier-Spielplan mit drei Wochen
- Spieler-Anmeldung für verschiedene Spiele
- Rangliste mit Punktestand
- Mobile-freundliches Design
- Dark Mode Unterstützung
- Server-basierte Speicherung der Anmeldungen

## Installation

1. Stelle sicher, dass Node.js auf deinem System installiert ist
2. Klone das Repository
3. Installiere die Abhängigkeiten:
   ```bash
   npm install
   ```
4. Starte den Server:
   ```bash
   npm start
   ```
   oder für die Entwicklung mit automatischem Neuladen:
   ```bash
   npm run dev
   ```
5. Öffne die Anwendung im Browser unter `http://localhost:3000`

## Technologien

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express.js
- Datenspeicherung: JSON-Datei

## Systemanforderungen

- Node.js 14.x oder höher
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)
- Internetverbindung für die Server-Kommunikation

## Entwicklung

Die Anwendung verwendet einen Express.js-Server für die Verwaltung der Anmeldungen. Die Daten werden in einer JSON-Datei gespeichert. Das Frontend kommuniziert über eine REST-API mit dem Backend.

### API-Endpunkte

- `GET /api/registrations`: Abrufen aller Anmeldungen
- `POST /api/registrations/:game`: An-/Abmelden für ein Spiel

## Lizenz

Alle Rechte vorbehalten © 2025 Call-Center Gaming Championship 