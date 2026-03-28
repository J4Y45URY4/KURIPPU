import { AlertTriangle, Phone, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { playAlertSound } from "../utils/audio";

const SEV_LABELS = {
  HIGH: { en: "HIGH RISK", ml: "ഉയർന്ന അപകടം", bg: "bg-red-600", text: "text-white" },
  MEDIUM: { en: "MEDIUM RISK", ml: "ഇടത്തരം അപകടം", bg: "bg-orange-500", text: "text-white" },
  LOW: { en: "LOW RISK", ml: "കുറഞ്ഞ അപകടം", bg: "bg-yellow-500", text: "text-white" },
};

export default function Conflict({ t, lang, result, profile, onBack, onProceed }) {
  useEffect(() => {
    playAlertSound();
  }, []);

  const hasConflict = result.conflictFound && result.conflicts?.length > 0;
  const hasAllergy = result.allergyAlert;

  return (
    <div className="min-h-screen bg-red-600 flex flex-col">

      {/* Header */}
      <div className="px-5 pt-10 pb-6 text-white text-center">
        <div className="text-6xl mb-3">🚨</div>
        <h1 className="text-4xl font-black leading-tight">
          {hasAllergy && !hasConflict ? t.allergyTitle : t.conflictTitle}
        </h1>
        <p className="text-xl mt-3 opacity-90 font-medium">{t.conflictAdvice}</p>
      </div>

      {/* Content cards */}
      <div className="flex-1 bg-white rounded-t-3xl px-5 pt-6 pb-32 flex flex-col gap-4 overflow-y-auto">

        {/* Conflict cards */}
        {hasConflict && result.conflicts.map((c, i) => {
          const sev = SEV_LABELS[c.severity] || SEV_LABELS.MEDIUM;
          return (
            <div key={i} className="border-2 border-red-300 rounded-3xl overflow-hidden shadow-md">
              <div className={`${sev.bg} ${sev.text} px-5 py-3 flex items-center justify-between`}>
                <span className="text-xl font-black">
                  {lang === "ml" ? sev.ml : sev.en}
                </span>
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-red-100 text-red-800 font-bold text-lg px-4 py-2 rounded-xl">
                    💊 {c.drug1}
                  </span>
                  <span className="text-2xl font-black text-red-400">+</span>
                  <span className="bg-orange-100 text-orange-800 font-bold text-lg px-4 py-2 rounded-xl">
                    💊 {c.drug2}
                  </span>
                </div>
                <p className="text-xl text-gray-800 leading-relaxed">
                  {lang === "ml" && c.malayalamReason ? c.malayalamReason : c.reason}
                </p>
              </div>
            </div>
          );
        })}

        {/* Allergy alert */}
        {hasAllergy && result.allergyDetails && (
          <div className="border-2 border-amber-400 rounded-3xl overflow-hidden shadow-md">
            <div className="bg-amber-500 text-white px-5 py-3 flex items-center justify-between">
              <span className="text-xl font-black">{t.allergyTitle}</span>
              <span className="text-2xl">🚫</span>
            </div>
            <div className="p-5">
              <p className="text-xl text-gray-800 leading-relaxed">{result.allergyDetails}</p>
            </div>
          </div>
        )}

        {/* Call doctor CTA */}
        <a
          href={`tel:${profile.emergencyContact || "108"}`}
          className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white rounded-3xl px-6 font-bold shadow-xl active:scale-95 transition-all"
          style={{ minHeight: 72 }}
        >
          <Phone size={28} />
          <span className="text-2xl font-black">{t.conflictCallDoctor}</span>
        </a>

        {/* Back / view results anyway */}
        <button
          onClick={onProceed}
          className="flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-600 rounded-3xl px-6 font-semibold active:scale-95 transition-all bg-white"
          style={{ minHeight: 60 }}
        >
          <span className="text-lg">{t.resultsTitle} →</span>
        </button>

        <button
          onClick={onBack}
          className="flex items-center justify-center gap-2 text-gray-400 active:scale-95 transition-all py-2"
        >
          <ArrowLeft size={18} />
          <span className="text-lg">{t.back}</span>
        </button>
      </div>
    </div>
  );
}
