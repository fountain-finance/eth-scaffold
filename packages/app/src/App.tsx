import './App.scss'

import { BigNumber } from '@ethersproject/bignumber'
import { Web3Provider } from '@ethersproject/providers'
import { useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Gimme from './components/Gimme'
import MoneyPools from './components/MoneyPools'
import Navbar from './components/Navbar'
import { localProvider } from './constants/local-provider'
import { web3Modal } from './constants/web3-modal'
import { createTransactor } from './helpers/Transactor'
import { useContractLoader } from './hooks/ContractLoader'
import { useGasPrice } from './hooks/GasPrice'
import { useUserProvider } from './hooks/UserProvider'
import MoneyPoolsHistory from './components/MoneyPoolsHistory'

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
      .then(address => {
        setAddress(address)

        if (window.location.pathname === '/') window.location.href = address
      })
  }, [userProvider, setAddress])

  const transactor = createTransactor({
    provider: userProvider,
    gasPrice: typeof gasPrice === 'number' ? BigNumber.from(gasPrice) : undefined,
  })

  const contracts = useContractLoader(userProvider)

  console.log('using provider:', userProvider)

  return (
    <div className="App">
      <Navbar
        contracts={contracts}
        address={address}
        userProvider={userProvider}
        onConnectWallet={loadWeb3Modal}
      ></Navbar>

      <div style={{ padding: 20 }}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/"></Route>
            <Route exact path="/gimme">
              <Gimme contracts={contracts} transactor={transactor} address={address}></Gimme>
            </Route>
            <Route exact path="/:owner">
              <MoneyPools contracts={contracts} transactor={transactor} address={address} />
            </Route>
            <Route exact path="/history/:number">
              <MoneyPoolsHistory contracts={contracts} transactor={transactor} address={address} />
            </Route>
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  )
}

export default App
