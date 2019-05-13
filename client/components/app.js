/* global WebSocket fetch */
import React, { Component } from 'react'
import Card from './card'
class App extends Component {
  constructor () {
    super()
    this.ciudades = []
    if (WebSocket) {
      console.log('updating with websockets')
      this.ws = new WebSocket(`${window.location.protocol.replace('http', 'ws').replace(':', '')}://${window.location.host}`)
      this.ws.addEventListener('message', ({ data }) => {
        console.log('got a message')
        if (!data || typeof data === 'string') {
          this.alternativeFetch()
        } else {
          this.ciudades = data
        }
      })
    } else {
      this.alternativeFetch()
    }
  }
  alternativeFetch () {
    setInterval(async () => {
      console.log('updating with fetch')
      // use fetch
      const response = await fetch('/api/ciudades')
      this.ciudades = await response.json()
      this.forceUpdate()
    }, 10 * 1000)
  }
  render () {
    return (
      <div className='center'>
        {Array.isArray(this.ciudades) && this.ciudades.map(ciudad => <Card key={ciudad.codigo} city={ciudad} />)}
      </div>
    )
  }
}

export default App
