import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from '@material-ui/core/styles'
import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import LocalizationProvider from '@mui/lab/LocalizationProvider'
import { persistor, store } from './redux/store'
import Layout from './components/Layout'
import Routes from './Routes'
import theme from './theme'
import './style/index.scss'

const App = () => (
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Layout>
              <Routes />
            </Layout>
          </LocalizationProvider>
        </ThemeProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
)

export default App
