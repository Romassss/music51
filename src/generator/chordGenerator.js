import { classes, keySignatures } from './chordConsts'
import addKeystrokes from './keystrokes'
import './utility.js'
import { randomArrayElement, randomObjectElement, randomSetElement, shuffle } from './utility'
import { LetterName, letterNamePosition } from './LetterName'
import { Clef } from './Clef'
import { Accidental } from './Accidental'
import { IndependentPitch, IndependentPitchSubset } from './IP'
import { Shapes } from './Shapes'
import { Mode, ModeSubset, degree, noteIdentities } from './Mode'
import { ChordType } from './ChordType'
import { ChordTypesOption } from './ChordTypesOption'
import { ChordStructure, chordStructures } from './ChordStructure'
import { RomanNumeral, degreeAndQualityToRomanNumeral } from './RomanNumeral'
import { Question, questionsForChordStructure } from './Question'

/**
 * export default - This is the interface between the generator and chord crusher or any other app
 *
 * @param  Int numQs      The number of questions a student has asked for
 * @param  Object options Configuration from student, in the form:
 *                          {
 *                            chordTypes: { triads: true, sevenths: true },
  *                           roots: { common: true, any: false }
 *                          }
 * @return Array          An array of Question objects, in the form:
 *                          [
 *                            {
 *                               "clef": Clef,
 *                               "keySignature": KeySignature,
 *                               "notes": [ { "letter", "accidental", "octave" } ],
 *                               "questions": [
 *                                  {
 *                                    "type": ("Names" | "Degrees", etc. ),
 *                                    "questionText": "...",
 *                                    "answers": [ "iv7", ... ] ,
 *                                    "ordered": Boolean,
 *                                    "choices": [ { "choice": "IV7", "key": "7" } ]
 *                                  }
 *                               ]
 *                            }
 *                          ]
 * @todo                  Assess the spec of the questions object which is put out by this function
 */
export default function(numQs, options) {
  let chords = []
  for (var i = 0; i < numQs; i++) {
    // Create the chords for each round.
    let chordContext = randomChordContext()
    chordContext.questions = questionsForChordStructure(chordContext.chordDescription.structure)
      .map(question => question(chordContext))
    chords.push(chordContext)
  }
  addKeystrokes(chords)
  return chords
}

/**
 * randomChord - A big function to generate a random, correctly spelled chord structure within
 *               clef/ staff limits
 *
 * @param options The user settings for a given session, in the form:
 *                {
 *                  {
 *                    chordTypes: { triads: true, sevenths: true },
                      roots: { common: true, any: false }
 *                  }
 *                }
 * @return chord  A contextualized chord object in the form:
 *                {
 *                  clef, keySignature, chordType, inversion, notes
 *                }
 */
export function randomChordContext(options) {
  // Choose a random `KeySignature`
  const keySignature = chooseKeySignature()
  // Choose a random `ChordType` from the constraints provided by the user
  const chordType = chooseChordType()
  // Choose a random `ChordStructure` belonging to the chosen `ChordType` family
  const chordStructure = chooseChordStructure(chordType)
  // Choose a random inversion from those afforded by the chosen `ChordStructure`
  const inversion = chooseInversion(chordStructure)
  // Choose whether we will be in a major or minor mode.
  // FIXME: Consider better naming of `modeLabel`. More like `modeCategory`.
  const modeLabel = chooseModeLabel(chordStructure)
  // Choose a random roman numeral context
  const romanNumeralContext = randomRomanNumeralContext(chordStructure, modeLabel)
  // Construct non—octave-positioned description of a chord, in the form:
  // {
  //    root: { independentPitch, accidental, letter, syllable },
  //    structure: ChordStructure,
  //    inversion: Int
  // }
  const chordDescription = makeChordDescription(
    chordStructure,
    inversion,
    keySignature,
    romanNumeralContext
  )
  // Construct the octave-displaced (but not concretely-octavized) notes for chord described above
  // TODO: Come up with a better name
  const partiallyConcretizedNotes = partiallyConcretizeChord(chordDescription, keySignature)
  // Choose a random clef
  const clef = randomObjectElement(Clef)
  // Fully concretize the notes on the staff as is appropriate for the randomly chosen `clef`.
  const staffAdjustedNotes = staffAdjust(partiallyConcretizedNotes, clef)
  // Get the VexFlow representation of the "Shapes" key signature.
  // FIXME: Codify the relationship between "Shapes" key signatures, Common Western Notation key signatures,
  //        and Vexflow key signatures.
  const vexFlowKeySignature = keySignatures[keySignature].vexSig

  // Bundle up all of the information useful to graphically represent the notes on the screen.
  // TODO: Consider bundling up all of the informational artifacts we have created along the way, e.g.,
  //       `chordDescription`, `romanNumeralContext`, etc.
  const result = {
    clef: clef,
    shape: keySignature,
    keySignature: vexFlowKeySignature,
    modeLabel: modeLabel,
    chordType: chordType,
    chordDescription: chordDescription,
    romanNumeralContext: romanNumeralContext,
    notes: staffAdjustedNotes
  }
  // All done!
  return result
}

