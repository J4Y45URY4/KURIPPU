import { RefreshCw } from "lucide-react";

export default function ErrorScreen({ t, message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-white">
      <div className="text-8xl mb-6">😟</div>
      <h2 className="text-3xl font-black text-red-600 mb-3">
        {t.tryAgain}
      </h2>
      <p className="text-xl text-gray-500 mb-10 max-w-sm leading-relaxed">{message}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl px-8 font-black text-2xl active:scale-95 transition-all shadow-lg"
        style={{ minHeight: 72 }}
      >
        <RefreshCw size={26} />
        {t.tryAgain}
      </button>
    </div>
  );
}
