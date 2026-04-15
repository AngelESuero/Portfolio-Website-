export type ArchiveVideoLaneId = 'videos' | 'streams' | 'shorts' | 'other';

export interface ArchiveVideoLaneNote {
  title: string;
  summary: string;
  body: string;
  points?: string[];
  open?: boolean;
}

export interface ArchiveVideoLaneConfig {
  id: ArchiveVideoLaneId;
  label: string;
  lead: string;
  summary: string;
  notes: ArchiveVideoLaneNote[];
}

export const ARCHIVE_VIDEO_LANES: ArchiveVideoLaneConfig[] = [
  {
    id: 'videos',
    label: 'Uploads',
    lead: 'The uploads lane is the main body of the moving-image archive.',
    summary:
      'Standalone videos, music videos, and shaped moving-image pieces live here so the archive reads like a body of work instead of a loose backlog.',
    notes: [
      {
        title: 'Feature pieces stay central',
        summary: 'The biggest uploads should feel like anchors, not just thumbnails in a grid.',
        body:
          'This lane is for the pieces that feel finished enough to carry a title and a point of view. Keeping them together makes the archive easier to read as a record of work rather than a pile of files.',
        points: ['Standalone uploads', 'Music videos', 'Performance captures', 'Documentary pieces'],
        open: true
      },
      {
        title: 'Release versus capture',
        summary: 'Not every upload means the same thing, and the lane should keep that visible.',
        body:
          'A polished release and a raw capture belong to the same family, but they do different jobs. The lane works best when it leaves room for both the finished surface and the rough proof that something happened.',
        points: ['Finished releases', 'Raw captures', 'Release order', 'Public record']
      },
      {
        title: 'What to add next',
        summary: 'A few chronology cues would make this lane easier to browse.',
        body:
          'If this lane keeps growing, the next useful layer is probably a short release note, a timeline cue, or a small way to mark the most important uploads without flattening the rest.',
        points: ['Release notes', 'Chronology', 'Context markers', 'Priority tags']
      }
    ]
  },
  {
    id: 'streams',
    label: 'Streams',
    lead: 'Streams keep the in-progress record visible.',
    summary:
      'Long sessions, live playthroughs, and unedited hangs preserve the timing of the work, so the lane should feel roomy and documentary rather than polished.',
    notes: [
      {
        title: 'Time in public',
        summary: 'The stream lane holds the parts of the archive that need duration to make sense.',
        body:
          'A stream is valuable because it keeps time visible. The lane should protect that quality so the archive still feels like a place where process can stay in view while it is unfolding.',
        points: ['Live sessions', 'Playthroughs', 'Long takes', 'Process']
      },
      {
        title: 'Keep the live texture',
        summary: 'Streams should not get over-edited into something they are not.',
        body:
          'If the live layer gets treated exactly like a release, the point of the lane disappears. The archive should still make room for drift, interruptions, and the casual texture of being there in real time.',
        points: ['Duration', 'Drift', 'Presence', 'Live texture'],
        open: true
      },
      {
        title: 'What to add next',
        summary: 'Session notes or timestamps would make the lane easier to revisit.',
        body:
          'A small note about what happened in a stream, or when it mattered, would help the lane stay navigable without turning it into a transcript.',
        points: ['Session notes', 'Timestamps', 'Highlights', 'Browse cues']
      }
    ]
  },
  {
    id: 'shorts',
    label: 'Shorts',
    lead: 'Shorts carry the quick signals.',
    summary:
      'Snippets, brief edits, and bite-sized clips keep the archive current even when the larger pieces are still forming.',
    notes: [
      {
        title: 'Fast capture',
        summary: 'Short-form pieces are the archive’s quickest way to stay alive.',
        body:
          'This lane catches the fast-response material: clips, fragments, and small moments that matter before they have time to turn into something longer. It keeps the page feeling present-tense.',
        points: ['Snippets', 'Brief edits', 'Quick captures', 'Current signals'],
        open: true
      },
      {
        title: 'Context still matters',
        summary: 'A short piece still needs a frame around it.',
        body:
          'The lane should make it easy to tell why a clip exists and how it connects to the bigger body of work. Otherwise short-form material can feel disposable when it is actually doing useful work.',
        points: ['Context lines', 'Related work', 'Short-form notes', 'Why it exists']
      },
      {
        title: 'What to add next',
        summary: 'Captions or series tags could make the lane easier to scan.',
        body:
          'A small set of recurring labels would probably do more than extra decoration. The goal is to help someone recognize a thread quickly without making the lane feel noisy.',
        points: ['Captions', 'Series tags', 'Thread markers', 'At-a-glance sorting']
      }
    ]
  },
  {
    id: 'other',
    label: 'Other',
    lead: 'Other keeps the edge cases from disappearing.',
    summary:
      'Anything moving-image that does not fit the cleaner buckets still belongs in the record, so this lane acts like a deliberate catchall instead of a forgotten drawer.',
    notes: [
      {
        title: 'Keep the edges visible',
        summary: 'Odd files and uncategorized clips should still have a home.',
        body:
          'The lane protects the pieces that do not yet fit a cleaner type. That keeps the archive honest about its rough edges instead of hiding them behind the neat categories.',
        points: ['Odd files', 'Unsorted clips', 'Edge cases', 'Temporary homes'],
        open: true
      },
      {
        title: 'Useful roughness',
        summary: 'Some pieces matter precisely because they are in-between.',
        body:
          'This lane can hold the awkward, early, or unresolved items that still matter to the story of the moving-image work. Not everything needs to be resolved before it belongs here.',
        points: ['In-between pieces', 'Early experiments', 'Unresolved items', 'Useful roughness']
      },
      {
        title: 'What to add next',
        summary: 'If the pile grows, this lane can split later.',
        body:
          'A few clearer labels could eventually break this lane into narrower groups. For now, it should stay a simple catchall with good notes and no apology.',
        points: ['Future splits', 'Clear labels', 'Catchall lane', 'Less noise']
      }
    ]
  }
];

