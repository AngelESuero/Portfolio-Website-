export type AGITimelineWave =
  | 'software_disruption_now'
  | 'broad_labor_stress'
  | 'physical_economy_disruption'
  | 'scenario_territory';

export type AGITimelineKind = 'signal' | 'thesis';
export type AGITimelineDomain = 'software' | 'labor' | 'robotics' | 'energy' | 'policy';
export type AGITimelineConfidence = 'low' | 'medium' | 'high';
export type AGITimelineHorizon = 'near' | 'mid' | 'long';
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

export interface AGITimelineItem {
  id: string;
  phase: AGITimelineWave;
  kind: AGITimelineKind;
  domain: AGITimelineDomain;
  confidence: AGITimelineConfidence;
  timeHorizon: AGITimelineHorizon;
  evidenceType: AGIEvidenceType;
  year: number;
  headline: string;
  url: string;
  sourceId: string;
  sourceName: string;
  publishedAt: string;
  summary: string;
  tags: string[];
  citations: AGICitation[];
  public: {
    summary: string;
    implication: string;
    analogy?: string;
  };
  analyst: {
    metric: string;
    value: string | number;
    dataSource: string;
    trend: 'improving' | 'stable' | 'concerning' | 'neutral';
    context?: string;
  };
  engineer: {
    technicalDetail: string;
    architectureNote?: string;
    bottleneck?: string;
    parameter?: {
      name: string;
      value: string;
      equation?: string;
    };
    references?: AGIReference[];
  };
}
