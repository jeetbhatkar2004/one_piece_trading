const descriptions: Record<string, string> = {
  luffy:
    'Captain of the Straw Hat Pirates. A rubber man with a dream to become the Pirate King and find the One Piece.',
  zoro:
    'First mate of the Straw Hat Pirates and master swordsman who wields three swords in his quest to become the world’s greatest.',
  nami:
    'Navigator of the Straw Hat Pirates. A genius cartographer with a love for treasure and a dream to map the entire world.',
  sanji:
    'Cook of the Straw Hat Pirates. A master of Black Leg style kicks and a hopeless romantic with a code of chivalry.',
  usopp:
    'Sniper of the Straw Hat Pirates. A sharpshooter, storyteller, and inventor who turns cowardice into courage when it matters most.',
  chopper:
    'Doctor of the Straw Hat Pirates. A blue-nosed reindeer with the power of the Human-Human Fruit and a heart of gold.',
  robin:
    'Archaeologist of the Straw Hat Pirates. A survivor of Ohara who can read Poneglyphs and seeks the true history of the world.',
  franky:
    'Shipwright of the Straw Hat Pirates. A cyborg who built the Thousand Sunny and lives for cola-fueled inventions.',
  brook:
    'Musician of the Straw Hat Pirates. A living skeleton revived by the Revive-Revive Fruit with a love for music and bad jokes.',
  jinbe:
    'Helmsman of the Straw Hat Pirates. A former Warlord and Fish-Man Karate master devoted to Luffy and coexistence between races.',

  ace:
    'Portgas D. Ace. Luffy’s sworn brother and former commander of the Whitebeard Pirates, known for his fiery power and proud spirit.',
  sabo:
    'Sabo. Luffy’s sworn brother and a top officer of the Revolutionary Army, carrying Ace’s will with fierce resolve.',
  shanks:
    'Red-Haired Shanks. A Yonko and former member of Roger’s crew who inspired Luffy to become a pirate.',
  mihawk:
    'Dracule Mihawk. The world’s greatest swordsman and former Warlord whose blade and presence terrify even veteran pirates.',
  doflamingo:
    'Donquixote Doflamingo. A former Warlord and underworld broker who manipulates people like puppets with string powers.',
  kaido:
    'Kaido of the Beasts. A Yonko known as the strongest creature in the world, obsessed with war and chaos.',
  'big-mom':
    'Charlotte Linlin (Big Mom). A Yonko and matriarch of the Charlotte family who rules Totto Land with terrifying power.',
  blackbeard:
    'Marshall D. Teach (Blackbeard). A Yonko who wields the power of two Devil Fruits and thrives on chaos.',
  law:
    'Trafalgar D. Water Law. Captain of the Heart Pirates and Ope Ope no Mi user with a complicated past and sharp strategy.',
  kid:
    'Eustass Kid. A fiery Supernova captain with magnetic powers and a grudge against the Yonko.',

  yamato:
    'Yamato. A fierce warrior from Wano who idolizes Oden and fights for freedom with overwhelming strength.',
  carrot:
    'Carrot. A Mink from Zou with swift combat skills and boundless energy, loyal to her friends and homeland.',
  vivi:
    'Nefertari Vivi. The princess of Alabasta who stood beside the Straw Hats to protect her people and her country’s future.',
  boa:
    'Boa Hancock. Empress of Amazon Lily and former Warlord whose beauty, pride, and power make her a fearsome ally and enemy.',
  buggy:
    'Buggy the Clown. A flashy pirate with a knack for surviving chaos, building influence, and turning disasters into opportunity.',
  crocodile:
    'Sir Crocodile. A ruthless former Warlord who schemes for power, armed with a sand-based ability and iron ambition.',
  lucci:
    'Rob Lucci. A deadly government assassin and master of Rokushiki whose cold precision makes him a relentless foe.',
  kuma:
    'Bartholomew Kuma. A towering figure tied to the Revolutionary Army and the World Government, known for his strange, decisive actions.',
  ivankov:
    'Emporio Ivankov. The flamboyant “Queen” of the Revolutionary Army, wielding life-changing abilities and unshakable charisma.',
  rayleigh:
    'Silvers Rayleigh. The “Dark King” and former right-hand of Roger, a legendary fighter and mentor who knows the seas’ secrets.',
  whitebeard:
    'Edward Newgate (Whitebeard). A Yonko famed as the “Strongest Man,” a pirate father who protected his crew like family.',
  marco:
    'Marco the Phoenix. Whitebeard’s trusted commander, a calm strategist with a mythical healing power and unbreakable loyalty.',
  jozu:
    'Jozu. A stalwart Whitebeard commander renowned for overwhelming defense and steadfast courage in battle.',
  vista:
    'Vista. A master swordsman among Whitebeard’s commanders, respected for his technique and composure.',
  garp:
    'Monkey D. Garp. The legendary Marine “Hero” whose strength and blunt personality shaped an era—and Luffy’s destiny.',
  sengoku:
    'Sengoku the Buddha. Former Fleet Admiral of the Marines, a brilliant strategist with immense authority and power.',
  smoker:
    'Smoker “White Chase.” A relentless Marine officer who pursues pirates with stubborn justice and unwavering resolve.',
  tashigi:
    'Tashigi. A Marine swordswoman devoted to justice and protecting famed blades from falling into the wrong hands.',
  hina:
    'Hina. A sharp, no-nonsense Marine officer known for efficient captures and a strict sense of order.',
  coby:
    'Koby. A determined Marine rising through the ranks, driven by courage, kindness, and a dream of true justice.',
  helmeppo:
    'Helmeppo. A former spoiled noble turned earnest Marine, training hard to earn respect and strength.',
  perona:
    'Perona. A ghostly princess with a dramatic flair whose eerie power can crush confidence and morale.',
  moria:
    'Gecko Moria. A former Warlord who builds an army from shadows, haunted by past defeat and obsession.',
  'hancock-sisters':
    'Boa Sisters. The powerful sisters of Amazon Lily, proud warriors shaped by a harsh past and formidable combat skill.',
  magellan:
    'Magellan. The terrifying chief jailer of Impel Down, feared for crushing escapes with overwhelming force.',
  hannyabal:
    'Hannyabal. An ambitious Impel Down official who clings to duty and pride, desperate to prove his worth.',
  'bon-clay':
    'Bentham (Mr. 2 Bon Clay). A loyal friend and flamboyant fighter whose devotion turns sacrifice into legend.',
  fujitora:
    'Issho (Fujitora). A Marine admiral guided by conscience, wielding immense gravity power and a heartfelt sense of justice.',
  gaban:
    'Scopper Gaban. A famed member of Roger’s crew, remembered as a battle-hardened veteran of the Pirate King’s era.',
  imu:
    'Imu. The mysterious sovereign figure hidden at the peak of the World Government, shrouded in secrecy and control.',
  loki:
    'Loki. A giant prince of Elbaf spoken of in legends and rumor, tied to the might and pride of the giants.',
  rocks:
    'Rocks D. Xebec. The feared captain behind a legendary crew, a name that shook the world and left scars on history.',
  roger:
    'Gol D. Roger. The Pirate King whose final voyage and words ignited the Great Pirate Era and the race for the One Piece.',
  shamrock:
    'Shamrock. A little-known figure in Grand Line stories—an emerging name whose reputation is still taking shape.',

  // World Government / Marines / Cipher Pol / Revolutionaries
  dragon:
    'Monkey D. Dragon. The enigmatic leader of the Revolutionary Army, feared by the World Government and tied to Luffy\'s fate.',
  akainu:
    'Sakazuki (Akainu). The ruthless Fleet Admiral whose absolute justice burns as fiercely as his magma power.',
  aokiji:
    'Kuzan (Aokiji). A former admiral with icy power and a complicated sense of justice that doesn\'t fit neatly into orders.',
  kizaru:
    'Borsalino (Kizaru). A Marine admiral who fights at light speed with an unsettling calm and overwhelming precision.',
  ryokugyu:
    'Aramaki (Ryokugyu). A Marine admiral with a harsh worldview and a nature-based power that can overwhelm battlefields.',
  tsuru:
    'Tsuru. A legendary Marine strategist known for sharp judgment, senior authority, and a long history hunting pirates.',
  kong:
    'Kong. The stern commander-in-chief figure who sits above the Marines\' top brass in the World Government\'s hierarchy.',
  gion:
    'Gion (Momousagi). A formidable Marine vice admiral and admiral candidate known for strength, discipline, and poise.',
  tokikake:
    'Tokikake (Chaton). A powerful Marine vice admiral and admiral candidate respected for experience and steady resolve.',
  garling:
    'Figarland Garling. A feared high-ranking Celestial Dragon figure associated with enforcing the World Nobles\' will.',
  saturn:
    'Saint Jaygarcia Saturn. One of the Five Elders—an imposing authority figure at the peak of the World Government.',
  mars:
    'Saint Marcus Mars. One of the Five Elders—an elite ruler whose decisions shape the world from the shadows.',
  warcury:
    'Saint Topman Warcury. One of the Five Elders—an iron-willed power broker representing the Government\'s highest authority.',
  nusjuro:
    'Saint Ethanbaron V. Nusjuro. One of the Five Elders—an intimidating figure whose presence signals the world\'s darkest orders.',
  'ju-peter':
    'Saint Shepherd Ju Peter. One of the Five Elders—an unseen hand of authority tied to the Government\'s ultimate control.',
  spandine:
    'Spandine. A former Cipher Pol chief tied to dark government operations and the machinery of institutional cruelty.',
  spandam:
    'Spandam. A petty but dangerous Cipher Pol official whose ambition causes disasters far bigger than his competence.',
  kaku:
    'Kaku. A Cipher Pol agent and skilled fighter whose acrobatics and technique make him a stylish, deadly opponent.',
  kalifa:
    'Kalifa. A Cipher Pol agent who mixes sharp intellect and ruthless combat with a cool, professional edge.',
  blueno:
    'Blueno. A Cipher Pol agent known for quiet menace and a door-based ability that turns space itself into an ambush.',
  jabra:
    'Jabra. A brutal Cipher Pol agent whose ferocity and pride make him a vicious close-quarters threat.',
  fukurou:
    'Fukurou. A Cipher Pol agent whose odd mannerisms hide the cold efficiency of an elite government assassin.',
  kumadori:
    'Kumadori. A theatrical Cipher Pol agent with bizarre intensity and the strength to match his dramatic style.',
  stussy:
    'Stussy. A mysterious underworld-connected figure tied to Cipher Pol operations and cutting-edge secrets.',
  koala:
    'Koala. A Revolutionary Army officer whose compassion and resolve drive her fight against oppression worldwide.',
  hack:
    'Hack. A tough Revolutionary Army fighter who uses Fish-Man Karate with disciplined power and unwavering loyalty.',
  inazuma:
    'Inazuma. Ivankov\'s trusted ally in the Revolutionary Army, using a snipping power to reshape environments mid-battle.',
  karasu:
    'Karasu. A Revolutionary Army commander whose eerie, strategic style makes him a terrifying presence in covert war.',
  'belo-betty':
    'Belo Betty. A Revolutionary Army commander who inspires people to rise up, turning courage into a weapon.',
  morley:
    'Morley. A giant Revolutionary Army commander who tunnels through obstacles with unstoppable momentum and heart.',
  lindbergh:
    'Lindbergh. A tech-minded Revolutionary Army commander who brings invention and aerial tactics to the battlefield.',

  // Worst Generation / Supernovas
  bonney:
    'Jewelry Bonney. A notorious Supernova with an unpredictable streak, tangled secrets, and a fierce will to survive.',
  bege:
    'Capone "Gang" Bege. A mafia-style pirate captain who treats his crew like a family business—ruthless, clever, and armed to the teeth.',
  hawkins:
    'Basil Hawkins. A Supernova who reads fate like numbers, fighting with eerie calm and straw-made terror.',
  apoo:
    'Scratchmen Apoo. A chaotic Supernova whose music-themed attacks turn rhythm into a battlefield hazard.',
  drake:
    'X Drake. A Supernova with a dinosaur power and a complicated double-life caught between pirates and justice.',
  urouge:
    'Urouge "Mad Monk." A mysterious Supernova who endures punishment and grows stronger through sheer grit.',
  killer:
    'Killer. Kid\'s loyal right-hand—fast, deadly, and driven by fierce devotion beneath a masked identity.',

  // Blackbeard Pirates
  shiryu:
    'Shiryu of the Rain. A former Impel Down executioner whose cold brutality and swordsmanship make him a nightmare ally.',
  burgess:
    'Jesus Burgess. Blackbeard\'s brawler champion—loud, relentless, and always hungry for glory and power.',
  'van-augur':
    'Van Augur. Blackbeard\'s sniper whose calm aim and eerie confidence make distance feel meaningless.',
  'doc-q':
    'Doc Q. Blackbeard\'s sickly doctor who spreads misfortune with a grin and treats cruelty like a diagnosis.',
  stronger:
    'Stronger. Doc Q\'s horse—an unsettling partner in crime that turns pursuit into a grim joke.',
  lafitte:
    'Lafitte. Blackbeard\'s hypnotic navigator whose polite tone hides a chilling talent for infiltration.',
  'catarina-devon':
    'Catarina Devon. A monstrous pirate with predatory flair, infamous even among Impel Down\'s worst.',
  'sanjuan-wolf':
    'Sanjuan Wolf. A colossal giant whose sheer scale turns him into a living disaster on the seas.',
  'avalo-pizarro':
    'Avalo Pizarro. The "Corrupt King," a savage pirate whose ambition and violence never learned restraint.',
  'vasco-shot':
    'Vasco Shot. A dangerous pirate with a vile personality, thriving in chaos and cruelty.',

  // Red-Hair Pirates
  'benn-beckman':
    'Benn Beckman. Shanks\' trusted right-hand—cool-headed, feared, and known for lethal judgment in a fight.',
  'lucky-roux':
    'Lucky Roux. A core member of Shanks\' crew, deceptively fast and dangerous with an easygoing grin.',
  yasopp:
    'Yasopp. A legendary sniper of the Red-Hair Pirates whose reputation echoes across the seas—and across Usopp\'s life.',
  rockstar:
    'Rockstar. A newer Red-Hair Pirate who represents the crew\'s growing influence and rising generation.',

  // Big Mom Pirates / Totto Land
  katakuri:
    'Charlotte Katakuri. Big Mom\'s strongest commander—calm, honorable, and terrifyingly precise with overwhelming power.',
  perospero:
    'Charlotte Perospero. Big Mom\'s eldest son, a cunning candy-wielding schemer who thrives on control.',
  pudding:
    'Charlotte Pudding. A complex Totto Land princess whose emotions and secrets cut deeper than any blade.',
  smoothie:
    'Charlotte Smoothie. A Sweet Commander whose draining power and cold confidence make her a looming threat.',
  cracker:
    'Charlotte Cracker. A Sweet Commander who hides behind an army of hardened biscuits and stubborn pride.',
  brulee:
    'Charlotte Brûlée. A mirror-wielding sister who turns reflection into escape routes, traps, and tricks.',
  oven:
    'Charlotte Oven. A blazing enforcer whose heat and temper make him Totto Land\'s walking furnace.',
  daifuku:
    'Charlotte Daifuku. A dangerous fighter who summons a genie-like force, mixing elegance with brutal impact.',
  streusen:
    'Streusen. Big Mom\'s long-time associate whose strange culinary power helped shape Totto Land\'s foundations.',
  pekoms:
    'Pekoms. A Mink aligned with Big Mom\'s crew, torn between loyalty, honor, and the cost of survival.',
  tamago:
    'Baron Tamago. A peculiar agent whose egg-themed transformations make him hard to put down for good.',

  // Germa 66
  reiju:
    'Vinsmoke Reiju. Sanji\'s sister—sharp, compassionate, and dangerous, carrying kindness into a family built on cold power.',
  ichiji:
    'Vinsmoke Ichiji. A Germa warrior prince who fights with engineered strength and ruthless confidence.',
  niji:
    'Vinsmoke Niji. A Germa warrior prince whose speed and arrogance crackle like lightning.',
  yonji:
    'Vinsmoke Yonji. A Germa warrior prince with brute force and a reckless attitude that hits like a hammer.',
  judge:
    'Vinsmoke Judge. The mastermind of Germa\'s science and ambition, willing to sacrifice anything for supremacy.',

  // Beasts Pirates (Kaido crew)
  king:
    'King the Wildfire. Kaido\'s right-hand—an intimidating commander with brutal aerial power and a merciless edge.',
  queen:
    'Queen the Plague. A mad-science commander who mixes showmanship, cruelty, and biochemical terror.',
  jack:
    'Jack the Drought. A relentless commander whose endurance and brutality make him a walking siege.',
  ulti:
    'Ulti. A fierce Tobiroppo with explosive energy and a headstrong fighting style that never backs down.',
  'page-one':
    'Page One. A Tobiroppo whose dinosaur strength and stubborn loyalty make him a dangerous enforcer.',
  'whos-who':
    'Who\'s-Who. A Tobiroppo with sharp intelligence and a vicious streak, blending mystery with ruthless violence.',
  'black-maria':
    'Black Maria. A Tobiroppo who mixes elegance and cruelty, turning her domain into a trap.',
  sasaki:
    'Sasaki. A Tobiroppo brawler with raw power, swagger, and a willingness to smash first and ask later.',

  // Dressrosa / Grand Fleet / Donquixote Family
  bartolomeo:
    'Bartolomeo. A Straw Hat superfan whose barrier power and loud loyalty turn him into an unforgettable ally.',
  cavendish:
    'Cavendish. A handsome pirate prince with a split nature—glamour by day, terrifying speed by night.',
  sai:
    'Sai. A proud martial artist and leader who carries legacy, honor, and explosive strength into every battle.',
  'don-chinjao':
    'Don Chinjao. A legendary fighter whose pride and history collide with the new era\'s rising stars.',
  leo:
    'Leo. A tiny Tontatta warrior whose brave heart and quick hands can topple giants.',
  hajrudin:
    'Hajrudin. A giant warrior who fights to restore his people\'s pride with thunderous strength.',
  orlumbus:
    'Orlumbus. A fleet commander whose booming leadership turns chaos into formation and momentum.',
  ideo:
    'Ideo. A hard-hitting fighter whose passion and raw technique make him a reliable force in the Straw Hat orbit.',
  rebecca:
    'Rebecca. A Dressrosa fighter who endured cruelty with resilience, seeking peace for her family and country.',
  kyros:
    'Kyros. A legendary gladiator and devoted father whose will cuts through tragedy and tyranny.',
  viola:
    'Viola. A sharp-minded royal who uses sight and strategy to survive under oppression.',
  riku:
    'King Riku. The compassionate ruler of Dressrosa, symbolizing dignity against manipulation and fear.',
  corazon:
    'Donquixote Rosinante (Corazon). A tragic undercover hero whose kindness changed Law\'s life forever.',
  sugar:
    'Sugar. A deceptively cute enforcer whose terrifying ability can erase people from memory and history.',
  'senor-pink':
    'Señor Pink. A hard-boiled fighter with surprising depth, loyalty, and a past that reshapes how you see him.',
  'baby-5':
    'Baby 5. A weapon-transforming fighter whose longing for belonging makes her story hit as hard as her attacks.',
  trebol:
    'Trebol. A sticky, scheming executive whose devotion to Doflamingo fuels cruelty and manipulation.',
  pica:
    'Pica. A towering executive who commands stone itself, hiding lethal power behind an infamous voice.',
  diamante:
    'Diamante. A cruel showman whose flag-like power and twisted pride thrive in spectacle.',
  gladius:
    'Gladius. A volatile executive who turns explosions into art, chaos into control, and fear into obedience.',
  'lao-g':
    'Lao G. An old master whose surprising martial prowess proves experience can still hit like a cannon.',
  dellinger:
    'Dellinger. A sadistic prodigy whose speed and malice make him a dangerous wildcard.',

  // Wano / Kozuki / Scabbards
  oden:
    'Kozuki Oden. A legendary samurai whose bold spirit and sacrifice became Wano\'s symbol of freedom.',
  toki:
    'Kozuki Toki. A mysterious woman tied to Wano\'s destiny, carrying hope across eras with unwavering faith.',
  momonosuke:
    'Kozuki Momonosuke. Wano\'s young heir who grows into leadership under immense pressure and prophecy.',
  hiyori:
    'Kozuki Hiyori. Oden\'s daughter—resilient, sharp, and determined to see Wano restored.',
  kinemon:
    'Kin\'emon. A loyal retainer whose humor hides deep devotion and battle-tested resolve.',
  denjiro:
    'Denjiro. A brilliant retainer who endured in silence, turning patience into vengeance and strategy.',
  'ashura-doji':
    'Ashura Doji. A fearsome warrior whose rough exterior masks loyalty forged through hardship.',
  kawamatsu:
    'Kawamatsu. A kappa swordsman whose steadfast heart protected Wano\'s hope through long years of pain.',
  raizo:
    'Raizo. A ninja retainer whose quirky style hides stubborn courage and clever survival instincts.',
  kiku:
    'Kikunojo (Kiku). A graceful samurai whose loyalty and bravery shine through the storm of war.',
  kanjuro:
    'Kurozumi Kanjuro. A performer whose talent and betrayal twist art into tragedy.',
  orochi:
    'Kurozumi Orochi. Wano\'s corrupt shogun who clung to power through fear, deceit, and cruelty.',
  yasuie:
    'Shimotsuki Yasuie. A beloved Wano figure whose laughter and sacrifice inspired hope under oppression.',
  otama:
    'O-Tama. A brave Wano child whose kindness and strange power can turn enemies into allies.',
  otoko:
    'O-Toko. A cheerful child of Wano whose smiles carry heartbreak—and quiet strength.',
  hyogoro:
    'Hyogoro the Flower. A respected yakuza boss whose pride and spirit embody Wano\'s unbroken will.',

  // Minks
  inuarashi:
    'Inuarashi. A Mink ruler whose loyalty to Oden and fierce combat style make him a pillar of the alliance.',
  nekomamushi:
    'Nekomamushi. A Mink ruler with wild charisma and crushing strength, driven by loyalty and vengeance.',
  pedro:
    'Pedro. A noble Mink warrior whose sacrifice and resolve pushed the next generation forward.',
  wanda:
    'Wanda. A capable Mink fighter whose loyalty and calm courage shine in desperate battles.',
  shishilian:
    'Shishilian. A Mink musketeer leader who stands as a dependable guardian of Zou\'s pride.',

  // Skypiea
  enel:
    'Enel. A self-proclaimed god whose lightning power and arrogance made Skypiea\'s conflict feel like divine judgment.',
  wyper:
    'Wyper. A fierce Shandian warrior who fights for his people\'s legacy with relentless conviction.',
  'gan-fall':
    'Gan Fall. A former Sky Island ruler who values honor and peace, even when power shifts violently.',
  conis:
    'Conis. A kind-hearted Skypiea resident whose bravery proves ordinary people can defy "gods."',
  noland:
    'Mont Blanc Noland. A legendary explorer whose truth became myth, and whose story defines courage against doubt.',
  kalgara:
    'Kalgara. A proud Shandian leader whose bond with Noland became one of the Grand Line\'s greatest tragedies.',

  // Water 7 / Enies Lobby
  iceburg:
    'Iceburg. The mayor of Water 7 and a master shipwright whose leadership guided a city built on craftsmanship.',
  tom:
    'Tom. A legendary shipwright whose work and ideals shaped an era—and left ripples across the sea.',
  paulie:
    'Paulie. A rope-using shipwright with a strong sense of duty and a knack for dramatic, heroic moments.',
  kokoro:
    'Kokoro. A tough Water 7 elder whose blunt wisdom and hidden courage keep people grounded.',
  chimney:
    'Chimney. Kokoro\'s energetic granddaughter—fearless, curious, and always sprinting into adventure.',

  // Egghead / Science
  vegapunk:
    'Dr. Vegapunk. The world\'s greatest scientist, whose inventions reshaped the age of pirates and the Government\'s power.',
  lilith:
    'Vegapunk "Lilith." One of Vegapunk\'s satellite selves, embodying bold ambition and a dangerous curiosity.',
  shaka:
    'Vegapunk "Shaka." A satellite self known for calm logic and a controlled, leader-like presence.',
  york:
    'Vegapunk "York." A satellite self tied to desire and indulgence, bringing unsettling honesty to human wants.',
  atlas:
    'Vegapunk "Atlas." A satellite self with explosive personality and raw power, turning emotion into action.',
  edison:
    'Vegapunk "Edison." A satellite self focused on invention—always tinkering, optimizing, and pushing ideas forward.',
  pythagoras:
    'Vegapunk "Pythagoras." A satellite self centered on analysis and systems, measuring outcomes like equations.',
  sentomaru:
    'Sentomaru. A tough, loyal bodyguard figure tied to the Navy\'s science forces, known for defense and hard-earned respect.',
  's-hawk':
    'S-Hawk. A Seraphim weapon modeled after Mihawk, combining terrifying genetics with futuristic military science.',
  's-snake':
    'S-Snake. A Seraphim weapon whose charm hides terrifying lethality, built from the Government\'s cold calculus.',
  's-bear':
    'S-Bear. A Seraphim weapon modeled after Kuma, reflecting the unsettling fusion of humanity and engineered control.',
  's-shark':
    'S-Shark. A Seraphim weapon modeled after Jinbe, engineered for overwhelming power and battlefield dominance.',

  // Punk Hazard
  caesar:
    'Caesar Clown. A cruel scientist whose toxic experiments and ego make him as dangerous as any Yonko commander.',
  monet:
    'Monet. A loyal underling whose snow power and cold devotion turn her into an elegant but deadly threat.',
  vergo:
    'Vergo. A hardened fighter tied to underworld schemes, known for brutal discipline and terrifying close-range power.',

  // Fish-Man Island / Sun Pirates
  shirahoshi:
    'Princess Shirahoshi. A gentle giant mermaid whose fear hides world-shaking importance and a longing for peace.',
  'fisher-tiger':
    'Fisher Tiger. A legendary Fish-Man leader whose rebellion and ideals lit the fuse for future change.',

  // Film Red
  uta:
    'Uta. A world-famous singer whose dreams, pain, and influence reveal how powerful hope can be—and how dangerous.',

  // News / Legends
  morgans:
    '"Big News" Morgans. The underworld\'s headline king who shapes the world with ink, secrets, and sensational truth.',
  crocus:
    'Crocus. The lighthouse doctor at Reverse Mountain, a quirky veteran who quietly connects eras of pirate history.',
}

