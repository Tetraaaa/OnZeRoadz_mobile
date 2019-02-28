import React from 'react'
import Navigation from './Navigation/Navigation';
import { Provider } from "react-redux"
import { persistStore } from 'redux-persist'
import Store from './Store/configureStore'
import { PersistGate } from 'redux-persist/es/integration/react'

export default class App extends React.Component
{
    render()
    {
        let persistor = persistStore(Store)
        return (
            <Provider store={Store}>
                <PersistGate persistor={persistor}>
                    <Navigation />
                </PersistGate>
            </Provider>

        )
    }
}