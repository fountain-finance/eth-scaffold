import { Contract } from '@ethersproject/contracts'
import { useState } from 'react'
import Web3 from 'web3'

import { ContractName } from '../constants/contract-name'
import { SECONDS_IN_DAY } from '../constants/seconds-in-day'
import { Transactor } from '../models/transactor'

export default function ConfigureMoneyPool({
  transactor,
  contracts,
}: {
  transactor?: Transactor
  contracts?: Record<ContractName, Contract>
}) {
  const [target, setTarget] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [title, setTitle] = useState<string>()
  const [link, setLink] = useState<string>()

  const eth = new Web3(Web3.givenProvider).eth

  const useDays = process.env.NODE_ENV === 'production'

  function onSubmit() {
    if (!transactor || !contracts?.Fountain || !contracts?.Token) return

    const _target = eth.abi.encodeParameter('uint256', target)
    // Contracts created during development use seconds for duration
    const _duration = eth.abi.encodeParameter('uint256', duration * (useDays ? SECONDS_IN_DAY : 1))
    const _title = title && Web3.utils.utf8ToHex(title)
    const _link = link && Web3.utils.utf8ToHex(link)

    transactor(contracts.Fountain.configureMp(_target, _duration, contracts.Token.address, _title, _link))
  }

  if (!transactor || !contracts) return null

  return (
    <form
      onSubmit={e => {
        onSubmit()
        e.preventDefault()
      }}
    >
      <p>
        <label htmlFor="title">Title</label>
        <br />
        <input
          onChange={e => setTitle(e.target.value)}
          style={{ marginRight: 10 }}
          type="text"
          name="title"
          id="duration"
          placeholder="Money pool title"
        />
      </p>
      <p>
        <label htmlFor="link">Link</label>
        <br />
        <input
          onChange={e => setLink(e.target.value)}
          style={{ marginRight: 10 }}
          type="text"
          name="link"
          id="duration"
          placeholder="http://your-money-pool.io"
        />
      </p>
      <p>
        <label htmlFor="target">Sustainability target</label>
        <br />
        <input
          onChange={e => setTarget(parseFloat(e.target.value))}
          style={{ marginRight: 10 }}
          type="number"
          name="target"
          id="target"
          placeholder="1500"
        />
        DAI
      </p>
      <p>
        <label htmlFor="duration">Duration</label>
        <br />
        <input
          onChange={e => setDuration(parseFloat(e.target.value))}
          style={{ marginRight: 10 }}
          type="number"
          name="duration"
          id="duration"
          placeholder="30"
        />
        {useDays ? 'days' : 'seconds'}
      </p>
      <button type="submit">Create</button>
    </form>
  )
}
