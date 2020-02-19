import React, { useContext, useEffect } from 'react'
import { Session } from '../../data/Context'
import useResponsiveStyles from '../../../hooks/useResponsiveStyles'
import { rounded } from '../../../utility'
import HorizontalTable from '../charts/HorizontalTable'
import VerticalTable from '../charts/VerticalTable'
import { questionsList } from '../../../generator/questionsList'
import styled from 'styled-components'
import {SmallPixelBorderSingle, SmallPixelBorderDouble, SmallPixelBorderOutline, MediumPixelBorder, LargePixelBorder, JumboPixelBorder, MegaPixelBorder} from './PixelBorder'
import {Grid, Cell, SubCell} from './Grids'
import Theme from '../Theme'



// QUESTION: when implementing reducers dispatch an update to session data that includes best/worst info?
// TODO: add a better breakpoint for tables?
// TODO: add a conversion from null to N/A for empty categories
// TODO: use the abbrev from the enum to get the table labels
export default function ResultsTable(props) {
  const { round, startOver } = props
  const means = useContext(Session).means.tally
  //get rid of this variable; just a placeholder to mark the change
  const qTypes = Object.keys(questionsList)
  const sizedStyles = useResponsiveStyles()
  const { tableSize } = sizedStyles

  const perfectRounds = (means.Overall.attempts.filter(average => average === 1)).length
  const greeting = perfectRounds >= 1 ? `Pefection! You completed ${perfectRounds} rounds with 100% accuracy this session.` : `No perfect rounds this session, but you'll get there next time!`

  useEffect(() => {
      window.scrollTo(0, 0)
  },[])

  /*if (tableSize >= 900) {
    const headers = qTypes.map( type => {
      return  <th scope="col" className="border-0">
                {type.toUpperCase()}
              </th>
    })
    const firstRoundAtt = qTypes.map( type => {
      return <td>{rounded(means[type].attempts[0], 2)}</td>
    })
    const lastRoundAtt = qTypes.map( type => {
      return <td>{rounded(means[type].attempts[round-1], 2)}</td>
    })
    const firstRoundT = qTypes.map( type => {
      return <td>{rounded(means[type].times[0], 2)}</td>
    })
    const lastRoundT = qTypes.map( type => {
      return <td>{rounded(means[type].times[round-1], 2)}</td>
    })
    const bestRoundT = qTypes.map( type => {
      return <td>{rounded(Math.min(...means[type].times), 2)}</td>
    })
    const bestRoundAtt = qTypes.map( type => {
      return <td>{rounded(Math.min(...means[type].attempts), 2)}</td>
    })
    return <HorizontalTable
            greeting={greeting}
            headers={headers}
            firstRoundAtt={firstRoundAtt}
            firstRoundT={firstRoundT}
            lastRoundAtt={lastRoundAtt}
            lastRoundT={lastRoundT}
            bestRoundAtt={bestRoundAtt}
            bestRoundT={bestRoundT}
            startOver={startOver}
            />
  } else {*/
    const verticalTableAtt = qTypes.map( type => {
      return <tr>
              <td>{questionsList[type].abbrev}</td>
              <td>{rounded(means[type].attempts[0], 2)}</td>
              <td>{rounded(means[type].attempts[round-1],2)}</td>
              <td>{rounded(Math.min(...means[type].attempts), 2)}</td>
            </tr>
    })
    const verticalTableT = qTypes.map( type => {
      return <tr>
              <td>{questionsList[type].abbrev}</td>
              <td>{rounded(means[type].times[0], 2)}</td>
              <td>{rounded(means[type].times[round-1],2)}</td>
              <td>{rounded(Math.min(...means[type].times), 2)}</td>
            </tr>
    })
    return <VerticalTable
            greeting={greeting}
            verticalTableAtt={verticalTableAtt}
            verticalTableT={verticalTableT}
            startOver={startOver}
            />
    /*}*/
}
