
import './App.css'
import 'antd/dist/reset.css';
import React, { useEffect } from 'react'
import IndexRouter from './router/IndexRouter'
import { Provider } from 'react-redux';
import {store,persiststore} from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'

export default function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persiststore}>
        <IndexRouter></IndexRouter>
      </PersistGate>
     
    </Provider>
  )
}
