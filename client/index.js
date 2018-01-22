import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { render } from 'react-dom'
import App from '../app'

const initialState = window.__PRELOADED_STATE__
render(
  <BrowserRouter>
    <App {...initialState} />
  </BrowserRouter>,
  document.querySelector('#app')
)
