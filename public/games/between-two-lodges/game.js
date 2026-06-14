"use strict";

const SAVE_KEY = "betweenTwoLodgesSave";

const chapterSummaries = {
  "Arrival": "A body, a badge, and the first cup of coffee in a town that smiles too hard.",
  "Town": "Diners, classrooms, mills, and stations: every warm room has a locked drawer.",
  "Dreams": "Curtains move without wind. Owls sit where witnesses should be.",
  "Family": "The house with the porch light becomes the center of a weather system.",
  "Lodges": "The case stops being only a case and becomes a map of hunger.",
  "Fire": "A backward chapter of symbolic fragments from the victim's final days.",
  "Return": "Decades later, the town and the self both arrive in pieces.",
  "Outside Time": "Every road, wire, dream, and tape recorder points to one impossible room.",
  "Ending": "The file closes, opens, or becomes someone else's dream."
};

const initialState = {
  currentScene: "arrival_bridge",
  inventory: [],
  clues: [],
  intuition: 2,
  darkness: 0,
  visited: [],
  flags: {}
};

// Add a new scene by creating another object in this map. Choices point to scene ids,
// and effects can change inventory, clues, meters, or flags before the next render.
const scenes = {
  arrival_bridge: {
    id: "arrival_bridge",
    chapter: "Arrival",
    title: "The Bridge Into Rain",
    text: [
      "Your car crosses a narrow bridge into a Pacific Northwest town wrapped in cedar smoke, wet asphalt, and the smell of diner coffee drifting impossibly far.",
      "A young woman has been found near the river. Everyone says her name softly, as if volume could bruise the dead.",
      "The sheriff waits under a dripping brim. Behind him, the woods lean close enough to listen."
    ],
    effects: { addItem: ["FBI recorder"], addClue: ["river body"], intuition: 1 },
    choices: [
      { text: "Meet the sheriff and ask for the case file.", next: "sheriff_station" },
      { text: "Walk down to the riverbank first.", next: "riverbank" },
      { text: "Follow the smell of coffee into town.", next: "double_r_diner" }
    ]
  },
  sheriff_station: {
    id: "sheriff_station",
    chapter: "Town",
    title: "The Sheriff's Station",
    text: [
      "The station is tidy, sincere, and faintly overdecorated with mounted fish. A receptionist offers you coffee before evidence, which tells you something about local procedure.",
      "The sheriff has kind eyes and a drawer full of things no one can explain: a torn diary page, a casino matchbook, and a photograph with a circle of trees scratched into the sky."
    ],
    effects: { addItem: ["case file"], addClue: ["torn diary page"] },
    choices: [
      { text: "Examine the diary page.", next: "diary_page" },
      { text: "Visit the high school.", next: "high_school" },
      { text: "Ask about the scratched trees.", next: "bookhouse" }
    ]
  },
  diary_page: {
    id: "diary_page",
    chapter: "Family",
    title: "The Page Torn Carefully",
    text: [
      "The diary page is not dramatic at first. It mentions homework, perfume, a joke about cafeteria peas, and the relief of being useful to people who need help.",
      "Only near the bottom does the handwriting tighten: a friend has become a hiding place, a house has become a hallway, and the hallway has learned to wait."
    ],
    effects: { addClue: ["waiting hallway"], intuition: 1 },
    choices: [
      { text: "Compare the page with the heart cassette.", next: "cassette", requires: { item: "heart cassette" } },
      { text: "Take the page to the family home.", next: "palmer_house" },
      { text: "Ask the bookhouse group about waiting hallways.", next: "bookhouse" }
    ]
  },
  riverbank: {
    id: "riverbank",
    chapter: "Arrival",
    title: "Plastic on the Stones",
    text: [
      "The river talks over itself. On the stones you find pale fibers, a casino token, and a tiny paper bird folded from a page of homework.",
      "Something in the woods clicks twice, like a tongue against teeth. When you turn, there are only firs and a single owl, awake in daylight."
    ],
    effects: { addItem: ["casino token"], addClue: ["paper bird"], intuition: 1, darkness: 1 },
    choices: [
      { text: "Pocket the paper bird and return to the station.", next: "sheriff_station" },
      { text: "Follow the owl into the trees.", next: "woods_owl" },
      { text: "Take the token to the roadhouse.", next: "roadhouse" }
    ]
  },
  double_r_diner: {
    id: "double_r_diner",
    chapter: "Town",
    title: "Coffee, Pie, and Static",
    text: [
      "The diner is bright enough to seem brave. A waitress pours coffee with the solemnity of a priest and slides you pie that tastes like childhood making a false statement.",
      "Teenagers whisper in a booth. A log truck driver laughs too loudly. The jukebox briefly plays static, then a song nobody admits choosing."
    ],
    effects: { addItem: ["cherry pie"], addClue: ["jukebox static"], intuition: 1 },
    choices: [
      { text: "Question the teenagers gently.", next: "diner_teens" },
      { text: "Inspect the jukebox.", next: "electricity_clue" },
      { text: "Bring pie to the grieving family.", next: "palmer_house" }
    ]
  },
  diner_teens: {
    id: "diner_teens",
    chapter: "Town",
    title: "The Booth in the Back",
    text: [
      "A girl in a letterman jacket says the victim was two people: the one who tutored freshmen and the one who vanished after midnight.",
      "A boy stares into his milkshake until it looks bottomless. He gives you a key from a motel with a name that sounds cheerful in the wrong way."
    ],
    effects: { addItem: ["motel key"], addClue: ["two lives"] },
    choices: [
      { text: "Go to the high school.", next: "high_school" },
      { text: "Use the motel key.", next: "motel_room" },
      { text: "Return to the diner counter.", next: "double_r_diner" }
    ]
  },
  electricity_clue: {
    id: "electricity_clue",
    chapter: "Dreams",
    title: "The Jukebox Hums",
    text: [
      "Behind the jukebox, a wire has been knotted into a shape like a ladder. Your recorder turns itself on and captures a voice buried under electricity.",
      "It does not speak in words. It speaks in room tone, fear, and the rhythm of someone walking down a hallway at night."
    ],
    effects: { addClue: ["electric ladder"], intuition: 1, darkness: 1 },
    choices: [
      { text: "Play the recording at the station.", next: "coded_message" },
      { text: "Keep listening until the room changes.", next: "red_curtain_dream", requires: { minIntuition: 4 } },
      { text: "Back away and order more coffee.", next: "double_r_diner" }
    ]
  },
  high_school: {
    id: "high_school",
    chapter: "Town",
    title: "Lockers and Lilacs",
    text: [
      "The high school smells of wet wool, floor wax, and flowers left too long in vases. The victim's locker contains perfume, a volunteer schedule, and a cassette labeled with a heart.",
      "The principal insists the children are resilient. Every child you pass looks like glass pretending to be skin."
    ],
    effects: { addItem: ["heart cassette"], addClue: ["volunteer schedule"] },
    choices: [
      { text: "Listen to the cassette.", next: "cassette" },
      { text: "Follow the volunteer schedule to the meals program.", next: "meals_program" },
      { text: "Ask about a secret club at the roadhouse.", next: "roadhouse" }
    ]
  },
  cassette: {
    id: "cassette",
    chapter: "Family",
    title: "A Voice on Tape",
    text: [
      "Her voice is bright, then tired, then very old. She talks around a name without saying it, as if the syllables might let someone in.",
      "At the end, she laughs at a joke you cannot hear. The laugh breaks. Your recorder answers with a burst of crackling light."
    ],
    effects: { addClue: ["unnamed visitor"], intuition: 2, darkness: 1 },
    choices: [
      { text: "Take the tape to her family home.", next: "palmer_house" },
      { text: "Compare it with the jukebox recording.", next: "coded_message", requires: { clue: "electric ladder" } },
      { text: "Go somewhere loud: the roadhouse.", next: "roadhouse" }
    ]
  },
  roadhouse: {
    id: "roadhouse",
    chapter: "Town",
    title: "The Roadhouse",
    text: [
      "Blue light, red beer signs, a singer with eyes like a locked hospital. The crowd sways as if the music is remembering them.",
      "A one-armed man at the bar folds a napkin into a tiny room. He tells you the woods do not invent evil. They provide an address."
    ],
    effects: { addClue: ["one-armed warning"], intuition: 1 },
    choices: [
      { text: "Ask about the casino token.", next: "one_eyed_jack", requires: { item: "casino token" } },
      { text: "Listen to the singer until you dream.", next: "red_curtain_dream", requires: { minIntuition: 4 } },
      { text: "Visit the sawmill before closing.", next: "sawmill" }
    ]
  },
  one_eyed_jack: {
    id: "one_eyed_jack",
    chapter: "Town",
    title: "The Casino Across the Line",
    text: [
      "Across the border, the casino smiles in velvet and cigarette light. Every chandelier seems to know which tables are traps.",
      "The token buys you five minutes with a ledger full of initials. One set matches the victim's volunteer schedule. Another belongs to someone with a house full of flowers."
    ],
    effects: { addClue: ["casino ledger"], darkness: 1 },
    choices: [
      { text: "Return to town with the ledger clue.", next: "sheriff_station" },
      { text: "Follow the initials to the motel.", next: "motel_room", requires: { item: "motel key" } },
      { text: "Let the casino lights become a dream.", next: "red_curtain_dream", requires: { minIntuition: 5 } }
    ]
  },
  sawmill: {
    id: "sawmill",
    chapter: "Town",
    title: "The Sawmill",
    text: [
      "The sawmill breathes resin and debt. Workers speak warmly of the victim's charity work, then go quiet when you ask who she feared.",
      "In the boiler room, you find a scorched scrap of paper: a drawing of red curtains under a telephone pole."
    ],
    effects: { addClue: ["curtain drawing"], darkness: 1 },
    choices: [
      { text: "Inspect the telephone pole outside.", next: "telephone_pole" },
      { text: "Follow a truck route into the woods.", next: "woods_owl" },
      { text: "Report the drawing to the sheriff.", next: "sheriff_station" }
    ]
  },
  bookhouse: {
    id: "bookhouse",
    chapter: "Town",
    title: "The Men Behind the Books",
    text: [
      "Behind a false shelf in a quiet bar, the sheriff introduces you to townspeople who have been tracking oddness for years with thermoses, shotguns, and very neat handwriting.",
      "Their map places the murder, the sawmill, the roadhouse, and several disappearances around a ring of sycamores."
    ],
    effects: { addItem: ["woods map"], addClue: ["sycamore ring"] },
    choices: [
      { text: "Take the map into the woods.", next: "woods_owl" },
      { text: "Investigate the motel room.", next: "motel_room", requires: { item: "motel key" } },
      { text: "Go to the family home.", next: "palmer_house" }
    ]
  },
  motel_room: {
    id: "motel_room",
    chapter: "Family",
    title: "The Cheerful Motel",
    text: [
      "The room has been cleaned with violent optimism. Under the mattress you find a broken angel pin and a list of names, some crossed out, some circled.",
      "A ceiling light flickers in a pattern your stomach understands before your mind does."
    ],
    effects: { addItem: ["broken angel pin"], addClue: ["crossed-out names"], intuition: 1, darkness: 1 },
    choices: [
      { text: "Bring the pin to her mother.", next: "palmer_house" },
      { text: "Trace the circled names to the roadhouse.", next: "roadhouse" },
      { text: "Stare into the flicker.", next: "red_curtain_dream", requires: { minIntuition: 5 } }
    ]
  },
  meals_program: {
    id: "meals_program",
    chapter: "Family",
    title: "Meals on the Hill",
    text: [
      "Elderly residents remember her kindness in details too small to fake: extra butter, open curtains, a radio tuned to baseball for a man who had forgotten the rules.",
      "One woman gives you a smell instead of a clue: engine oil, scorched hair, and a flower pressed in a book."
    ],
    effects: { addClue: ["scorched smell"], intuition: 1 },
    choices: [
      { text: "Look for the flower in the school library.", next: "library_flower" },
      { text: "Return to the family home.", next: "palmer_house" },
      { text: "Follow the smell toward the telephone pole.", next: "telephone_pole" }
    ]
  },
  library_flower: {
    id: "library_flower",
    chapter: "Family",
    title: "Pressed Between Pages",
    text: [
      "The flower is inside a book of myths about doorways, thresholds, and bargains made by firelight. Someone has underlined every mention of a double.",
      "A card falls out with tonight's date, written twenty-five years too early."
    ],
    effects: { addItem: ["pressed flower"], addClue: ["double myth"], intuition: 1 },
    choices: [
      { text: "Take the flower to the woods.", next: "woods_owl" },
      { text: "Ask the sheriff about the impossible date.", next: "coded_message" },
      { text: "Bring the myth book to the grieving house.", next: "palmer_house" }
    ]
  },
  palmer_house: {
    id: "palmer_house",
    chapter: "Family",
    title: "The House With the Porch Light",
    text: [
      "The living room is full of flowers and the exhausted politeness people use when grief has nowhere to sit. Her mother looks through you, toward a corner where nothing stands.",
      "Her father makes coffee with shaking hands. The house seems ordinary until the walls settle and you realize they are holding their breath."
    ],
    effects: { addClue: ["house breathes"], darkness: 1 },
    choices: [
      { text: "Offer the angel pin and listen.", next: "mother_vision", requires: { item: "broken angel pin" } },
      { text: "Interview the father directly.", next: "father_shadow" },
      { text: "Leave the pie and say nothing for a while.", next: "compassion_room", requires: { item: "cherry pie" } }
    ]
  },
  mother_vision: {
    id: "mother_vision",
    chapter: "Family",
    title: "The Mother Sees",
    text: [
      "The pin touches her palm and the room tilts. She describes a shape at the foot of her daughter's bed, a smile behind a smile, a hand that did not belong to the hand.",
      "You believe her. It costs you something, but less than disbelief would."
    ],
    effects: { addClue: ["smile behind smile"], intuition: 2, darkness: 1 },
    choices: [
      { text: "Name it as possession, though the word feels too small.", next: "possession_theory" },
      { text: "Ask what her daughter needed most.", next: "compassion_room" },
      { text: "Retreat to the woods map.", next: "woods_owl", requires: { item: "woods map" } }
    ]
  },
  father_shadow: {
    id: "father_shadow",
    chapter: "Family",
    title: "The Laugh in the Hall",
    text: [
      "The father answers every question correctly and makes every correct answer frightening. In the hallway mirror, for one second, his reflection is late.",
      "You smell engine oil, scorched hair, and a flower pressed in a book."
    ],
    effects: { addClue: ["late reflection"], darkness: 2 },
    choices: [
      { text: "Push harder and risk the house pushing back.", next: "basement_horror" },
      { text: "Step outside and call the sheriff.", next: "possession_theory" },
      { text: "Follow the smell to the telephone pole.", next: "telephone_pole" }
    ]
  },
  compassion_room: {
    id: "compassion_room",
    chapter: "Family",
    title: "Pie on a Mourning Table",
    text: [
      "You stop investigating for twelve minutes. You sit with a woman who has no room left inside her and let the silence be a thing you do together.",
      "When you leave, a picture frame has turned face down by itself. On its back is a tiny blue rose drawn in pencil."
    ],
    effects: { addClue: ["blue rose"], intuition: 2, darkness: -1, flag: { compassion: true } },
    choices: [
      { text: "Take the blue rose clue to the station.", next: "blue_rose_file" },
      { text: "Enter the woods with a gentler heart.", next: "woods_owl" },
      { text: "Sleep and let the dream answer.", next: "red_curtain_dream", requires: { minIntuition: 5 } }
    ]
  },
  basement_horror: {
    id: "basement_horror",
    chapter: "Family",
    title: "Beneath the House",
    text: [
      "The basement is full of labeled boxes, storm windows, and the terror of ordinary storage. Behind a loose panel is a scrap of bloody plastic and a mirror wrapped in a towel.",
      "The mirror shows you the room empty. Then it shows you yourself smiling with someone else's appetite."
    ],
    effects: { addItem: ["wrapped mirror"], addClue: ["bloody plastic"], darkness: 2 },
    choices: [
      { text: "Destroy the mirror.", next: "possession_theory" },
      { text: "Keep the mirror as evidence.", next: "mirror_burden" },
      { text: "Run into the rain.", next: "woods_owl" }
    ]
  },
  mirror_burden: {
    id: "mirror_burden",
    chapter: "Lodges",
    title: "Evidence That Looks Back",
    text: [
      "You tag the mirror, but the tag keeps appearing on your own wrist. The case file now contains a photograph of you standing in a red room you have never visited.",
      "Your recorder clicks on and whispers your badge number in reverse."
    ],
    effects: { addClue: ["future photograph"], darkness: 2, intuition: 1, flag: { carriesMirror: true } },
    choices: [
      { text: "Play the reversed number.", next: "coded_message" },
      { text: "Bring the mirror to the sycamores.", next: "sycamore_circle" },
      { text: "Hide it in the station evidence locker.", next: "blue_rose_file" }
    ]
  },
  telephone_pole: {
    id: "telephone_pole",
    chapter: "Dreams",
    title: "Six Wires Against the Sky",
    text: [
      "The pole hums although no wind moves. Numbers have been carved into the wood, then burned, then carved again by someone with patient hands.",
      "A moth lands on your sleeve. Its wings are patterned like floor tile."
    ],
    effects: { addClue: ["burned numbers"], intuition: 1, darkness: 1 },
    choices: [
      { text: "Read the numbers aloud.", next: "coded_message" },
      { text: "Follow the wires into the woods.", next: "woods_owl" },
      { text: "Wait for nightfall.", next: "red_curtain_dream", requires: { minIntuition: 5 } }
    ]
  },
  coded_message: {
    id: "coded_message",
    chapter: "Dreams",
    title: "The Message Between Sounds",
    text: [
      "Tape hiss, burned numbers, and electrical pops align into a message that is less sentence than weather report: the hungry thing entered through love twisted into ownership.",
      "The sheriff writes it down, then crosses it out, then writes it down again."
    ],
    effects: { addClue: ["hunger uses love"], intuition: 2 },
    choices: [
      { text: "Build the possession theory.", next: "possession_theory" },
      { text: "Let the message pull you into sleep.", next: "red_curtain_dream", requires: { minIntuition: 5 } },
      { text: "Open the old blue rose file.", next: "blue_rose_file", requires: { clue: "blue rose" } }
    ]
  },
  woods_owl: {
    id: "woods_owl",
    chapter: "Dreams",
    title: "The Owls Are Not Evidence",
    text: [
      "The woods are green, wet, and full of the feeling that something has just stepped aside. Owls follow your flashlight beam without moving their heads.",
      "Between two sycamores, a curtain of darkness hangs in daylight."
    ],
    effects: { addClue: ["dark curtain"], intuition: 1, darkness: 1 },
    choices: [
      { text: "Enter the sycamore circle.", next: "sycamore_circle", requires: { clue: "sycamore ring" } },
      { text: "Leave an offering of cherry pie.", next: "white_lodge_hint", requires: { item: "cherry pie" } },
      { text: "Keep walking until the trees repeat.", next: "repeating_path" }
    ]
  },
  red_curtain_dream: {
    id: "red_curtain_dream",
    chapter: "Dreams",
    title: "A Room With No Corners",
    text: [
      "Red curtains breathe around a floor of sharp black and white. A small table holds coffee that steams downward and a ring that is also a question.",
      "A woman who looks like the victim but older mouths words you cannot hear. When she points at you, your hand is already pointing back."
    ],
    effects: { addItem: ["green ring"], addClue: ["room with no corners"], intuition: 2, darkness: 1, flag: { dreamedRedRoom: true } },
    choices: [
      { text: "Take the ring.", next: "green_ring_taken" },
      { text: "Refuse the ring and ask whom it hurts.", next: "white_lodge_hint" },
      { text: "Look behind the curtains.", next: "black_lodge_glimpse" }
    ]
  },
  green_ring_taken: {
    id: "green_ring_taken",
    chapter: "Lodges",
    title: "The Ring on Your Finger",
    text: [
      "The ring is cold, then warm, then exactly your temperature. Your badge photo changes: you are smiling too widely.",
      "Some doors open now. Others close quietly and forever."
    ],
    effects: { addClue: ["ring bargain"], darkness: 2, intuition: 1, flag: { tookRing: true } },
    choices: [
      { text: "Use the ring to enter the circle.", next: "sycamore_circle" },
      { text: "Investigate the old case files.", next: "blue_rose_file" },
      { text: "Dream backward into the victim's final days.", next: "fire_walk_chapter" }
    ]
  },
  black_lodge_glimpse: {
    id: "black_lodge_glimpse",
    chapter: "Lodges",
    title: "Behind the Curtains",
    text: [
      "You see a room stacked inside the room, and inside it a version of you that has learned every shortcut to cruelty.",
      "It taps the glass between worlds. The tapping matches your heartbeat."
    ],
    effects: { addClue: ["doppelganger"], darkness: 2, flag: { sawDouble: true } },
    choices: [
      { text: "Confront the double now.", next: "double_confrontation" },
      { text: "Wake yourself by remembering the victim.", next: "fire_walk_chapter" },
      { text: "Run deeper.", next: "ending_repeating_dream" }
    ]
  },
  white_lodge_hint: {
    id: "white_lodge_hint",
    chapter: "Lodges",
    title: "Warm Light Through Needles",
    text: [
      "For a moment the woods become less hungry. You hear laughter from the diner, the sheriff's steady breathing, and the victim's voice saying that pity is not the same as mercy.",
      "A white shape passes between the trees, not pure, not simple, but kind."
    ],
    effects: { addClue: ["mercy path"], intuition: 2, darkness: -1, flag: { mercyPath: true } },
    choices: [
      { text: "Carry mercy into the prequel dream.", next: "fire_walk_chapter" },
      { text: "Open the blue rose file.", next: "blue_rose_file" },
      { text: "Go to the sycamore circle.", next: "sycamore_circle" }
    ]
  },
  repeating_path: {
    id: "repeating_path",
    chapter: "Dreams",
    title: "The Path That Remembers You",
    text: [
      "The trail loops through the same fern, the same stump, the same gum wrapper, each time more familiar and less yours.",
      "Your recorder says, in your voice, that repetition can be a door or a trap."
    ],
    effects: { addClue: ["looping trail"], darkness: 1 },
    choices: [
      { text: "Break the loop with the woods map.", next: "sycamore_circle", requires: { item: "woods map" } },
      { text: "Trust intuition over direction.", next: "white_lodge_hint", requires: { minIntuition: 7 } },
      { text: "Keep walking.", next: "ending_repeating_dream" }
    ]
  },
  possession_theory: {
    id: "possession_theory",
    chapter: "Lodges",
    title: "The Human Door",
    text: [
      "The evidence makes a shape no court would love: a human being used as a doorway by an old appetite from the woods.",
      "The tragedy remains human anyway. That is the worst part. The supernatural does not erase the harm. It only gives it teeth."
    ],
    effects: { addClue: ["human door"], intuition: 2 },
    choices: [
      { text: "Arrest the human suspect.", next: "arrest_attempt", requires: { clue: "late reflection" } },
      { text: "Seek the source at the sycamore circle.", next: "sycamore_circle" },
      { text: "Dream the victim's final days before acting.", next: "fire_walk_chapter" }
    ]
  },
  arrest_attempt: {
    id: "arrest_attempt",
    chapter: "Family",
    title: "The Siren at the House",
    text: [
      "The arrest begins with procedure and ends with every light on the street exploding. The suspect weeps, laughs, and begs in voices that do not agree on a face.",
      "When the room goes still, you know the case has an answer. You also know the answer has not ended anything."
    ],
    effects: { addClue: ["case answer"], darkness: 2, flag: { solvedCase: true } },
    choices: [
      { text: "Close the file and accept the damage.", next: "ending_lost_yourself" },
      { text: "Follow the escaping thing to the woods.", next: "sycamore_circle" },
      { text: "Let the answer become a dream backward.", next: "fire_walk_chapter" }
    ]
  },
  blue_rose_file: {
    id: "blue_rose_file",
    chapter: "Lodges",
    title: "The Blue Rose File",
    text: [
      "The old file cabinet contains cases that refused to be cases: vanished agents, impossible fingerprints, a woman who heard electricity speaking from the sink.",
      "Your current file fits too neatly beside them. The folder edges align with a click that sounds like a lock."
    ],
    effects: { addItem: ["blue rose file"], addClue: ["vanished agents"], intuition: 1 },
    choices: [
      { text: "Compare vanished agents with the double myth.", next: "double_confrontation", requires: { clue: "double myth" } },
      { text: "Use the file to enter the prequel dream.", next: "fire_walk_chapter" },
      { text: "Wait twenty-five years for the file to ripen.", next: "return_time_jump" }
    ]
  },
  sycamore_circle: {
    id: "sycamore_circle",
    chapter: "Lodges",
    title: "Between the Sycamores",
    text: [
      "The circle is not hidden. It has been waiting in plain sight, patient as a stain. Your clues feel heavier here, as if the woods can read paper.",
      "A red opening appears. From one side comes grief. From the other comes hunger wearing grief's coat."
    ],
    effects: { addClue: ["lodge doorway"], darkness: 1 },
    choices: [
      { text: "Enter with compassion as your anchor.", next: "white_lodge_trial", requires: { flag: "mercyPath" } },
      { text: "Enter wearing the ring.", next: "black_lodge_trial", requires: { flag: "tookRing" } },
      { text: "Enter with only evidence.", next: "black_lodge_trial" }
    ]
  },
  fire_walk_chapter: {
    id: "fire_walk_chapter",
    chapter: "Fire",
    title: "The Week Before",
    text: [
      "The dream turns backward. You are not the victim, not exactly, but you move through fragments of her last days: perfume over fear, kindness beside danger, a diary hidden where adults do not look.",
      "She knew the town loved her. She also knew love can be used as camouflage by those who want possession."
    ],
    effects: { addClue: ["final days"], intuition: 2, darkness: 1, flag: { sawFinalDays: true } },
    choices: [
      { text: "Protect the diary fragment.", next: "diary_fragment" },
      { text: "Stand beside her in the train-car dream.", next: "train_car_dream" },
      { text: "Look away and return to the investigation.", next: "sycamore_circle" }
    ]
  },
  diary_fragment: {
    id: "diary_fragment",
    chapter: "Fire",
    title: "The Hidden Page",
    text: [
      "The page does not reveal a twist. It reveals endurance. She was afraid, funny, furious, and alive in ways the case file flattened.",
      "You add her words to the evidence, not as a clue to solve her, but as a person refusing to disappear."
    ],
    effects: { addItem: ["hidden diary fragment"], addClue: ["victim endured"], intuition: 2, darkness: -1, flag: { honoredVictim: true } },
    choices: [
      { text: "Carry her voice to the final room.", next: "white_lodge_trial" },
      { text: "Follow the old evil into the future.", next: "return_time_jump" },
      { text: "Return to the circle.", next: "sycamore_circle" }
    ]
  },
  train_car_dream: {
    id: "train_car_dream",
    chapter: "Fire",
    title: "Metal, Rain, and Prayer",
    text: [
      "In the dream, metal walls shudder and the air tastes like pennies. You cannot undo what happened. The dream will not flatter you with that lie.",
      "But you can bear witness. You can refuse to let horror become spectacle."
    ],
    effects: { addClue: ["witness not spectacle"], intuition: 2, darkness: -1, flag: { boreWitness: true } },
    choices: [
      { text: "Follow the angelic light.", next: "white_lodge_trial" },
      { text: "Chase the killer's shadow.", next: "black_lodge_trial" },
      { text: "Wake decades later.", next: "return_time_jump" }
    ]
  },
  return_time_jump: {
    id: "return_time_jump",
    chapter: "Return",
    title: "Twenty-Five Years, Give or Take",
    text: [
      "Time passes with the strange mercy of a bad edit. The town grows older, then not older enough. Your own face becomes a rumor in federal databases.",
      "A call comes from Las Vegas about an insurance salesman who looks like you and wins jackpots by listening to wall sockets."
    ],
    effects: { addClue: ["fractured identity"], intuition: 1, darkness: 1, flag: { timeJumped: true } },
    choices: [
      { text: "Go to Las Vegas.", next: "las_vegas" },
      { text: "Return to the old town first.", next: "old_town" },
      { text: "Follow the electrical signal.", next: "electric_world" }
    ]
  },
  las_vegas: {
    id: "las_vegas",
    chapter: "Return",
    title: "The Desert Wearing Neon",
    text: [
      "Las Vegas is the woods turned inside out: bright, artificial, and full of hidden rooms. The man with your face smiles at slot machines like they are giving him instructions.",
      "A tiny red light in an outlet blinks when you say the victim's name."
    ],
    effects: { addClue: ["Vegas double"], intuition: 1 },
    choices: [
      { text: "Help the fractured man remember kindness.", next: "dougie_kindness" },
      { text: "Use him as bait for the double.", next: "double_confrontation" },
      { text: "Enter the outlet's light.", next: "electric_world" }
    ]
  },
  dougie_kindness: {
    id: "dougie_kindness",
    chapter: "Return",
    title: "A Simple Goodness",
    text: [
      "You spend a day guiding a gentle, emptied version of yourself through breakfast, work, and a child's drawing. It should be absurd. It is absurd.",
      "It is also the first time in years the case has felt close to grace."
    ],
    effects: { addClue: ["simple goodness"], intuition: 2, darkness: -1, flag: { savedDougie: true } },
    choices: [
      { text: "Bring that goodness back to town.", next: "old_town" },
      { text: "Let the outlet pull you onward.", next: "electric_world" },
      { text: "Confront the double with a steadier heart.", next: "double_confrontation" }
    ]
  },
  old_town: {
    id: "old_town",
    chapter: "Return",
    title: "The Town After the Town",
    text: [
      "The diner has new paint and the same counter. The sheriff's station has younger voices answering old phones. The woods look unchanged, which feels like an accusation.",
      "People remember the victim differently now: as cautionary tale, saint, scandal, daughter, friend. None of the versions are large enough."
    ],
    effects: { addClue: ["memory changes"], intuition: 1 },
    choices: [
      { text: "Visit the house one final time.", next: "final_house" },
      { text: "Go straight to the sycamores.", next: "outside_time" },
      { text: "Accept that time may not heal the town.", next: "ending_return_uncertain" }
    ]
  },
  electric_world: {
    id: "electric_world",
    chapter: "Return",
    title: "Where Electricity Sleeps",
    text: [
      "Inside the current, rooms are stacked like old televisions. A woman with no visible address guards a switchboard of humming bells.",
      "She offers you a choice: send the evil forward where you can fight it, or backward where you might break the story and everyone in it."
    ],
    effects: { addClue: ["switchboard"], intuition: 2, darkness: 1 },
    choices: [
      { text: "Send it forward and face your double.", next: "double_confrontation" },
      { text: "Send yourself backward to save her.", next: "outside_time", requires: { flag: "honoredVictim" } },
      { text: "Touch every bell at once.", next: "ending_repeating_dream" }
    ]
  },
  double_confrontation: {
    id: "double_confrontation",
    chapter: "Return",
    title: "The Other Investigator",
    text: [
      "Your double arrives wearing your tiredness as elegance. It knows your instincts, your pride, your private wish to be the one who understands.",
      "It offers the easiest ending: solve the case, take the credit, leave the wound open."
    ],
    effects: { addClue: ["double offer"], darkness: 1 },
    choices: [
      { text: "Accept the easy ending.", next: "ending_lost_yourself" },
      { text: "Reject the offer with compassion.", next: "outside_time", requires: { flag: "compassion" } },
      { text: "Fight it with the mirror.", next: "outside_time", requires: { flag: "carriesMirror" } }
    ]
  },
  final_house: {
    id: "final_house",
    chapter: "Outside Time",
    title: "The House That Answers Differently",
    text: [
      "The house is both occupied and empty. A stranger answers the door and gives a name that rearranges the hallway behind you.",
      "Somewhere upstairs a girl cries out, or a woman remembers, or time itself discovers pain and calls it by a human name."
    ],
    effects: { addClue: ["wrong house"], darkness: 1 },
    choices: [
      { text: "Ask what year this is.", next: "outside_time" },
      { text: "Leave before the scream repeats.", next: "ending_return_uncertain" },
      { text: "Follow the sound upstairs.", next: "black_lodge_trial" }
    ]
  },
  white_lodge_trial: {
    id: "white_lodge_trial",
    chapter: "Outside Time",
    title: "The Trial of Mercy",
    text: [
      "The white room is not spotless. It contains every failure you brought with you, arranged gently so you can look at them without flinching.",
      "The question is not whether you solved the murder. The question is whether you can meet grief without turning it into a trophy."
    ],
    effects: { addClue: ["trial of mercy"], intuition: 1, darkness: -1 },
    choices: [
      { text: "Speak the victim's humanity before the room.", next: "outside_time", requires: { flag: "honoredVictim" } },
      { text: "Trade your exit for another person's freedom.", next: "ending_left_behind", requires: { flag: "boreWitness" } },
      { text: "Try to master the room.", next: "black_lodge_trial" }
    ]
  },
  black_lodge_trial: {
    id: "black_lodge_trial",
    chapter: "Outside Time",
    title: "The Trial of Appetite",
    text: [
      "The black room applauds without hands. It shows you every clue you found and asks why understanding did not make you kinder sooner.",
      "Your double circles you, patient and beautifully dressed. The ring burns. The curtains wait."
    ],
    effects: { addClue: ["trial of appetite"], darkness: 2 },
    choices: [
      { text: "Keep the solution and surrender the self.", next: "ending_lost_yourself" },
      { text: "Break the ring with the hidden diary fragment.", next: "outside_time", requires: { item: "hidden diary fragment" } },
      { text: "Run until the room loops.", next: "ending_repeating_dream" }
    ]
  },
  outside_time: {
    id: "outside_time",
    chapter: "Outside Time",
    title: "The Place Outside Time",
    text: [
      "Every chapter reaches this room: the river, diner, school, roadhouse, sawmill, house, casino, outlet, and woods. The victim stands at the center, not saved by your arrival, not reduced to your failure.",
      "The final choice is smaller than heroism and harder than certainty."
    ],
    effects: { addClue: ["final room"], intuition: 1 },
    choices: [
      { text: "Break the cycle through compassion.", next: "ending_compassion", requires: { flag: "compassion" } },
      { text: "Escape the Lodge and leave the double sealed inside.", next: "ending_left_behind" },
      { text: "Return to town decades later, unsure.", next: "ending_return_uncertain" }
    ]
  },
  ending_lost_yourself: {
    id: "ending_lost_yourself",
    chapter: "Ending",
    title: "Ending: Solved the Case, Lost Yourself",
    text: [
      "The report is exemplary. The suspect is named. The evidence closes around the answer with professional precision.",
      "Years later, agents study your file and admire your work. None of them notice the smile in your photograph changing one millimeter at a time."
    ],
    effects: { flag: { ended: true } },
    choices: [{ text: "Begin the dream again.", next: "arrival_bridge", restart: true }]
  },
  ending_left_behind: {
    id: "ending_left_behind",
    chapter: "Ending",
    title: "Ending: Escaped, But Left Someone Behind",
    text: [
      "You wake beside the river with mud on your shoes and a red thread around your wrist. The town is alive. The door is closed.",
      "At night, the diner windows reflect someone standing just behind you, smiling with your face, waiting for a kindness you could not afford."
    ],
    effects: { flag: { ended: true } },
    choices: [{ text: "Restart the investigation.", next: "arrival_bridge", restart: true }]
  },
  ending_compassion: {
    id: "ending_compassion",
    chapter: "Ending",
    title: "Ending: Broke the Cycle Through Compassion",
    text: [
      "You do not save the past. You do not make suffering useful. Instead, you refuse the old hunger its favorite food: isolation.",
      "The victim's voice fills the room with all the ordinary things she never got to finish. The curtains open onto morning. Somewhere, coffee is poured for the living."
    ],
    effects: { flag: { ended: true } },
    choices: [{ text: "Visit the town again.", next: "arrival_bridge", restart: true }]
  },
  ending_repeating_dream: {
    id: "ending_repeating_dream",
    chapter: "Ending",
    title: "Ending: Trapped in a Repeating Dream",
    text: [
      "You walk the same hallway, enter the same room, lift the same cup, and understand the same clue one second too late.",
      "The dream is not punishment. It is appetite with good memory."
    ],
    effects: { flag: { ended: true } },
    choices: [{ text: "Try the first door again.", next: "arrival_bridge", restart: true }]
  },
  ending_return_uncertain: {
    id: "ending_return_uncertain",
    chapter: "Ending",
    title: "Ending: Returned Decades Later, Unsure",
    text: [
      "You come back when your hair is different and the town has learned new ways to keep old secrets. Some people are kinder. Some lights still flicker.",
      "At the bridge, you hear a young woman laugh in the rain. It might be memory. It might be mercy. It might be the first scene starting over with a better witness."
    ],
    effects: { flag: { ended: true } },
    choices: [{ text: "Cross the bridge again.", next: "arrival_bridge", restart: true }]
  }
};

