import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { store } from "./store";
import { Provider } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  </Provider>
)