// Display names for all characters (used by seed and UI)
export const characterDisplayNames: Record<string, string> = {
  luffy: 'Monkey D. Luffy',
  zoro: 'Roronoa Zoro',
  nami: 'Nami',
  sanji: 'Vinsmoke Sanji',
  usopp: 'Usopp',
  ussop: 'Usopp',
  chopper: 'Tony Tony Chopper',
  robin: 'Nico Robin',
  franky: 'Franky',
  brook: 'Brook',
  jinbe: 'Jinbe',
  ace: 'Portgas D. Ace',
  sabo: 'Sabo',
  shanks: 'Red-Haired Shanks',
  mihawk: 'Dracule Mihawk',
  doflamingo: 'Donquixote Doflamingo',
  kaido: 'Kaido',
  'big-mom': 'Charlotte Linlin (Big Mom)',
  blackbeard: 'Marshall D. Teach (Blackbeard)',
  law: 'Trafalgar D. Water Law',
  kid: 'Eustass Kid',
  yamato: 'Yamato',
  carrot: 'Carrot',
  vivi: 'Nefertari Vivi',
  boa: 'Boa Hancock',
  'boa-hancock': 'Boa Hancock',
  buggy: 'Buggy the Clown',
  crocodile: 'Sir Crocodile',
  lucci: 'Rob Lucci',
  kuma: 'Bartholomew Kuma',
  ivankov: 'Emporio Ivankov',
  rayleigh: 'Silvers Rayleigh',
  whitebeard: 'Edward Newgate (Whitebeard)',
  marco: 'Marco the Phoenix',
  jozu: 'Jozu',
  vista: 'Vista',
  garp: 'Monkey D. Garp',
  sengoku: 'Sengoku the Buddha',
  smoker: 'Smoker',
  tashigi: 'Tashigi',
  hina: 'Hina',
  coby: 'Koby',
  helmeppo: 'Helmeppo',
  perona: 'Perona',
  moria: 'Gecko Moria',
  'hancock-sisters': 'Boa Sisters',
  magellan: 'Magellan',
  hannyabal: 'Hannyabal',
  'bon-clay': 'Bentham (Mr. 2 Bon Clay)',
  fujitora: 'Issho (Fujitora)',
  gaban: 'Scopper Gaban',
  imu: 'Imu',
  loki: 'Loki',
  rocks: 'Rocks D. Xebec',
  roger: 'Gol D. Roger',
  shamrock: 'Shamrock',
  dragon: 'Monkey D. Dragon',
  akainu: 'Sakazuki (Akainu)',
  aokiji: 'Kuzan (Aokiji)',
  kizaru: 'Borsalino (Kizaru)',
  ryokugyu: 'Aramaki (Ryokugyu)',
  tsuru: 'Tsuru',
  kong: 'Kong',
  gion: 'Gion (Momousagi)',
  tokikake: 'Tokikake (Chaton)',
  garling: 'Figarland Garling',
  saturn: 'Saint Jaygarcia Saturn',
  mars: 'Saint Marcus Mars',
  warcury: 'Saint Topman Warcury',
  nusjuro: 'Saint Ethanbaron V. Nusjuro',
  'ju-peter': 'Saint Shepherd Ju Peter',
  spandine: 'Spandine',
  spandam: 'Spandam',
  kaku: 'Kaku',
  kalifa: 'Kalifa',
  blueno: 'Blueno',
  jabra: 'Jabra',
  fukurou: 'Fukurou',
  kumadori: 'Kumadori',
  stussy: 'Stussy',
  koala: 'Koala',
  hack: 'Hack',
  inazuma: 'Inazuma',
  karasu: 'Karasu',
  'belo-betty': 'Belo Betty',
  morley: 'Morley',
  lindbergh: 'Lindbergh',
  bonney: 'Jewelry Bonney',
  bege: 'Capone "Gang" Bege',
  hawkins: 'Basil Hawkins',
  apoo: 'Scratchmen Apoo',
  drake: 'X Drake',
  urouge: 'Urouge "Mad Monk"',
  killer: 'Killer',
  shiryu: 'Shiryu of the Rain',
  burgess: 'Jesus Burgess',
  'van-augur': 'Van Augur',
  'doc-q': 'Doc Q',
  stronger: 'Stronger',
  lafitte: 'Lafitte',
  'catarina-devon': 'Catarina Devon',
  'sanjuan-wolf': 'Sanjuan Wolf',
  'avalo-pizarro': 'Avalo Pizarro',
  'vasco-shot': 'Vasco Shot',
  'benn-beckman': 'Benn Beckman',
  'lucky-roux': 'Lucky Roux',
  yasopp: 'Yasopp',
  rockstar: 'Rockstar',
  katakuri: 'Charlotte Katakuri',
  perospero: 'Charlotte Perospero',
  pudding: 'Charlotte Pudding',
  smoothie: 'Charlotte Smoothie',
  cracker: 'Charlotte Cracker',
  brulee: 'Charlotte Brûlée',
  oven: 'Charlotte Oven',
  daifuku: 'Charlotte Daifuku',
  streusen: 'Streusen',
  pekoms: 'Pekoms',
  tamago: 'Baron Tamago',
  reiju: 'Vinsmoke Reiju',
  ichiji: 'Vinsmoke Ichiji',
  niji: 'Vinsmoke Niji',
  yonji: 'Vinsmoke Yonji',
  judge: 'Vinsmoke Judge',
  king: 'King the Wildfire',
  queen: 'Queen the Plague',
  jack: 'Jack the Drought',
  ulti: 'Ulti',
  'page-one': 'Page One',
  'whos-who': "Who's-Who",
  'black-maria': 'Black Maria',
  sasaki: 'Sasaki',
  bartolomeo: 'Bartolomeo',
  cavendish: 'Cavendish',
  sai: 'Sai',
  'don-chinjao': 'Don Chinjao',
  leo: 'Leo',
  hajrudin: 'Hajrudin',
  orlumbus: 'Orlumbus',
  ideo: 'Ideo',
  rebecca: 'Rebecca',
  kyros: 'Kyros',
  viola: 'Viola',
  riku: 'King Riku',
  corazon: 'Donquixote Rosinante (Corazon)',
  sugar: 'Sugar',
  'senor-pink': 'Señor Pink',
  'baby-5': 'Baby 5',
  trebol: 'Trebol',
  pica: 'Pica',
  diamante: 'Diamante',
  gladius: 'Gladius',
  'lao-g': 'Lao G',
  dellinger: 'Dellinger',
  oden: 'Kozuki Oden',
  toki: 'Kozuki Toki',
  momonosuke: 'Kozuki Momonosuke',
  hiyori: 'Kozuki Hiyori',
  kinemon: "Kin'emon",
  denjiro: 'Denjiro',
  'ashura-doji': 'Ashura Doji',
  kawamatsu: 'Kawamatsu',
  raizo: 'Raizo',
  kiku: 'Kikunojo (Kiku)',
  kanjuro: 'Kurozumi Kanjuro',
  orochi: 'Kurozumi Orochi',
  yasuie: 'Shimotsuki Yasuie',
  otama: 'O-Tama',
  otoko: 'O-Toko',
  hyogoro: 'Hyogoro the Flower',
  inuarashi: 'Inuarashi',
  nekomamushi: 'Nekomamushi',
  pedro: 'Pedro',
  wanda: 'Wanda',
  shishilian: 'Shishilian',
  enel: 'Enel',
  wyper: 'Wyper',
  'gan-fall': 'Gan Fall',
  conis: 'Conis',
  noland: 'Mont Blanc Noland',
  kalgara: 'Kalgara',
  iceburg: 'Iceburg',
  tom: 'Tom',
  paulie: 'Paulie',
  kokoro: 'Kokoro',
  chimney: 'Chimney',
  vegapunk: 'Dr. Vegapunk',
  lilith: 'Vegapunk "Lilith"',
  shaka: 'Vegapunk "Shaka"',
  york: 'Vegapunk "York"',
  atlas: 'Vegapunk "Atlas"',
  edison: 'Vegapunk "Edison"',
  pythagoras: 'Vegapunk "Pythagoras"',
  sentomaru: 'Sentomaru',
  's-hawk': 'S-Hawk',
  's-snake': 'S-Snake',
  's-bear': 'S-Bear',
  's-shark': 'S-Shark',
  caesar: 'Caesar Clown',
  monet: 'Monet',
  vergo: 'Vergo',
  shirahoshi: 'Princess Shirahoshi',
  'fisher-tiger': 'Fisher Tiger',
  uta: 'Uta',
  morgans: '"Big News" Morgans',
  crocus: 'Crocus',
}

