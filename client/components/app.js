/* global WebSocket fetch */
import React, { Component } from 'react'
import Card from './card'
class App extends Component {
  constructor () {
    super()
    this.ciudades = []
    if (WebSocket && process.env.WS_URL) {
      this.ws = new WebSocket(process.env.WS_URL)
    }
    const useWebSocket = !!this.ws
    setInterval(async () => {
      console.log('updating...')
      if (useWebSocket) {

      } else {
        // use fetch
        const response = await fetch('/api/ciudades')
        this.ciudades = await response.json()
      }
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
