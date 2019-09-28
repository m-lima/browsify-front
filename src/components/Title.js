import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  MenuItem,
  Nav,
  Navbar,
  NavDropdown,
  NavItem,
  Checkbox,
  Image
} from 'react-bootstrap'

import * as Config from '../Config.js'
import * as Constants from '../Constants.js'

const UserDropdown = (user) =>
  <span style={{ height: 50 }}>
    <Image
      src={user.picture}
      alt=''
      style={{ height: 36, marginTop: -8, marginBottom: -8, marginRight: 10 }}
      rounded
    />
    {user.givenName}
  </span>

const PreferenceToggle = (props) => (
    <MenuItem onClick={() => {
        props.togglePreference(props.preference.name)
      }}>
      <Checkbox checked={props.checked}>{props.preference.displayName}</Checkbox>
    </MenuItem>
)

export default class Title extends Component {

  renderUserButton() {
    if (this.props.loading) {
      return <Navbar.Text pullRight>Loading..</Navbar.Text>
    }

    if (this.props.user) {
      var user = this.props.user
      return (
        <Nav pullRight>
          <NavDropdown
            id='user-dropdown'
            title={UserDropdown(user)}
            eventKey={1}>

            {user.permissions.admin && <MenuItem>Admin Panel</MenuItem>}
            {user.permissions.admin && <MenuItem divider />}

            {(user.permissions.admin || user.permissions.canShowHidden) &&
              <PreferenceToggle
                checked={this.props.preferences.showHidden}
                preference={Constants.preferences.hidden}
                togglePreference={this.props.togglePreference}
              />}
            {(user.permissions.admin || user.permissions.canShowProtected) &&
              <PreferenceToggle
                checked={this.props.preferences.showProtected}
                preference={Constants.preferences.protected}
                togglePreference={this.props.togglePreference}
              />}

            {(user.permissions.canShowHidden || user.permissions.canShowProtected)
                && <MenuItem divider />}

            <MenuItem eventKey={1.1} onClick={() => window.location = Config.auth.logout}>
              Logout
            </MenuItem>
          </NavDropdown>
        </Nav>
      )
    }

    return (
      <Nav pullRight>
        <NavItem onClick={() => window.location = Config.auth.login + window.location}>Login</NavItem>
      </Nav>
    )
  }

  render() {
    return (
      <Navbar inverse collapseOnSelect fixedTop>
        <Navbar.Header>
          {this.props.user &&
            <Navbar.Brand>
              <Link to={Config.path.home}>
                <img src={this.props.logo} alt='' style={{ height: 20 }} />
              </Link>
            </Navbar.Brand>
          }
          <Navbar.Brand>
            <Link to={Config.path.home}>
              {this.props.titleName}
            </Link>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          {this.renderUserButton()}
        </Navbar.Collapse>
      </Navbar>
    )
  }
}
