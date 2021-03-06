import React, { useState, useRef, useContext } from 'react'
import { Dispatch } from '../data/Context'
import QuizQuestion from '../views/layouts/QuizQuestion'
import EndOfRound from './EndOfRound'

export default function Quiz ({ data, round }) {
  const dispatch = useContext(Dispatch)
  const devMode = useState(false)[0] //change to true to enable dev mode
  const [currentQ, nextQ] = useState(data[0].questions[0])
  const [colors, setColors] = useState([])
  const thisInput = useRef(null)
  const currentChord = useRef(data[0])
  const roundData = useRef([])
  const chord = useRef({
    chord: data[0].notes, //this is not a unique id. we should decide on one when we work on the data structure.
    questions: []
  })
  const subQ = useRef({
    type: data[0].questions[0].type,
    answers: []
  })
  const answer = useRef({
    answer: data[0].questions[0].answers[0],
    tries: [],
    startTime: Date.now(),
    endTime: '',
    elapsedTime: '',
  })

  function handleClick(input) {
    if (thisInput.current === false) {
      return
    }
    answer.current.tries.push({'input': input, type: 'click'})
    thisInput.current = input
    checkInput(input)
  }
  function onKeyPressed(e) {
    if (thisInput.current === false) {
      return
    }
    const key = e.key
    const input = (() => {
      for (let choice of currentQ.choices) {
        if (key === choice.key) {
          return choice.choice
        }
      }
      return null
    })()
    if (input !== null) {
      answer.current.tries.push({'input': input, type: 'keypress'})
      thisInput.current = input
    }
    checkInput(input)
  }
  function checkInput(input) {
    if (devMode) {
      input = currentQ.answers[subQ.current.answers.length]
    }
    switch (input) {
      case null:
        return
      case (currentQ.answers[subQ.current.answers.length]):
        answer.current.endTime = Date.now()
        answer.current.elapsedTime = (answer.current.endTime-answer.current.startTime)/1000
        subQ.current.answers.push(answer.current)
        answer.current = {
          answer: data[roundData.current.length].questions[chord.current.questions.length].answers[subQ.current.answers.length],
          tries: [],
          startTime: Date.now(),
          endTime: '',
          elapsedTime: '',
        }
        return setNextView(input)
      default:
        return setColors([...colors, {'input': input, color: 'red'}])
    }
  }
  function setNextView(input) {
    if (subQ.current.answers.length === currentQ.answers.length) {
      setColors([...colors, {'input': input, color: 'green'}])
      chord.current.questions.push(subQ.current)
      return resetForNextQ()
    }
    else {
      setColors([...colors, {'input': input, color: 'green'}])
    }
  }
  function resetForNextQ() {
    thisInput.current = false
    setTimeout(() => {
      setColors([])
      thisInput.current = null
      if (chord.current.questions.length < currentChord.current.questions.length) {
        subQ.current = {
          type: data[roundData.current.length].questions[chord.current.questions.length].type,
          answers: []
        }
        answer.current = {
          answer: data[roundData.current.length].questions[chord.current.questions.length].answers[0],
          tries: [],
          startTime: Date.now(),
          endTime: '',
          elapsedTime: '',
        }
        nextQ(currentChord.current.questions[chord.current.questions.length])
      } else {
        roundData.current= [...roundData.current, chord.current]
        if (roundData.current.length < data.length) {
          chord.current = {
            chord: data[roundData.current.length].notes,
            questions: []
          }
          answer.current = {
            answer: data[roundData.current.length].questions[0].answers[0],
            tries: [],
            startTime: Date.now(),
            endTime: '',
            elapsedTime: '',
          }
          subQ.current = {
            type: data[roundData.current.length].questions[0].type,
            answers: []
          }
          currentChord.current = data[roundData.current.length]
          nextQ(currentChord.current.questions[0])
        } else {
          dispatch({type: 'tally', data: roundData.current})
          dispatch({type: 'round', round: round, data: roundData.current})
        }
      }
    }, 1000)
  }

  if (roundData.current.length === data.length) {
    return <EndOfRound round={round} />
  } else {
    return <QuizQuestion
              chord={currentChord}
              question={currentQ}
              colors={colors}
              handleClick={handleClick}
              onKeyPressed={onKeyPressed}
              currentInput={thisInput.current}
              />
  }
}
