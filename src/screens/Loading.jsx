import { useEffect, useState } from "react";

const STEP_DELAYS = [0, 2200, 4400, 6200];

export default function Loading({ t }) {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [t.step1, t.step2, t.step3, t.step4];

  useEffect(() => {
    const timers = STEP_DELAYS.map((delay, i) =>
      setTimeout(() => setActiveStep(i), delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-white">

      {/* Pulse animation */}
      <div className="relative mb-10" style={{ width: 120, height: 120 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 border-blue-400"
            style={{
              inset: -i * 18,
              opacity: 0.15 + i * 0.08,
              animation: `ping 2s ease-in-out ${i * 0.35}s infinite`,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-5xl shadow-xl"
            style={{ animation: "pulse 2s ease-in-out infinite" }}
          >
            🔬
          </div>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">{t.analyzingTitle}</h2>

      <div className="w-full max-w-sm flex flex-col gap-3">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 ${
              i < activeStep
                ? "bg-green-50 border border-green-200"
                : i === activeStep
                ? "bg-blue-50 border-2 border-blue-400 shadow-md"
                : "bg-gray-50 border border-gray-100 opacity-50"
            }`}
          >
            <span className="text-2xl flex-shrink-0">
              {i < activeStep ? "✅" : i === activeStep ? "⏳" : "⬜"}
            </span>
            <span
              className={`text-xl font-semibold ${
                i === activeStep ? "text-blue-700" : i < activeStep ? "text-green-700" : "text-gray-400"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes ping {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.12); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
