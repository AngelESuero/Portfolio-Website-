export interface IdeaMetric {
  label: string;
  value: string;
}

export interface IdeaThought {
  title: string;
  summary: string;
  body: string;
  points?: string[];
  open?: boolean;
}

export interface IdeaValue {
  title: string;
  against: string;
}

export interface IdeaLane {
  title: string;
  body: string;
}

export interface IdeaCard {
  title: string;
  body: string;
  badge?: string;
}

export interface IdeaSection {
  id: string;
  label: string;
  lead: string;
  summary: string;
  notes: IdeaThought[];
  cards: IdeaCard[];
}

export const IDEA_SOURCE = {
  handle: '@a_e_s_4',
  generatedAt: 'April 14, 2026',
  source: 'X / Twitter'
} as const;

export const IDEA_STATS: IdeaMetric[] = [
  { label: 'Sections', value: '8' },
  { label: 'Clusters', value: '48' },
  { label: 'Source', value: IDEA_SOURCE.source },
  { label: 'Status', value: 'Lane pass' }
];

export const IDEA_THROUGH_LINE =
  'How do we build lives, tools, cultures, and systems that help people become more whole rather than more fragmented?';

export const IDEA_VALUES: IdeaValue[] = [
  {
    title: 'Wholeness over fragmentation',
    against: 'Against scattered tools, broken UX, patchwork systems, and split identity.'
  },
  {
    title: 'Truth over hype',
    against: 'Against half-truths, hype cycles, shallow performance, and PR theater.'
  },
  {
    title: 'Authenticity in art',
    against: 'Against pain packaging, image-selling, and performative vulnerability.'
  },
  {
    title: 'Human dignity and material fairness',
    against: 'Against exclusion, prestige barriers, and normalized deprivation.'
  },
  {
    title: 'Technology as liberation infrastructure',
    against: 'Against tech as a luxury toy, prestige object, or entertainment layer only.'
  },
  {
    title: 'Consciousness as a governing framework',
    against: 'Against unmanaged compulsion, identity drift, and inner disorder as normal.'
  },
  {
    title: 'Democratized access to excellence',
    against: 'Against artificial hierarchy, mystified expertise, and access bottlenecks.'
  },
  {
    title: 'Life-affirming culture',
    against: 'Against culture as extraction, attention capture, and glorified suffering.'
  }
];

export const IDEA_LANES: IdeaLane[] = [
  {
    title: 'AI, labor, and social transition',
    body: 'What people are owed while automation changes the terms of work and participation.'
  },
  {
    title: 'Humane design and fragmented tools',
    body: 'Why digital life feels broken, and how interfaces could feel more like minds than menus.'
  },
  {
    title: 'Truthful culture and music',
    body: 'Why art should process experience honestly instead of simply packaging pain or image.'
  },
  {
    title: 'Consciousness and human becoming',
    body: 'Inner health, stillness, and relational wholeness as public infrastructure.'
  }
];

