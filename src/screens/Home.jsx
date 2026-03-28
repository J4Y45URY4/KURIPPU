import { useRef } from "react";
import { Camera, ClipboardList, Phone, Pill, AlertTriangle } from "lucide-react";

export default function Home({ t, profile, onScan, onViewLog, lang }) {
  const fileRef = useRef();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? t.greetingMorning : hour < 17 ? t.greetingAfternoon : t.greetingEvening;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) onScan(file);
    e.target.value = "";
  };

  return (
    <div className="flex flex-col gap-5 p-5 pb-28 max-w-lg mx-auto">

      {/* ── Greeting header ── */}
      <div className="bg-blue-700 text-white rounded-3xl px-6 py-5">
        <p className="text-xl font-medium opacity-80">{greeting}, {profile.name.split(" ")[0]} 👋</p>
        <h1 className="text-3xl font-bold mt-1">{t.appName}</h1>
        <p className="text-lg opacity-75 mt-1">{t.appTagline}</p>
      </div>

      {/* ── Primary action: Scan ── */}
      <input
        ref={fileRef} type="file" accept="image/*" capture="environment"
        className="hidden" onChange={handleFile}
      />
      <button
        onClick={() => fileRef.current?.click()}
        className="flex items-center gap-4 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white rounded-3xl px-6 py-5 w-full text-left transition-all shadow-lg"
        style={{ minHeight: 80 }}
      >
        <div className="bg-white/20 rounded-2xl p-3 flex-shrink-0">
          <Camera size={32} />
        </div>
        <div>
          <div className="text-2xl font-bold">{t.scanNew}</div>
          <div className="text-base opacity-80 mt-0.5">{t.scanNewSub}</div>
        </div>
      </button>

      {/* ── Secondary action: View log ── */}
      <button
        onClick={onViewLog}
        className="flex items-center gap-4 bg-white border-2 border-blue-200 hover:border-blue-400 active:scale-95 text-blue-700 rounded-3xl px-6 py-5 w-full text-left transition-all shadow-sm"
        style={{ minHeight: 80 }}
      >
        <div className="bg-blue-100 rounded-2xl p-3 flex-shrink-0">
          <ClipboardList size={32} />
        </div>
        <div>
          <div className="text-2xl font-bold">{t.viewExisting}</div>
          <div className="text-base text-blue-500 mt-0.5">{t.viewExistingSub}</div>
        </div>
      </button>

      {/* ── Current Medicines summary ── */}
      {profile.currentMedications.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Pill size={22} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">{t.currentMeds}</h2>
          </div>
          <div className="flex flex-col gap-3">
            {profile.currentMedications.map((med) => (
              <div key={med.id} className="flex items-center justify-between bg-blue-50 rounded-2xl px-4 py-3">
                <div>
                  <div className="text-xl font-bold text-gray-900">{med.name}</div>
                  <div className="text-base text-gray-500">{med.frequency}</div>
                </div>
                <div className="text-lg font-semibold text-blue-700 bg-white rounded-xl px-3 py-1">
                  {med.dosage}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Allergies ── */}
      {profile.allergies.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={22} className="text-amber-600" />
            <h2 className="text-xl font-bold text-amber-800">{t.allergies}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.allergies.map((a, i) => (
              <span key={i} className="bg-amber-200 text-amber-900 font-bold text-lg px-4 py-2 rounded-xl">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── SOS Emergency Button ── */}
      <a
        href={`tel:${profile.emergencyContact || "108"}`}
        className="flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 active:scale-95 text-white rounded-3xl px-6 w-full font-bold transition-all shadow-lg"
        style={{ minHeight: 72 }}
      >
        <Phone size={28} />
        <div className="text-center">
          <div className="text-2xl font-black tracking-wide">{t.emergency}</div>
          <div className="text-base font-medium opacity-90">{t.emergencySub}</div>
        </div>
      </a>
    </div>
  );
}