// TODO: Consider making `Chord` a class. Add a class method on `Chord`: `random()`, which produces one
// random chord!
export function makeChordDescription(
  chordStructure,
  inversion,
  keySignature,
  romanNumeralContext
) {
  // Concretize the root by situating the roman numeral context's `modeNote` in the given
  // `keySignature`.
  const concretizedRoot = concretizeRoot(
    keySignature,
    romanNumeralContext
  )
  return {
    root: concretizedRoot,
    structure: chordStructure,
    inversion: inversion
  }
}

/**
 * concretizeRoot - Returns a letter name, an independent pitch, and an accidental for a root note given a key signature and a mode note.
 *
 * @param  KeySignature         keySignature A randomly chosen key signature represented as a shape
 * @param  RomanNumeralContext  romanNumeralContext     The mode of the root note
 * @return {type}              An object consisting of the independent pitch, the accidental, and the letter name for the root note.
 * @todo                       This algorithm works in quadratic time, but could quite possibly work in constant time.
 */
export function concretizeRoot(keySignature, romanNumeralContext) {
  const shape = Shapes[keySignature]
  const initialIndex = shape.notes.findIndex(note => note.mode === romanNumeralContext.mode)
  const initial = shape.notes[initialIndex]
  const initialLetterName = refIPToLetter(initial.refIP)
  const initialLetterNameIndex = Object.values(LetterName).indexOf(initialLetterName)
  const rootLetterNameIndex = (initialLetterNameIndex + (romanNumeralContext.degree - 1)) % 7
  const rootLetterName = Object.values(LetterName)[rootLetterNameIndex]
  // FIXME: This is currently thinking in mod7 version of IP, but it needs to be the objective mod12 version
  const initialIP = initial.refIP

  // FIXME: This is a horrible hack. Help.
  let initialIPIndex = Object.values(IndependentPitch).indexOf(initialIP)

  if (initial.accidental === Accidental.FLAT) {
    initialIPIndex -= 1
  } else if (initial.accidental === Accidental.SHARP) {
    initialIPIndex += 1
  }

  const rootIPIndex = (initialIPIndex + romanNumeralContext.rootOffset) % 12
  const rootIP = Object.values(IndependentPitch)[rootIPIndex]
  const rootSyllable = Object.values(IndependentPitch)[rootIPIndex + romanNumeralContext.incidental]
  const rootIndex = (initialIndex + (romanNumeralContext.degree - 1) * 2) % 7
  const unalteredRootAccidental = shape.notes[rootIndex].accidental
  const unalteredRootAccidentalIndex = Object.values(Accidental).indexOf(unalteredRootAccidental)
  const alteredRootAccidental = Object.values(Accidental)[unalteredRootAccidentalIndex + romanNumeralContext.incidental]
  // FIXME: Audit worth of sending `independentPitch`, `letter`, AND `syllable` (as `syllable` is
  //        isomorphic to `letter`)
  return {
    independentPitch: rootIP,
    accidental: alteredRootAccidental,
    letter: rootLetterName,
    syllable: letterNameToRefIP(rootLetterName)
  }
}

