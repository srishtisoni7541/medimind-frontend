import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContextProvider from './context/AppContext.jsx'
import { Provider } from 'react-redux'
import { store } from './store/store.js'
import { SnackbarProvider } from 'notistack'

createRoot(document.getElementById('root')).render(
      <BrowserRouter>
        <Provider store={store}>
          <AppContextProvider>
            <SnackbarProvider
              maxSnack={3}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <App />
            </SnackbarProvider>
          </AppContextProvider>
        </Provider>
      </BrowserRouter>
)
