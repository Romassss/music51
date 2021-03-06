import { LetterName } from '../generator/LetterName'
import { Clef } from '../generator/Clef'
import { invert } from '../generator/chordGenerator'
import { staffAdjust } from '../generator/chordGenerator'

test('chord in range not adjusted', () => {
  let chord = [
    { letter: LetterName.C, octave: 4 }
  ]
  expect(staffAdjust(chord, Clef.TREBLE)).toEqual(chord)
})

test('monad below range adjusted up in treble clef', () => {
  let chord = [
    { letter: LetterName.C, octave: 3 }
  ]
  let expected = [
    { letter: LetterName.C, octave: 4 }
  ]
  expect(staffAdjust(chord, Clef.TREBLE)).toEqual(expected)
})

test('monad below range adjusted up in bass clef', () => {
  let chord = [
    { letter: LetterName.C, octave: 1 }
  ]
  let expected = [
    { letter: LetterName.C, octave: 2 }
  ]
  expect(staffAdjust(chord, Clef.BASS)).toEqual(expected)
})

test('monad above range adjusted down in treble clef', () => {
  let chord = [
    { letter: LetterName.C, octave: 7 }
  ]
  let expected = [
    { letter: LetterName.C, octave: 6 }
  ]
  expect(staffAdjust(chord, Clef.TREBLE)).toEqual(expected)
})

test('monad above range adjusted down in bass clef', () => {
  let chord = [
    { letter: LetterName.C, octave: 5 }
  ]
  let expected = [
    { letter: LetterName.C, octave: 4 }
  ]
  expect(staffAdjust(chord, Clef.BASS)).toEqual(expected)
})

test('shifting notes', () => {
  const chord = [
    { letter: LetterName.C, octave: 4 },
    { letter: LetterName.E, octave: 4 },
    { letter: LetterName.G, octave: 4 },
  ]
  const inverted = invert(chord, 2)
  const expected = [
    { letter: LetterName.G, octave: 4 },
    { letter: LetterName.C, octave: 5 },
    { letter: LetterName.E, octave: 5 },
  ]
  expect(inverted).toEqual(expected)
})