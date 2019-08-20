import {
  triads,
  classes,
  ip,
  subsets,
  letters,
  octaveOrientedLetters,
  rootAccidentals,
  accidentals,
  clefs,
  inversions
} from './chordConsts'



// a function to choose something random:
function randomchoice(array){
   return array[Math.floor(Math.random()*array.length)];
}

// the super cool Fisher-Yates shuffle
function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}


// adjusts the whole chord for clef/staff upper limit
// TODO: make this easier to change, and match changes with the range of randomChoice(clefs)
// this assumes a structure will only exceed ONE of those limits, not both.
// also has an "or" statement for upper limit octaves, but not lower (because chords are inverted/modified upward)
function staffAdjust(chord){
  let adjust

  for(var i=0; i<chord.notes.length; i++){
    adjust = 0

    // bass clef upper limit is F4
    if(chord.clef === "bass" && octaveOrientedLetters.indexOf(chord.notes[i].letter) > octaveOrientedLetters.indexOf("F") && chord.notes[i].octave >= 4 || chord.notes[i].octave === 5){
      adjust -= 1
    }
    // bass clef lower limit is B1
    if(chord.clef === "bass" && octaveOrientedLetters.indexOf(chord.notes[i].letter) < octaveOrientedLetters.indexOf("B") && chord.notes[i].octave <= 1){
      adjust += 1
    }
    // treble clef upper limit is F6
    if(chord.clef === "treble" && octaveOrientedLetters.indexOf(chord.notes[i].letter) > octaveOrientedLetters.indexOf("F") && chord.notes[i].octave >= 6 || chord.notes[i].octave === 6){
      adjust -= 1
    }
    // treble clef lower limit is G3
    if(chord.clef === "treble" && octaveOrientedLetters.indexOf(chord.notes[i].letter) < octaveOrientedLetters.indexOf("G") && chord.notes[i].octave <= 3){
      adjust += 1
    }
  }
  // apply the adjust to each note
  for(var j=0; j<chord.notes.length; j++){
    chord.notes[j].octave += adjust
  }

  // console.log(JSON.stringify(chord, null, 4));
  return(chord)
}