// CSS gradient backgrounds - balanced palette (red, orange, yellow, green, teal, purple, pink, gray)
const characterGradientCss: Record<string, string> = {
  luffy: 'linear-gradient(to bottom right, #ef4444, #f97316)',
  zoro: 'linear-gradient(to bottom right, #16a34a, #059669)',
  nami: 'linear-gradient(to bottom right, #fb923c, #eab308)',
  usopp: 'linear-gradient(to bottom right, #ca8a04, #d97706)',
  ussop: 'linear-gradient(to bottom right, #ca8a04, #d97706)',
  sanji: 'linear-gradient(to bottom right, #3b82f6, #06b6d4)',
  chopper: 'linear-gradient(to bottom right, #f472b6, #fb7185)',
  robin: 'linear-gradient(to bottom right, #7c3aed, #6366f1)',
  franky: 'linear-gradient(to bottom right, #0891b2, #06b6d4)',
  brook: 'linear-gradient(to bottom right, #9ca3af, #4b5563)',
  jinbe: 'linear-gradient(to bottom right, #0e7490, #06b6d4)',
  ace: 'linear-gradient(to bottom right, #dc2626, #ea580c)',
  sabo: 'linear-gradient(to bottom right, #eab308, #f97316)',
  shanks: 'linear-gradient(to bottom right, #b91c1c, #e11d48)',
  mihawk: 'linear-gradient(to bottom right, #a16207, #d97706)',
  doflamingo: 'linear-gradient(to bottom right, #ec4899, #ef4444)',
  kaido: 'linear-gradient(to bottom right, #6d28d9, #7c3aed)',
  'big-mom': 'linear-gradient(to bottom right, #db2777, #e11d48)',
  blackbeard: 'linear-gradient(to bottom right, #374151, #000000)',
  law: 'linear-gradient(to bottom right, #6366f1, #8b5cf6)',
  kid: 'linear-gradient(to bottom right, #ef4444, #ec4899)',
  yamato: 'linear-gradient(to bottom right, #06b6d4, #22d3ee)',
  carrot: 'linear-gradient(to bottom right, #fdba74, #eab308)',
  vivi: 'linear-gradient(to bottom right, #a855f7, #c084fc)',
  boa: 'linear-gradient(to bottom right, #ec4899, #ef4444)',
  'boa-hancock': 'linear-gradient(to bottom right, #ec4899, #ef4444)',
  buggy: 'linear-gradient(to bottom right, #f87171, #fb923c)',
  crocodile: 'linear-gradient(to bottom right, #a16207, #d97706)',
  lucci: 'linear-gradient(to bottom right, #4b5563, #1f2937)',
  kuma: 'linear-gradient(to bottom right, #d97706, #eab308)',
  ivankov: 'linear-gradient(to bottom right, #f472b6, #c084fc)',
  rayleigh: 'linear-gradient(to bottom right, #6b7280, #374151)',
  fujitora: 'linear-gradient(to bottom right, #9333ea, #7c3aed)',
  gaban: 'linear-gradient(to bottom right, #d97706, #f59e0b)',
  imu: 'linear-gradient(to bottom right, #1f2937, #000000)',
  loki: 'linear-gradient(to bottom right, #dc2626, #ea580c)',
  rocks: 'linear-gradient(to bottom right, #991b1b, #ea580c)',
  roger: 'linear-gradient(to bottom right, #ca8a04, #f97316)',
  shamrock: 'linear-gradient(to bottom right, #22c55e, #059669)',
  whitebeard: 'linear-gradient(to bottom right, #6b7280, #374151)',
  marco: 'linear-gradient(to bottom right, #f59e0b, #fbbf24)',
  jozu: 'linear-gradient(to bottom right, #0e7490, #06b6d4)',
  vista: 'linear-gradient(to bottom right, #a16207, #d97706)',
  garp: 'linear-gradient(to bottom right, #1f2937, #4b5563)',
  sengoku: 'linear-gradient(to bottom right, #eab308, #f59e0b)',
  dragon: 'linear-gradient(to bottom right, #059669, #0d9488)',
  akainu: 'linear-gradient(to bottom right, #dc2626, #991b1b)',
  aokiji: 'linear-gradient(to bottom right, #22d3ee, #06b6d4)',
  kizaru: 'linear-gradient(to bottom right, #fbbf24, #f59e0b)',
  ryokugyu: 'linear-gradient(to bottom right, #16a34a, #059669)',
  tsuru: 'linear-gradient(to bottom right, #9ca3af, #6b7280)',
  katakuri: 'linear-gradient(to bottom right, #7c3aed, #a855f7)',
  perospero: 'linear-gradient(to bottom right, #f472b6, #ec4899)',
}

