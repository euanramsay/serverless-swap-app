import { FC, useState } from 'react'
import { Grid, Menu, Segment } from 'semantic-ui-react'
import { Link, Route, Router, Switch } from 'react-router-dom'

import Auth from './auth/Auth'
import { EditSwap } from './components/EditSwap'
import { LogIn } from './components/LogIn'
import { NotFound } from './components/NotFound'
import { Swaps } from './components/Swaps'
import history from './utils/history'
import { useAuth0 } from './auth/react-auth0-spa'

export interface AppProps {}

export interface AppProps {
  auth: Auth
  history: any
}

export interface AppState {}

export const App: FC = () => {
  const [jwt, setJwt] = useState<string | undefined>(undefined)
  const {
    loading,
    getIdTokenClaims,
    isAuthenticated,
    logout,
    loginWithRedirect
  } = useAuth0()

  if (!loading) {
    getIdTokenClaims().then((claims: IdToken) => {
      if (claims && claims.__raw) {
        setJwt(claims.__raw)
      }
    })
  }

  return (
    <div>
      <Segment style={{ padding: '8em 0em' }} vertical>
        <Grid container stackable verticalAlign="middle">
          <Grid.Row>
            <Grid.Column width={16}>
              <Router history={history}>
                {generateMenu(isAuthenticated, logout, loginWithRedirect)}

                {generateCurrentPage()}
              </Router>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    </div>
  )
}

const generateMenu = (
  isAuthenticated: any,
  logout: any,
  loginWithRedirect: any
) => (
  <Menu>
    <Menu.Item name="home">
      <Link to="/">Home</Link>
    </Menu.Item>
    <Menu.Menu position="right">
      {logInLogOutButton(isAuthenticated, logout, loginWithRedirect)}
    </Menu.Menu>
  </Menu>
)

const logInLogOutButton = (
  isAuthenticated: any,
  logout: any,
  loginWithRedirect: any
) => {
  if (isAuthenticated()) {
    return (
      <Menu.Item name="logout" onClick={(): void => logout()}>
        Log Out
      </Menu.Item>
    )
  } else {
    return (
      <Menu.Item name="login" onClick={(): void => loginWithRedirect({})}>
        Log In
      </Menu.Item>
    )
  }
}

const generateCurrentPage = (isAuthenticated: any) => {
  if (!isAuthenticated()) {
    return <LogIn auth={this.props.auth} />
  }

  return (
    <Switch>
      <Route
        path="/"
        exact
        render={props => {
          return <Swaps {...props} auth={this.props.auth} />
        }}
      />

      <Route
        path="/swaps/:swapId/edit"
        exact
        render={props => {
          return <EditSwap {...props} auth={this.props.auth} />
        }}
      />

      <Route component={NotFound} />
    </Switch>
  )
}

export default App
