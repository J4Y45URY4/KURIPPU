/**
 * data/storage.js
 * All localStorage read/write helpers + default patient profile.
 */

const KEYS = {
  PROFILE: "kurippu_profile",
  HISTORY: "kurippu_history",
  MED_LOG: "kurippu_med_log",
};

// ── Default patient profile ────────────────────────────────────
export const DEFAULT_PROFILE = {
  name: "Rajan Nair",
  age: 71,
  bloodGroup: "B+",
  emergencyContact: "9447000000",
  currentMedications: [
    { id: "m1", name: "Warfarin", dosage: "5mg", frequency: "Once daily", condition: "Atrial Fibrillation" },
    { id: "m2", name: "Metoprolol", dosage: "25mg", frequency: "Twice daily", condition: "Hypertension" },
  ],
  allergies: ["Penicillin", "Sulfa drugs"],
};

// ── Profile ────────────────────────────────────────────────────
export function loadProfile() {
  try {
    const raw = localStorage.getItem(KEYS.PROFILE);
    return raw ? JSON.parse(raw) : DEFAULT_PROFILE;
  } catch {
    return DEFAULT_PROFILE;
  }
}

export function saveProfile(profile) {
  localStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

// ── Prescription History ───────────────────────────────────────
export function loadHistory() {
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history) {
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(history));
}

export function addHistoryEntry(entry) {
  const history = loadHistory();
  const newEntry = { id: Date.now().toString(), date: new Date().toISOString(), ...entry };
  history.unshift(newEntry);
  saveHistory(history);
  return newEntry;
}

// ── Medication Log (daily checklist) ──────────────────────────
export function loadMedLog() {
  try {
    const raw = localStorage.getItem(KEYS.MED_LOG);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveMedLog(log) {
  localStorage.setItem(KEYS.MED_LOG, JSON.stringify(log));
}

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

export function markDoseTaken(medicineId, doseIndex) {
  const log = loadMedLog();
  const today = getTodayKey();
  if (!log[today]) log[today] = {};
  if (!log[today][medicineId]) log[today][medicineId] = {};
  log[today][medicineId][doseIndex] = { takenAt: new Date().toISOString() };
  saveMedLog(log);
  return log;
}

export function isDoseTaken(medicineId, doseIndex) {
  const log = loadMedLog();
  const today = getTodayKey();
  return !!(log?.[today]?.[medicineId]?.[doseIndex]);
}
