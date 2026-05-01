# Risorse native (icone & splash)

Questa cartella contiene le sorgenti per generare automaticamente le icone e le splash screen native di iOS/Android usando `@capacitor/assets`.

## File richiesti

- `icon.png` — 1024×1024, sfondo opaco (cream `#f5f0e6`). Già presente.
- `splash.png` — opzionale, 2732×2732, soggetto centrato.

## Generare le risorse native

Dopo aver clonato il progetto in locale e aver aggiunto le piattaforme native:

```bash
npm install
npm install -D @capacitor/assets
npx cap add ios       # se non già fatto
npx capacitor-assets generate --ios
npx cap sync ios
```

Questo riempie automaticamente `ios/App/App/Assets.xcassets/AppIcon.appiconset/` con tutte le dimensioni (20pt, 29pt, 40pt, 60pt, 76pt, 83.5pt, 1024pt @1x/@2x/@3x).

## Set pre-generato

In alternativa, le icone iOS sono già pre-generate in `ios-icons/AppIcon.appiconset/`. Dopo `npx cap add ios`, copia il contenuto:

```bash
cp -R ios-icons/AppIcon.appiconset/* ios/App/App/Assets.xcassets/AppIcon.appiconset/
npx cap sync ios
```
