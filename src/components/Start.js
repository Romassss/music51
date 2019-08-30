import React, { useState, useRef, useContext } from 'react'
import Options from './Options.js'
import Go from './Go.js'
import Quiz from './Quiz'
import {
  Container,
  Row,
  Col,
} from 'shards-react'
import generateChords from '../chordGenerator'
import { Size, Session } from './Context'




export default function Start({ title, round }) {

  const size = useContext(Size)
  const [session, updateSession] = useContext(Session)
  let borderRadius = size.width > 500 ? '2rem' : '1rem'
  let fontStyle = size.width > 500 ? {fontFamily: "'Press Start 2P', cursive", textAlign: 'center', fontSize: '3em'} : {textAlign: 'center', fontSize: '2.5em'}
  let subtitleStyle = size.width > 500 ? {textAlign: 'center', fontSize: '2em'} : {textAlign: 'center', fontSize: '2em'}
  let betaStyle = size.width > 500 ? {fontFamily: "'Press Start 2P', cursive", textAlign: 'center', fontSize: '1.5em'} : {textAlign: 'center', fontSize: '1em'}
  const numQs = useRef(5)
  const [ready, launchQuiz] = useState(false)
  const [quiz, setQuiz] = useState([])
  const [options, updateOptions] = useState({
    chordTypes: {triads:true, sevenths:true},
    roots: {common:true, any:false}
  })

  let generateQuiz = (e) => {

      setQuiz(generateChords(numQs.current, options))

      let types
      if (options.chordTypes.triads && options.chordTypes.sevenths) {
        types = ['triads', 'sevenths']
      }
      else if (options.chordTypes.triads && !options.chordTypes.sevenths) {
        types = ['triads']
      }
      else if (!options.chordTypes.triads && options.chordTypes.sevenths) {
        types = ['sevenths']
      }
      let settings = {
        numChords: numQs.current,
        types: types,
        roots: options.roots.common ? 'common' : 'any',
        options: options
      }
      updateSession({...session, settings: settings })

      launchQuiz(true)
  }

  let onCheck = (e, type, option) => {

    let prev
    let next

    switch (type) {
      case 'chord':
          prev = options.chordTypes
          switch (prev[option]) {
            case false:
              console.log('case false');
                next = {...prev, [option]: !prev[option]}
                updateOptions({...options, chordTypes: next })
                break
            case true:
              console.log('case true');
                if (prev.triads === prev.sevenths) {
                  console.log('same');
                  next = {...prev, [option]: !prev[option]}
                  updateOptions({...options, chordTypes: next })
                }
                else {
                  console.log('different');
                  next = {triads:!prev.triads, sevenths:!prev.sevenths}
                  console.log('here is next: ' + JSON.stringify(next));
                  updateOptions({...options, chordTypes: next })
                }
                break
            default: alert('something went wrong selecting options')
          }
          break
      case 'root':
          prev = options.roots
          next = {common: !prev.common, any: !prev.any}
          updateOptions({...options, roots: next })
          break
      default: alert('something went wrong selecting options')

    }

  }

  console.log(JSON.stringify(options, null, 4));


  if (!ready) {
    return (
      <Container fluid className="main-content-container px-4" style={{backgroundColor: 'black', minHeight: '100vh'}}>
        <Row noGutters style={{paddingTop: '5%'}}></Row>
        <Row style={{display: 'flex', justifyContent: 'center'}} noGutters>
          <Col sm='12' lg='8' style={{border: '5px solid black', borderRadius: borderRadius, marginLeft: '5%', marginRight: '5%', marginTop: '5%', backgroundColor: '#e5e6eb'}}>
            <Row style={{display: 'flex', justifyContent: 'center', marginLeft: '5%', marginRight: '5%', marginTop: '5%'}}><h1 style={fontStyle}>{title.headline}</h1></Row>
            <Row style={{display: 'flex', justifyContent: 'center', marginLeft: '5%', marginRight: '5%'}}><h2 style={betaStyle}>{title.beta}</h2></Row>
            <Row style={{display: 'flex', justifyContent: 'center', marginLeft: '5%', marginRight: '5%'}}><h2 style={subtitleStyle}>{title.subtitle}</h2></Row>
            <Row style={{display: 'flex', justifyContent: 'center', marginLeft: '10%', marginRight: '10%', marginTop: '2%', marginBottom: '2%'}}><p style={{ marginBottom: '0', textAlign: 'left'}}><strong>Instructions: </strong>In a session of Chord Crusher, you'll complete multiple rounds; see if you can improve your time and accuracy on each round. You can set rounds from 5-25 chords in length. For each chord, there are four questions that aggregate to name the chord, quality, and inversion. If this is your first time, try 5 chords per round. After that, choose as many as you want!</p></Row>
            <Row style={{display: 'flex', justifyContent: 'center', marginLeft: '5%', marginRight: '5%'}}><p style={{ marginBottom: '0'}}></p></Row>
            <Options checked={options} onChange={(e) => {numQs.current = e.target.value}} onCheck={onCheck} text={'just testing some more'}/>
          </Col>
        </Row>
        <Row style={{display: 'flex', justifyContent: 'center', marginTop: '2%', paddingBottom: '5%'}} noGutters>
            <Go onClick={generateQuiz}/>
        </Row>
      </Container>
    )
  }
  else if (ready) {
    return (
        <Quiz data={quiz} round={round}/>
    )
  }


}
