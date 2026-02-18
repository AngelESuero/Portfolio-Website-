export type AGITimelinePhase =
  | 'agentic_stumble'
  | 'infrastructure_convergence'
  | 'moment_of_truth';

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
  phase: AGITimelinePhase;
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
