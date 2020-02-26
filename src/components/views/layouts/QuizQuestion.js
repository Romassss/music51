import React, { useEffect } from 'react'
import Vexflow from '../Vexflow'
import AnswerChoice from '../buttons/AnswerChoice'
import useResponsiveStyles from '../../../hooks/useResponsiveStyles'
import styled from 'styled-components'
import {MegaPixelBorder} from './PixelBorder'
import {Bug} from '../buttons/Bug'
import {Universe, Grid, Entree, Dessert} from './Grids'
import Theme from '../Theme'


const QuestionH4 = styled.h4`
  color: ${props => props.theme.colors.light};
  padding: 0 5% 5% 5%;
`
const ButtonBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: row wrap;
  > * {
    margin: 2%;
  }
`

const VexFlowCenteringDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function QuizQuestion(props) {
  const sizedStyles = useResponsiveStyles()
  const { h4, layoutQuiz } = sizedStyles
  const { chord, question, colors, handleClick, onKeyPressed, currentInput } = props
  const noteColors = question.type === 'LETTER_NAMES' || question.type === 'ROOT' ? colors.filter(input => input.color === 'green').map(input => input.input) : []

  useEffect(() => {
      window.scrollTo(0, 0)
  },[question])

  return (
    <Theme>
      <div style={{outline:'none'}}
        onKeyDown={(e) => onKeyPressed(e)}
        tabIndex="1"
        ref={keyboard => keyboard && keyboard.focus()}
        >
        <Universe>
          <Grid style={layoutQuiz}>
            <Entree>
              <QuestionH4 style={h4}>{question.questionText}</QuestionH4>
              <MegaPixelBorder>
                <VexFlowCenteringDiv>
                  <Vexflow
                    notes={chord.current.notes}
                    octaves={chord.current.octaves}
                    clef={chord.current.clef}
                    keySig={chord.current.keySignature}
                    colors={noteColors}
                    />
                </VexFlowCenteringDiv>
              </MegaPixelBorder>
            </Entree>
            <Dessert>
              <ButtonBox>
                {question.choices.map(choice => {
                  return (
                    <AnswerChoice
                      onClick={(e) => handleClick(choice.choice)}
                      choice={choice.choice}
                      key={choice.key}
                      keystroke={choice.key}
                      input={currentInput}
                      colors={colors}
                      />
                  )}
                )}
              </ButtonBox>
            </Dessert>
          </Grid>
          <Bug />
        </Universe>
      </div>
    </Theme>

  )
}
