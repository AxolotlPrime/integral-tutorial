# Integrale Meistern - Interaktive Lernplattform

Ein interaktives Web-Tutorial zur Integralrechnung mit Übungsaufgaben, Visualisierungen und Schritt-für-Schritt-Lösungen.

## 🎯 Was ist das?

Dies ist eine vollständige Lernplattform für Integralrechnung, die entwickelt wurde, um Schülern und Studenten zu helfen, Integrale wirklich zu verstehen - nicht nur auswendig zu lernen. Das Tutorial führt dich von den Grundkonzepten über die wichtigsten Regeln bis hin zu praktischen Anwendungen in der Biologie.

### Features

- **7 interaktive Kapitel** von Grundlagen bis zu Anwendungen
- **Interaktive Visualisierungen** mit Riemann-Summen
- **Übungsaufgaben** zu jeder Integrationsregel
- **Intelligente Hinweise** die nach 2 Fehlversuchen automatisch erscheinen
- **Eingabe-Historie** zeigt deine letzten 3 Versuche
- **Schritt-für-Schritt-Lösungen** für jede Aufgabe
- **Responsives Design** funktioniert auf Desktop, Tablet und Smartphone

## 🚀 Schnellstart

### Voraussetzungen

Du brauchst Node.js auf deinem Computer. Wenn du es noch nicht installiert hast:

