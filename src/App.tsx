import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import QBRICK from './QBRICK'
import { Global } from './style'

export default function App() {
  return (
    <Router>
      <Global />
      <QBRICK />
    </Router>
  )
}
