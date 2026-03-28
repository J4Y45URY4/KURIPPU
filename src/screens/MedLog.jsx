import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";
import { markDoseTaken, isDoseTaken } from "../data/storage";
import { playSuccessSound, playReminderChime } from "../utils/audio";

function getDoseCount(frequency = "") {
  const f = frequency.toLowerCase();
  if (f.includes("three") || f.includes("3") || f.includes("thrice")) return 3;
  if (f.includes("twice") || f.includes("two") || f.includes("2")) return 2;
  return 1;
}

const DOSE_LABELS_EN = ["Morning", "Afternoon", "Night"];
const DOSE_LABELS_ML = ["രാവിലെ", "ഉച്ചക്ക്", "രാത്രി"];

export default function MedLog({ t, lang, profile }) {
  const [log, setLog] = useState(() => {
    // Build initial taken state from localStorage
    const today = new Date().toISOString().slice(0, 10);
    const raw = localStorage.getItem("kurippu_med_log");
    return raw ? JSON.parse(raw) : {};
  });

  const today = new Date().toISOString().slice(0, 10);

  const handleTake = (medId, doseIndex) => {
    const updated = markDoseTaken(medId, doseIndex);
    setLog({ ...updated });
    playSuccessSound();
  };

  // Check if already taken
  const isTaken = (medId, doseIndex) =>
    !!(log?.[today]?.[medId]?.[doseIndex]);

  const doseLabels = lang === "ml" ? DOSE_LABELS_ML : DOSE_LABELS_EN;

  // Check if all doses are done for today
  const totalDoses = profile.currentMedications.reduce(
    (sum, med) => sum + getDoseCount(med.frequency), 0
  );
  const takenDoses = profile.currentMedications.reduce((sum, med) => {
    const count = getDoseCount(med.frequency);
    return sum + Array.from({ length: count }, (_, i) => isTaken(med.id, i) ? 1 : 0).reduce((a, b) => a + b, 0);
  }, 0);
  const allDone = totalDoses > 0 && takenDoses >= totalDoses;

  const todayLabel = new Date().toLocaleDateString(lang === "ml" ? "ml-IN" : "en-IN", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <div className="flex flex-col gap-5 p-5 pb-28 max-w-lg mx-auto">

      {/* Header */}
      <div className="bg-blue-700 text-white rounded-3xl px-6 py-5">
        <p className="text-lg font-medium opacity-75">{todayLabel}</p>
        <h1 className="text-3xl font-black mt-1">{t.logTitle}</h1>
        {totalDoses > 0 && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${(takenDoses / totalDoses) * 100}%` }}
              />
            </div>
            <span className="text-lg font-bold">{takenDoses}/{totalDoses}</span>
          </div>
        )}
      </div>

      {/* All done banner */}
      {allDone && (
        <div className="bg-green-50 border-2 border-green-300 rounded-3xl px-6 py-5 text-center">
          <div className="text-5xl mb-2">🎉</div>
          <p className="text-2xl font-black text-green-800">{t.allDoneTitle}</p>
          <p className="text-lg text-green-600 mt-1">{t.allDoneSub}</p>
        </div>
      )}

      {/* Medicine dose cards */}
      {profile.currentMedications.map((med) => {
        const doseCount = getDoseCount(med.frequency);
        return (
          <div key={med.id} className="bg-white rounded-3xl border-2 border-gray-100 shadow-sm overflow-hidden">
            {/* Medicine header */}
            <div className="bg-blue-50 px-5 py-4 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900">{med.name}</h2>
                <p className="text-lg text-blue-600 font-semibold">{med.dosage}</p>
              </div>
              <span className="bg-white text-blue-700 font-bold text-base px-3 py-1.5 rounded-xl border border-blue-200">
                {med.frequency}
              </span>
            </div>

            {/* Dose buttons */}
            <div className="p-4 flex flex-col gap-3">
              {Array.from({ length: doseCount }, (_, i) => {
                const taken = isTaken(med.id, i);
                return (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-500 w-24 flex-shrink-0">
                      {doseLabels[i]}
                    </span>
                    <button
                      onClick={() => !taken && handleTake(med.id, i)}
                      disabled={taken}
                      className={`flex-1 flex items-center justify-center gap-3 rounded-2xl font-black transition-all active:scale-95 ${
                        taken
                          ? "bg-green-100 text-green-700 border-2 border-green-300"
                          : "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                      }`}
                      style={{ minHeight: 60 }}
                    >
                      {taken ? (
                        <>
                          <CheckCircle2 size={24} />
                          <span className="text-xl">{lang === "ml" ? t.takenMl : t.taken}</span>
                        </>
                      ) : (
                        <>
                          <Circle size={24} />
                          <span className="text-xl">{t.notTaken}</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {profile.currentMedications.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">💊</div>
          <p className="text-2xl font-bold text-gray-400">No medicines in your profile yet.</p>
        </div>
      )}
    </div>
  );
}