let state = loadGame();

const sceneTitle = document.querySelector("#sceneTitle");
const sceneText = document.querySelector("#sceneText");
const choicesEl = document.querySelector("#choices");
const inventoryList = document.querySelector("#inventoryList");
const clueList = document.querySelector("#clueList");
const intuitionMeter = document.querySelector("#intuitionMeter");
const darknessMeter = document.querySelector("#darknessMeter");
const intuitionValue = document.querySelector("#intuitionValue");
const darknessValue = document.querySelector("#darknessValue");
const chapterName = document.querySelector("#chapterName");
const chapterSummary = document.querySelector("#chapterSummary");
const sceneCounter = document.querySelector("#sceneCounter");
const restartButton = document.querySelector("#restartButton");

restartButton.addEventListener("click", () => {
  state = structuredClone(initialState);
  saveGame();
  render();
});

function loadGame() {
  const saved = localStorage.getItem(SAVE_KEY);
  if (!saved) return structuredClone(initialState);

  try {
    const parsed = JSON.parse(saved);
    if (!parsed.currentScene || !scenes[parsed.currentScene]) {
      return structuredClone(initialState);
    }
    return {
      ...structuredClone(initialState),
      ...parsed,
      inventory: Array.isArray(parsed.inventory) ? parsed.inventory : [],
      clues: Array.isArray(parsed.clues) ? parsed.clues : [],
      visited: Array.isArray(parsed.visited) ? parsed.visited : [],
      flags: parsed.flags && typeof parsed.flags === "object" ? parsed.flags : {}
    };
  } catch {
    return structuredClone(initialState);
  }
}