/**
 * partiallyConcretizeChord - Return the non-octave-positioned notes for the given `chord`.
 * @param chordDescription
 * @return An array of octave-displaced spelled pitches comprising a `chord`.
 */
export function partiallyConcretizeChord(chordDescription, keySignature) {
  const rootLetter = chordDescription.root.letter
  const rootIP = chordDescription.root.independentPitch
  const rootAccidental = chordDescription.root.accidental
  const rootSyllable = chordDescription.root.syllable
  const inversion = chordDescription.inversion

  let template = chordDescription.structure.structure

  // TODO: First, codify `inversion` in a stronger way
  // TODO: Then, pull this out to its own function
  // Rotates the independent pitches in the `template` based on the `inversion`.
  if ((inversion === "63") || (inversion === "65")) {
    template.rotate(1)
  } else if ((inversion === "64") || (inversion === "43")) {
    template.rotate(2)
  } else if (inversion === "42") {
    template.rotate(3)
  }

  // Keep track of the preceeding letter name position (e.g., C = 0, D = 1, G = 4, etc.) in order to see
  // when we have crossed over the mod7 boundary, and thus when to bump up the octave displacement.
  // We start with `7` as it is a kind of `Infinity`, which all values will register as being "less than".
  // As such, we will bump up the `octaveDisplacement` from `-1` to `0` for the first note no matter what.
  //
  // This is surely not the only way, and quite possibly not the best way, to do this. Open for critique!
  //
  // One other method would be to do this in a second pass over non-octave-positioned notes. This could be
  // theoretically wasteful, but we are iterating over 3–4 values for now…
  let prevLetterNamePosition = 7
  let octaveDisplacement = -1

  // The notes of a chord to be returned
  // TODO: Consider implementing this with `map`
  let notes = []

  // build the structure with correct spellings
  // FIXME: Assess schema (diving `structure.structure` is not elegant)
  // TODO: Consider breaking out the body of this loop into its own function
  for (var i=0; i<template.length; i++) {
    // Translate the template ip to a relative note in the class
    const translatedNoteIP = translateNoteIPIndex(template[i])
    // Compute the letterName equivalent mod7 IP syllable of the chord component
    const syllable = chordComponentSyllable(translatedNoteIP, chordDescription)
    // Find the equivalent IP based on the rootIp and tensionMod12 value in the class
    // FIXME: This is currently incorrect for certain situations.
    const noteIP = chordComponentIndependentPitch(rootIP, translatedNoteIP, keySignature)
    const noteLetter = refIPToLetter(syllable)
    const notePosition = letterNamePosition(noteLetter)

    // Handle octave displacement if we cross over the mod7 boundary
    // FIXME: Consider doing this in another pass
    if (notePosition < prevLetterNamePosition) { octaveDisplacement += 1 }
    prevLetterNamePosition = notePosition
    const accid = accidental(noteIP, syllable)

    // FIXME: This should happen at a later point in the pipeline!
    const shouldFilterOutAccidental = accidentalForLetterNameIsInKeySignature(
      noteLetter,
      accid,
      keySignature
    )

    const note = {
      letter: noteLetter,
      accidental: shouldFilterOutAccidental ? "" : accidental(noteIP, syllable),
      octave: octaveDisplacement
    }

    // Append our new note to the array to be returned
    notes.push(note)
  }

  return notes
}

export function translateNoteIPIndex(componentIP) {
  const untranslatedIndex = Object.values(IndependentPitch).indexOf(componentIP)
  const anchorIndex = Object.values(IndependentPitch).indexOf("D")
  return (untranslatedIndex - anchorIndex + 12).mod(12)
}

