import { useEffect, useState } from "react";
import { Button } from "./ui/Button";

const SCRIPT =
  "Welcome to GIWA Builder Passport. BuilderPass creates a portable, verifiable on-chain identity for builders. Your wallet anchors a soulbound passport containing your profile and skills. Projects and contribution evidence can then connect to that identity, creating a foundation for credentials, reputation, a builder graph, and eventually agent-readable capabilities. Explore the passport, verify the contract, and see the proof on GIWA Sepolia.";

export function VoiceGuide() {
  const [speaking, setSpeaking] = useState(false);
  const supported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  function toggleVoice() {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(SCRIPT);
    utterance.rate = 0.94;
    utterance.pitch = 0.96;
    utterance.volume = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button
        type="button"
        variant="secondary"
        onClick={toggleVoice}
        aria-pressed={speaking}
        aria-label={speaking ? "Stop BuilderPass voice guide" : "Play BuilderPass voice guide"}
      >
        <span aria-hidden="true" className={speaking ? "animate-pulse" : ""}>
          {speaking ? "◼" : "◉"}
        </span>
        {speaking ? "Stop voice guide" : "Listen to BuilderPass"}
      </Button>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-slate">
        browser voice · no audio file required
      </span>
    </div>
  );
}
