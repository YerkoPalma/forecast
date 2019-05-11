import React, { Component } from 'react'
class Card extends Component {
  get image () {
    return require(`../assets/${this.props.city.nombre.toLowerCase()}.jpg`)
  }
  get hour () {
    return new Date(this.props.city.time).getHours()
  }
  get minutes () {
    return new Date(this.props.city.time).getMinutes()
  }
  get seconds () {
    return new Date(this.props.city.time).getSeconds()
  }
  render () {
    return (
      <article className='br2 ba dib dark-gray b--black-10 ma4 w-100 w-50-m w-25-l mw5'>
        <img src={this.image} className='db w-100 br2 br--top' alt='Photo of a kitten looking menacing.' />
        <div className='pa2 ph3-ns pb3-ns'>
          <div className='dt w-100 mt1'>
            <div className='dtc'>
              <h1 className='f5 f4-ns mv0'>{this.props.city.nombre}</h1>
            </div>
            <div className='dtc tr'>
              <h2 className='f5 mv0'>{this.props.city.temperature}°C</h2>
              <h2 className='f5 mv0'>{this.hour}:{this.minutes}:{this.seconds}</h2>
            </div>
          </div>
          <p className='f6 lh-copy measure mt2 mid-gray'>
            Image from unsplash
          </p>
        </div>
      </article>
    )
  }
}

export default Card