function saveGame() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function render() {
  const scene = scenes[state.currentScene] || scenes.arrival_bridge;
  applyEffects(scene.effects);
  rememberVisit(scene.id);
  saveGame();

  sceneTitle.textContent = scene.title;
  chapterName.textContent = scene.chapter;
  chapterSummary.textContent = chapterSummaries[scene.chapter] || "";
  sceneCounter.textContent = `${state.visited.length} scene${state.visited.length === 1 ? "" : "s"} visited`;
  sceneText.innerHTML = scene.text.map((paragraph) => `<p>${paragraph}</p>`).join("");

  renderChoices(scene);
  renderSidebar();
}

function renderChoices(scene) {
  choicesEl.innerHTML = "";

  scene.choices.forEach((choice) => {
    const button = document.createElement("button");
    const allowed = meetsRequirements(choice.requires);
    button.className = "choice-button";
    button.type = "button";
    button.textContent = allowed ? choice.text : `${choice.text} (locked)`;
    button.disabled = !allowed;
    button.addEventListener("click", () => {
      if (choice.restart) {
        state = structuredClone(initialState);
      }
      state.currentScene = choice.next;
      render();
    });
    choicesEl.appendChild(button);
  });
}

function renderSidebar() {
  intuitionMeter.value = state.intuition;
  darknessMeter.value = state.darkness;
  intuitionValue.textContent = state.intuition;
  darknessValue.textContent = state.darkness;
  renderList(inventoryList, state.inventory, "Empty pockets, full thermos.");
  renderList(clueList, state.clues, "No clues recorded yet.");
}

