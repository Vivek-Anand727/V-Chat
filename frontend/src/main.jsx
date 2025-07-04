import { BrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Provider} from "react-redux"
import { store } from './redux/store.js'
export const serverUrl = "https://v-chat-backend-9jiw.onrender.com"

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <Provider store={store}>
     <App />
  </Provider>
  </BrowserRouter>
)
