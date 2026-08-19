# CookMate auf dem iPhone mit Sideloadly

## Was bereits vorbereitet ist

Das Projekt enthält einen GitHub-Actions-Workflow unter:

`.github/workflows/build-unsigned-ipa.yml`

Dieser Workflow baut auf einem macOS-Runner eine **unsignierte iPhone-IPA**. Sideloadly kann diese IPA anschließend mit deiner Apple-ID neu signieren und auf dein iPhone installieren.

## A. IPA über GitHub Actions erstellen

1. Das komplette CookMate-Projekt in ein GitHub-Repository hochladen.
2. Im Repository den Tab **Actions** öffnen.
3. Workflow **Build unsigned CookMate IPA** auswählen.
4. **Run workflow** starten.
5. Nach erfolgreichem Build den Artifact **CookMate-unsigned-ipa** laden.
6. ZIP entpacken. Darin liegt `CookMate-unsigned.ipa`.

## B. Mit Sideloadly installieren

1. Sideloadly öffnen.
2. iPhone per USB verbinden und diesem Computer am iPhone vertrauen.
3. `CookMate-unsigned.ipa` in Sideloadly auswählen.
4. Apple-ID in Sideloadly eintragen.
5. Installation starten.
6. Falls iOS danach einen Entwicklerhinweis zeigt, in den iPhone-Einstellungen das entsprechende Entwicklerprofil bzw. den Entwicklermodus freigeben.

## Kostenlose Apple-ID

Sideloadly unterstützt laut eigener Dokumentation kostenlose Apple-IDs. Solche Installationen sind typischerweise 7 Tage gültig und müssen danach erneut signiert/aktualisiert werden. Sideloadly bietet dafür auch Auto-Refresh-Funktionen.

## Wichtig

Die bereitgestellte ZIP-Datei enthält den kompletten Quellcode, aber **keine bereits kompilierte IPA**. Eine echte iPhone-IPA enthält nativen ARM64-Code und muss in einer macOS/Xcode-Umgebung kompiliert werden. Genau dafür ist der GitHub-Actions-Workflow enthalten.