1. Gehe zu [nodejs.org](https://nodejs.org/)
2. Lade die LTS-Version herunter (empfohlen)
3. Installiere Node.js mit den Standard-Einstellungen

Um zu prüfen, ob Node.js installiert ist, öffne ein Terminal und tippe:

```bash
node --version
npm --version
```

Wenn du Versionsnummern siehst (z.B. v18.17.0), ist alles bereit!

### Installation

1. **Navigiere zum Projektordner**

   Öffne ein Terminal und gehe in den Ordner, wo du das Projekt gespeichert hast:

   ```bash
   cd pfad/zum/integral-tutorial
   ```

2. **Installiere die Abhängigkeiten**

   Dieser Befehl lädt automatisch alle benötigten Bibliotheken herunter (React, Recharts, Lucide Icons, etc.):

   ```bash
   npm install
   ```

   Das kann beim ersten Mal 1-2 Minuten dauern. Du siehst einen Fortschrittsbalken.

3. **Starte den Entwicklungsserver**

   Dieser Befehl startet einen lokalen Webserver und öffnet dein Tutorial im Browser:

   ```bash
   npm run dev
   ```

   Du solltest eine Meldung sehen wie:
   ```
   VITE v5.0.8  ready in 523 ms

   ➜  Local:   http://localhost:5173/
   ```

4. **Öffne deinen Browser**

   Gehe zu `http://localhost:5173/` (oder die URL, die im Terminal angezeigt wird).

   Jetzt siehst du dein Tutorial live! Änderungen, die du am Code machst, werden automatisch im Browser aktualisiert.

## 🛠️ Entwicklung

### Projektstruktur

```
integral-tutorial/
├── src/
│   ├── App.jsx          # Das Haupttutorial (hier machst du Änderungen)
│   ├── main.jsx         # React-Einstiegspunkt
│   └── index.css        # Globale Basis-Styles
├── index.html           # HTML-Grundgerüst
├── package.json         # Projekt-Konfiguration und Abhängigkeiten
├── vite.config.js       # Vite-Build-Konfiguration
└── README.md           # Diese Datei
```

### Wie du das Tutorial erweiterst

Die gesamte Logik und das Design sind in `src/App.jsx`. Hier einige Beispiele, was du ändern kannst:

**Neue Übungsaufgaben hinzufügen:**

Öffne `src/App.jsx` und finde das `exercises`-Objekt (ca. Zeile 8). Dort sind alle Aufgaben nach Regeln organisiert. Füge einfach ein neues Objekt im gleichen Format hinzu:

```javascript
{
  id: 'potenz4',
  difficulty: 'Schwer',
  question: '∫ (x⁴ + 2x³) dx',
  solution: 'x⁵/5 + x⁴/2 + C',
  alternatives: ['(x^5)/5 + (x^4)/2 + C'],
  steps: [
    'Integriere jeden Term einzeln',
    'Term 1: ∫ x⁴ dx = x⁵/5',
    'Term 2: ∫ 2x³ dx = 2·x⁴/4 = x⁴/2',
    'Zusammen: x⁵/5 + x⁴/2 + C'
  ],
  hint: 'Wende die Potenzregel auf beide Terme an!'
}
```

**Neue Kapitel hinzufügen:**

Finde das `slides`-Array (ca. Zeile 400). Jedes Slide ist ein Objekt mit `title`, `subtitle` und `content`. Kopiere ein bestehendes Slide und passe es an deine Bedürfnisse an.

**Farben ändern:**

Alle Farben sind im `<style>`-Tag definiert (ca. Zeile 900). Suche nach Hex-Codes wie `#ff6b35` (orange) oder `#4ecdc4` (türkis) und ersetze sie durch deine gewünschten Farben.

## 📦 Build für Produktion

Wenn du bereit bist, dein Tutorial online zu stellen:

1. **Erstelle den Production Build:**

   ```bash
   npm run build
   ```

   Dieser Befehl optimiert deine Anwendung für maximale Performance. Das Ergebnis findest du im `dist/`-Ordner.

2. **Teste den Build lokal:**

   ```bash
   npm run preview
   ```

   Dies zeigt dir, wie deine Seite in Produktion aussehen wird.

## 🌐 Veröffentlichung

### Option 1: Vercel (Empfohlen - Am einfachsten)

Vercel ist perfekt für React-Projekte und komplett kostenlos für persönliche Projekte.

1. Erstelle einen Account auf [vercel.com](https://vercel.com)
2. Lade dein Projekt auf GitHub hoch
3. Klicke auf "New Project" in Vercel
4. Wähle dein GitHub Repository aus
5. Vercel erkennt automatisch, dass es sich um ein Vite-Projekt handelt
6. Klicke auf "Deploy"

Fertig! Du bekommst eine URL wie `https://integral-tutorial.vercel.app`

### Option 2: Netlify

Ähnlich wie Vercel, ebenfalls sehr einfach:

1. Erstelle einen Account auf [netlify.com](https://netlify.com)
2. Ziehe den `dist/`-Ordner (nach `npm run build`) einfach auf die Netlify-Webseite
3. Oder verbinde dein GitHub Repository für automatische Deployments

### Option 3: GitHub Pages

Kostenlos, aber etwas technischer:

1. Installiere das GitHub Pages Plugin:
   ```bash
   npm install --save-dev gh-pages
   ```

2. Füge in `package.json` diese Zeilen hinzu:
   ```json
   "homepage": "https://dein-username.github.io/integral-tutorial",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

3. Deploye mit:
   ```bash
   npm run deploy
   ```

## 💡 Tipps für Erweiterungen

Hier sind einige Ideen, wie du das Tutorial weiter ausbauen kannst:

### Neue Integrationstechniken

- **Substitution:** Zeige, wie man komplizierte Integrale durch Variablensubstitution vereinfacht
- **Partielle Integration:** Erkläre die Produktregel rückwärts
- **Partialbruchzerlegung:** Für rationale Funktionen

### Gamification

- **Punktesystem:** Vergib Punkte für richtige Antworten
- **Achievements:** Badges für besondere Leistungen (z.B. "Alle Potenzregel-Aufgaben gelöst!")
- **Leaderboard:** Zeige die besten Scores (mit localStorage)

### Fortgeschrittene Features

- **Benutzerkonten:** Mit Firebase oder Supabase kannst du Fortschritt speichern
- **Zufallsgenerator:** Generiere automatisch neue Aufgaben mit verschiedenen Zahlen
- **Diagramm-Editor:** Lass Benutzer eigene Funktionen eingeben und visualisieren
- **PDF-Export:** Erlaube das Herunterladen von Übungsblättern

### Spezialisierung für Biologie

Da du Biologie studierst, könntest du spezialisierte Kapitel hinzufügen:

- Wachstumsmodelle (exponentielle, logistische)
- Enzymkinetik und Reaktionsgeschwindigkeiten
- Populationsdynamik und Räuber-Beute-Modelle
- Pharmakokinetik (Medikamentenkonzentration über Zeit)

## 🐛 Häufige Probleme

### "npm: command not found"

Node.js ist nicht installiert oder nicht im PATH. Installiere Node.js von nodejs.org neu.

### Port 5173 ist bereits belegt

Ein anderes Programm verwendet den Port. Stoppe andere Entwicklungsserver oder ändere den Port in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

### Änderungen werden nicht angezeigt

Stoppe den Server (Ctrl+C) und starte neu mit `npm run dev`. Wenn das nicht hilft:

```bash
rm -rf node_modules
npm install
npm run dev
```

### Build-Fehler

Prüfe, ob alle Imports korrekt sind und ob du alle Abhängigkeiten installiert hast:

```bash
npm install
```

## 📚 Weiterführende Ressourcen

- **React Dokumentation:** [react.dev](https://react.dev)
- **Vite Dokumentation:** [vitejs.dev](https://vitejs.dev)
- **Recharts (für Diagramme):** [recharts.org](https://recharts.org)
- **Lucide Icons:** [lucide.dev](https://lucide.dev)

## 🤝 Beitragen

Das ist dein Projekt! Du kannst es nach Belieben erweitern, anpassen und verbessern. Wenn du es öffentlich auf GitHub stellst, können auch andere davon lernen oder sogar beitragen.

## 📄 Lizenz

Dieses Projekt ist frei verfügbar. Du kannst es verwenden, ändern und weitergeben, wie du möchtest.

## 🎓 Über das Projekt

Entwickelt als interaktives Lern-Tool für Mathematik-Nachhilfe mit Fokus auf Integralrechnung. Speziell gestaltet für Schüler und Studenten, die mehr als nur Formeln auswendig lernen wollen - sie sollen Integrale wirklich verstehen.

---

Viel Erfolg beim Lernen und Lehren! 🚀📊✨