function chordComponentSyllable(translatedNoteIPIndex, chordDescription) {
  // FIXME: Come up with a name that is neither `whiteNotes` nor `.BOTTOM`
  const whiteNotes = Object.values(IndependentPitchSubset.BOTTOM)
  const rootSyllable = chordDescription.root.syllable
  const rootSyllableIndex = whiteNotes.indexOf(rootSyllable)
  const modeConstructor = chordDescription.structure.modeConstructor
  const modeNoteIdentities = noteIdentities(modeConstructor)
  const tensionMod7 = modeNoteIdentities[translatedNoteIPIndex].tensionMod7
  const index = (rootSyllableIndex + tensionMod7 - 1) % 7
  return whiteNotes[index]
}

/**
 * @param rootIP            IndependentPitch  The IndependentPitch syllable of the root of a chord
 * @param translatedNoteIPIndex  Int               The index of the translated note independent pitch
 */
// find the equivalent IP based on the rootIp and tensionMod12 value in the class
function chordComponentIndependentPitch(rootIP, translatedNoteIPIndex) {
  const ips = Object.values(IndependentPitch)
  const rootIPIndex = ips.indexOf(rootIP)
  return ips[(rootIPIndex + translatedNoteIPIndex) % 12]
}

function accidental(independentPitch, syllable) {
  // FIXME: (James) Make a helper function that tidies this up
  // find the accidental from the diff between IP and "natural" syllable (natural is accidentals[2])
  let accidentalVal = (Object.values(IndependentPitch).indexOf(independentPitch))-(Object.values(IndependentPitch).indexOf(syllable))

  // FIXME: (James) Perhaps break this into a function of its own
  // FIXME: Add convenience getters to IndependentPitch to avoid the `Object.values` choreography
  // adjusts for IPs on opposite ends of the array, like "D" from "R"
  // but something about this feels hacky... is there a better way?
  if (accidentalVal > Object.values(IndependentPitch).length/2) {
    accidentalVal -= Object.values(IndependentPitch).length
  }
  if (-accidentalVal > Object.values(IndependentPitch).length/2) {
    accidentalVal += Object.values(IndependentPitch).length
  }
  // FIXME: (James) Add a convenience getter to Accidental to avoid the `Object.values` choreography
  const accidental = Object.values(Accidental)[(2 + accidentalVal) % 5]
  return accidental
}

/**
 * accidentalForLetterNameIsInKeySignature - description
 *
 * @param  LetterName   letterName
 * @param  Accidental   accidental
 * @param  KeySignature keySignature
 * @return Boolean      `true` if the given `letterName` is inherent in the given
 *                      `keySignature` is associated with the given `accidental`.
 *                      Otherwise, `false`.
 * @todo                Move to `Accidental` or somewhere similarly low-level
 */
export function accidentalForLetterNameIsInKeySignature(letterName, accidental, keySignature) {
  const noteInKeySignature = Shapes[keySignature].notes.find(note =>
    note.refIP == letterNameToRefIP(letterName)
  )
  return accidental == noteInKeySignature.accidental
}

function letterNameToRefIP(letter) {
  switch (letter) {
    case LetterName.C:
      return IndependentPitch.DO
    case LetterName.D:
      return IndependentPitch.RE
    case LetterName.E:
      return IndependentPitch.MI
    case LetterName.F:
      return IndependentPitch.FA
    case LetterName.G:
      return IndependentPitch.SO
    case LetterName.A:
      return IndependentPitch.LA
    case LetterName.B:
      return IndependentPitch.TI
    default:
      throw 'invalid letter name'
  }
}

function refIPToLetter(refIP) {
  switch (refIP) {
    case IndependentPitch.DO:
      return LetterName.C
    case IndependentPitch.RE:
      return LetterName.D
    case IndependentPitch.MI:
      return LetterName.E
    case IndependentPitch.FA:
      return LetterName.F
    case IndependentPitch.SO:
      return LetterName.G
    case IndependentPitch.LA:
      return LetterName.A
    case IndependentPitch.TI:
      return LetterName.B
  }
}

/**
 * range - returns range of acceptable letter name + octave pairs for a given clef
 *
 * @param  {type} clef the clef for which to return acceptable letter name + octave pairs for a given clef
 * @return {type}      object which contains lower and upper bounds
 */
