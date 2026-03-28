import { ClipboardList } from "lucide-react";

export default function History({ t, lang, history }) {
  return (
    <div className="flex flex-col gap-4 p-5 pb-28 max-w-lg mx-auto">
      <h1 className="text-3xl font-black text-gray-900 pt-2">{t.historyTitle}</h1>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <ClipboardList size={64} className="text-gray-200" />
          <p className="text-2xl font-bold text-gray-400 text-center">{t.historyEmpty}</p>
          <p className="text-lg text-gray-400 text-center">{t.historyEmptySub}</p>
        </div>
      ) : (
        history.map((entry) => {
          const date = new Date(entry.date);
          const dateStr = date.toLocaleDateString(lang === "ml" ? "ml-IN" : "en-IN", {
            weekday: "short", day: "numeric", month: "long", year: "numeric",
          });
          const timeStr = date.toLocaleTimeString(lang === "ml" ? "ml-IN" : "en-IN", {
            hour: "2-digit", minute: "2-digit",
          });

          return (
            <div
              key={entry.id}
              className={`bg-white rounded-3xl border-2 shadow-sm overflow-hidden ${
                entry.conflictFound || entry.allergyAlert ? "border-red-200" : "border-gray-100"
              }`}
            >
              {/* Top bar */}
              <div className={`px-5 py-3 flex items-center justify-between ${
                entry.conflictFound || entry.allergyAlert ? "bg-red-50" : "bg-blue-50"
              }`}>
                <div>
                  <p className="text-lg font-black text-gray-800">{dateStr}</p>
                  <p className="text-base text-gray-500">{timeStr}</p>
                </div>
                {(entry.conflictFound || entry.allergyAlert) && (
                  <span className="bg-red-600 text-white font-bold text-base px-3 py-1.5 rounded-xl">
                    ⚠️ {t.conflictFound}
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                {entry.doctorName && (
                  <p className="text-lg font-semibold text-gray-700 mb-1">👨‍⚕️ {entry.doctorName}</p>
                )}
                {entry.hospitalName && (
                  <p className="text-base text-gray-500 mb-3">🏥 {entry.hospitalName}</p>
                )}

                {/* Medicine list */}
                <div className="flex flex-wrap gap-2">
                  {entry.medicines?.map((med, i) => (
                    <span
                      key={i}
                      className={`font-bold text-base px-3 py-1.5 rounded-xl ${
                        med.verified === false
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      💊 {med.name} {med.dosage}
                    </span>
                  ))}
                </div>

                <p className="text-base text-gray-400 mt-3">
                  {entry.medicines?.length || 0} {t.medicines}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
