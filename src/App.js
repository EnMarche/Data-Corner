import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor, store } from './redux/store'
import { NotifyProvider, ThemeProvider } from './providers'
import Layout from './components/Layout'
import Routes from './Routes'
import './style/index.scss'

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider>
          <NotifyProvider>
            <Layout>
              <Routes />
            </Layout>
          </NotifyProvider>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)

export default App
