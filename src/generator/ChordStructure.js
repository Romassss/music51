import { Mode } from "./Mode"
import { IndependentPitch } from "./IP"
import { ChordType } from "./ChordType"

export const ChordStructure = {
  MAJOR_TRIAD: {
    displayName: "M",
    modeConstructor: Mode.MAJOR, // TODO: David to define all modeConstructors in mode.js
    structure: [
      IndependentPitch.DO,
      IndependentPitch.MI,
      IndependentPitch.SO
    ],
    possibleRootOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    commonRootOffsets: {
      Major: [0, 5, 7], // I, IV, or V
      minor: [3, 7, 8, 10] // III, V, VI, or VII
    }
  },
  MINOR_TRIAD: {
    displayName: "m",
    modeConstructor: Mode.MINOR,
    structure: [
      IndependentPitch.DO,
      IndependentPitch.NA,
      IndependentPitch.SO
    ],
    possibleRootOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    commonRootOffsets: {
      Major: [2, 4, 9], // ii, iii, or vi
      minor: [0, 2, 5] // i, ii, or iv
    }
  },
  DIMINISHED_TRIAD: {
    displayName: "o",
    modeConstructor: Mode.DIMINISHED,
    structure: [
      IndependentPitch.DO,
      IndependentPitch.NA,
      IndependentPitch.VE
    ],
    possibleRootOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    commonRootOffsets: {
      Major: [11], // viio
      minor: [2, 10] // iio or viio
    }
  },
  AUGMENTED_TRIAD: {
    displayName: "+",
    modeConstructor: Mode.AUGMENTED_DOMINANT,
    structure: [
      IndependentPitch.DO,
      IndependentPitch.MI,
      IndependentPitch.PE
    ],
    possibleRootOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    commonRootOffsets: {
      Major: [], // none defined.
      minor: [3] // III+
    }
  },
  DOMINANT_SEVENTH: {
    displayName: "7",
    modeConstructor: Mode.DOMINANT,
    structure: [
      IndependentPitch.DO,
      IndependentPitch.MI,
      IndependentPitch.SO,
      IndependentPitch.KE
    ],
    possibleRootOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    commonRootOffsets: {
      Major: [7], // V7
      minor: [7] // V7
    }
  },
  MAJOR_SEVENTH: {
    displayName: "M7",
    modeConstructor: Mode.LYDIAN,
    structure: [
      IndependentPitch.DO,
      IndependentPitch.MI,
      IndependentPitch.SO,
      IndependentPitch.TI
    ],
    possibleRootOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    commonRootOffsets: {
      Major: [0, 5], // IMaj7 or IVMaj7
      minor: [] // none defined.
    }
  },
  MINOR_SEVENTH: {
    displayName: "m7",
    modeConstructor: Mode.DORIAN,
    structure: [
      IndependentPitch.DO,
      IndependentPitch.NA,
      IndependentPitch.SO,
      IndependentPitch.KE
    ],
    possibleRootOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    commonRootOffsets: {
      Major: [2, 4, 9], // ii7, iii7, or vi7
      minor: [0, 5] // i7 or iv7
    }
  },
  HALF_DIMINISHED_SEVENTH: {
    displayName: "ø7",
    modeConstructor: Mode.DIMINISHED_MINOR,
    structure: [
      IndependentPitch.DO,
      IndependentPitch.NA,
      IndependentPitch.VE,
      IndependentPitch.KE
    ],
    possibleRootOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    commonRootOffsets: {
      Major: [11], // viiø7
      minor: [2, 10] // iiø7 or viiø7
    }
  },
  FULLY_DIMINISHED_SEVENTH: {
    displayName: "o7",
    modeConstructor: Mode.DIMINISHED,
    structure: [
      IndependentPitch.DO,
      IndependentPitch.NA,
      IndependentPitch.VE,
      IndependentPitch.LA
    ],
    possibleRootOffsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    commonRootOffsets: {
      Major: [], // none defined.
      minor: [10] // viio7
    }
  },
  NEAPOLITAN_SIXTH: { // This is treated as a Major triad. It will most often show up in first inversion, but can also show up in root position. See commit notes about decoupling commonRootOffsets.
    displayName: "N6",
    modeConstructor: Mode.MAJOR,
    structure: [
      IndependentPitch.BA, // Db (root)
      IndependentPitch.FA, // F
      IndependentPitch.PE // Ab
    ],
    possibleRootOffsets: [1], // TODO: possibleRootOffsets is not necessary in specified non-diatonic chords.
    commonRootOffsets: {
      Major: [1], // bII
      minor: [1] // bII
    }
  },
  ITALIAN_AUGMENTED_SIXTH: {
    displayName: "It+6",
    modeConstructor: Mode.PHRYGIAN, // TODO: consider an intervalic approach rather than modeConstructor. See commit comments.
    structure: [
      IndependentPitch.PE, // Ab (in the bass)
      IndependentPitch.DO, // C
      IndependentPitch.VE // F#
    ],
    possibleRootOffsets: [8],
    commonRootOffsets: {
      Major: [8],
      minor: [8]
    }
  },
  FRENCH_AUGMENTED_SIXTH: {
    displayName: "Fr+6",
    modeConstructor: Mode.PHRYGIAN,
    structure: [
      IndependentPitch.PE, // Ab (in the bass)
      IndependentPitch.DO, // C
      IndependentPitch.RE, // D
      IndependentPitch.VE // F#
    ],
    possibleRootOffsets: [8],
    commonRootOffsets: {
      Major: [8],
      minor: [8]
    }
  },
  GERMAN_AUGMENTED_SIXTH: {
    displayName: "Ger+6",
    modeConstructor: Mode.PHRYGIAN,
    structure: [
      IndependentPitch.PE, // Ab (in the bass)
      IndependentPitch.DO, // C
      IndependentPitch.NA, // EB
      IndependentPitch.VE // F#
    ],
    possibleRootOffsets: [8],
    commonRootOffsets: {
      Major: [8],
      minor: [8]
    }
  },
  FLAT_THREE_MAJOR_TRIAD: {
    displayName: "bIII",
    modeConstructor: Mode.MAJOR,
    structure: [
      IndependentPitch.NA, // Eb
      IndependentPitch.SO, // G
      IndependentPitch.KE // Bb
    ],
    possibleRootOffsets: [3],
    commonRootOffsets: {
      Major: [3],
      minor: [] // none defined.
    }
  },
  FLAT_SIX_MAJOR_TRIAD: {
    displayName: "bVI",
    modeConstructor: Mode.MAJOR,
    structure: [
      IndependentPitch.PE, // Ab
      IndependentPitch.DO, // C
      IndependentPitch.NA // Eb
    ],
    possibleRootOffsets: [8],
    commonRootOffsets: {
      Major: [8],
      minor: [] // none defined.
    }
  },
  FLAT_SEVEN_MAJOR_TRIAD: {
    displayName: "bVII",
    modeConstructor: Mode.MAJOR,
    structure: [
      IndependentPitch.KE, // Bb
      IndependentPitch.RE, // D
      IndependentPitch.FA // F
    ],
    possibleRootOffsets: [10],
    commonRootOffsets: {
      Major: [10],
      minor: [] // none defined.
    }
  },
  TONIC_MAJOR_TRIAD_IN_MINOR: {
    displayName: "I",
    modeConstructor: Mode.MAJOR,
    structure: [
      IndependentPitch.DO, // C
      IndependentPitch.MI, // E
      IndependentPitch.SO // G
    ],
    possibleRootOffsets: [0],
    commonRootOffsets: {
      Major: [], // none defined.
      minor: [0]
    }
  },
  SUBDOMINANT_MAJOR_TRIAD_IN_MINOR: {
    displayName: "IV",
    modeConstructor: Mode.LYDIAN,
    structure: [
      IndependentPitch.FA, // F
      IndependentPitch.LA, // A
      IndependentPitch.DO // C
    ],
    possibleRootOffsets: [5],
    commonRootOffsets: {
      Major: [], // none defined.
      minor: [5]
    }
  },
  FIVE_OF_FIVE: {
    displayName: "V/V",
    modeConstructor: Mode.DOMINANT,
    structure: [
      IndependentPitch.RE, // D
      IndependentPitch.VE, // F#
      IndependentPitch.LA // A
    ],
    possibleRootOffsets: [2],
    commonRootOffsets: {
      Major: [2],
      minor: [2]
    }
  },
  FIVE_SEVEN_OF_FIVE: {
    displayName: "V7/V",
    modeConstructor: Mode.DOMINANT,
    structure: [
      IndependentPitch.RE, // D
      IndependentPitch.VE, // F#
      IndependentPitch.LA, // A
      IndependentPitch.DO // C
    ],
    possibleRootOffsets: [2],
    commonRootOffsets: {
      Major: [2],
      minor: [2]
    }
  },
  FIVE_OF_SIX: { // TODO: Treating this (and V7/vi) as "dominant of the relative minor" in Major. Kate had said this can occur in minor as well. Is that true?
    displayName: "V/vi",
    modeConstructor: Mode.DOMINANT,
    structure: [
      IndependentPitch.MI, // E
      IndependentPitch.PE, // G#
      IndependentPitch.KE // B
    ],
    possibleRootOffsets: [4],
    commonRootOffsets: {
      Major: [4],
      minor: [] // none defined.
    }
  },
  FIVE_SEVEN_OF_SIX: {
    displayName: "V7/vi",
    modeConstructor: Mode.DOMINANT,
    structure: [
      IndependentPitch.MI, // E
      IndependentPitch.PE, // G#
      IndependentPitch.KE, // B
      IndependentPitch.RE // D
    ],
    possibleRootOffsets: [4],
    commonRootOffsets: {
      Major: [4], // none defined.
      minor: []
    }
  },
  FIVE_SEVEN_OF_MAJOR_FOUR: {
    displayName: "V7/IV",
    modeConstructor: Mode.DOMINANT,
    structure: [
      IndependentPitch.DO, // C
      IndependentPitch.MI, // E
      IndependentPitch.SO, // G
      IndependentPitch.KE // Bb
    ],
    possibleRootOffsets: [0],
    commonRootOffsets: {
      Major: [0],
      minor: [] // none defined.
    }
  },
  FIVE_SEVEN_OF_MINOR_FOUR: {
    displayName: "V7/iv",
    modeConstructor: Mode.DOMINANT,
    structure: [
      IndependentPitch.DO, // C
      IndependentPitch.MI, // E
      IndependentPitch.SO, // G
      IndependentPitch.KE // Bb
    ],
    possibleRootOffsets: [0],
    commonRootOffsets: {
      Major: [],
      minor: [0] // none defined.
    }
  },
  SEVEN_DIMINISHED_SEVENTH_OF_FIVE: {
    displayName: "viio7/V",
    modeConstructor: Mode.DIMINISHED,
    structure: [
      IndependentPitch.VE, // F#
      IndependentPitch.LA, // A
      IndependentPitch.DO, // C
      IndependentPitch.NA // Eb
    ],
    possibleRootOffsets: [6],
    commonRootOffsets: {
      Major: [6],
      minor: [6]
    }
  },
  SEVEN_HALF_DIMINISHED_SEVENTH_OF_SEVEN: {
    displayName: "viiø7/vii",
    modeConstructor: Mode.DIMINISHED_MINOR,
    structure: [
      IndependentPitch.KE, // A#
      IndependentPitch.BA, // C#
      IndependentPitch.MI, // E
      IndependentPitch.PE // G#
    ],
    possibleRootOffsets: [10],
    commonRootOffsets: {
      Major: [10], // none defined.
      minor: []
    }
  },
  FIVE_OF_SEVEN_DIMINISHED: {
    displayName: "V/viio",
    modeConstructor: Mode.DOMINANT,
    structure: [
      IndependentPitch.VE, // F#
      IndependentPitch.KE, // A#
      IndependentPitch.BA // C#
    ],
    possibleRootOffsets: [6],
    commonRootOffsets: {
      Major: [6],
      minor: [] // none defined.
    }
  },
  FIVE_SEVEN_OF_SEVEN_DIMINISHED: {
    displayName: "V7/viio",
    modeConstructor: Mode.DOMINANT,
    structure: [
      IndependentPitch.VE, // F#
      IndependentPitch.KE, // A#
      IndependentPitch.BA, // C#
      IndependentPitch.MI // E
    ],
    possibleRootOffsets: [6],
    commonRootOffsets: {
      Major: [6],
      minor: [] // none defined.
    }
  }
}

