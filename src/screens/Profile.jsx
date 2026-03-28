import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { saveProfile } from "../data/storage";

export default function Profile({ t, lang, profile, setProfile }) {
  const [local, setLocal] = useState({ ...profile });
  const [saved, setSaved] = useState(false);
  const [newMed, setNewMed] = useState({ name: "", dosage: "", frequency: "", condition: "" });
  const [newAllergy, setNewAllergy] = useState("");

  const handleSave = () => {
    setProfile(local);
    saveProfile(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const addMed = () => {
    if (!newMed.name.trim()) return;
    const med = { ...newMed, id: Date.now().toString() };
    setLocal((p) => ({ ...p, currentMedications: [...p.currentMedications, med] }));
    setNewMed({ name: "", dosage: "", frequency: "", condition: "" });
  };

  const removeMed = (id) =>
    setLocal((p) => ({ ...p, currentMedications: p.currentMedications.filter((m) => m.id !== id) }));

  const addAllergy = () => {
    if (!newAllergy.trim()) return;
    setLocal((p) => ({ ...p, allergies: [...p.allergies, newAllergy.trim()] }));
    setNewAllergy("");
  };

  const removeAllergy = (i) =>
    setLocal((p) => ({ ...p, allergies: p.allergies.filter((_, idx) => idx !== i) }));

  const field = (label, key, placeholder = "") => (
    <div>
      <label className="block text-lg font-bold text-gray-600 mb-1">{label}</label>
      <input
        value={local[key] || ""}
        onChange={(e) => setLocal((p) => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full border-2 border-gray-200 focus:border-blue-400 rounded-2xl px-4 py-3 text-xl font-semibold text-gray-900 outline-none transition-all"
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-5 p-5 pb-32 max-w-lg mx-auto">
      <h1 className="text-3xl font-black text-gray-900 pt-2">{t.profileTitle}</h1>

      {/* Basic info */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-5 flex flex-col gap-4 shadow-sm">
        {field(t.profileName, "name", "Enter name")}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-lg font-bold text-gray-600 mb-1">{t.profileAge}</label>
            <input
              type="number"
              value={local.age || ""}
              onChange={(e) => setLocal((p) => ({ ...p, age: e.target.value }))}
              className="w-full border-2 border-gray-200 focus:border-blue-400 rounded-2xl px-4 py-3 text-xl font-semibold outline-none"
            />
          </div>
          <div>
            <label className="block text-lg font-bold text-gray-600 mb-1">{t.profileBlood}</label>
            <input
              value={local.bloodGroup || ""}
              onChange={(e) => setLocal((p) => ({ ...p, bloodGroup: e.target.value }))}
              placeholder="e.g. B+"
              className="w-full border-2 border-gray-200 focus:border-blue-400 rounded-2xl px-4 py-3 text-xl font-semibold outline-none"
            />
          </div>
        </div>
        {field(t.profileEmergency, "emergencyContact", "e.g. 9447000000")}
      </div>

      {/* Current medications */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-5 shadow-sm">
        <h2 className="text-2xl font-black text-gray-800 mb-4">{t.profileMeds}</h2>

        {local.currentMedications.map((med) => (
          <div key={med.id} className="flex items-center gap-3 bg-blue-50 rounded-2xl px-4 py-3 mb-3">
            <div className="flex-1">
              <p className="text-xl font-black text-gray-900">{med.name} {med.dosage}</p>
              <p className="text-base text-gray-500">{med.frequency}</p>
            </div>
            <button
              onClick={() => removeMed(med.id)}
              className="text-red-400 hover:text-red-600 p-2 active:scale-90 transition-all"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}

        {/* Add medicine form */}
        <div className="border-2 border-dashed border-blue-200 rounded-2xl p-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2">
            <input
              value={newMed.name}
              onChange={(e) => setNewMed((m) => ({ ...m, name: e.target.value }))}
              placeholder="Medicine name"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-lg font-semibold outline-none focus:border-blue-400"
            />
            <input
              value={newMed.dosage}
              onChange={(e) => setNewMed((m) => ({ ...m, dosage: e.target.value }))}
              placeholder="Dosage e.g. 5mg"
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-lg font-semibold outline-none focus:border-blue-400"
            />
          </div>
          <input
            value={newMed.frequency}
            onChange={(e) => setNewMed((m) => ({ ...m, frequency: e.target.value }))}
            placeholder="Frequency e.g. Once daily"
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-lg font-semibold outline-none focus:border-blue-400"
          />
          <button
            onClick={addMed}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl py-3 font-bold text-lg active:scale-95 transition-all"
          >
            <Plus size={20} /> {t.addMed}
          </button>
        </div>
      </div>

      {/* Allergies */}
      <div className="bg-white rounded-3xl border-2 border-gray-100 p-5 shadow-sm">
        <h2 className="text-2xl font-black text-gray-800 mb-4">{t.profileAllergies}</h2>

        <div className="flex flex-wrap gap-2 mb-4">
          {local.allergies.map((a, i) => (
            <div key={i} className="flex items-center gap-1 bg-amber-100 rounded-xl px-3 py-2">
              <span className="text-lg font-bold text-amber-900">{a}</span>
              <button onClick={() => removeAllergy(i)} className="text-amber-600 hover:text-red-500 ml-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={newAllergy}
            onChange={(e) => setNewAllergy(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addAllergy()}
            placeholder="e.g. Penicillin"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-lg font-semibold outline-none focus:border-blue-400"
          />
          <button
            onClick={addAllergy}
            className="bg-amber-500 text-white rounded-xl px-4 font-bold text-lg active:scale-95 transition-all"
          >
            <Plus size={22} />
          </button>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={handleSave}
        className={`flex items-center justify-center gap-3 rounded-3xl font-black text-2xl transition-all active:scale-95 shadow-lg ${
          saved ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
        style={{ minHeight: 72 }}
      >
        <Save size={26} />
        {saved ? t.saved : t.save}
      </button>
    </div>
  );
}
