import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BrainCircuit,
  Camera,
  GitBranch,
  Home,
  Lock,
  Mic,
  RefreshCcw,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";

export const stats: { value: string; label: string }[] = [
  { value: "18", label: "Nodes im Cluster" },
  { value: "7", label: "KI-Inferenz-Tiers" },
  { value: "6", label: "Namespaces, Default-Deny" },
  { value: "100%", label: "Deklarativ via GitOps" },
];

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: GitBranch,
    title: "GitOps-Infrastruktur",
    description:
      "Ein Git-Monorepo als Single Source of Truth. Ansible für die Node-Ebene, FluxCD für den Cluster-Zustand — jede Änderung ein reviewbarer Commit, jeder Drift wird automatisch zurückreconciled.",
  },
  {
    icon: Server,
    title: "18-Node Bare-Metal-Cluster",
    description:
      "Raspberry Pi 5, ein ODROID-H5 und eine GPU-Workstation im Verbund als K3s-Cluster — vom Edge-Gerät bis zur Inferenz-Hardware alles selbst betrieben, keine Cloud-VMs.",
  },
  {
    icon: BrainCircuit,
    title: "Mehrstufige lokale KI-Inferenz",
    description:
      "Anfragen laufen über gestaffelte Hardware-Tiers — vom NPU-Edge-Gerät für sofortige Kurzantworten bis zur GPU-Workstation für komplexes Reasoning. Cloud dient nur als eng limitierter Fallback.",
  },
  {
    icon: Camera,
    title: "Vision-Tracker",
    description:
      "Aktive Personenerkennung mit Kameraverfolgung (Pan/Tilt/Zoom). Verarbeitung vollständig lokal im Cluster, gespeichert werden ausschließlich Embeddings enrollter Personen — nie Rohbilder, kein Cloud-Pfad.",
  },
  {
    icon: Mic,
    title: "Sprachassistent & HUD",
    description:
      "Wake-Word-Erkennung, Sprachausgabe und ein Head-up-Display, das Identität und Status in Echtzeit anzeigt — inklusive namentlicher Begrüßung und präsenzgesteuerten Automationen.",
  },
  {
    icon: ShieldCheck,
    title: "Zero-Trust-Netzwerksegmentierung",
    description:
      "Default-Deny-Netzwerkrichtlinien je Workload-Namespace, verschlüsselter Node-zu-Node-Traffic und ein explizites, versioniertes Allow-Set statt impliziter Erreichbarkeit.",
  },
  {
    icon: Lock,
    title: "Sicherheit & Compliance",
    description:
      "An ISO 27001, NIS-2 und CIS orientierte Kontrollen: Secrets ausschließlich verschlüsselt, vollständiges API-Audit-Logging, Laufzeit-Bedrohungserkennung und automatisches Image-Scanning.",
  },
  {
    icon: RefreshCcw,
    title: "Automatisierte Versions-Governance",
    description:
      "Abhängigkeiten und Chart-Versionen werden laufend geprüft und als reviewbare Pull-Requests vorgeschlagen — kein stilles „latest”, jede Änderung sichtbar und nachvollziehbar.",
  },
  {
    icon: Activity,
    title: "Backup, DR & Observability",
    description:
      "Getestete Backup- und Restore-Pfade für den gesamten Cluster, durchgehendes Monitoring und Dashboards über Nodes, Workloads und Netzwerk hinweg.",
  },
  {
    icon: Home,
    title: "Heimautomation",
    description:
      "Anbindung an Smart-Home-Geräte im lokalen Netz und präsenzgesteuerte Automationen, orchestriert aus derselben Plattform wie die KI- und Voice-Dienste.",
  },
];

export const pipeline: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Workflow,
    title: "Ansible",
    description: "Node-Ebene: Betriebssystem, Storage, GPU- und Geräte-Vorbereitung.",
  },
  {
    icon: Server,
    title: "Helmfile",
    description: "Minimaler Pre-Flux-Bootstrap für die Kern-Cluster-Dienste.",
  },
  {
    icon: GitBranch,
    title: "FluxCD",
    description: "Rollt alle Cluster-Workloads deklarativ aus und reconciled Drift automatisch.",
  },
  {
    icon: RefreshCcw,
    title: "Renovate",
    description: "Öffnet automatisch Pull-Requests für jedes Versions-Update.",
  },
];

export interface ModelTier {
  tier: string;
  hardware: string;
  role: string;
}

export const modelTiers: ModelTier[] = [
  { tier: "Edge / NPU", hardware: "KI-Beschleuniger am Edge", role: "Intent-Erkennung, Sofortantworten" },
  { tier: "CPU-Tier", hardware: "Kompaktes Board, CPU-Inferenz", role: "Großes Mixture-of-Experts-Modell für Reasoning" },
  { tier: "Worker-Tier", hardware: "Kompakte Cluster-Nodes", role: "Verteilte Alltagsinferenz" },
  { tier: "GPU-Tier", hardware: "Workstation mit dedizierter GPU", role: "Produktive Echtzeit-Inferenz" },
  { tier: "GPU-Tier (Ausbau)", hardware: "Nächste GPU-Generation", role: "Multimodale Audio- & Vision-Modelle" },
  { tier: "Cloud-Fallback", hardware: "Extern, streng ratenbegrenzt", role: "Nur als letzter Ausweg, ein einziger erlaubter Egress" },
];

export interface TechCategory {
  icon: LucideIcon;
  title: string;
  tools: string[];
}

/** The six spokes of the system map — every tool/component in the stack, grouped. */
export const techCategories: TechCategory[] = [
  {
    icon: GitBranch,
    title: "GitOps & Automatisierung",
    tools: ["Ansible", "FluxCD", "Helmfile", "Renovate", "Forgejo"],
  },
  {
    icon: Server,
    title: "Cluster & Storage",
    tools: ["K3s", "Longhorn", "MetalLB", "Traefik", "cert-manager"],
  },
  {
    icon: BrainCircuit,
    title: "KI-Inferenz",
    tools: ["LiteLLM", "llama.cpp", "Qdrant", "NVIDIA NIM"],
  },
  {
    icon: ShieldCheck,
    title: "Sicherheit & Netzwerk",
    tools: ["Cilium", "Kyverno", "Falco", "Trivy", "Authentik", "SOPS + Age"],
  },
  {
    icon: Mic,
    title: "Voice & Vision",
    tools: ["Wyoming", "Wake-Agent", "Vision-Tracker", "Kokoro TTS", "HUD"],
  },
  {
    icon: Activity,
    title: "Observability & Ops",
    tools: ["Prometheus", "Grafana", "Velero", "n8n", "Shelly-Exporter"],
  },
];

export const securityHighlights: string[] = [
  "Verschlüsselung sensibler Cluster-Daten im Ruhezustand",
  "Vollständiges API-Audit-Logging mit RBAC-Nachvollziehbarkeit",
  "Secrets ausschließlich verschlüsselt im Repository (nie im Klartext)",
  "Policy-Enforcement, Laufzeit-Bedrohungserkennung und Image-Scanning",
  "Verschlüsselter Node-zu-Node-Netzwerkverkehr",
  "Least-Privilege-Zugriff für sämtliche Automatisierung",
];
