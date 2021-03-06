import React, { useContext, useEffect } from 'react'
import { Session } from '../../data/Context'
import {
  Container,
  Row,
  Col
} from 'shards-react'
import useResponsiveStyles from '../../../hooks/useResponsiveStyles'
import styled from 'styled-components'
import NavButtons from '../buttons/RoundEndNav'
import {SmallPixelBorderSingle, SmallPixelBorderDouble, SmallPixelBorderOutline, MediumPixelBorder, LargePixelBorder, JumboPixelBorder, MegaPixelBorder} from './PixelBorder'
import {Universe, Grid, Appetizer, Entree, Dessert, BugWrapper} from './Grids'
import {Bug} from '../buttons/Bug'
import Theme from '../Theme'

const StatsH1 = styled.h1`
  color: ${props => props.theme.colors.dark};
`

const StatsH3 = styled.h3`
  color: ${props => props.theme.colors.tertiary};
  line-height: 0.75em!important;

`
const StatsH4 = styled.h4`
  color: ${props => props.theme.colors.light};
  .category {
    color: ${props => props.theme.colors.tertiary};
    font-weight: 600;
    text-transform: uppercase;
  }
  .num {
    color: ${props => props.theme.colors.secondary};
  }
`

export default function StatLines(props) {
  const { round, setShowStats, nextRound, finished } = props
  const means = useContext(Session).means.tally
  const qTypes = useContext(Session).means.questionsCurrentRound
  const sizedStyles = useResponsiveStyles()
  const { h1, h2, h3, h4, para, input, layoutInfo, layoutQuiz} = sizedStyles

  useEffect(() => {
      window.scrollTo(0, 0)
  },[])

  const headline = round === 1 ? 'First Round Complete!' : `Round ${round} Stats`
  const subtitle = round === 1 ? `Here's Your Benchmark:` : null
  const closing = round === 1 ? 'Try to beat these numbers in the next round!' : null
  const statLines = qTypes.map( type => {
    console.log("type:" + JSON.stringify(type))
    return <Row
            key={type}
            style={{display: 'flex', justifyContent: 'center', textAlign: 'center'}}>
              <p>
                <span class='category'>{type.toUpperCase()}: </span><br />
                <span class='num'>{means[type].attempts[means[type].attempts.length-1]}</span> attempts and <span class='num'>{means[type].times[means[type].times.length-1]}</span> seconds per question
              </p>
            </Row>
  })

  return (
    <Theme>
      <Universe>
        <Grid style={layoutInfo}>
          <Appetizer>
            <MegaPixelBorder>
              <StatsH1 style={h1}>{headline}</StatsH1>
            </MegaPixelBorder>
            <NavButtons viewStats={setShowStats} nextRound={nextRound} finished={finished} round={round} statLines/>
          </Appetizer>
          <Entree>
            <SmallPixelBorderOutline>
              <StatsH3 style={h3}>{subtitle}</StatsH3>
              <StatsH4 style={h4}>{statLines}</StatsH4>
              <StatsH3 style={h3}>{closing}</StatsH3>
            </SmallPixelBorderOutline>
          </Entree>
        </Grid>
        <Bug />
      </Universe>
    </Theme>

  )
}
