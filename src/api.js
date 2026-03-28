/**
 * api.js — Kurippu AI Engine
 * Gemini 1.5 Flash multimodal OCR + conflict/allergy detection.
 * API key is NEVER exposed to UI — loaded from VITE_GEMINI_API_KEY only.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Analyse a prescription image against the patient profile.
 *
 * @param {string} base64Image    Raw base64 (no "data:" prefix)
 * @param {string} mimeType       e.g. "image/jpeg"
 * @param {Object} patientProfile { currentMedications: [], allergies: [] }
 * @returns {Promise<Object>}     Structured JSON result
 */
export async function analyzePrescription(base64Image, mimeType, patientProfile) {
  if (!GEMINI_API_KEY) {
    throw new Error(
      "API key not configured. Add VITE_GEMINI_API_KEY to your .env file."
    );
  }

  const currentMeds =
    (patientProfile.currentMedications || [])
      .map((m) => `${m.name} ${m.dosage || ""}`.trim())
      .join(", ") || "None";

  const allergies =
    (patientProfile.allergies || []).join(", ") || "None";

  const prompt = `
You are Kurippu, a medical prescription analysis AI for elderly patients in Kerala, India.

PATIENT CURRENT MEDICATIONS: ${currentMeds}
PATIENT KNOWN ALLERGIES: ${allergies}

TASK: Carefully read the prescription image (it may be handwritten and messy).
Return ONLY a raw JSON object — no markdown, no backticks, no preamble.

REQUIRED JSON FORMAT:
{
  "success": true,
  "imageQuality": "GOOD" | "POOR" | "UNREADABLE",
  "doctorName": "string or null",
  "hospitalName": "string or null",
  "medicines": [
    {
      "name": "Medicine name (Title Case)",
      "dosage": "e.g. 500mg",
      "frequency": "e.g. Twice daily",
      "timing": "e.g. After food",
      "durationDays": 5,
      "totalQuantity": "Number of pills/bottles prescribed (numeric index)",
      "malayalamTiming": "Natural spoken Malayalam, e.g. ഭക്ഷണത്തിന് ശേഷം രാവിലെയും രാത്രിയും",
      "verified": true,
      "unverifiedNote": "UNVERIFIED – CONSULT PHARMACIST (only when illegible)"
    }
  ],
  "conflictFound": false,
  "conflicts": [
    {
      "drug1": "Drug from prescription",
      "drug2": "Drug from patient profile",
      "severity": "HIGH" | "MEDIUM" | "LOW",
      "reason": "Plain English explanation",
      "malayalamReason": "Malayalam explanation"
    }
  ],
  "allergyAlert": false,
  "allergyDetails": "string or null",
  "generalNote": "string or null"
}

CRITICAL RULES:
1. ZERO HALLUCINATION: If you cannot confidently read a drug name, set verified:false. Never invent names.
2. CONFLICT ENGINE: Compare EVERY extracted medicine against [${currentMeds}].
3. ALLERGY CHECK: Flag allergyAlert:true if any medicine matches or belongs to the class of [${allergies}].
4. MALAYALAM: Every medicine MUST have a natural spoken-style malayalamTiming.
5. QUANTITY EXTRACTION: Try your best to find the total number of pills (e.g., "30 tabs", "1 bottle", "#10"). Put it in totalQuantity as a number.
6. If the image is not a prescription, return { "success": false, "imageQuality": "UNREADABLE", "medicines": [], "conflictFound": false, "allergyAlert": false }.
`;

  const body = {
    contents: [
      {
        parts: [
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Image,
            },
          },
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 2048,
    },
  };

  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    const msg = err?.error?.message || `Gemini API Error: ${response.status}`;
    throw new Error(msg);
  }

  const data = await response.json();
  const rawText =
    data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Strip accidental markdown fences
  const clean = rawText.replace(/```json|```/gi, "").trim();

  try {
    return JSON.parse(clean);
  } catch {
    throw new Error(
      "AI returned an unreadable response. Please try scanning again."
    );
  }
}
