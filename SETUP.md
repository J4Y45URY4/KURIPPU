# Kurippu v2 — Setup Guide

## Quick Start (3 steps)

### 1. Copy these files into your project

Overwrite your existing files with:
- `src/App.jsx` — Complete single-file app (all 11 features)
- `src/api.js` — Gemini 1.5 Flash OCR engine
- `src/main.jsx` — Correct React mount point
- `src/index.css` — Elder-friendly global styles
- `index.html` — Root HTML
- `vite.config.js` — Vite configuration
- `package.json` — Dependencies

### 2. Set your API key

Create a `.env` file in the project root:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

Get a free key at: https://aistudio.google.com/apikey

### 3. Install & run

```bash
npm install
npm run dev
```

Open http://localhost:5173

---

## Architecture

```
App.jsx (single file)
  ├── STATE MACHINE: screen ∈ { home | loading | conflict | results | medlog | history | profile | error }
  ├── GLOBAL STATE: lang, profile (currentMedications + allergies), history, scanResult
  ├── SCREENS (all inline, no broken imports):
  │   ├── HomeScreen      — Scan button + daily log shortcut + safety summary
  │   ├── LoadingScreen   — 4-step animated progress
  │   ├── ConflictScreen  — FULL SCREEN RED OVERLAY with emergency call
  │   ├── ResultsScreen   — Medicines + Malayalam translations + safety badge
  │   ├── MedLogScreen    — TAKEN/കഴിച്ചു checklist with timestamps
  │   ├── HistoryScreen   — localStorage-persisted scan history
  │   ├── ProfileScreen   — Edit meds/allergies + save to localStorage
  │   └── ErrorScreen     — Graceful error with retry
  ├── STORAGE: all localStorage reads/writes in storage helpers
  ├── AUDIO: Web Audio API chime (playChime) on dose taken + hourly reminders
  └── NAVIGATION: sticky header + bottom nav tabs + persistent SOS button

api.js
  └── analyzePrescription(base64, mimeType, profile)
      → Gemini 1.5 Flash multimodal OCR
      → Returns structured JSON: medicines[], conflicts[], allergyAlert
      → Key loaded from VITE_GEMINI_API_KEY only (never UI-exposed)
```

## Features Checklist

| # | Feature | Implementation |
|---|---------|---------------|
| 1 | Gemini OCR | `api.js` → `analyzePrescription()` |
| 2 | Zero-config API key | `import.meta.env.VITE_GEMINI_API_KEY` |
| 3 | Bilingual EN/ML | `T` object + `lang` state, entire UI switches |
| 4 | Safety Buffer | `DEFAULT_PROFILE` with Warfarin + Penicillin allergy |
| 5 | Conflict/Allergy Alert | Full-screen red `ConflictScreen` with Emergency Call |
| 6 | Daily Med-Log | `MedLogScreen` with TAKEN/കഴിച്ചു + timestamp |
| 7 | Smart Reminders | `playChime()` Web Audio + interval check at 8/13/20h |
| 8 | localStorage | `storage` helpers persist all scans and dose logs |
| 9 | SOS Button | Persistent `<a href="tel:108">` in nav footer |
| 10 | Navigation | Home/Doses/History/Profile tabs + screen routing |
| 11 | Elder Design | 22px+ fonts, Trust Blue #1e40af, Safety Red #b91c1c |