function allowableRange(clef) {
  switch (clef) {
    case 'treble':
      return { upper: 15, /*F6*/ lower: -5, /*G3*/ }
    case 'bass':
      return { upper: 13, /*F4*/ lower: -5, /*B1*/ }
    default:
      throw 'invalid clef'
  }
}

/*
* @param Clef clef The type of clef for which we are trying to get the middle c position.
* @return {type} The position in the staff of middle c in the context of a given `clef`.
* @todo Implement `middleCPosition` as an instance method over `Clef`.
*/
export function middleCPosition(clef) {
  switch (clef) {
    case Clef.TREBLE:
      return -2
    case Clef.BASS:
      return 10
    default:
      throw 'unsupported clef'
  }
}

/**
 * staffPosition - returns the staff position of a note with a given letter name and octave respective to a clef. A staff position is either a line or a space indexed by distance from bottom line, 0, of a staff. For example, C4 (middle C) in treble clef has a staff position of -2.
 *
 * @param  {type} letter Letter name of a note
 * @param  {type} octave The octave of a note
 * @param  {type} clef   The context in which the note will be represented
 * @return {type}        An integer value representing the staff position of the given note, letter name and octave, respective to a clef
 */
export function staffPosition(letter, octave, clef) {
  const octaveDisplacement = octave - 4
  const distanceFromC = letterNamePosition(letter)
  return middleCPosition(clef)+(7*octaveDisplacement)+distanceFromC
}

/**
 * requiredOctaveDisplacement - return the amount of octaves to transpose the chord which is represented graphically at the given `staffPositions` in the allowable `range` of staff positions.
 *
 * @param  {type} staffPositions
 * @param  {type} range
 * @return {type} The amount of octaves to transpose the chord which is represented graphically at the given `staffPositions` in the allowable `range` of staff positions.
 * @todo This assumes that the octave does span a width greater than that of the given `range`. In this case, we need to decide what to do.
 */
export function requiredOctaveDisplacement(staffPositions, range) {
  const maxPosition = Math.max(...staffPositions)
  const minPosition = Math.min(...staffPositions)
  if ( maxPosition > range.upper ) {
    return Math.floor((range.upper-maxPosition)/7)
  } else if ( minPosition < range.lower ) {
    return Math.floor((range.lower-minPosition)/7)+1
  } else {
    return 0
  }
}

/**
 * @param Array of notes chord  notes   The notes to be adjusted, in the form:
                                          { letter, accidental }
 * @param Clef                  clef    The clef context in which we are positioning the given
 *                                      `notes`.
 * @return An array of notes positioned properly within the context of the given `clef`.
*/
// FIXME: Establish when we know a note's octave. Do we generate it here, or later?
export function staffAdjust(notes, clef) {
  const initialOctave = chooseInitialOctave(clef)
  const range = allowableRange(clef)
  const staffPositions = notes.map(note => {
    return staffPosition(note.letter, note.octave, clef)
  })
  const octaveTransposition = requiredOctaveDisplacement(staffPositions, range)
  return octaveTranspose(notes, octaveTransposition)
}

/**
 * octaveTranspose - return a brand new array of notes, each transposed by the given amount of `octaves`.
 *
 * @param  {type} notes   Note values to be transposed
 * @param  {type} octaves The amount of octaves by which to transpose notes
 * @return {type}         a brand new array of notes, each transposed by the given amount of `octaves`
 */
function octaveTranspose(notes, octaves) {
  return notes.map(note => {
    return { letter: note.letter, accidental: note.accidental, octave: note.octave + octaves }
  })
}

// Constrains accidental only for root pitch
function constrainAccidental(syllable, structure, initialChoice) {
  const containsTripleFlat = (
    initialChoice === Accidental.FLAT &&
    structure === ChordStructure.DIMINISHED_SEVENTH &&
    (syllable === IndependentPitch.DO || IndependentPitch.FA)
  )
  const containsTripleSharp = (
    initialChoice === Accidental.SHARP &&
    structure === ChordStructure.AUGMENTED_TRIAD &&
    syllable === IndependentPitch.TI
  )
  if (containsTripleFlat || containsTripleSharp) {
    return Accidental.NATURAL
  }
  return initialChoice
}

