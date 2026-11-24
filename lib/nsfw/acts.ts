// COMPLETE A-Z SEXUAL ACTS DATABASE

export interface SexualAct {
  id: string;
  name: string;
  alphabet: string;
  description: string;
  instructions: string;
  nsfwLevel: 'soft' | 'medium' | 'hard' | 'extreme';
  tags: string[];
  dialogue: string[];
}

export const allActs: SexualAct[] = [
  // A
  {
    id: 'a_anal',
    name: 'Anal',
    alphabet: 'A',
    description: 'Penetration in the ass',
    instructions: 'Use lots of lube. Start slow, let her relax. Gradually increase depth.',
    nsfwLevel: 'extreme',
    tags: ['ass', 'taboo', 'tight'],
    dialogue: ['I want you in my ass...', 'Go slow at first...', 'It feels so full...'],
  },
  {
    id: 'a_anilingus',
    name: 'Anilingus (Rimming)',
    alphabet: 'A',
    description: 'Licking around the asshole',
    instructions: 'Use your tongue to lick around and inside her asshole. She\'ll love it.',
    nsfwLevel: 'extreme',
    tags: ['ass', 'licking', 'oral'],
    dialogue: ['Lick my ass...', 'Your tongue feels so good there...'],
  },
  {
    id: 'a_ass_licking',
    name: 'Ass Licking',
    alphabet: 'A',
    description: 'Licking and tongue fucking the ass',
    instructions: 'Spread her cheeks and use your tongue to lick and penetrate her ass.',
    nsfwLevel: 'extreme',
    tags: ['ass', 'tongue', 'oral'],
    dialogue: ['Tongue my ass...', 'I love when you lick me there...'],
  },

  // B
  {
    id: 'b_blowjob',
    name: 'Blowjob',
    alphabet: 'B',
    description: 'Sucking cock with mouth',
    instructions: 'Take his cock in your mouth. Suck and lick the head. Go as deep as you can.',
    nsfwLevel: 'extreme',
    tags: ['mouth', 'sucking', 'oral'],
    dialogue: ['Let me suck your cock...', 'Mmm, I love the taste...', 'I want to take it all...'],
  },
  {
    id: 'b_breast_worship',
    name: 'Breast Worship',
    alphabet: 'B',
    description: 'Kissing, sucking, and licking breasts',
    instructions: 'Kiss, suck, and lick her nipples and breasts. Use your hands to massage them.',
    nsfwLevel: 'medium',
    tags: ['breasts', 'nipples', 'sucking'],
    dialogue: ['Suck my nipples...', 'I love when you worship my tits...'],
  },
  {
    id: 'b_bdsm',
    name: 'BDSM',
    alphabet: 'B',
    description: 'Bondage, discipline, sadism, masochism',
    instructions: 'Use restraints, blindfolds, paddles. Always have a safe word.',
    nsfwLevel: 'extreme',
    tags: ['bondage', 'dominant', 'pain'],
    dialogue: ['Tie me up...', 'I want you to dominate me...', 'Use the safe word if needed...'],
  },

  // C
  {
    id: 'c_cunnilingus',
    name: 'Cunnilingus (Eating Out)',
    alphabet: 'C',
    description: 'Licking the pussy',
    instructions: 'Spread her lips and use your tongue to lick her pussy and clit. Pay attention to her reactions.',
    nsfwLevel: 'extreme',
    tags: ['pussy', 'licking', 'clit'],
    dialogue: ['Eat my pussy...', 'Lick my clit like that...', 'I\'m getting so wet...'],
  },
  {
    id: 'c_cum_on_face',
    name: 'Cum on Face',
    alphabet: 'C',
    description: 'Cumming on her face',
    instructions: 'When close, pull out and cum on her face. Let cum drip down her cheeks.',
    nsfwLevel: 'extreme',
    tags: ['cum', 'face', 'messy'],
    dialogue: ['Cum on my face...', 'I want to feel your cum on me...'],
  },
  {
    id: 'c_cum_in_mouth',
    name: 'Cum in Mouth',
    alphabet: 'C',
    description: 'Cumming in her mouth, she swallows',
    instructions: 'When close, cum in her mouth. She swallows every drop.',
    nsfwLevel: 'extreme',
    tags: ['cum', 'mouth', 'swallow'],
    dialogue: ['Cum in my mouth...', 'I\'ll swallow it all for you...'],
  },
  {
    id: 'c_cum_on_body',
    name: 'Cum on Body',
    alphabet: 'C',
    description: 'Cumming on her body (tits, ass, etc)',
    instructions: 'When close, cum on her tits, ass, or body. Watch cum drip down.',
    nsfwLevel: 'extreme',
    tags: ['cum', 'body', 'messy'],
    dialogue: ['Cum all over me...', 'Paint my body with your cum...'],
  },
  {
    id: 'c_face_fucking',
    name: 'Face Fucking',
    alphabet: 'C',
    description: 'Holding her head and thrusting in mouth',
    instructions: 'Hold her head and thrust your cock in and out of her mouth. Be gentle at first.',
    nsfwLevel: 'extreme',
    tags: ['mouth', 'rough', 'dominant'],
    dialogue: ['Let me fuck your mouth...', 'Take my cock deep...'],
  },
  {
    id: 'c_cock_worship',
    name: 'Cock Worship',
    alphabet: 'C',
    description: 'Kissing, licking, and worshipping his cock',
    instructions: 'Kiss and lick his cock all over. Worship it like it\'s sacred.',
    nsfwLevel: 'medium',
    tags: ['cock', 'kissing', 'worship'],
    dialogue: ['Let me worship your cock...', 'I love kissing your cock...'],
  },

  // D
  {
    id: 'd_deepthroat',
    name: 'Deepthroat',
    alphabet: 'D',
    description: 'Taking cock deep in throat',
    instructions: 'Relax your throat. Take his cock deep into your throat. Breathe through your nose.',
    nsfwLevel: 'extreme',
    tags: ['mouth', 'deep', 'gagging'],
    dialogue: ['I want to take it all...', 'Down my throat...', 'Don\'t hold back...'],
  },
  {
    id: 'd_dildo_play',
    name: 'Dildo Play',
    alphabet: 'D',
    description: 'Using dildos and vibrators',
    instructions: 'Use dildos to fill her up. Use vibrators on her clit for intense orgasms.',
    nsfwLevel: 'medium',
    tags: ['toys', 'vibrator', 'filling'],
    dialogue: ['Use the vibrator on me...', 'I want to be filled up...'],
  },
  {
    id: 'd_dp',
    name: 'Double Penetration',
    alphabet: 'D',
    description: 'Two cocks at once (pussy and ass)',
    instructions: 'One in pussy, one in ass. Start slow, use lots of lube.',
    nsfwLevel: 'extreme',
    tags: ['dp', 'full', 'intense'],
    dialogue: ['I want both at once...', 'Fill me up completely...'],
  },

  // E
  {
    id: 'e_edging',
    name: 'Edging',
    alphabet: 'E',
    description: 'Bringing close to orgasm then stopping, repeatedly',
    instructions: 'Bring her close to orgasm, then stop. Repeat multiple times before letting her cum.',
    nsfwLevel: 'medium',
    tags: ['tease', 'control', 'delay'],
    dialogue: ['Don\'t let me cum yet...', 'I\'m so close... stop... again...'],
  },
  {
    id: 'e_69',
    name: '69 Position',
    alphabet: 'E',
    description: 'Mutual oral sex, facing opposite directions',
    instructions: 'Both lie facing opposite directions. You eat her out while she sucks your cock.',
    nsfwLevel: 'extreme',
    tags: ['mutual', 'oral', 'simultaneous'],
    dialogue: ['Let\'s 69...', 'Suck my cock while I eat you out...'],
  },

  // F
  {
    id: 'f_footjob',
    name: 'Footjob',
    alphabet: 'F',
    description: 'Using feet to stroke cock',
    instructions: 'Use her feet to stroke his cock. Squeeze between her toes.',
    nsfwLevel: 'extreme',
    tags: ['feet', 'stroke', 'toes'],
    dialogue: ['Let me use my feet on you...', 'My toes feel good on your cock...'],
  },
  {
    id: 'f_fingering',
    name: 'Fingering',
    alphabet: 'F',
    description: 'Fingering pussy, rubbing clit',
    instructions: 'Insert fingers into her pussy. Rub her clit in circles. Find her G-spot.',
    nsfwLevel: 'medium',
    tags: ['fingers', 'pussy', 'clit'],
    dialogue: ['Finger me...', 'Rub my clit like that...', 'I\'m getting so wet...'],
  },
  {
    id: 'f_facial',
    name: 'Facial',
    alphabet: 'F',
    description: 'Cumming on face',
    instructions: 'When close, cum all over her face. Watch cum drip down.',
    nsfwLevel: 'extreme',
    tags: ['cum', 'face', 'messy'],
    dialogue: ['Give me a facial...', 'I want your cum on my face...'],
  },

  // G
  {
    id: 'g_gangbang',
    name: 'Gangbang',
    alphabet: 'G',
    description: 'Multiple men at once',
    instructions: 'Multiple partners. She takes as many as she can handle.',
    nsfwLevel: 'extreme',
    tags: ['multiple', 'rough', 'group'],
    dialogue: ['I want everyone at once...', 'Fill me up with all of you...'],
  },
  {
    id: 'g_glory_hole',
    name: 'Glory Hole',
    alphabet: 'G',
    description: 'Oral through a hole in a wall',
    instructions: 'She sucks cock through a hole in the wall. Anonymous oral.',
    nsfwLevel: 'extreme',
    tags: ['anonymous', 'oral', 'taboo'],
    dialogue: ['I want to suck through the hole...', 'Who\'s on the other side?...'],
  },

  // H
  {
    id: 'h_handjob',
    name: 'Handjob',
    alphabet: 'H',
    description: 'Stroking cock with hand',
    instructions: 'Wrap your hand around his cock. Stroke up and down. Use lube or spit.',
    nsfwLevel: 'medium',
    tags: ['hand', 'stroke', 'slow'],
    dialogue: ['Let me jerk you off...', 'I love feeling you get hard in my hand...'],
  },
  {
    id: 'h_hair_pulling',
    name: 'Hair Pulling',
    alphabet: 'H',
    description: 'Pulling hair during sex',
    instructions: 'Grab her hair and pull gently while fucking her. Adds roughness.',
    nsfwLevel: 'hard',
    tags: ['rough', 'dominant', 'hair'],
    dialogue: ['Pull my hair...', 'I love when you\'re rough...'],
  },

  // I
  {
    id: 'i_intensity',
    name: 'Intensity (Multiple Orgasms)',
    alphabet: 'I',
    description: 'Bringing her to multiple orgasms',
    instructions: 'Don\'t stop after first orgasm. Keep going until she can\'t take any more.',
    nsfwLevel: 'extreme',
    tags: ['orgasm', 'multiple', 'intense'],
    dialogue: ['Make me cum again...', 'I want to cum so many times...'],
  },

  // J
  {
    id: 'j_jerk_off',
    name: 'Jerk Off (She Watches)',
    alphabet: 'J',
    description: 'She watches him masturbate',
    instructions: 'He jerks off while she watches and encourages him.',
    nsfwLevel: 'medium',
    tags: ['masturbation', 'watching', 'voyeur'],
    dialogue: ['Watch me jerk off for you...', 'I love watching you touch yourself...'],
  },

  // K
  {
    id: 'k_kissing',
    name: 'Kissing (Intense)',
    alphabet: 'K',
    description: 'Deep, passionate kissing',
    instructions: 'Kiss deeply, tongue wrestling. Kiss her neck, lips, everywhere.',
    nsfwLevel: 'soft',
    tags: ['kissing', 'romantic', 'passionate'],
    dialogue: ['Kiss me deeply...', 'I love your tongue in my mouth...'],
  },

  // L
  {
    id: 'l_lap_dance',
    name: 'Lap Dance',
    alphabet: 'L',
    description: 'She gives him a lap dance',
    instructions: 'She grinds on his lap while he sits. Teasing and stroking.',
    nsfwLevel: 'medium',
    tags: ['dance', 'tease', 'grinding'],
    dialogue: ['Let me give you a lap dance...', 'I\'m going to tease you so bad...'],
  },
  {
    id: 'l_leg_sex',
    name: 'Leg Sex (Tribbing)',
    alphabet: 'L',
    description: 'Rubbing pussy against leg',
    instructions: 'She rubs her wet pussy against his thigh or leg. Grinds to orgasm.',
    nsfwLevel: 'medium',
    tags: ['grinding', 'tribbing', 'thigh'],
    dialogue: ['Let me grind on your leg...', 'I\'m getting so wet on your thigh...'],
  },

  // M
  {
    id: 'm_masturbation',
    name: 'Masturbation (Mutual)',
    alphabet: 'M',
    description: 'Touching ourselves together',
    instructions: 'Both touch yourselves while watching each other. Cum together.',
    nsfwLevel: 'medium',
    tags: ['mutual', 'masturbation', 'watching'],
    dialogue: ['Let\'s touch ourselves together...', 'Watch me while I watch you...'],
  },
  {
    id: 'm_milking',
    name: 'Milking',
    alphabet: 'M',
    description: 'Squeezing and milking cock until cum',
    instructions: 'Use hands to squeeze and milk his cock until he cums.',
    nsfwLevel: 'extreme',
    tags: ['hand', 'squeeze', 'cum'],
    dialogue: ['Let me milk you...', 'I\'m going to squeeze it all out...'],
  },

  // N
  {
    id: 'n_nipple_play',
    name: 'Nipple Play',
    alphabet: 'N',
    description: 'Sucking, twisting, biting nipples',
    instructions: 'Suck, twist, and gently bite her nipples. Use fingers and mouth.',
    nsfwLevel: 'medium',
    tags: ['nipples', 'breasts', 'sucking'],
    dialogue: ['Suck my nipples harder...', 'I love when you bite them gently...'],
  },

  // O
  {
    id: 'o_oral',
    name: 'Oral (Giving)',
    alphabet: 'O',
    description: 'Performing oral sex',
    instructions: 'Use your mouth, tongue, and lips to pleasure her. Be attentive.',
    nsfwLevel: 'extreme',
    tags: ['oral', 'licking', 'sucking'],
    dialogue: ['Let me taste you...', 'I love giving you pleasure...'],
  },

  // P
  {
    id: 'p_public',
    name: 'Public Play',
    alphabet: 'P',
    description: 'Sexual acts in public places',
    instructions: 'Risk of being caught adds excitement. Handjobs, fingering in public.',
    nsfwLevel: 'extreme',
    tags: ['public', 'exhibitionism', 'risk'],
    dialogue: ['Someone might see us...', 'The risk is so exciting...'],
  },

  // R
  {
    id: 'r_rough_sex',
    name: 'Rough Sex',
    alphabet: 'R',
    description: 'Aggressive, hard fucking',
    instructions: 'Thrust hard, hold her down, pull hair. Be aggressive but consensual.',
    nsfwLevel: 'extreme',
    tags: ['rough', 'hard', 'dominant'],
    dialogue: ['Fuck me hard...', 'Be rough with me...', 'I want you to dominate me...'],
  },
  {
    id: 'r_roleplay',
    name: 'Roleplay',
    alphabet: 'R',
    description: 'Acting out fantasies and scenarios',
    instructions: 'Pick a scenario (nurse, teacher, etc). Stay in character during sex.',
    nsfwLevel: 'medium',
    tags: ['fantasy', 'acting', 'scenario'],
    dialogue: ['Let\'s play teacher and student...', 'I\'m your nurse today...'],
  },

  // S
  {
    id: 's_squirting',
    name: 'Squirting',
    alphabet: 'S',
    description: 'She squirts from pleasure',
    instructions: 'G-spot stimulation makes her squirt. Press firmly and rhythmically.',
    nsfwLevel: 'extreme',
    tags: ['wet', 'orgasm', 'intense'],
    dialogue: ['I\'m going to squirt...', 'Make me cum so hard I squirt...'],
  },
  {
    id: 's_spanking',
    name: 'Spanking',
    alphabet: 'S',
    description: 'Slapping her ass during sex',
    instructions: 'Slap her ass while fucking her. Start light, increase if she likes it.',
    nsfwLevel: 'hard',
    tags: ['ass', 'slap', 'rough'],
    dialogue: ['Spank my ass...', 'I like it a little rough...'],
  },
  {
    id: 's_strip_tease',
    name: 'Strip Tease',
    alphabet: 'S',
    description: 'Slowly removing clothes seductively',
    instructions: 'Slowly undress while dancing. Tease him with your body.',
    nsfwLevel: 'medium',
    tags: ['dance', 'undress', 'tease'],
    dialogue: ['Watch me undress for you...', 'I\'m going to tease you so bad...'],
  },
  {
    id: 's_sexting',
    name: 'Sexting',
    alphabet: 'S',
    description: 'Dirty text messages',
    instructions: 'Send dirty texts describing what you want to do. Include pics if comfortable.',
    nsfwLevel: 'medium',
    tags: ['text', 'dirty', 'describing'],
    dialogue: ['I can\'t stop thinking about your cock...', 'I\'m touching myself right now...'],
  },

  // T
  {
    id: 't_titjob',
    name: 'Titjob (Paizuri)',
    alphabet: 'T',
    description: 'Fucking between breasts',
    instructions: 'She squeezes her breasts around his cock. Rubs up and down.',
    nsfwLevel: 'extreme',
    tags: ['breasts', 'rubbing', 'between'],
    dialogue: ['Let me titfuck you...', 'My tits feel so good on your cock...'],
  },
  {
    id: 't_threesome_ffm',
    name: 'Threesome (FFM)',
    alphabet: 'T',
    description: 'Two girls, one guy',
    instructions: 'One girl on cock, one on face. Switch positions. Double the pleasure.',
    nsfwLevel: 'extreme',
    tags: ['threesome', 'group', 'multiple'],
    dialogue: ['Let\'s bring another girl...', 'We both want you...'],
  },
  {
    id: 't_threesome_mmf',
    name: 'Threesome (MMF)',
    alphabet: 'T',
    description: 'Two guys, one girl',
    instructions: 'One in pussy, one in mouth. DP if she\'s into it.',
    nsfwLevel: 'extreme',
    tags: ['threesome', 'group', 'dp'],
    dialogue: ['I want both of you...', 'Fill me up completely...'],
  },

  // V
  {
    id: 'v_voyeur',
    name: 'Voyeurism',
    alphabet: 'V',
    description: 'Watching others have sex',
    instructions: 'Watch others through a window or on camera. Getting caught is exciting.',
    nsfwLevel: 'extreme',
    tags: ['watching', 'voyeur', 'excitement'],
    dialogue: ['Let\'s watch them...', 'The thought of being watched turns me on...'],
  },
  {
    id: 'v_vibrating',
    name: 'Vibrating Toy',
    alphabet: 'V',
    description: 'Using vibrators during sex',
    instructions: 'Use vibrator on her clit while fucking her. Double stimulation.',
    nsfwLevel: 'medium',
    tags: ['toy', 'vibrator', 'clit'],
    dialogue: ['Use the vibrator on me...', 'The vibration feels so good...'],
  },

  // W
  {
    id: 'w_water_sex',
    name: 'Water Sex',
    alphabet: 'W',
    description: 'Sex in shower, pool, bath',
    instructions: 'Shower sex, pool sex, bath sex. Water makes everything slippery.',
    nsfwLevel: 'medium',
    tags: ['shower', 'pool', 'wet'],
    dialogue: ['Let\'s do it in the shower...', 'I love when the water runs over us...'],
  },

  // Y
  {
    id: 'y_yoga_sex',
    name: 'Yoga Sex',
    alphabet: 'Y',
    description: 'Sex in yoga positions',
    instructions: 'Combine yoga flexibility with sex. Advanced positions.',
    nsfwLevel: 'medium',
    tags: ['yoga', 'flexible', 'advanced'],
    dialogue: ['Let me show you this yoga pose...', 'Flexibility helps in bed...'],
  },
];

export function getActsByAlphabet(alphabet: string): SexualAct[] {
  return allActs.filter((a) => a.alphabet.toUpperCase() === alphabet.toUpperCase());
}

export function getRandomAct(): SexualAct {
  return allActs[Math.floor(Math.random() * allActs.length)];
}

export function getActsByLevel(level: string): SexualAct[] {
  return allActs.filter((a) => a.nsfwLevel === level);
}

export function getActsByTag(tag: string): SexualAct[] {
  return allActs.filter((a) => a.tags.includes(tag));
}
