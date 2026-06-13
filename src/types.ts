export interface AnalystReport {
  analyst: string;
  signal: string;
  confidence: number;
  summary: string;
  keyPoints: string[];
  fullReport?: string;
}

export interface CommitteeVotes {
  bullish: number;
  bearish: number;
  neutral: number;
}

export interface Decision {
  coin: string;
  action: string;
  confidence: number;
  rationale: string;
  committeeVotes: CommitteeVotes;
  analystReports: AnalystReport[];
  timestamp: string;
}

export interface SystemStatus {
  status: string;
  lastRun: string | null;
  lastDecision: string | null;
  lastConfidence: number | null;
  model?: string | null;
}
