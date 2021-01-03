import { Web3Provider, JsonRpcProvider } from '@ethersproject/providers'
import BurnerProvider from 'burner-provider'
import { useMemo } from 'react'

import { infuraId } from './../constants/infura-id'

const UserProvider = (injectedProvider?: Web3Provider, localProvider?: JsonRpcProvider) =>
  useMemo(() => {
    if (injectedProvider) {
      console.log('🦊 Using injected provider')
      return injectedProvider
    }
    if (!localProvider) return undefined

    let burnerConfig: {
      privateKey?: string
      rpcUrl?: string
    } = {}

    if (window.location.pathname) {
      if (window.location.pathname.indexOf('/pk') >= 0) {
        let incomingPK = window.location.hash.replace('#', '')
        let rawPK
        if (incomingPK.length === 64 || incomingPK.length === 66) {
          console.log('🔑 Incoming Private Key...')
          rawPK = incomingPK
          burnerConfig.privateKey = rawPK
          window.history.pushState({}, '', '/')
          let currentPrivateKey = window.localStorage.getItem('metaPrivateKey')
          if (currentPrivateKey && currentPrivateKey !== rawPK) {
            window.localStorage.setItem('metaPrivateKey_backup' + Date.now(), currentPrivateKey)
          }
          window.localStorage.setItem('metaPrivateKey', rawPK)
        }
      }
    }

    console.log('🔥 Using burner provider', burnerConfig)
    if (localProvider.connection && localProvider.connection.url) {
      burnerConfig.rpcUrl = localProvider.connection.url
      return new Web3Provider(new BurnerProvider(burnerConfig))
    } else {
      // eslint-disable-next-line no-underscore-dangle
      const networkName = localProvider._network && localProvider._network.name
      burnerConfig.rpcUrl = `https://${networkName || 'mainnet'}.infura.io/v3/${infuraId}`
      return new Web3Provider(new BurnerProvider(burnerConfig))
    }
  }, [injectedProvider, localProvider])

export default UserProvider
