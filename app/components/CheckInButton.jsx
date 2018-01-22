import React, { Component } from 'react'

class CheckInButton extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
    }
    this.onClick = this.onClick.bind(this)
  }
  onClick(e) {
    e.preventDefault()
    this.setState({
      isLoading: true,
    }, () => this.props.onClick(() => {
      this.setState({
        isLoading: false,
      })
    }))
  }
  render() {
    return (
      <button
        className={this.props.isCheckedIn ? 'uncheckin' : 'checkin'}
        disabled={this.state.isLoading}
        onClick={this.onClick}
      >
        {this.props.title || this.props.children || 'Submit'}
      </button>
    )
  }
}

export default CheckInButton
