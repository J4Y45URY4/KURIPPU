import { CheckCircle, ArrowLeft, AlertTriangle, Camera } from "lucide-react";

export default function Results({ t, lang, result, onReset, onScanAnother, imagePreview }) {
  if (!result) return null;

  return (
    <div className="flex flex-col gap-4 p-5 pb-28 max-w-lg mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onReset}
          className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center active:scale-90 transition-all flex-shrink-0"
        >
          <ArrowLeft size={22} className="text-gray-600" />
        </button>
        <h1 className="text-3xl font-black text-gray-900">{t.resultsTitle}</h1>
      </div>

      {/* Prescription image thumbnail */}
      {imagePreview && (
        <div className="rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm">
          <img src={imagePreview} alt="Prescription" className="w-full max-h-44 object-cover" />
        </div>
      )}

      {/* Doctor / Hospital */}
      {(result.doctorName || result.hospitalName) && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
          {result.doctorName && (
            <p className="text-xl font-bold text-blue-900">👨‍⚕️ {result.doctorName}</p>
          )}
          {result.hospitalName && (
            <p className="text-lg text-blue-700 mt-1">🏥 {result.hospitalName}</p>
          )}
        </div>
      )}

      {/* Safe banner */}
      {!result.conflictFound && !result.allergyAlert && (
        <div className="flex items-center gap-3 bg-green-50 border-2 border-green-200 rounded-2xl px-5 py-4">
          <CheckCircle size={28} className="text-green-600 flex-shrink-0" />
          <p className="text-xl font-bold text-green-800">{t.noConflict}</p>
        </div>
      )}

      {/* Medicine cards */}
      {result.medicines?.map((med, i) => (
        <div
          key={i}
          className={`bg-white rounded-3xl shadow-sm border-2 ${
            med.verified === false ? "border-amber-300" : "border-gray-100"
          } p-5`}
        >
          {/* Name + dosage */}
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-2xl font-black text-gray-900 leading-tight">{med.name}</h2>
            <span className="bg-blue-100 text-blue-800 font-black text-lg px-3 py-1 rounded-xl ml-3 flex-shrink-0">
              {med.dosage}
            </span>
          </div>

          {/* Details grid */}
          <div className="flex flex-col gap-2 mb-3">
            {med.frequency && (
              <div className="flex gap-2 items-center">
                <span className="text-xl">🕐</span>
                <span className="text-xl text-gray-700 font-semibold">{med.frequency}</span>
              </div>
            )}
            {med.timing && (
              <div className="flex gap-2 items-center">
                <span className="text-xl">🍽️</span>
                <span className="text-xl text-gray-700">{med.timing}</span>
              </div>
            )}
            {med.durationDays && (
              <div className="flex gap-2 items-center">
                <span className="text-xl">📅</span>
                <span className="text-xl text-gray-700">{med.durationDays} {t.days}</span>
              </div>
            )}
          </div>

          {/* Malayalam translation */}
          {med.malayalamTiming && (
            <div className="bg-blue-50 border-l-4 border-blue-500 rounded-xl px-4 py-3 mt-2">
              <p className="text-xl text-blue-800 font-semibold leading-relaxed">
                🗣️ {med.malayalamTiming}
              </p>
            </div>
          )}

          {/* Verified badge */}
          <div className="mt-3">
            {med.verified === false ? (
              <div className="flex items-center gap-2 bg-amber-50 rounded-xl px-3 py-2">
                <AlertTriangle size={18} className="text-amber-600" />
                <span className="text-base font-bold text-amber-700">{t.unverified}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <CheckCircle size={18} className="text-green-500" />
                <span className="text-base font-semibold text-green-700">{t.verified}</span>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Saved banner */}
      <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-3 text-center">
        <p className="text-lg font-bold text-green-700">{t.saveToHistory}</p>
      </div>

      {/* Scan another */}
      <button
        onClick={onScanAnother}
        className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-3xl px-6 font-bold transition-all shadow-lg"
        style={{ minHeight: 72 }}
      >
        <Camera size={26} />
        <span className="text-2xl font-bold">{t.scanAnother}</span>
      </button>
    </div>
  );
}
