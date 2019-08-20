import React from 'react'
import { Button } from 'shards-react'


export default function Choice({ choice, input, red, onClick}) {

  let style = {minHeight: '10vh', minWidth: '10vh', marginLeft: '2%', marginRight: '2%', marginBottom: '2%', fontWeight: '400', fontSize: '2rem', textAlign: 'center'}

    if (choice === input) {
      if (red) {
        style = {...style, backgroundColor: '#c4183c'}
      }
      else {
        style = {...style, backgroundColor: '#17c671'}
      }
    }


  return (
    <Button theme="light" style={style} onClick={onClick}>{choice}</Button>
  )

}