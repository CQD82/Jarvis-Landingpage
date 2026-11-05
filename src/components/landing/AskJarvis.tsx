import { useReducedMotion } from "framer-motion";
import { Mic, RotateCw, Volume2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { trackPointer } from "@/lib/pointer";

interface QA {
  q: string;
  a: string;
}

type Phase = "idle" | "listening" | "thinking" | "answering" | "done";

const BARS = 28;

/**
 * Speaks with a voice that runs on the device only (localService). Network
 * voices would send the text to a third party, which the privacy policy
 * rules out — without a local voice the demo simply stays silent.
 */
function speak(text: string, lang: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const synth = window.speechSynthesis;
  const voices = synth.getVoices().filter((v) => v.localService);
  const base = lang.slice(0, 2).toLowerCase();
  const voice = voices.find((v) => v.lang.toLowerCase().startsWith(base));
  if (!voice) return;
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.voice = voice;
  u.lang = voice.lang;
  u.rate = 1.02;
  u.pitch = 0.9;
  synth.speak(u);
}

export function AskJarvis() {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const qa = t("askJarvis.qa", { returnObjects: true }) as QA[];

  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(
    () => () => {
      clearTimers();
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    },
    [],
  );

  // Voices load asynchronously in some browsers; touching the list warms it up.
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.getVoices();
  }, []);

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const typeOut = (text: string, set: (s: string) => void, msPerChar: number, done: () => void) => {
    if (reduceMotion) {
      set(text);
      done();
      return;
    }
    let i = 0;
    const step = () => {
      i += 1;
      set(text.slice(0, i));
      if (i < text.length) later(step, msPerChar);
      else done();
    };
    step();
  };

  const run = () => {
    clearTimers();
    const item = qa[round % qa.length];
    if (!item) return;
    setAnswer("");
    setQuestion("");
    setPhase("listening");
    typeOut(item.q, setQuestion, 38, () => {
      later(() => {
        setPhase("thinking");
        later(() => {
          setPhase("answering");
          speak(item.a, i18n.language);
          typeOut(item.a, setAnswer, 24, () => {
            setPhase("done");
            setRound((r) => r + 1);
          });
        }, reduceMotion ? 0 : 900);
      }, 350);
    });
  };

  const active = phase === "listening" || phase === "answering";
  const busy = phase !== "idle" && phase !== "done";

  return (
    <section id="ask-jarvis" className="px-6 py-24">
      <Reveal>
        <SectionHeading
          eyebrow={t("askJarvis.eyebrow")}
          title={t("askJarvis.title")}
          description={t("askJarvis.description")}
        />
      </Reveal>

      <Reveal delay={0.1}>
        <div
          onPointerMove={trackPointer}
          className="holo-card mx-auto mt-14 max-w-3xl rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-accent/60 p-6 sm:p-8"
        >
          {/* Arc-reactor button + waveform */}
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <button
              type="button"
              onClick={run}
              disabled={busy}
              aria-label={phase === "idle" ? t("askJarvis.start") : t("askJarvis.again")}
              className="group relative grid size-24 shrink-0 cursor-pointer place-items-center rounded-full border border-primary/40 bg-background/60 transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:cursor-wait"
            >
              <span aria-hidden="true" className={`absolute inset-1 rounded-full border-t-2 border-[var(--hud-reactor)] ${busy && !reduceMotion ? "animate-radar-sweep" : ""}`} style={{ animationDuration: "1.4s" }} />
              <span aria-hidden="true" className={`absolute inset-3 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--hud-reactor)_45%,transparent),transparent_70%)] ${active ? "opacity-100" : "opacity-40"} transition-opacity`} />
              {phase === "done" ? (
                <RotateCw className="relative size-8 text-primary" aria-hidden="true" />
              ) : phase === "answering" ? (
                <Volume2 className="relative size-8 text-[var(--hud-reactor)]" aria-hidden="true" />
              ) : (
                <Mic className="relative size-8 text-primary" aria-hidden="true" />
              )}
            </button>

            <div className="w-full flex-1">
              <div aria-hidden="true" className="flex h-14 items-center gap-[3px]">
                {Array.from({ length: BARS }, (_, i) => (
                  <span
                    key={i}
                    className={`flex-1 rounded-full ${phase === "answering" ? "bg-[var(--hud-reactor)]" : "bg-primary"} ${active && !reduceMotion ? "animate-voice-bar" : ""}`}
                    style={{
                      height: active ? "100%" : "12%",
                      opacity: active ? 0.85 : 0.3,
                      animationDelay: `${(i * 73) % 600}ms`,
                      animationDuration: `${520 + ((i * 131) % 380)}ms`,
                    }}
                  />
                ))}
              </div>
              <p className="mt-3 font-mono text-xs tracking-widest text-muted-foreground uppercase" aria-live="polite">
                {phase === "listening"
                  ? t("askJarvis.listening")
                  : phase === "thinking"
                    ? t("askJarvis.thinking")
                    : phase === "idle"
                      ? t("askJarvis.start")
                      : phase === "done"
                        ? t("askJarvis.again")
                        : "JARVIS"}
              </p>
            </div>
          </div>

          {/* Transcript */}
          <div className="mt-6 min-h-28 space-y-3 border-t border-primary/15 pt-5 text-sm">
            {question ? (
              <p>
                <span className="mr-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">{t("askJarvis.you")}</span>
                <span className="text-foreground">{question}</span>
              </p>
            ) : null}
            {answer ? (
              <p>
                <span className="mr-2 font-mono text-xs tracking-widest text-[var(--hud-reactor)] uppercase">JARVIS</span>
                <span className="text-foreground/90">{answer}</span>
              </p>
            ) : null}
          </div>

          <p className="mt-4 text-xs text-muted-foreground/80">{t("askJarvis.disclaimer")}</p>
        </div>
      </Reveal>
    </section>
  );
}