// returns one example instantiation of the given `chordType` which we will generate in a
// concrete form downstream.
export function chordStructures(chordType) {
  switch (chordType) {
    case ChordType.TRIAD:
      return new Set([
        ChordStructure.MAJOR_TRIAD,
        ChordStructure.MINOR_TRIAD,
        ChordStructure.AUGMENTED_TRIAD,
        ChordStructure.DIMINISHED_TRIAD
      ])
    case ChordType.SEVENTH:
      return new Set([
        ChordStructure.DOMINANT_SEVENTH,
        ChordStructure.MAJOR_SEVENTH,
        ChordStructure.MINOR_SEVENTH,
        ChordStructure.HALF_DIMINISHED_SEVENTH,
        ChordStructure.FULLY_DIMINISHED_SEVENTH
      ])
    case ChordType.CHROMATIC_VARIATION:
      return new Set([
        ChordStructure.NEAPOLITAN_SIXTH,
        ChordStructure.ITALIAN_AUGMENTED_SIXTH,
        ChordStructure.FRENCH_AUGMENTED_SIXTH,
        ChordStructure.GERMAN_AUGMENTED_SIXTH
      ])
    case ChordType.MODE_MIXTURE:
      return new Set([
        ChordStructure.FLAT_THREE_MAJOR_TRIAD,
        ChordStructure.FLAT_SIX_MAJOR_TRIAD,
        ChordStructure.FLAT_SEVEN_MAJOR_TRIAD,
        ChordStructure.TONIC_MAJOR_TRIAD_IN_MINOR,
        ChordStructure.SUBDOMINANT_MAJOR_TRIAD_IN_MINOR
      ])
    case ChordType.APPLIED_CHORD:
      return new Set([
        ChordStructure.FIVE_OF_FIVE,
        ChordStructure.FIVE_SEVEN_OF_FIVE,
        ChordStructure.FIVE_OF_SIX,
        ChordStructure.FIVE_SEVEN_OF_SIX,
        ChordStructure.FIVE_SEVEN_OF_MAJOR_FOUR,
        ChordStructure.FIVE_SEVEN_OF_MINOR_FOUR,
        ChordStructure.SEVEN_DIMINISHED_SEVENTH_OF_FIVE,
        ChordStructure.SEVEN_HALF_DIMINISHED_SEVENTH_OF_SEVEN,
        ChordStructure.FIVE_OF_SEVEN_DIMINISHED,
        ChordStructure.FIVE_SEVEN_OF_SEVEN_DIMINISHED
      ])
    default:
      throw "Unsupported chordType"
  }
}