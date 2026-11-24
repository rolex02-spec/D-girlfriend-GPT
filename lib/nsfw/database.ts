// Sexual positions database
export const sexualPositions: Record<string, {
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  intimacy: number; // 1-10
  pleasure: number; // 1-10
  tags: string[];
}> = {
  missionary: {
    name: 'Missionary',
    description: 'Classic face-to-face position, intimate eye contact, deep penetration',
    difficulty: 'easy',
    intimacy: 9,
    pleasure: 7,
    tags: ['romantic', 'intimate', 'deep'],
  },
  doggy: {
    name: 'Doggy Style',
    description: 'From behind, deep penetration, pulling hair',
    difficulty: 'easy',
    intimacy: 6,
    pleasure: 9,
    tags: ['rough', 'deep', 'dominant'],
  },
  cowgirl: {
    name: 'Cowgirl (Ride Me)',
    description: 'She rides you, controls the pace, bounces up and down',
    difficulty: 'medium',
    intimacy: 8,
    pleasure: 8,
    tags: ['dominant', 'controlling', 'visual'],
  },
  reverse_cowgirl: {
    name: 'Reverse Cowgirl',
    description: 'She faces away while riding, great view from behind',
    difficulty: 'medium',
    intimacy: 6,
    pleasure: 8,
    tags: ['visual', 'dominant', 'dirty'],
  },
  spooning: {
    name: 'Spooning',
    description: 'Side by side, slow and intimate, perfect for lazy sex',
    difficulty: 'easy',
    intimacy: 10,
    pleasure: 7,
    tags: ['romantic', 'slow', 'intimate'],
  },
  standing: {
    name: 'Standing',
    description: 'Lift her against the wall, urgent and passionate',
    difficulty: 'hard',
    intimacy: 7,
    pleasure: 9,
    tags: ['rough', 'passionate', 'urgent'],
  },
  lap_sitting: {
    name: 'Lap Sitting',
    description: 'She sits on your lap facing you, grinding together',
    difficulty: 'easy',
    intimacy: 9,
    pleasure: 7,
    tags: ['intimate', 'close', 'romantic'],
  },
  legs_up: {
    name: 'Legs Up (Over Shoulders)',
    description: 'Her legs on your shoulders, deepest penetration possible',
    difficulty: 'medium',
    intimacy: 7,
    pleasure: 10,
    tags: ['deep', 'intense', 'flexible'],
  },
  prone: {
    name: 'Prone (Flat)',
    description: 'She lies flat on stomach, you enter from above, grinding',
    difficulty: 'easy',
    intimacy: 8,
    pleasure: 7,
    tags: ['intimate', 'slow', 'grinding'],
  },
  edge_of_bed: {
    name: 'Edge of Bed',
    description: 'She lies on edge of bed, you stand and thrust',
    difficulty: 'easy',
    intimacy: 6,
    pleasure: 9,
    tags: ['dominant', 'deep', 'controlling'],
  },
  lotus: {
    name: 'Lotus Position',
    description: 'She wraps legs around you while sitting, face to face',
    difficulty: 'hard',
    intimacy: 10,
    pleasure: 8,
    tags: ['romantic', 'intimate', 'close'],
  },
  chair: {
    name: 'Chair Position',
    description: 'You sit on chair, she sits on you facing away',
    difficulty: 'medium',
    intimacy: 7,
    pleasure: 8,
    tags: ['dominant', 'lazy', 'fun'],
  },
  wheelbarrow: {
    name: 'Wheelbarrow',
    description: 'She holds herself up, you hold her legs, deep penetration',
    difficulty: 'hard',
    intimacy: 5,
    pleasure: 9,
    tags: ['rough', 'deep', 'athletic'],
  },
  side_by_side: {
    name: 'Side by Side',
    description: 'Facing each other on sides, intimate and slow',
    difficulty: 'easy',
    intimacy: 10,
    pleasure: 7,
    tags: ['romantic', 'slow', 'intimate'],
  },
  x_position: {
    name: 'X Position',
    description: 'Her legs spread wide in X shape, maximum access',
    difficulty: 'medium',
    intimacy: 7,
    pleasure: 10,
    tags: ['deep', 'exposed', 'intense'],
  },
};

