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
  ["FluxCD", "Forgejo", "Forgejo Actions", "Renovate", "Helm", "Kustomize", "Ansible", "SOPS + age", "kube-linter", "n8n"],
  ["K3s", "Longhorn", "Garage", "kube-vip", "Cilium LB-IPAM + L2", "Traefik", "cert-manager", "CloudNativePG", "Valkey", "Spegel", "Headlamp"],
  ["llama.cpp", "llama-swap", "Bifrost", "Hailo-10H", "Open WebUI", "Qdrant", "SearXNG", "Apache Tika", "Docling", "Kiwix", "ComfyUI", "JupyterLab", "MLflow", "Unsloth", "Label Studio", "Promptfoo", "Langfuse", "Hermes Agent", "ZeroClaw"],
  ["Cilium + WireGuard", "Hubble", "Tetragon", "Kyverno", "Falco", "Trivy", "gVisor", "cosign", "Authentik", "Pi-hole", "Vaultwarden", "Stalwart + Roundcube"],
  ["Home Assistant", "ESPHome-Satellit", "Wake-Word", "Whisper", "Kokoro TTS", "Piper", "Frigate", "HUD"],
  ["VictoriaMetrics", "VictoriaLogs", "Grafana", "Alloy", "Alertmanager", "Velero", "kured", "system-upgrade-controller", "SNMP-Exporter", "Shelly-Exporter", "ntfy", "Paperless-ngx", "Immich"],
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