/**
 * romanNumeral - Returns a roman numeral or romanette of the appropriate number given a chord structure and scale degree.
 *
 * @param  {type} chordStructure The type of chord for which to generate a numeral
 * @param  {type} degree         The scale degree
 * @return {type}                The roman numeral or romanette for the given configuration of chord type and scale degree.
 */
export function romanNumeral(chordStructure, degree) {
  switch (chordStructure) {
    case ChordStructure.MAJOR_TRIAD:
    case ChordStructure.AUGMENTED_TRIAD:
    case ChordStructure.DOMINANT_SEVENTH:
    case ChordStructure.MAJOR_SEVENTH:
      return degreeAndQualityToRomanNumeral(degree, true)
    default:
      return degreeAndQualityToRomanNumeral(degree, false)
  }
}

// TODO: Decouple inversion from amount of notes in chord
// TODO: Move into partiallyConcretizeChordNotes
function handleInversion(chord, inversion) {

  // inverts the chord, reorders chord.notes, and adjusts the ordered answer for inversion
  if ((inversion === "63") || (inversion === "65")) {
    chord.notes = invert(chord.notes, 1)
    chord.questions[0].answers.rotate(1)
  } else if ((inversion === "64") || (inversion === "43")) {
    chord.notes = invert(chord.notes, 2)
    chord.questions[0].answers.rotate(2)
  } else if (inversion === "42") {
    chord.notes = invert(chord.notes, 3)
    chord.questions[0].answers.rotate(3)
  }
  return chord
}

/**
 * invert - return a brand new array of notes inverted the amount of times indicated by `inversion`. For example, `0` is equal to "root inversion", while `1` is equal to "first inversion".
 *
 * @param  {type} chord     Note values to be inverted
 * @param  {type} inversion The amount of inversions to perform
 * @return {type}           An array of notes inverted the amount of times indicated by `inversion`
 */
export function invert(chord, inversion) {
  let notes = [...chord]
  for (let i = 0; i < inversion; i++) {
    const head = notes.shift()
    head.octave += 1
    notes.push(head)
  }
  return notes
}

/**
 * @param ChordType chordType The type of chord affording inversions from which to select
 * @return A random inversion from those afforded by the given `chordType`
 */
export function chooseInversion(chordType) {
  // TODO: Implement inversions as an instance method over `ChordType`
  return randomArrayElement(inversions(chordType))
}

/**
 * @param ChordStructure chordStructure The `ChordStructure` of a chord
 * @return                              An array of strings representing the various inversions
 *                                      available for the given `chordStructure`
 * @todo                                Create an `Inversion` abstraction
 */
function inversions(chordStructure) {
  switch (chordStructure) {
    // Triads
    case ChordStructure.MAJOR_TRIAD:
    case ChordStructure.MINOR_TRIAD:
    case ChordStructure.DIMINISHED_TRIAD:
    case ChordStructure.AUGMENTED_TRIAD:
    case ChordStructure.FLAT_THREE_MAJOR_TRIAD:
    case ChordStructure.FLAT_SIX_MAJOR_TRIAD:
    case ChordStructure.FLAT_SEVEN_MAJOR_TRIAD:
    case ChordStructure.TONIC_MAJOR_TRIAD_IN_MINOR:
    case ChordStructure.SUBDOMINANT_MAJOR_TRIAD_IN_MINOR:
    case ChordStructure.FIVE_OF_FIVE:
    case ChordStructure.FIVE_SEVEN_OF_FIVE:
    case ChordStructure.FIVE_OF_SIX:
    case ChordStructure.FIVE_SEVEN_OF_SIX:
    case ChordStructure.FIVE_SEVEN_OF_MAJOR_FOUR:
    case ChordStructure.FIVE_SEVEN_OF_MINOR_FOUR:
      return ["","63","64"]
    // Sevenths
    case ChordStructure.DOMINANT_SEVENTH:
    case ChordStructure.MAJOR_SEVENTH:
    case ChordStructure.MINOR_SEVENTH:
    case ChordStructure.HALF_DIMINISHED_SEVENTH:
    case ChordStructure.FULLY_DIMINISHED_SEVENTH:
    case ChordStructure.SEVEN_DIMINISHED_SEVENTH_OF_FIVE:
    case ChordStructure.SEVEN_HALF_DIMINISHED_SEVENTH_OF_SEVEN:
    case ChordStructure.FIVE_OF_SEVEN_DIMINISHED:
    case ChordStructure.FIVE_SEVEN_OF_SEVEN_DIMINISHED:
      return ["","65","43","42"]
    // Unique cases
    case ChordStructure.NEAPOLITAN_SIXTH:
      return ["", "63"]
    case ChordStructure.ITALIAN_AUGMENTED_SIXTH:
    case ChordStructure.FRENCH_AUGMENTED_SIXTH:
    case ChordStructure.GERMAN_AUGMENTED_SIXTH:
      return [""]
    default:
      throw "Invalid chord structure: " + JSON.stringify(chordStructure)
  }
}