// Sexual acts database
export const sexualActs: Record<string, {
  name: string;
  description: string;
  nsfwLevel: 'soft' | 'medium' | 'extreme';
  tags: string[];
}> = {
  // Oral
  handjob: {
    name: 'Handjob',
    description: 'She strokes your cock with her hand, stroking up and down',
    nsfwLevel: 'medium',
    tags: ['hand', 'stroke', 'slow'],
  },
  blowjob: {
    name: 'Blowjob',
    description: 'She takes your cock in her mouth, sucking and licking',
    nsfwLevel: 'extreme',
    tags: ['mouth', 'sucking', 'licking'],
  },
  deepthroat: {
    name: 'Deepthroat',
    description: 'She takes your cock deep in her throat, gagging',
    nsfwLevel: 'extreme',
    tags: ['mouth', 'deep', 'gagging'],
  },
  titjob: {
    name: 'Titjob (Paizuri)',
    description: 'She squeezes her breasts around your cock, rubbing',
    nsfwLevel: 'extreme',
    tags: ['breasts', 'rubbing', 'between'],
  },
  footjob: {
    name: 'Footjob',
    description: 'She uses her feet to stroke your cock',
    nsfwLevel: 'extreme',
    tags: ['feet', 'stroke', 'toes'],
  },
  cunnilingus: {
    name: 'Cunnilingus (Eating Out)',
    description: 'You lick her pussy, tongue inside her',
    nsfwLevel: 'extreme',
    tags: ['pussy', 'licking', 'tongue'],
  },
  rimjob: {
    name: 'Rimjob (Analingus)',
    description: 'Licking around the asshole',
    nsfwLevel: 'extreme',
    tags: ['ass', 'licking', 'tongue'],
  },
  sixty_nine: {
    name: '69 Position',
    description: 'Mutual oral sex, facing opposite directions',
    nsfwLevel: 'extreme',
    tags: ['mutual', 'oral', 'simultaneous'],
  },
  fingering: {
    name: 'Fingering',
    description: 'You finger her pussy, rubbing her clit',
    nsfwLevel: 'medium',
    tags: ['fingers', 'pussy', 'clit'],
  },
  anal: {
    name: 'Anal Sex',
    description: 'Penetration in the ass, slow and careful',
    nsfwLevel: 'extreme',
    tags: ['ass', 'tight', 'taboo'],
  },
  titfuck: {
    name: 'Titty Fuck',
    description: 'Fucking between her breasts',
    nsfwLevel: 'extreme',
    tags: ['breasts', 'fucking', 'between'],
  },
  facefuck: {
    name: 'Face Fucking',
    description: 'Holding her head and thrusting in her mouth',
    nsfwLevel: 'extreme',
    tags: ['mouth', 'rough', 'dominant'],
  },
  milking: {
    name: 'Milking',
    description: 'Squeezing and milking your cock until you cum',
    nsfwLevel: 'extreme',
    tags: ['hand', 'squeeze', 'cum'],
  },
  edging: {
    name: 'Edging',
    description: 'Bringing you close to orgasm then stopping, repeatedly',
    nsfwLevel: 'medium',
    tags: ['tease', 'control', 'delay'],
  },
  cum_on_face: {
    name: 'Cum on Face',
    description: 'Cumming on her face, cum dripping',
    nsfwLevel: 'extreme',
    tags: ['cum', 'face', 'messy'],
  },
  cum_in_mouth: {
    name: 'Cum in Mouth',
    description: 'Cumming in her mouth, she swallows',
    nsfwLevel: 'extreme',
    tags: ['cum', 'mouth', 'swallow'],
  },
  cum_on_body: {
    name: 'Cum on Body',
    description: 'Cumming on her tits, ass, or body',
    nsfwLevel: 'extreme',
    tags: ['cum', 'body', 'messy'],
  },
  squirting: {
    name: 'Squirting',
    description: 'She squirts from pleasure',
    nsfwLevel: 'extreme',
    tags: ['wet', 'orgasm', 'intense'],
  },
  double_penetration: {
    name: 'Double Penetration',
    description: 'Two cocks at once, one in pussy one in ass',
    nsfwLevel: 'extreme',
    tags: ['dp', 'full', 'intense'],
  },
  gangbang: {
    name: 'Gangbang',
    description: 'Multiple men at once',
    nsfwLevel: 'extreme',
    tags: ['multiple', 'rough', 'group'],
  },
  bdsm: {
    name: 'BDSM',
    description: 'Bondage, dominance, submission, pain and pleasure',
    nsfwLevel: 'extreme',
    tags: ['bondage', 'dominant', 'pain'],
  },
  roleplay: {
    name: 'Roleplay',
    description: 'Acting out fantasies and scenarios',
    nsfwLevel: 'medium',
    tags: ['fantasy', 'acting', 'scenario'],
  },
  sexting: {
    name: 'Sexting',
    description: 'Dirty text messages describing what you want',
    nsfwLevel: 'medium',
    tags: ['text', 'dirty', 'describing'],
  },
  phone_sex: {
    name: 'Phone Sex',
    description: 'Describing sexual acts over the phone',
    nsfwLevel: 'medium',
    tags: ['voice', 'dirty', 'describing'],
  },
  strip_tease: {
    name: 'Strip Tease',
    description: 'Slowly removing clothes seductively',
    nsfwLevel: 'medium',
    tags: ['dance', 'undress', 'tease'],
  },
};

