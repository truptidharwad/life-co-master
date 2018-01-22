import React, { Component } from 'react'
import request from 'superagent'
import Search from '../components/Search'
import SearchResultCell from '../components/SearchResultCell'
import { searchBusinesses } from '../utils/apiSearch'
import { checkin, unCheckin } from '../utils/apiCheckin'
import handleError from '../utils/handleError'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      username: this.props.username,
      location: this.props.location,
      businesses: this.props.businesses,
    }
    this.onSearch = this.onSearch.bind(this)
    this.onChange = this.onChange.bind(this)
    this.updateBusinesses = this.updateBusinesses.bind(this)
    this.handleCheckin = this.handleCheckin.bind(this)
  }
  onSearch(e) {
    e.preventDefault()
    if (this.state.isLoading || this.state.location === '') {
      return
    }
    this.setState({
      isLoading: true,
    }, () => {
      searchBusinesses(this.state.location)
        .then((resp) => {
          this.setState({
            isLoading: false,
            businesses: resp.body,
          })
        })
        .catch((err) => {
          this.setState({
            isLoading: false,
          })
        })
    })
  }
  onChange(e) {
    e.preventDefault()
    this.setState({
      location: e.target.value,
    })
  }
  componentDidMount() {
    this.searchbox.focus()
  }
  updateBusinesses(resp) {
    const updated = resp.body
    const newBusinesses = this.state.businesses.map((business) => {
      if (business.id === updated.id) {
        return updated
      }
      return business
    })
    this.setState({
      businesses: newBusinesses,
    })
  }
  handleCheckin(id) {
    return (cb) => {
      const isLoggedIn = !!this.props.username
      if (!isLoggedIn) {
        location.href = '/auth/twitter?location=' + this.state.location
          + '&business=' + id
        return
      }
      const selected = this.state.businesses.filter((b) => b.id === id)[0]
      const action = (selected && selected.isCheckedIn)
        ? unCheckin
        : checkin

      action(id)
        .then(this.updateBusinesses)
        .then(cb)
        .catch(handleError)
    }
  }
  render() {
    return (
      <Search
        onSubmit={this.onSearch}
        onChange={this.onChange}
        searchTerm={this.state.location}
        searchboxRef={(node) => this.searchbox = node}
        searchResults={this.state.businesses}
        isLoading={this.state.isLoading}
      >
        {
          this.state.businesses.map((b) => (
            <SearchResultCell 
              {...b} 
              key={b.id}
              onCheckin={this.handleCheckin(b.id)}
            />
          ))
        }
      </Search>
    )
  }
}

export default App
