import { useReducedMotion } from "framer-motion";
import { Bot, Check, Mic, RotateCw, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Reveal } from "@/components/landing/Reveal";
import { SectionHeading } from "@/components/landing/SectionHeading";
import { trackPointer } from "@/lib/pointer";

interface QA {
  /** Short label for the question chip. */
  chip: string;
  q: string;
  a: string;
  /** Which part of the real system would answer (shown as a badge). */
  route: string;
}

type Phase = "idle" | "listening" | "thinking" | "answering" | "done";

const BARS = 28;

function stopSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
}

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

/**
 * Scripted voice-assistant demo. Visitors pick a question (or tap the
 * reactor for the next one); the dialogue is typed out with the route the
 * real system would take. Nothing is sent anywhere.
 */
export function AskJarvis() {
  const { i18n } = useTranslation();
  // Remount on language switch so a running dialogue cannot mix languages.
  return <AskJarvisDemo key={i18n.language} />;
}

function AskJarvisDemo() {
  const { t, i18n } = useTranslation();
  const reduceMotion = useReducedMotion();
  const qa = t("askJarvis.qa", { returnObjects: true }) as QA[];

  const [current, setCurrent] = useState<number | null>(null);
  const [asked, setAsked] = useState<Set<number>>(() => new Set());
  const [phase, setPhase] = useState<Phase>("idle");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [voiceOn, setVoiceOn] = useState(true);
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(
    () => () => {
      clearTimers();
      stopSpeech();
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

  const finish = (idx: number) => {
    setPhase("done");
    setAsked((prev) => new Set(prev).add(idx));
  };

  const ask = (idx: number) => {
    const item = qa[idx];
    if (!item) return;
    clearTimers();
    stopSpeech();
    setCurrent(idx);
    setAnswer("");
    setQuestion("");
    setPhase("listening");
    typeOut(item.q, setQuestion, 34, () => {
      later(() => {
        setPhase("thinking");
        later(() => {
          setPhase("answering");
          if (voiceOn) speak(item.a, i18n.language);
          typeOut(item.a, setAnswer, 22, () => finish(idx));
        }, reduceMotion ? 0 : 800);
      }, 300);
    });
  };

  /** Jump to the end of the running dialogue. */
  const skip = () => {
    if (current === null) return;
    const item = qa[current];
    clearTimers();
    setQuestion(item.q);
    setAnswer(item.a);
    finish(current);
  };

  const nextIndex = () => {
    const start = current === null ? 0 : current + 1;
    for (let k = 0; k < qa.length; k++) {
      const i = (start + k) % qa.length;
      if (!asked.has(i)) return i;
    }
    return start % qa.length;
  };

  const busy = phase !== "idle" && phase !== "done";
  const active = phase === "listening" || phase === "answering";
  const item = current === null ? null : qa[current];

  const toggleVoice = () => {
    setVoiceOn((v) => {
      if (v) stopSpeech();
      return !v;
    });
  };

  const status =
    phase === "listening"
      ? t("askJarvis.listening")
      : phase === "thinking"
        ? t("askJarvis.thinking")
        : phase === "answering"
          ? "JARVIS"
          : phase === "done"
            ? t("askJarvis.again")
            : t("askJarvis.start");

  return (
    <section id="ask-jarvis" className="px-6 py-24">
      <Reveal>
        <SectionHeading eyebrow={t("askJarvis.eyebrow")} title={t("askJarvis.title")} description={t("askJarvis.description")} />
      </Reveal>

      <Reveal delay={0.1}>
        <div
          onPointerMove={trackPointer}
          className="holo-card mx-auto mt-14 max-w-3xl rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-accent/60 p-6 sm:p-8"
        >
          {/* AI disclosure (EU AI Act, Art. 50) */}
          <p className="mb-6 flex items-start gap-2 rounded-lg border border-[var(--hud-violet)]/40 bg-[var(--hud-violet)]/10 px-3 py-2 text-xs leading-relaxed text-foreground/90">
            <Bot className="mt-0.5 size-4 shrink-0 text-[var(--hud-violet)]" aria-hidden="true" />
            <span>{t("askJarvis.aiNotice")}</span>
          </p>

          {/* Arc-reactor button + waveform */}
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <button
              type="button"
              onClick={busy ? skip : () => ask(nextIndex())}
              aria-label={busy ? t("askJarvis.skip") : phase === "idle" ? t("askJarvis.start") : t("askJarvis.again")}
              className="group relative grid size-24 shrink-0 cursor-pointer place-items-center rounded-full border border-primary/40 bg-background/60 transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <span aria-hidden="true" className={`absolute inset-1 rounded-full border-t-2 border-[var(--hud-reactor)] ${busy && !reduceMotion ? "animate-radar-sweep" : ""}`} style={{ animationDuration: "1.4s" }} />
              <span aria-hidden="true" className={`absolute inset-3 rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--hud-reactor)_45%,transparent),transparent_70%)] ${active ? "opacity-100" : "opacity-40"} transition-opacity`} />
              {busy ? (
                <SkipForward className="relative size-7 text-primary opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100" aria-hidden="true" />
              ) : phase === "done" ? (
                <RotateCw className="relative size-8 text-primary" aria-hidden="true" />
              ) : (
                <Mic className="relative size-8 text-primary" aria-hidden="true" />
              )}
              {busy ? (
                <span aria-hidden="true" className="absolute inset-0 grid place-items-center transition-opacity group-hover:opacity-0 group-focus-visible:opacity-0">
                  {phase === "answering" ? <Volume2 className="size-8 text-[var(--hud-reactor)]" /> : <Mic className="size-8 text-primary" />}
                </span>
              ) : null}
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
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase" aria-live="polite">
                  {status}
                </p>
                <button
                  type="button"
                  onClick={toggleVoice}
                  aria-pressed={voiceOn}
                  aria-label={voiceOn ? t("askJarvis.voiceOff") : t("askJarvis.voiceOn")}
                  title={voiceOn ? t("askJarvis.voiceOff") : t("askJarvis.voiceOn")}
                  className="rounded-md border border-border p-1.5 text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                >
                  {voiceOn ? <Volume2 className="size-4" aria-hidden="true" /> : <VolumeX className="size-4" aria-hidden="true" />}
                </button>
              </div>
            </div>
          </div>

          {/* Question picker */}
          <div className="mt-6">
            <p className="mb-2 font-mono text-[0.65rem] tracking-widest text-muted-foreground uppercase">{t("askJarvis.pick")}</p>
            <div className="flex flex-wrap gap-2">
              {qa.map((x, i) => {
                const isCurrent = i === current;
                const done = asked.has(i);
                return (
                  <button
                    key={x.chip}
                    type="button"
                    onClick={() => ask(i)}
                    aria-pressed={isCurrent}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                      isCurrent
                        ? "border-primary/60 bg-primary/15 text-primary"
                        : "border-border/70 bg-background/40 text-foreground/85 hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    {done && !isCurrent ? <Check className="size-3 text-[var(--hud-reactor)]" aria-hidden="true" /> : null}
                    {x.chip}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transcript */}
          <div className="mt-6 min-h-32 space-y-3 border-t border-primary/15 pt-5 text-sm" aria-live="polite" aria-busy={busy}>
            {question ? (
              <p>
                <span className="mr-2 font-mono text-xs tracking-widest text-muted-foreground uppercase">{t("askJarvis.you")}</span>
                <span className="text-foreground">{question}</span>
              </p>
            ) : (
              <p className="text-muted-foreground/70 italic">{t("askJarvis.empty")}</p>
            )}
            {answer ? (
              <p>
                <span className="mr-2 font-mono text-xs tracking-widest text-[var(--hud-reactor)] uppercase">JARVIS</span>
                <span className="text-foreground/90">{answer}</span>
              </p>
            ) : null}
            {phase === "done" && item ? (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-1">
                <span className="rounded-full border border-[var(--hud-reactor)]/40 bg-[var(--hud-reactor)]/10 px-2 py-0.5 font-mono text-[0.6rem] tracking-wider text-[var(--hud-reactor)] uppercase">
                  {t("askJarvis.routeLabel")}: {item.route}
                </span>
                <span className="text-xs text-muted-foreground italic">{t("askJarvis.followUp")}</span>
              </div>
            ) : null}
          </div>

          <p className="mt-4 text-xs text-muted-foreground/80">{t("askJarvis.disclaimer")}</p>
        </div>
      </Reveal>
    </section>
  );
}
