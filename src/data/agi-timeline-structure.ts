export type AGITimelineWave =
  | 'software_disruption_now'
  | 'broad_labor_stress'
  | 'physical_economy_disruption'
  | 'scenario_territory';

export type AGITimelineKind = 'signal' | 'thesis';

export type AGITimelineDomain = 'software' | 'labor' | 'robotics' | 'energy' | 'policy';

export type AGITimelineConfidence = 'low' | 'medium' | 'high';

export type AGITimeHorizon = 'near' | 'mid' | 'long';

export type AGIEvidenceType = 'paper' | 'benchmark' | 'deployment' | 'labor' | 'policy' | 'interpretation';

export interface AGICitation {
  label: string;
  url: string;
}

export interface AGIReference {
  title: string;
  authors?: string;
  conference?: string;
  link?: string;
}

export interface AGIWaveDefinition {
  id: AGITimelineWave;
  title: string;
  timebox: string;
  publicThesis: string;
  narrative: string;
  overlap: string;
  analystFocus: string;
  engineerFocus: string;
  gates: string[];
  laneStart: number;
  laneEnd: number;
}

export interface AGITimelineItem {
  id: string;
  wave: AGITimelineWave;
  kind: AGITimelineKind;
  domain: AGITimelineDomain;
  confidence: AGITimelineConfidence;
  timeHorizon: AGITimeHorizon;
  evidenceType: AGIEvidenceType;
  year: number;
  timingLabel?: string;
  headline: string;
  url: string;
  sourceId: string;
  sourceName: string;
  publishedAt: string;
  summary: string;
  tags: string[];
  citations: AGICitation[];
  whyIncluded?: string;
  public: {
    summary: string;
    implication: string;
    caution?: string;
    analogy?: string;
  };
  analyst: {
    thesisRole: string;
    context: string;
    watchFor?: string;
  };
  engineer: {
    technicalDetail: string;
    architectureNote?: string;
    bottleneck?: string;
    dependencies?: string[];
    unlocks?: string[];
    references?: AGIReference[];
  };
}

export interface AGITimelineMeta {
  schemaVersion: number;
  thesisVersion: string;
  updatedAt: string;
}

export interface AGITimelineDataset {
  meta: AGITimelineMeta;
  waves: AGIWaveDefinition[];
  items: AGITimelineItem[];
}