// Fallback: hash slug to pick from balanced palette (avoids all unknowns being blue)
const FALLBACK_COLORS = [
  '#ef4444', '#f97316', '#eab308', '#16a34a', '#06b6d4', '#7c3aed', '#ec4899', '#6b7280',
  '#dc2626', '#d97706', '#059669', '#0891b2', '#6366f1', '#db2777', '#4b5563',
]

export function getCharacterGradientColor(slug: string): string {
  const key = slug.toLowerCase()
  if (characterGradientCss[key]) return characterGradientCss[key]
  const hue = key.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const fallback = FALLBACK_COLORS[hue % FALLBACK_COLORS.length]
  const end = fallback === '#4b5563' ? '#1f2937' : fallback
  return `linear-gradient(to bottom right, ${fallback}, ${end})`
}

// Primary accent color - balanced, fewer blues
const characterAccentHex: Record<string, string> = {
  luffy: '#ef4444', zoro: '#16a34a', nami: '#fb923c', usopp: '#ca8a04', ussop: '#ca8a04',
  sanji: '#3b82f6', chopper: '#f472b6', robin: '#7c3aed', franky: '#0891b2', brook: '#9ca3af',
  jinbe: '#0e7490', ace: '#dc2626', sabo: '#eab308', shanks: '#b91c1c', mihawk: '#a16207',
  doflamingo: '#ec4899', kaido: '#6d28d9', 'big-mom': '#db2777', blackbeard: '#374151',
  law: '#6366f1', kid: '#ef4444', yamato: '#06b6d4', carrot: '#fdba74', vivi: '#a855f7',
  boa: '#ec4899', 'boa-hancock': '#ec4899', buggy: '#f87171', crocodile: '#a16207',
  lucci: '#4b5563', kuma: '#d97706', ivankov: '#f472b6', rayleigh: '#6b7280',
  fujitora: '#9333ea', gaban: '#d97706', imu: '#1f2937', loki: '#dc2626', rocks: '#991b1b',
  roger: '#ca8a04', shamrock: '#22c55e',
  whitebeard: '#6b7280', marco: '#f59e0b', jozu: '#0e7490', vista: '#a16207',
  garp: '#1f2937', sengoku: '#eab308', dragon: '#059669', akainu: '#dc2626',
  aokiji: '#22d3ee', kizaru: '#fbbf24', ryokugyu: '#16a34a', tsuru: '#9ca3af',
  katakuri: '#7c3aed', perospero: '#f472b6',
}

export function getCharacterAccentColor(slug: string): string {
  const key = slug.toLowerCase()
  if (characterAccentHex[key]) return characterAccentHex[key]
  const hue = key.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  return FALLBACK_COLORS[hue % FALLBACK_COLORS.length]
}

export function getAllCharacters(): { slug: string; displayName: string }[] {
  return Object.keys(descriptions).map((slug) => ({
    slug,
    displayName: characterDisplayNames[slug] ?? slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
  }))
}

export function getCharacterDescription(slug: string, displayName: string): string {
  const key = slug.toLowerCase()
  if (descriptions[key]) return descriptions[key]

  // Fallback generic description
  return `${displayName} is one of the many legends of the Grand Line whose strength, reputation, and story you can trade on The Grand Line Exchange.`
}