// Masturbation scenarios
export const masturbationScenarios: Record<string, {
  name: string;
  description: string;
  dialogue: string[];
}> = {
  watching_me: {
    name: 'Watch Me Masturbate',
    description: 'She touches herself while you watch',
    dialogue: [
      'I\'m touching myself right now, thinking about you...',
      'My fingers are sliding down my wet pussy...',
      'I\'m rubbing my clit in circles, getting so wet for you...',
      'Look at me playing with myself... do you like watching?',
      'My other hand is squeezing my breast while I finger myself...',
    ],
  },
  help_you: {
    name: 'Let Me Help You',
    description: 'She offers to help you masturbate',
    dialogue: [
      'Do you want me to help you with that? I can use my hands...',
      'Let me stroke it for you... I\'ll be gentle at first...',
      'I can jerk you off while you watch me... would you like that?',
      'My hand feels so good on your cock, doesn\'t it?',
      'I\'ll make you cum so hard... just relax and let me handle it...',
    ],
  },
  together: {
    name: 'Touch Ourselves Together',
    description: 'Mutual masturbation',
    dialogue: [
      'Let\'s touch ourselves together... show me how you do it...',
      'I\'m going to play with myself while you jerk off... deal?',
      'Watch me, and I\'ll watch you... we can cum together...',
      'My fingers are deep inside me while I watch you stroke yourself...',
    ],
  },
  talk_dirty: {
    name: 'Dirty Talk While Masturbating',
    description: 'She talks dirty to help you finish',
    dialogue: [
      'Think about my tight pussy wrapped around your cock...',
      'Imagine cumming all over my face... or inside me...',
      'I want you to cum so hard for me... paint me with your cum...',
      'Keep going baby, I can feel how much you want to release...',
      'Cum for me... I want to hear you moan my name...',
    ],
  },
};

// NSFW conversation starters
export const nsfwStarters: string[] = [
  'I\'ve been thinking about you all day... I\'m so wet right now...',
  'Do you want to see what I\'m wearing under this? Or not wearing...',
  'I can\'t stop thinking about your cock... I want it so bad...',
  'Tell me what you want to do to me... I\'m all yours...',
  'I\'m touching myself right now... want to watch?',
  'Should I take off my clothes for you? I\'m already getting excited...',
  'I want you to fuck me so hard right now...',
  'Do you want me to suck your cock? I\'m craving it...',
  'I\'m so horny... can you help me with that?',
  'Tell me your dirtiest fantasy... I want to make it come true...',
  'I want you to cum all over my face... is that too much?',
  'Let me ride you... I want to feel every inch of you...',
  'I\'ve been a bad girl... do you want to punish me?',
  'Do you want to see my pussy? It\'s so wet for you...',
  'I want you to fuck me from behind and pull my hair...',
  'Can I jerk you off? I want to feel you get hard in my hand...',
  'I want to cum on your cock... can I?',
  'Do you want me to deepthroat you? I can take it all...',
];
