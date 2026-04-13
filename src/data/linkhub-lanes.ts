import type { LinkHubCategoryId } from './linkhub';

export type LinkHubLaneId = LinkHubCategoryId;

export interface LinkHubLaneNote {
  title: string;
  summary: string;
  body: string;
  points?: string[];
  open?: boolean;
}

export interface LinkHubLaneConfig {
  id: LinkHubLaneId;
  label: string;
  lead: string;
  summary: string;
  notes: LinkHubLaneNote[];
}

export const LINK_HUB_LANES: Record<LinkHubLaneId, LinkHubLaneConfig> = {
  music: {
    id: 'music',
    label: 'Music',
    lead: 'Music is the routing layer for the sound archive, not just a list of playlists.',
    summary:
      'This lane groups platform playlists, beat tapes, scraps, and archive fragments so someone can move from a listening mood to the right doorway without losing the larger map.',
    notes: [
      {
        title: 'Platform routes',
        summary: 'Spotify, SoundCloud, YouTube Music, smart links, and Linktree all point at the same sound system.',
        body:
          'The job here is to get from a mood to a listening destination fast. The lane should feel like a routing layer before it feels like a catalog, so the different platforms stay distinct but still point toward the same archive.',
        points: ['Spotify playlists', 'SoundCloud sets', 'YouTube Music playlists', 'Smart links and mirrors'],
        open: true
      },
      {
        title: 'Project shape',
        summary: 'Beat tapes, scraps, and profiles each serve a different listening mode.',
        body:
          'This lane works best when the archive keeps those forms separate. A tape, a scraps collection, and a profile route all answer slightly different questions, and the lane gets clearer when the distinction stays visible.',
        points: ['Project sets', 'Era markers', 'Profile routes', 'Archive fragments']
      },
      {
        title: 'What to add next',
        summary: 'Short liner notes or chronology markers would help the lane grow.',
        body:
          'If this lane keeps expanding, the next useful layer is probably a little more explanation around why the collection is arranged the way it is. That can stay brief, but it will make the route feel more intentional.',
        points: ['Liner notes', 'Release chronology', 'Listening order', 'Small context blocks']
      }
    ]
  },
  writing: {
    id: 'writing',
    label: 'Writing',
    lead: 'Writing is the public voice side of the archive.',
    summary:
      'The lane should let Substack, RSS, and on-site writing act like one readable pathway while still keeping the archive and the feed distinct.',
    notes: [
      {
        title: 'Public voice',
        summary: 'Writing here is both outward-facing and archive-native.',
        body:
          'This lane is where the site says things directly. The important part is not only that the writing exists, but that the lane shows how the writing is meant to be used: as a public voice, a record, and a place to return to.',
        points: ['Long-form essays', 'Shorter posts', 'Archive-native writing', 'Public voice']
      },
      {
        title: 'Profile + feed + archive',
        summary: 'Substack, RSS, and on-site writing should stay readable as separate routes.',
        body:
          'The lane gets stronger when the reader can tell whether they are entering a feed, a profile, or a stable on-site page. Those routes belong together, but they should not be flattened into one undifferentiated writing surface.',
        points: ['Substack profile', 'Substack feed', 'Writing archive', 'RSS feed'],
        open: true
      },
      {
        title: 'Next pass',
        summary: 'Future growth could add clusters, themes, or editorial notes.',
        body:
          'If this lane grows, the most useful upgrade may be a short note about what kind of writing lives where. That would help turn the hub from a set of links into a more deliberate reading path.',
        points: ['Theme clusters', 'Editorial notes', 'Reading paths', 'Category framing']
      }
    ]
  },
  video: {
    id: 'video',
    label: 'Video',
    lead: 'Video is the moving part of the hub.',
    summary:
      'The lane ties together a flagship video, a music video, and the uploads playlist so the motion layer stays legible without losing the archive links around it.',
    notes: [
      {
        title: 'A moving archive',
        summary: 'Video works best when the viewer can tell what is a feature and what is a route.',
        body:
          'This lane is the most obviously motion-led part of the hub, so it helps to treat it like a small editorial shelf. The goal is to make the major pieces feel easy to enter while keeping the full video archive nearby.',
        points: ['Feature video', 'Music video', 'Uploads playlist', 'Archive route'],
        open: true
      },
      {
        title: 'One flagship, one document, one feed',
        summary: 'The lane already has a useful internal shape.',
        body:
          'The existing items fall into a clean trio: a flagship piece, a shaped short-form piece, and a feed of uploads. That makes the lane feel like a structure instead of a random stack.',
        points: ['Flagship view', 'Short-form piece', 'Uploads feed', 'Route back to archive']
      },
      {
        title: 'Next pass',
        summary: 'More commentary or a few release notes could deepen the lane.',
        body:
          'If this lane grows, short notes about why each video matters would make it easier to browse intentionally. That would keep the embed functionality while adding a clearer layer of thought.',
        points: ['Release notes', 'Context markers', 'Feature notes', 'Viewing order']
      }
    ]
  },
  resources: {
    id: 'resources',
    label: 'Resources',
    lead: 'Resources is the utility lane.',
    summary:
      'This lane keeps wellbeing, study, work, and reference links available without pretending they are finished projects.',
    notes: [
      {
        title: 'Utility first',
        summary: 'These links should stay easy to reach and easy to scan.',
        body:
          'Resources are most useful when they feel operational instead of decorative. The lane should behave like a quiet utility shelf: practical, stable, and easy to come back to when a specific need shows up.',
        points: ['Study aids', 'Work references', 'Wellbeing tools', 'On-site utilities'],
        open: true
      },
      {
        title: 'Work and wellbeing',
        summary: 'The lane mixes practical and personal supports on purpose.',
        body:
          'That mix matters because the archive does not split neatly between productivity and care. A good resources lane can hold both work-facing tools and the more grounded practices that make the work sustainable.',
        points: ['Wellbeing', 'Work support', 'Reading aids', 'On-site resources']
      },
      {
        title: 'Next pass',
        summary: 'This lane could eventually split into narrower sub-lanes.',
        body:
          'If the resource stack keeps growing, the next clean move may be separating work, study, and wellbeing into clearer groups. For now, the lane should keep its utility-first shape and avoid becoming noisy.',
        points: ['Work tools', 'Study tools', 'Wellbeing tools', 'Reference split']
      }
    ]
  },
  legal: {
    id: 'legal',
    label: 'Legal',
    lead: 'Legal holds the boundary documents.',
    summary:
      'This lane stays intentionally small and direct because the job is orientation and accountability, not breadth.',
    notes: [
      {
        title: 'Boundaries and governance',
        summary: 'The lane is about rules, accountability, and institutional language.',
        body:
          'Legal and policy docs should feel crisp. They do not need to be numerous to be useful; they need to tell the reader what boundary is being drawn and why that boundary exists.',
        points: ['Policy', 'Accountability', 'Boundaries', 'Institutional language'],
        open: true
      },
      {
        title: 'Small on purpose',
        summary: 'A narrow lane can still be useful if it stays precise.',
        body:
          'This lane should probably remain short and specific unless new governance material appears. Its job is to keep the site honest and oriented, not to become a giant legal archive.',
        points: ['Concise', 'Precise', 'Readable', 'Minimal but clear']
      },
      {
        title: 'Next pass',
        summary: 'More governance or accountability documents could live here later.',
        body:
          'If more policy work shows up, the lane can grow into a stronger governance stack. Until then, it should keep acting as a clean boundary marker.',
        points: ['Governance docs', 'Accountability notes', 'Boundary setting', 'Policy expansion']
      }
    ]
  },
  social: {
    id: 'social',
    label: 'Social',
    lead: 'Social is the live presence lane.',
    summary:
      'These links are doorways to active surfaces across the web, not destinations in themselves, so the lane should feel current and navigational.',
    notes: [
      {
        title: 'Live routes',
        summary: 'The point here is presence, not completion.',
        body:
          'Social links change the fastest, so this lane should feel like a map of where the archive is alive right now. It is less about preserving a perfect record and more about pointing to current public surfaces.',
        points: ['Instagram', 'YouTube', 'X', 'TikTok', 'Twitch'],
        open: true
      },
      {
        title: 'Social is a doorway',
        summary: 'These links work best when the reader knows they are leaving the site.',
        body:
          'The lane can make the distinction explicit: this is where the archive touches other platforms. That helps the page stay oriented even when the destination is an outside feed or a live service.',
        points: ['Profile routes', 'Live feeds', 'External destinations', 'Current presence']
      },
      {
        title: 'Next pass',
        summary: 'This lane could eventually include more live notes or status signals.',
        body:
          'If the social stack keeps changing, a short note about what each platform is for might help the lane stay readable. The goal is to keep the surface current without turning it into clutter.',
        points: ['Status notes', 'Platform roles', 'Current routes', 'Freshness cues']
      }
    ]
  }
};
