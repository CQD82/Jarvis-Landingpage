import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Bot,
  BrainCircuit,
  Camera,
  Cpu,
  GitBranch,
  Home,
  Lock,
  Mic,
  RefreshCcw,
  Server,
  ShieldCheck,
  Volume2,
  Workflow,
} from "lucide-react";

/**
 * Icons only — all user-facing copy lives in the locale files
 * (src/i18n/locales/*.json) and is zipped with these by index in each
 * component. Order here must match the corresponding translation array.
 */

/** Matches features.items in the locale files. */
export const featureIcons: LucideIcon[] = [
  GitBranch,
  Server,
  BrainCircuit,
  Camera,
  Mic,
  ShieldCheck,
  Lock,
  RefreshCcw,
  Activity,
  Home,
];

/** Matches pipeline.steps in the locale files. */
export const pipelineIcons: LucideIcon[] = [Workflow, Server, GitBranch, RefreshCcw];

/** Matches systemMap.categories in the locale files. Tool names stay in code — product names aren't translated. */
export const techCategoryTools: string[][] = [
  ["FluxCD", "Helmfile", "Renovate", "Forgejo"],
  ["K3s", "Longhorn", "Cilium LB-IPAM + L2", "Traefik", "cert-manager", "Garage"],
  ["LiteLLM", "llama.cpp", "llama-swap", "Qdrant", "NVIDIA NIM"],
  ["Cilium", "Kyverno", "Falco", "Trivy", "gVisor", "Authentik", "SOPS + Age"],
  ["Wyoming", "Wake-Agent", "Vision-Tracker", "Kokoro TTS", "HUD"],
  ["VictoriaMetrics", "VictoriaLogs", "Grafana", "Velero", "kured", "system-upgrade-controller", "n8n", "Shelly-Exporter"],
];

export const techCategoryIcons: LucideIcon[] = [
  GitBranch,
  Server,
  BrainCircuit,
  ShieldCheck,
  Mic,
  Activity,
];

/** Matches howItWorks.stages in the locale files. */
export const howItWorksStageIcons: LucideIcon[] = [Mic, Cpu, Bot, Volume2];