export const IDEA_SECTIONS: IdeaSection[] = [
  {
    id: 'product',
    label: 'Product & UX',
    lead: 'The best product ideas reduce translation between intent and interface.',
    summary: 'Feature requests, interaction fixes, and product direction notes across social apps, AI tools, and devices.',
    notes: [
      {
        title: 'Calmer social surfaces',
        summary: 'The social product notes keep pointing toward less noise and more control.',
        body:
          'Age filters, anonymous live joins, reorderable grids, and dark overlays all point toward the same desire: make the interface less visually and socially brittle.',
        points: ['Age filters', 'Anonymous live joins', 'Reorderable grids', 'Dark overlays'],
        open: true
      },
      {
        title: 'AI as legibility layer',
        summary: 'The AI product notes are less about novelty than clarity.',
        body:
          'Grammar improvement, Grok rewrite, ChatGPT audio, and Canvas parity with Docs all point toward a product surface that can explain itself more clearly.',
        points: ['Grammar toggle', 'Grok rewrite', 'Audio responses', 'Docs-level Canvas']
      },
      {
        title: 'Utility without friction',
        summary: 'Device and access ideas keep collapsing back into usefulness.',
        body:
          'Voice memos while video plays, AirPods without a phone, a better Photos API, and lossless MOV preservation all ask the same thing: make the tool feel lighter than the task.',
        points: ['Voice memo + video', 'AirPods standalone', 'Photo API', 'Lossless MOV']
      }
    ],
    cards: [
      {
        title: 'Social media ergonomics',
        body: 'Age filters, anonymous live joins, reorderable grids, and dark overlays that make the platforms feel calmer.',
        badge: 'social'
      },
      {
        title: 'X / Twitter legibility',
        body: 'A grammar-improvement toggle, auto-follow based on proximity, and a Grok rewrite button for more legible language.',
        badge: 'X'
      },
      {
        title: 'Creator presence and community',
        body: 'Thread creation in Discord forums, SoundCloud presence in status, and shareable GIFs on Pinterest.',
        badge: 'community'
      },
      {
        title: 'AI product flow',
        body: 'A Discord forum for OpenAI feedback, folder support in ChatGPT, an on-device notepad, and Canvas parity with Docs.',
        badge: 'AI'
      },
      {
        title: 'Device utility',
        body: 'AirPods without a phone, voice memo recording while video plays, and lossless MOV preservation in photos workflows.',
        badge: 'hardware'
      },
      {
        title: 'Access and moderation',
        body: 'A better Google Photos API, wildlife reporting in CitizenApp, copyright reform on YouTube, and stronger platform accountability.',
        badge: 'access'
      }
    ]
  },
  {
    id: 'aipolicy',
    label: 'AI Policy',
    lead: 'If AI changes work, the social transition has to be designed on purpose.',
    summary: 'Transition support, trust infrastructure, verification, and the public duties that come with widespread AI adoption.',
    notes: [
      {
        title: 'Transition support',
        summary: 'The labor question needs practical buffer zones.',
        body:
          'Tax AI companies, publish a public UBI timeline, and treat UBI like an early-retirement bridge. The important part is the transition being legible before it is perfect.',
        points: ['Tax AI companies', 'Public UBI timeline', 'Grace periods', 'Early-retirement frame'],
        open: true
      },
      {
        title: 'Trust infrastructure',
        summary: 'People will trust systems through institutions and humans they already know.',
        body:
          'Libraries, museums, nonprofits, and ambassadors matter because the social bridge is as important as the model. Adoption becomes easier when people can ask a trusted person what the system is doing.',
        points: ['Libraries', 'Museums', 'Nonprofits', 'Ambassador role']
      },
      {
        title: 'Safety and consent',
        summary: 'Verification should happen before the agent acts.',
        body:
          'Deepfake checks, human-or-bot registration, Face ID style confirmations, and a visible path from AI distress to therapy all point toward safety that feels actionable instead of theoretical.',
        points: ['Deepfake detection', 'Face ID / Touch ID', 'Human/bot registration', 'Therapy connector']
      }
    ],
    cards: [
      {
        title: 'Transition support and UBI',
        body: 'Tax AI companies, publish a public UBI timeline, and treat UBI like an early-retirement bridge rather than a slogan.',
        badge: 'policy'
      },
      {
        title: 'Grace periods for disruption',
        body: 'If AI changes the labor market quickly, the response should include broad grace periods instead of instant pressure.',
        badge: 'transition'
      },
      {
        title: 'Trust infrastructure',
        body: 'An AI Ambassador Program rooted in libraries, museums, nonprofits, and people others already trust.',
        badge: 'trust'
      },
      {
        title: 'Safety and verification',
        body: 'Deepfake detection, human or bot registration, and Face ID style checks before an agent acts on your behalf.',
        badge: 'safety'
      },
      {
        title: 'Data portability and care',
        body: 'Move data between AI platforms more freely, and build a visible pathway from AI distress to real human support.',
        badge: 'buildable'
      },
      {
        title: 'Creative consent and cultural AI',
        body: 'Use AI for cancelled shows, cultural closure episodes, and public art only when consent, royalties, and authorship are explicit.',
        badge: 'consent'
      }
    ]
  },
  {
    id: 'governance',
    label: 'Governance',
    lead: 'Government feels brittle when no one can hold it at human scale.',
    summary: 'How power, bureaucracy, health, and public institutions shape the actual room people have to live in.',
    notes: [
      {
        title: 'Power and bureaucracy',
        summary: 'One-to-one government is a recurring demand.',
        body:
          'The critiques keep circling the same issue: bureaucracy hides accountability, and power concentrates when people cannot see the human relationship to the institution.',
        points: ['One-to-one relationship', 'Bureaucracy as ambiguity', 'Branch protection', 'Wealth concentration'],
        open: true
      },
      {
        title: 'Health and pricing',
        summary: 'Basic life should not be priced like luxury access.',
        body:
          'Healthcare and congestion pricing are both framed as structural design problems, because the cost of existing should not become the dominant logic of the system.',
        points: ['Healthcare critique', 'Congestion pricing', 'Access', 'Structural design']
      },
      {
        title: 'Public goods and transparency',
        summary: 'The next layer is about what the state owes people in practice.',
        body:
          'Paid UN internships, ownership in games, public expectation timelines, and visible system progress all belong to the same argument about shared capacity and honest institutions.',
        points: ['Paid internships', 'Open intelligence', 'Expectation timelines', 'Visible progress']
      }
    ],
    cards: [
      {
        title: 'Power concentration and bureaucracy',
        body: 'Government should feel one-to-one, bureaucracy should not hide power, and wealth concentration should be treated as a structural issue.',
        badge: 'civic'
      },
      {
        title: 'Health, pricing, and access',
        body: 'Healthcare should not become a tax on existence, and congestion pricing should be judged against the real cost of leaving.',
        badge: 'access'
      },
      {
        title: 'Civic opportunity and public goods',
        body: 'Paid UN internships, wider ownership in games and society, and a world where intelligence is not locked behind money.',
        badge: 'public'
      },
      {
        title: 'Accountability and transparency',
        body: 'Public expectation timelines, visible system progress, and branches of government protected from political capture.',
        badge: 'transparency'
      },
      {
        title: 'AI governance and stability',
        body: 'If automation creates social strain, the answer is not panic but a better civic plan for rights, work, and stability.',
        badge: 'governance'
      }
    ]
  },
  {
    id: 'culture',
    label: 'Culture & Music',
    lead: 'Culture should help people process life, not only package it.',
    summary: 'What art should do, what it is doing instead, and how music, media, and fame shape public feeling.',
    notes: [
      {
        title: 'Authenticity over image',
        summary: 'The archive keeps rejecting art that sells a feeling instead of a truth.',
        body:
          'Inauthentic music, performance-only vulnerability, and image-selling all get treated as signs of a culture that has lost its center.',
        points: ['Authentic music', 'No image-selling', 'Vulnerability with movement', 'Process over polish'],
        open: true
      },
      {
        title: 'Process in public',
        summary: 'Livestreams and long-form progress now matter more than mystery.',
        body:
          'The idea that snippets are a dead format shows up alongside praise for artists showing the work while it is still being made. That makes the lane feel more like a living studio than a highlight reel.',
        points: ['Livestream sets', 'Open process', 'Snippets are dead', 'Long-form progress']
      },
      {
        title: 'Celebrity and closure',
        summary: 'Fame should become less insulated and more human.',
        body:
          'The celebrity notes, the media notes, and the TV closure ideas all push toward a culture where people are less boxed in by image and more allowed to be ordinary, flawed, and unfinished.',
        points: ['Normalize famous people', 'Show endings', 'Closure episodes', 'Ordinary humanity']
      }
    ],
    cards: [
      {
        title: 'Authenticity over image',
        body: 'Inauthentic music is poisonous, and culture should stop rewarding performances that only sell a feeling of depth.',
        badge: 'music'
      },
      {
        title: 'Public process beats snippets',
        body: 'The creative process is public now. Livestreams and long-form progress matter more than isolated snippets.',
        badge: 'process'
      },
      {
        title: 'Artists, responsibility, and growth',
        body: 'J. Cole, Kenny Beats, Bieber, and Mac Miller all point to the same question: are we showing real movement, or just emotion?',
        badge: 'artists'
      },
      {
        title: 'Fame as ordinary life',
        body: 'Normalize famous people as people, shrink the moat, and stop treating access as the only proof of value.',
        badge: 'fame'
      },
      {
        title: 'Originals and the archive',
        body: 'The personal archive of songs, performances, and rough cuts matters because it records the arc of becoming.',
        badge: 'archive'
      },
      {
        title: 'Culture as survival',
        body: 'Entertainment made this era worth living through, but culture should also build the conditions for a better life.',
        badge: 'core idea'
      }
    ]
  },
  {
    id: 'consciousness',
    label: 'Consciousness',
    lead: 'Inner wholeness is the real infrastructure.',
    summary: 'Stillness, wholeness, health, spirituality, and the inner conditions that make a livable life possible.',
    notes: [
      {
        title: 'Health as a practice',
        summary: 'This lane treats health as something you build, not just something you have.',
        body:
          'Repeated references to a culture of health, meditation, and bodily awareness turn the lane into a public operating system for steadiness.',
        points: ['Culture of health', 'Meditation', 'Bodily awareness', 'Managed health'],
        open: true
      },
      {
        title: 'Relationship and becoming',
        summary: 'Dating, peacocking, and intimacy get read as development problems too.',
        body:
          'The lane keeps insisting that relationships are not just social habits. They are part of how people become more integrated, or more fragmented, over time.',
        points: ['Dating culture', 'Peacocking', 'Wholeness in love', 'Human becoming']
      },
      {
        title: 'Spiritual support and precarity',
        summary: 'Practice and poverty live close together here.',
        body:
          'Sadhguru, Inner Engineering, Isha Foundation, Miracle Mind, and the poverty notes all point toward a lane where consciousness is shaped by access, support, and the conditions people live in.',
        points: ['Sadhguru', 'Inner Engineering', 'Isha Foundation', 'Precarity']
      }
    ],
    cards: [
      {
        title: 'Culture of health',
        body: 'Stillness, bodily awareness, and managed health are not side quests. They are a working system.',
        badge: 'health'
      },
      {
        title: 'Wholeness and love',
        body: 'You cannot fully love from a fragmented self, and consciousness becomes the framework for that realization.',
        badge: 'wholeness'
      },
      {
        title: 'Conscious relation',
        body: 'Dating, peacocking, and even institutional structures become clearer when viewed through conscious development.',
        badge: 'relation'
      },
      {
        title: 'Spiritual practice as infrastructure',
        body: 'Sadhguru, Inner Engineering, Isha, and Miracle Mind show up here as practical supports rather than pure reference points.',
        badge: 'practice'
      },
      {
        title: 'Poverty and fragmentation',
        body: 'Precarity narrows perception, compresses choice, and makes inner fragmentation feel normal unless something changes.',
        badge: 'development'
      },
      {
        title: 'Life, doubt, and becoming',
        body: 'Life is profound, doubt is useful, and completion anxiety is a reminder that becoming never truly ends.',
        badge: 'becoming'
      }
    ]
  },
  {
    id: 'techphil',
    label: 'Tech Philosophy',
    lead: 'Interfaces should fit the mind before they try to optimize the machine.',
    summary: 'How technology should relate to human experience, and why most products still ask for too much adaptation.',
    notes: [
      {
        title: 'Human-centered AI UX',
        summary: 'The mind should not have to translate itself into folders and modes.',
        body:
          'The best system feels native to thought, not like another layer of software asking for attention.',
        points: ['Mind-shaped UX', 'No extra modes', 'Screenless intelligence', 'Native to thought'],
        open: true
      },
      {
        title: 'Compression and clarity',
        summary: 'Big ideas should get smaller without getting weaker.',
        body:
          'The archive repeatedly says ideas need to start wide and then compress with no loss of force. That is a useful rule for product, writing, and AI surfaces alike.',
        points: ['Start big', 'Compress with force', 'Legibility', 'Less jargon']
      },
      {
        title: 'Games and boundaries',
        summary: 'Control should disappear into the experience, but people should still remain in the loop.',
        body:
          'Some systems should feel invisible, like good game control. Others, especially life-or-death ones, should stay clearly human.',
        points: ['Invisible controls', 'Immersive games', 'Human decisions', 'AI assistance']
      }
    ],
    cards: [
      {
        title: 'Human-centered AI UX',
        body: 'Interfaces should mirror the mind, not bury it in folders and extra modes. The best system is the one that feels native to thought.',
        badge: 'design'
      },
      {
        title: 'Empowerment without screens',
        body: 'The point is not another app to learn. It is everyday intelligence woven into normal life and movement.',
        badge: 'everyday'
      },
      {
        title: 'Compression and clarity',
        body: 'Ideas should start big, then compress as much as possible without losing force or legibility.',
        badge: 'clarity'
      },
      {
        title: 'Games and immersion',
        body: 'Good control systems should disappear into the experience, not sit on top of it and demand attention.',
        badge: 'games'
      },
      {
        title: 'Human-AI boundaries',
        body: 'AI can assist, but life-or-death decisions should stay in a human relationship, not become full delegation.',
        badge: 'boundary'
      },
      {
        title: 'LLM connectors as an OS',
        body: 'The connector layer looks like the beginning of an operating system, and that seems deliberate.',
        badge: 'OS'
      }
    ]
  },
  {
    id: 'self',
    label: 'Self & Placement',
    lead: 'This lane is the gap between capacity and position.',
    summary: 'Direct statements about identity, career, aspiration, and the gap between capacity and current position.',
    notes: [
      {
        title: 'Capable, but misplaced',
        summary: 'The self-description is precise enough to build from.',
        body:
          'The recurring theme is not incapacity; it is misalignment. There is enough signal here to say the problem is placement, not potential.',
        points: ['Misplacement', 'Potential', 'Alignment', 'Readiness'],
        open: true
      },
      {
        title: 'Ambition and contribution',
        summary: 'The path keeps pointing toward building something public.',
        body:
          'OpenAI, product leadership, and contribution show up as the kinds of roles that would let the work scale without losing meaning.',
        points: ['Build', 'PM path', 'Public contribution', 'Scale with meaning']
      },
      {
        title: 'Knowledge into motion',
        summary: 'Knowing things is not the same as changing a room.',
        body:
          'The lane keeps challenging itself to convert thinking into motion, and motion into service. That tension is probably the right one to keep visible.',
        points: ['Action', 'Attention fatigue', 'Conviction', 'Service']
      }
    ],
    cards: [
      {
        title: 'Capable, but misplaced',
        body: 'That feels like the clearest self-description in the whole set: capable, but not yet placed where the work belongs.',
        badge: 'self'
      },
      {
        title: 'Ambition and contribution',
        body: 'The path points toward building, contributing, and eventually stepping into product leadership or public-facing roles.',
        badge: 'ambition'
      },
      {
        title: 'Attention fatigue',
        body: 'Trying too hard to hold attention is exhausting. The point is to build something stronger than attention games.',
        badge: 'pressure'
      },
      {
        title: 'Knowing versus doing',
        body: 'Knowing a lot does not automatically change the room. The real task is converting knowledge into motion.',
        badge: 'action'
      },
      {
        title: 'Conviction and uncertainty',
        body: 'There is a recurring question about why everyone speaks with conviction, and what that means for an honest life.',
        badge: 'reflection'
      },
      {
        title: 'Love, stage, and service',
        body: 'Wanting more, wanting to perform, and wanting to love fully all point in the same direction: stay alive to the work.',
        badge: 'service'
      }
    ]
  },
  {
    id: 'speculative',
    label: 'Speculative',
    lead: 'The future lane is where the model tests its own assumptions.',
    summary: 'Hypotheses, thought experiments, and questions about consciousness, physics, and long-range futures.',
    notes: [
      {
        title: 'Observer and physics',
        summary: 'Some ideas are really about whether the observer is part of the system.',
        body:
          'The string theory question and the broader observer hypothesis both ask whether existence includes the witness, not just the thing witnessed.',
        points: ['Observer hypothesis', 'String theory', 'Embodiment of reality', 'Perception'],
        open: true
      },
      {
        title: 'RL and purpose',
        summary: 'Reward, evolution, and survival keep getting compared.',
        body:
          'The reinforcement-learning analogy makes the lane feel like a lab for thinking about purpose, not just a technical metaphor.',
        points: ['RL analogy', 'Reward', 'Evolution', 'Survival mechanics']
      },
      {
        title: 'Embodiment and value',
        summary: 'The long horizon stays grounded in whether intelligence can live in the world.',
        body:
          'Aging, singularity skepticism, embodied experience, and monetization all come back to the same question: what remains real when the future arrives?',
        points: ['Aging', 'Embodied AGI', 'Singularity skepticism', 'Value and monetization']
      }
    ],
    cards: [
      {
        title: 'Observer and physics',
        body: 'What if the observer is part of the underlying mechanism, not just a passenger watching it happen?',
        badge: 'physics'
      },
      {
        title: 'RL and purpose',
        body: 'Reinforcement learning, life, and evolution all share a strange family resemblance when you look at reward, survival, and behavior.',
        badge: 'theory'
      },
      {
        title: 'Long-range futures',
        body: 'Aging, singularity narratives, and world change all sit in the same long horizon of what might still be possible.',
        badge: 'future'
      },
      {
        title: 'Embodiment and AGI',
        body: 'Embodied experience may be required for real general intelligence. Language alone may not be enough.',
        badge: 'AGI'
      },
      {
        title: 'Singularity skepticism',
        body: 'The classic singularity story might be too clean. Real change may be slower, messier, and more distributed.',
        badge: 'skepticism'
      },
      {
        title: 'Value and monetization',
        body: 'One lingering question remains: can inherent value become monetizable without being flattened in the process?',
        badge: 'economics'
      }
    ]
  }
];
