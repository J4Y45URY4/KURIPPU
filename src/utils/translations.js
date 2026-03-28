/**
 * utils/translations.js
 * Complete bilingual UI string map for English and Malayalam.
 */

const T = {
  en: {
    // App
    appName: "Kurippu",
    appTagline: "Your prescription companion",

    // Navigation
    navHome: "Home",
    navLog: "My Doses",
    navHistory: "History",
    navProfile: "Profile",

    // Home Screen
    greeting: "Good",
    greetingMorning: "Morning",
    greetingAfternoon: "Afternoon",
    greetingEvening: "Evening",
    scanNew: "Scan New Prescription",
    scanNewSub: "Take a photo of your doctor's prescription",
    viewExisting: "View Today's Medicines",
    viewExistingSub: "Check your current medication schedule",
    currentMeds: "Current Medicines",
    allergies: "Known Allergies",
    emergency: "EMERGENCY",
    emergencySub: "Call 108 – Doctor",

    // Scan / Loading
    analyzingTitle: "Reading Prescription…",
    step1: "Reading the image",
    step2: "Identifying medicines",
    step3: "Checking interactions",
    step4: "Translating to Malayalam",

    // Results
    resultsTitle: "Prescription Results",
    verified: "Verified",
    unverified: "Unverified – Ask Pharmacist",
    noConflict: "No drug interactions found",
    noAllergyAlert: "No allergy concerns found",
    scanAnother: "Scan Another Prescription",
    saveToHistory: "Saved to History ✓",

    // Conflict Screen
    conflictTitle: "⚠ Drug Interaction Warning",
    conflictAdvice: "Do NOT take these medicines together without consulting your doctor first.",
    conflictCallDoctor: "Call Your Doctor Now",
    severityHigh: "HIGH RISK",
    severityMedium: "MEDIUM RISK",
    severityLow: "LOW RISK",
    allergyTitle: "⚠ Allergy Alert",

    // Med Log
    logTitle: "Today's Medicines",
    logDate: "Today",
    taken: "TAKEN ✓",
    takenMl: "കഴിച്ചു ✓",
    notTaken: "Mark as Taken",
    allDoneTitle: "All done for today!",
    allDoneSub: "You've taken all your medicines. Great job!",

    // History
    historyTitle: "Prescription History",
    historyEmpty: "No prescriptions scanned yet.",
    historyEmptySub: "Scan your first prescription to see it here.",
    medicines: "medicines",
    conflictFound: "Conflict Detected",

    // Profile
    profileTitle: "My Health Profile",
    profileName: "Name",
    profileAge: "Age",
    profileBlood: "Blood Group",
    profileEmergency: "Emergency Contact",
    profileMeds: "Current Medications",
    profileAllergies: "Known Allergies",
    addMed: "+ Add Medicine",
    addAllergy: "+ Add Allergy",
    save: "Save Profile",
    saved: "Profile Saved ✓",

    // Misc
    doctor: "Doctor",
    hospital: "Hospital",
    frequency: "Frequency",
    timing: "Timing",
    dosage: "Dosage",
    duration: "Duration",
    days: "days",
    tryAgain: "Try Again",
    back: "← Back",
    close: "Close",
  },

  ml: {
    // App
    appName: "കുറിപ്പ്",
    appTagline: "നിങ്ങളുടെ കുറിപ്പടി സഹായി",

    // Navigation
    navHome: "ഹോം",
    navLog: "ഡോസ് ലോഗ്",
    navHistory: "ചരിത്രം",
    navProfile: "പ്രൊഫൈൽ",

    // Home Screen
    greeting: "സുപ്രഭാതം",
    greetingMorning: "രാവിലെ",
    greetingAfternoon: "ഉച്ചക്ക്",
    greetingEvening: "വൈകുന്നേരം",
    scanNew: "കുറിപ്പടി സ്കാൻ ചെയ്യുക",
    scanNewSub: "ഡോക്ടറുടെ കുറിപ്പടിയുടെ ഫോട്ടോ എടുക്കുക",
    viewExisting: "ഇന്നത്തെ മരുന്നുകൾ",
    viewExistingSub: "നിലവിലെ മരുന്ന് ഷെഡ്യൂൾ കാണുക",
    currentMeds: "നിലവിലെ മരുന്നുകൾ",
    allergies: "അറിയപ്പെടുന്ന അലർജികൾ",
    emergency: "അടിയന്തിരം",
    emergencySub: "108 വിളിക്കുക – ഡോക്ടർ",

    // Scan / Loading
    analyzingTitle: "കുറിപ്പടി വായിക്കുന്നു…",
    step1: "ചിത്രം വിശകലനം ചെയ്യുന്നു",
    step2: "മരുന്നുകൾ തിരിച്ചറിയുന്നു",
    step3: "ഇടപെടലുകൾ പരിശോധിക്കുന്നു",
    step4: "മലയാളത്തിലേക്ക് മാറ്റുന്നു",

    // Results
    resultsTitle: "കുറിപ്പടി ഫലങ്ങൾ",
    verified: "സ്ഥിരീകരിച്ചു",
    unverified: "ഫാർമസിസ്റ്റിനോട് ചോദിക്കുക",
    noConflict: "മരുന്ന് ഇടപെടലുകൾ ഒന്നും കണ്ടെത്തിയില്ല",
    noAllergyAlert: "അലർജി പ്രശ്നങ്ങൾ കണ്ടെത്തിയില്ല",
    scanAnother: "മറ്റൊരു കുറിപ്പടി സ്കാൻ ചെയ്യുക",
    saveToHistory: "ചരിത്രത്തിൽ സേവ് ചെയ്തു ✓",

    // Conflict
    conflictTitle: "⚠ മരുന്ന് ഇടപെടൽ മുന്നറിയിപ്പ്",
    conflictAdvice: "ഡോക്ടറോട് ചോദിക്കാതെ ഈ മരുന്നുകൾ ഒരുമിച്ച് കഴിക്കരുത്.",
    conflictCallDoctor: "ഇപ്പോൾ ഡോക്ടറെ വിളിക്കുക",
    severityHigh: "ഉയർന്ന അപകടം",
    severityMedium: "ഇടത്തരം അപകടം",
    severityLow: "കുറഞ്ഞ അപകടം",
    allergyTitle: "⚠ അലർജി മുന്നറിയിപ്പ്",

    // Med Log
    logTitle: "ഇന്നത്തെ മരുന്നുകൾ",
    logDate: "ഇന്ന്",
    taken: "കഴിച്ചു ✓",
    takenMl: "കഴിച്ചു ✓",
    notTaken: "കഴിച്ചതായി അടയാളപ്പെടുത്തുക",
    allDoneTitle: "ഇന്ന് എല്ലാം കഴിച്ചു!",
    allDoneSub: "നിങ്ങൾ എല്ലാ മരുന്നുകളും കഴിച്ചു. നന്നായി!",

    // History
    historyTitle: "കുറിപ്പടി ചരിത്രം",
    historyEmpty: "ഇതുവരെ കുറിപ്പടികൾ സ്കാൻ ചെയ്തിട്ടില്ല.",
    historyEmptySub: "ആദ്യ കുറിപ്പടി സ്കാൻ ചെയ്യുക.",
    medicines: "മരുന്നുകൾ",
    conflictFound: "ഇടപെടൽ കണ്ടെത്തി",

    // Profile
    profileTitle: "എന്റെ ആരോഗ്യ പ്രൊഫൈൽ",
    profileName: "പേര്",
    profileAge: "പ്രായം",
    profileBlood: "രക്ത ഗ്രൂപ്പ്",
    profileEmergency: "അടിയന്തര ബന്ധം",
    profileMeds: "നിലവിലെ മരുന്നുകൾ",
    profileAllergies: "അറിയപ്പെടുന്ന അലർജികൾ",
    addMed: "+ മരുന്ന് ചേർക്കുക",
    addAllergy: "+ അലർജി ചേർക്കുക",
    save: "പ്രൊഫൈൽ സേവ് ചെയ്യുക",
    saved: "പ്രൊഫൈൽ സേവ് ചെയ്തു ✓",

    // Misc
    doctor: "ഡോക്ടർ",
    hospital: "ആശുപത്രി",
    frequency: "ആവൃത്തി",
    timing: "സമയം",
    dosage: "അളവ്",
    duration: "ദൈർഘ്യം",
    days: "ദിവസം",
    tryAgain: "വീണ്ടും ശ്രമിക്കുക",
    back: "← തിരികെ",
    close: "അടയ്ക്കുക",
  },
};

export default T;