// and a big function to generate a random, correctly spelled chord structure within clef/staff limits:
function randomChord(triads, subsets, rootAccidentals, accidentals, ip){
  // choose a random structure, root, and accidental
  let newStructure = randomchoice(Object.keys(triads));
  let newClass = triads[newStructure].class
  let newRoot = triads[newStructure].anchor
  let rootSyllable = randomchoice(subsets.B); // B is set implicitly as the "reference" subset
  let rootAccidental = randomchoice(rootAccidentals);
  // translate the syllable "position" to a letter
  let rootLetter = letters[subsets.B.indexOf(rootSyllable)]
    // console.log(rootLetter+rootAccidental+" "+newStructure);

  // find the equivalent IP based on the accidental's offset from the "natural" root syllable
  let offset = (accidentals.indexOf(rootAccidental))-(accidentals.indexOf("n")) // the distance from natural!
    // console.log(offset + " from natural")
  let rootIp = ip[(ip.indexOf(rootSyllable)+offset)%12]
    // console.log("IP: " + rootIp)

  // choose the octave of the starting (root) note.
  // TODO: make sure this range matches with staffAdjust()
  let clef = randomchoice(clefs)
  // console.log(clef + " clef")
  let clefOctave
  if(clef === "bass"){
    clefOctave = Math.floor(Math.random() * 4) + 1 // range of 4 octaves starting from octave 1
  }
  if(clef === "treble"){
    clefOctave = Math.floor(Math.random() * 4) + 3 // range of 4 octaves starting from octave 3
  }
  // console.log(clefOctave)

  let startingOctave = triads[newStructure].structure[0].octave// this takes the first note of the template structure, which works fine when the template is root position triads. better would be to loop through the structure and find the lowest octave number, or the lowest octave number that's also template[newStructure].anchor

  let noteOctave = startingOctave // reset it outside the note loop
  let lastOctaveIndex = startingOctave // this is so the octave "if" statement doesn't carry across chords. otherwise if octaveIndex of the first note of the new chord is less than the last note of the previous chord, the new chord will start an octive higher.

  let inversion = randomchoice(inversions);
  // console.log(inversion);

  let chord = {}; // an object to put the stuff in.
  // chord.rootLetter = rootLetter
  // chord.rootAccidental = rootAccidental
  // chord.type = newStructure
  // chord.inversion = inversion
  chord.clef = clef
  chord.keySignature = "C" // from Flow.keySignature.keySpecs (vexflow /tables.js)
  chord.notes = [];

  chord.questions = [
    {
      "type": "Note Names",
      "questionText": "Name the letter positions from lowest to highest.",
      "answers": [], // will populate in the loop
      "ordered": true,
      "choices": [
          "A",
          "B",
          "C",
          "D",
          "E",
          "F",
          "G"
      ]
    },
    {
      "type": "Root",
      "questionText": "What's the root note?",
      "answers": [rootLetter+rootAccidental],
      "choices": [] // will populate in the loop
    },
    {
      "type": "Chord Quality",
      "questionText": "What's the chord quality?",
      "answers": [newStructure],
      "choices": [ // TODO: populate choices, include 7ths
          "M",
          "m",
          "o",
          "+"
      ]
    },
    {
      "type": "Inversions",
      "questionText": "What's the inversion?",
      "answers": [inversion],
      "choices": [ // TODO: populate choices, include 7ths
          "root",
          "63",
          "64"
      ]
    }
  ]

  // build the structure with correct spellings
  for(var i=0; i<triads[newStructure].structure.length; i++){
    // translate the template ip to a relative note in the class
    let newNote = (ip.indexOf(triads[newStructure].structure[i].ip) - ip.indexOf(newRoot) + 12)%12
      // console.log(classes[newClass][newNote])
    // get the syllable "position" from the reference subset based on tensionMod7 value in the class
    let noteSyllable = subsets.B[((subsets.B.indexOf(rootSyllable) + classes[newClass][newNote].tensionMod7 -1)%7)]
      // console.log(noteSyllable)

    // find the equivalent IP based on the rootIp and tensionMod12 value in the class
    let noteIp = ip[(ip.indexOf(rootIp) + classes[newClass][newNote].tensionMod12 -1)%12]
      // console.log("IP: " + noteIp)
    // find the accidental from the diff between IP and "natural" syllable (natural is accidentals[2])
    let accidentalVal = (ip.indexOf(noteIp))-(ip.indexOf(noteSyllable))
      // adjusts for IPs on opposite ends of the array, like "D" from "R"
      // but something about this feels hacky... is there a better way?
      if(accidentalVal > ip.length/2)accidentalVal -= ip.length
      if(-accidentalVal > ip.length/2)accidentalVal += ip.length
    let accidental = accidentals[(2 + accidentalVal)%5]
      // console.log(accidental)

    // incredibly lazy, temporary way to put this in keySignature == "C"
    // this doesn't affect rootAccidental. which begs a larger philosophical question of whether the chord or the keySignature should be generated first. hint: not the chord.
    if(accidental === "n") accidental = ""

    // translate the syllable "position" to a letter
    let noteLetter = letters[subsets.B.indexOf(noteSyllable)]
      // console.log(noteLetter+accidental)

    // octave adjustments:
    // will this also work for template structures bigger than an octave?
    let octaveIndex = octaveOrientedLetters.indexOf(noteLetter)
    // var lastOctaveIndex // just declaring it so i can use it the first time
    if(octaveIndex < lastOctaveIndex){
      noteOctave += 1;
    }
    lastOctaveIndex = octaveIndex
    // here's the only safe place to add clefOctave. if you add it to startingOctave outside this loop, it does things like give you chords that start on octave 4 in bass clef.
    let octave = noteOctave+clefOctave
    // console.log(octave)

    let note = {}
    note.letter = noteLetter
    note.accidental = accidental
    note.octave = octave
    chord.notes.push(note);

    chord.questions[0].answers.push(noteLetter);
    chord.questions[1].choices.push(noteLetter+accidental);

  }

  // adjusts the ordered answer for inversion
  if(inversion === 63){
    chord.questions[0].answers.push(chord.questions[0].answers.shift());
  }
  if(inversion === 64){
    chord.questions[0].answers.push(chord.questions[0].answers.shift());
    chord.questions[0].answers.push(chord.questions[0].answers.shift());
  }

  // shuffles the root note choices so they're not always in root position haha
  shuffle(chord.questions[1].choices)

  // adjusts the chord so it's within staff limits
  chord = staffAdjust(chord);
  // console.log("chord adjust: " + adjust);

  // inverts the chord. slicker would be to also reorder chord.notes, but not necessary.
  if(inversion === "63"){
    chord.notes[0].octave += 1
  }
  if(inversion === "64"){
    chord.notes[0].octave += 1
    chord.notes[1].octave += 1
  }

  // adjusts the inverted chord so it's within staff limits
  chord = staffAdjust(chord);
  // console.log("inversion adjust: " + adjust);

  // console.log(JSON.stringify(chord, null, 3));
  return(chord)
}



export default (numQs) => {
  let chords = []
  for (var i = 0; i < numQs; i++) {
    chords.push(randomChord(triads, subsets, rootAccidentals, accidentals, ip))
  }
  console.log('here is chords: ' + JSON.stringify(chords, null, 4));
  return chords
}