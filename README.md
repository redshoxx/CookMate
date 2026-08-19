# CookMate

CookMate ist eine lokale Rezepte-, Wochenplan-, Einkaufslisten- und Vorrats-App für iPhone und Android. Die Oberfläche orientiert sich am freigegebenen Mockup.

## Funktionen

- Startseite mit heutiger Mahlzeit und Wochenvorschau
- Rezeptübersicht, Suche, Filter und Favoriten
- Rezeptdetail mit Portionsumrechnung
- Zutaten direkt zur Einkaufsliste
- Wochenplan und automatischer Wocheneinkauf
- Einkaufsliste mit Kategorien, Erledigen und Löschen
- Vorrat mit Mindestbestand
- Kochmodus mit Schritten und Timer
- Rezeptimport aus Schema.org/JSON-LD-Webseiten
- Rezeptfoto aus der Mediathek auswählen
- Persistente lokale Daten mit `expo-sqlite/kv-store`

## Lokal starten

```bash
npm install
npx expo install --fix
npx expo start
```

SDK 57 benötigt auf iOS einen passenden Development Build, falls Expo Go aus dem App Store noch nicht mit SDK 57 kompatibel ist.

## iPhone / Sideloadly

Im Repository liegt `.github/workflows/build-unsigned-ipa.yml`. Der Workflow baut auf einem macOS GitHub Runner eine **unsignierte IPA**. Diese IPA kann anschließend mit Sideloadly auf Windows mit der eigenen Apple-ID signiert und installiert werden.

1. Projekt in ein GitHub-Repository hochladen.
2. GitHub → Actions → `Build unsigned CookMate IPA` → `Run workflow`.
3. Artifact `CookMate-unsigned-ipa` herunterladen und ZIP entpacken.
4. `CookMate-unsigned.ipa` in Sideloadly auswählen.
5. iPhone per USB/WLAN verbinden, Apple-ID in Sideloadly eintragen und Start drücken.
6. Auf dem iPhone dem Entwicklerprofil vertrauen, falls iOS dies verlangt.

Bei einer kostenlosen Apple-ID gelten Apples zeitliche und funktionale Sideloading-Einschränkungen. Sideloadly übernimmt das Resigning; die App verwendet absichtlich keine Push-/iCloud-Entitlements.
