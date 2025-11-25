import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Dies ist der Einstiegspunkt deiner React-Anwendung
// Hier wird die App-Komponente in das HTML-Element mit der ID "root" eingehängt
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
