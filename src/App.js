import React, { Component } from 'react'

import Title from './components/Title.js'
import Main from './components/Main.js'
import * as Config from './Config.js'
import * as Constants from './Constants.js'

import logoSimple from './img/folder.simple.svg'
import logoHollow from './img/folder.hollow.svg'

export default class App extends Component {

  state = {
    user: null,
    loading: false,
    preferences: {
      showHidden: false,
      showProtected: false,
    },
  }

  constructor(props) {
    super(props)
    this.togglePreference = this.togglePreference.bind(this)
  }

  componentDidMount() {
    this.updatePreferences()
    this.fetchUser()
  }

  cleanPath(path) {
    if (path === undefined || path === '') {
      path = this.props.location.pathname
    }

    if (!this.props.location.pathname.startsWith(Config.path.home)) {
      return
    }

    path = path.substring(Config.path.home.length)
    if (path.length > 0 && path.charAt(path.length - 1) !== '/') {
      path += '/'
    }

    return path
  }

  getPreferences() {
    var preferences = document.cookie.split('=')
    if (preferences.length !== 2) {
      return []
    }

    return preferences[1].split(Constants.preferences.cookie.separator)
  }

  togglePreference(preference) {
    var preferences = this.getPreferences()

    // Remove flag if exists, else add if it doesnt
    if (this.state.preferences[preference]) {
      var index = preferences.indexOf(preference)
      if (index >= 0) {
        preferences.splice(index, 1)
      }
    } else {
      if (preferences.indexOf(preference) < 0) {
        preferences.push(preference)
      }
    }

    // Clean up
    for (var i = preferences.indexOf(''); i >= 0; i = preferences.indexOf('')) {
      preferences.splice(i, 1)
    }

    // Store cookie
    document.cookie = Constants.preferences.cookie.name
                        + '='
                        + preferences.join(Constants.preferences.cookie.separator)
                        + '; path=/;'

    this.updatePreferences()
  }

  updatePreferences() {
    var preferences = this.getPreferences()

    this.setState({
      preferences: {
        showHidden: preferences.indexOf('showHidden') >= 0,
        showProtected: preferences.indexOf('showProtected') >= 0,
      }
    })
  }

  fetchUser() {
    this.setState({ loading: true })
    fetch(Config.auth.user, { method: 'GET', credentials: 'include' })
      .then(response => {
        if (response.ok) {
          response.json()
            .then(newUser => this.setState({ user: newUser, loading: false }))
            .catch(() => this.setState({ user: null, loading: false }))
        } else {
         this.setState({ user: null, loading: false })
        }
      })
      .catch(() => this.setState({ user: null, loading: false }))
  }

  render() {
    return (
      <div style={{ height: '100%' }}>
        <Title
          titleName='Browsify'
          logo={logoSimple}
          user={this.state.user}
          preferences={this.state.preferences}
          loading={this.state.loading}
          togglePreference={this.togglePreference}
        />
        <Main
          logo={logoHollow}
          user={this.state.user}
          preferences={this.state.preferences}
          loading={this.state.loading}
          path={this.cleanPath(this.props.location.basePath)}
        />
      </div>
    )
  }
}

