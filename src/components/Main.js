import React, { Component, Fragment } from 'react'
import { Link } from 'react-router-dom'
import {
  Panel,
  Table,
  Grid,
  Row
} from 'react-bootstrap'

import * as Constants from '../Constants.js'
import * as Config from '../Config.js'

function convertSize(size) {
  var unit = ' B'
  if (size >= 1024) {
    size /= 1024
    unit = ' KB'
    if (size >= 1024) {
      size /= 1024
      unit = ' MB'
      if (size >= 1024) {
        size /= 1024
        unit = ' GB'
        if (size >= 1024) {
          size /= 1024
          unit = ' TB'
        }
      }
    }
  }

  return size.toFixed(2) + unit
}

function buildApiUrl(path, preferences) {
  var url = Config.path.api + path

  if (preferences.showHidden) {
    url += '?' + Constants.preferences.hidden.name
    if (preferences.showProtected) {
      url += '&' + Constants.preferences.protected.name
    }
  } else if (preferences.showProtected) {
    url += '?' + Constants.preferences.protected.name
  }

  return url
}

const style = {
  landing: {
    height: '100%',
    margin: 0,
    padding: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#222222',
  },

  dark: {
    height: '100%',
    paddingTop: 80,
    backgroundColor: '#222222',
    color: 'lightGray'
  }
}

const EntryRenderer = (props) => (
  <tr>
    <td>
      {props.entry.Directory
        ? <span className='glyphicon glyphicon-folder-open' aria-hidden='true'></span>
        : <span />
      }
    </td>
    <td>
      {props.entry.Directory
        ? <Link to={Config.path.home + props.path + props.entry.Name}>{props.entry.Name}</Link>
        : <a href={buildApiUrl(props.path + props.entry.Name, props.preferences)}>{props.entry.Name}</a>
      }
    </td>
    <td>{props.entry.Directory ? '' : convertSize(props.entry.Size)}</td>
    <td>{new Date(props.entry.Date).toLocaleString()}</td>
  </tr>
)

export default class Main extends Component {

  state = {
    loading: false,
    entries: [],
    status: Constants.status.unauthorized,
  }

  componentDidUpdate(previousProps) {
    // There was a change, fetch data
    if (previousProps.user !== this.props.user
        || previousProps.loading !== this.props.loading
        || previousProps.preferences !== this.props.preferences
        || previousProps.path !== this.props.path) {
      this.fetchData()
      return
    }
  }

  invalidateData(error) {
    this.setState({ entries: [], loading: false, status: error })
  }

  fetchData() {
    if (!this.props.user) {
      this.invalidateData(Constants.status.unauthorized)
      return
    }

    this.setState({ loading: true })
    fetch(buildApiUrl(this.props.path, this.props.preferences), { method: 'GET', credentials: 'include' })
      .then(response => {
        if (response.ok) {
          response.json().then(newEntries => {
            this.setState({ entries: newEntries, loading: false, status: Constants.status.ok })
          })
          .catch(() => this.invalidateData(Constants.status.error))
        } else {
          this.invalidateData(response.status)
        }
      })
      .catch(() => this.invalidateData(Constants.status.error))
  }

  generateBreadcrumb() {
    var folders = this.props.path.split('/')
    var url = ''

    return (
      <Fragment>
        <Link to={url}>Home</Link>
        {
          folders.map((folder, index) => {
            if (!folder) {
              return ''
            }

            url += '/' + folder
            if (index < folders.length - 2) {
              return (<Fragment> / <Link to={url}>{folder}</Link></Fragment>)
            } else {
              return (<Fragment> / <b>{folder}</b></Fragment>)
            }
          })
        }
      </Fragment>
    )
  }

  renderTable() {
    if (this.state.loading) {
      return <b>Loading..</b>
    }

    if (this.state.status === Constants.status.notFound) {
      return <b>Not found</b>
    }

    if (!this.state.entries || this.state.entries.length === 0) {
      return <b>Empty folder</b>
    }

    return (
      <Table fill>
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Size</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {this.state.entries.map((entry, index) => (
            <EntryRenderer
              key={index}
              entry={entry}
              path={this.props.path}
              preferences={this.props.preferences}
            />
          ))}
        </tbody>
      </Table>
    )
  }

  render() {
    if (this.props.loading
        || (this.state.status === Constants.status.unauthorized && this.state.loading)) {
      return (
        <div style={style.dark}>
          <Grid>
            <h4>Loading..</h4>
          </Grid>
        </div>
      )
    }

    switch(this.state.status) {
      case Constants.status.unauthorized:
        return (
          <div style={style.landing}>

            <img src={this.props.logo} alt='' style={{ height: 350 }} />
          </div>
        )
      case Constants.status.forbidden:
        return (
          <div style={style.dark}>
            <Grid>
              <h3>Unauthorized</h3>
              <p>The current user does not have access to this content</p>
              <a href={Config.auth.login}>Retry</a>
            </Grid>
          </div>
        )
      case Constants.status.ok:
      case Constants.status.notFound:
        return (
          <Grid style={{ paddingTop: 80 }}>
            <Row>
              <Panel>
                <Panel.Heading>
                  {this.generateBreadcrumb()}
                </Panel.Heading>
                {this.renderTable()}
              </Panel>
            </Row>
          </Grid>
        )
      case null:
        return (
          <div style={style.dark} />
        )
      default:
        return (
          <div style={style.dark}>
            <Grid>
              <h3>Oops!</h3>
              <p>An error has occurred while processing your request</p>
              <a href={Config.path.home}>Return home</a>
            </Grid>
          </div>
        )
    }
  }
}