function renderList(listEl, entries, emptyText) {
  listEl.innerHTML = "";
  const items = entries.length ? entries : [emptyText];

  items.forEach((entry) => {
    const li = document.createElement("li");
    li.textContent = entry;
    listEl.appendChild(li);
  });
}

function applyEffects(effects = {}) {
  if (state.flags[`effect:${state.currentScene}`]) return;

  addUnique(state.inventory, effects.addItem);
  addUnique(state.clues, effects.addClue);
  state.intuition = clamp(state.intuition + (effects.intuition || 0), 0, 10);
  state.darkness = clamp(state.darkness + (effects.darkness || 0), 0, 10);

  if (effects.flag) {
    state.flags = { ...state.flags, ...effects.flag };
  }

  state.flags[`effect:${state.currentScene}`] = true;
}

function addUnique(target, values) {
  if (!values) return;
  values.forEach((value) => {
    if (!target.includes(value)) target.push(value);
  });
}

function rememberVisit(sceneId) {
  if (!state.visited.includes(sceneId)) {
    state.visited.push(sceneId);
  }
}

function meetsRequirements(requirements) {
  if (!requirements) return true;
  if (requirements.item && !state.inventory.includes(requirements.item)) return false;
  if (requirements.clue && !state.clues.includes(requirements.clue)) return false;
  if (requirements.flag && !state.flags[requirements.flag]) return false;
  if (requirements.minIntuition && state.intuition < requirements.minIntuition) return false;
  if (requirements.maxDarkness !== undefined && state.darkness > requirements.maxDarkness) return false;
  return true;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

render();
