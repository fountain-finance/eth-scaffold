import './App.scss'
import 'antd/dist/antd.css'

import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider } from '@ethersproject/providers'
import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import CreateMp from './components/CreateMp'
import Gimme from './components/Gimme'
import Navbar from './components/Navbar'
import Owner from './components/Owner'
import ViewMp from './components/ViewMp'
import { localProvider } from './constants/local-provider'
import { web3Modal } from './constants/web3-modal'
import { createTransactor } from './helpers/Transactor'
import { useContractLoader } from './hooks/ContractLoader'
import { useGasPrice } from './hooks/GasPrice'
import { useUserProvider } from './hooks/UserProvider'

function App() {
  const [injectedProvider, setInjectedProvider] = useState<Web3Provider>()
  const [address, setAddress] = useState<string>()

  const gasPrice = useGasPrice('fast')

  const userProvider = useUserProvider(injectedProvider, localProvider)

  const loadWeb3Modal = useCallback(async () => {
    const provider = await web3Modal.connect()
    setInjectedProvider(new Web3Provider(provider))
  }, [setInjectedProvider])

  // https://github.com/austintgriffith/eth-hooks/blob/master/src/UserAddress.ts
  useEffect(() => {
    userProvider
      ?.getSigner()
      .getAddress()
      .then(setAddress)
  }, [userProvider, setAddress])

  const transactor = createTransactor({
    provider: userProvider,
    gasPrice: gasPrice !== undefined ? BigNumber.from(gasPrice) : undefined,
  })

  const contracts = useContractLoader(userProvider)

  console.log('using provider:', userProvider)

  return (
    <div className="App">
      <Navbar address={address} userProvider={userProvider} onConnectWallet={loadWeb3Modal}></Navbar>

      <BrowserRouter>
        <Switch>
          <Route exact path="/"></Route>
          <Route exact path="/mp">
            <Owner transactor={transactor} address={address} contracts={contracts}></Owner>
          </Route>
          <Route exact path="/mp/create">
            <CreateMp transactor={transactor} contracts={contracts} />
          </Route>
          <Route exact path="/mp/:number">
            <ViewMp contracts={contracts} transactor={transactor} address={address}></ViewMp>
          </Route>
          <Route exact path="/gimme">
            <Gimme contracts={contracts} transactor={transactor} address={address}></Gimme>
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  )
}

export default App