/**
 * @return  A random key signature within the realm of reason (omitting c+f flat, e+b sharp)
 * @todo    Add some configurability with an input of allowed key signatures, with some
 *          sensible default
 */
export function chooseKeySignature() {
  return randomArrayElement(Object.keys(Shapes).slice(3, 12))
}

/**
 * @return A random `Clef`.
 */
export function chooseClef() {
  return randomObjectElement(Clef)
}

/**
 * @return A random `ChordStructure` for the given `chordType`.
 */
export function chooseChordStructure(chordType) {
  return randomSetElement(chordStructures(chordType))
}

/**
 * @return A random `ChordType` value.
 */
export function chooseChordType() {
  return randomObjectElement(ChordType)
}

function chooseInitialOctave(clef) {
  switch (clef) {
    case Clef.BASS:
      // range of 4 octaves starting from octave 1
      return Math.floor(Math.random() * 4) + 1
    case Clef.TREBLE:
      // range of 4 octaves starting from octave 3
      return Math.floor(Math.random() * 4) + 3
    default:
      throw new Error('invalid clef')
  }
}

function chooseRandomAccidental(allowedAccidentals) {
  return randomArrayElement(allowedAccidentals)
}

// Make a random choice of root accidentals while filtering out egregious edge cases (e.g., 𝄫♭, and `𝄪♯`)
function chooseRootAccidental(syllable, structure, allowedAccidentals) {
  return constrainAccidental(
    syllable,
    structure,
    chooseRandomAccidental(allowedAccidentals))
}

export function chooseModeLabel(chordStructure) {
  return randomArrayElement(Object.keys(chordStructure.commonRootOffsets))
}

/**
 * randomRomanNumeralContext - Choose a random roman numeral context -- mode, mode note, scale degree, and numeral -- given a chord structure.
 *
 * @param  chordStructure The chord structure to create context for.
 * @param  modeLabel      The mode label of the mode (i.e., mode category, i.e., "Major" | "minor")
 * @return                An object consisting of a mode, a mode note, scale degree, and roman numeral.
 * @todo                  Rename to `chooseRomanNumeralContext`
 */
export function randomRomanNumeralContext(chordStructure, modeLabel) {
  // FIXME: Codify "Major" and "minor" here!
  let mode
  switch (modeLabel) {
    case "Major":
      mode = Mode.MAJOR
      break
    case "minor":
      mode = Mode.MINOR
      break
  }
  const commonRootOffsets = chordStructure.commonRootOffsets[modeLabel]
  const rootOffset = randomArrayElement(commonRootOffsets)
  const noteIdentity = noteIdentities(mode)[rootOffset]
  const scaleDegree = noteIdentity.tensionMod7
  return {
    mode: mode,
    rootOffset: rootOffset,
    degree: scaleDegree,
    romanNumeral: romanNumeral(chordStructure, scaleDegree),
    incidental: noteIdentity.incidental
  }
}
