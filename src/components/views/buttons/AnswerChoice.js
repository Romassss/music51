import React from 'react'
import { Button } from 'shards-react'
import styled from 'styled-components'


const StyledChoiceButton = styled(Button)`
  min-height: 10vh;
  min-width: 10vh;
  margin-left: 2%;
  margin-right: 2%;
  margin-bottom: 2%;
  font-size: 2rem;
  text-align: center;
  font-family: 'Overpass Mono', monospace;
  font-weight: 600;
  border-width: 4px;
  border-radius: 0;
  background-color: ${props => props.color};
  &:hover {
    background-color: ${props => props.color};
  }
`
const StyledKeystrokeSymbol = styled.p`
  font-size: 14px;
  color: #898a8d;
  margin-bottom: 0;
  margin-top: 2;
`

export default function AnswerChoice({ choice, keystroke, input, colors, onClick }) {
  const background = (() => {
    const thisInput = colors[colors.length-1]
    const greens = colors.filter(input => input.color === 'green').map(input => input.input)
    if (colors.length > 0 && thisInput.color === 'red' && thisInput.input === choice) {
      return '#c4183c'
    } else if (greens.includes(choice)) {
      return '#17c671'
    }
    return '#e5e6eb'
  })()

  function formatButtonText(choice) {
    if (choice.includes('^')) {
      return (
        <span>
          &nbsp;{choice.charAt(0)}
          <sup style={{position:'relative', left:'-15px', top:'-17px'}}>
            ^
          </sup>
        </span>
      )
    } else if (choice.includes('6') || choice.includes('4')) {
      return (
        <>
        {choice.slice(0,-2)}
          <span style={{postion: 'absolute'}}>
            <sup style={{display:'inline-block', position:'relative', left:'0px', top:'-17px'}}>
              {choice.charAt(choice.length-2)}
            </sup>
            <sub style={{position:'relative', left:'-14px', top:'6px'}}>
              {choice.charAt(choice.length-1)}
            </sub>
          </span>
        </>
      )
    }
    return choice
  }
  const formattedChoice = formatButtonText(choice)

  return (
    <StyledChoiceButton
      theme='light'
      color={background}
      onClick={onClick}
      >
        {formattedChoice}
        <StyledKeystrokeSymbol>
          [{keystroke}]
        </StyledKeystrokeSymbol>
    </StyledChoiceButton>
  )
}