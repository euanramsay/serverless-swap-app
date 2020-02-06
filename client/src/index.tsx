// Referenced from https://auth0.com/docs/quickstart/spa/react

import './index.css'
import 'semantic-ui-css/semantic.min.css'

import * as serviceWorker from './serviceWorker'

import App from './App'
import { Auth0Provider } from './auth/react-auth0-spa'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import ReactDOM from 'react-dom'
import config from './auth_config.json'
import history from './utils/history'
import { makeAuthRouting } from './routing'

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState?: { targetUrl: string }): void => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  )
  return
}

ReactDOM.render(
  <BrowserRouter>
    <Auth0Provider
      domain={config.domain}
      client_id={config.clientId}
      redirect_uri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>,
  document.getElementById('root')
)

ReactDOM.render(makeAuthRouting(), document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
