import React, { useState, useEffect, createContext, useContext } from 'react'
import MemoryToken from '../abis/MemoryToken.json'
import loadWeb3 from '../utils/loadWeb3'

const BlockchainContext = createContext()

function BlockchainProvider({ children }) {
	const [loading, setLoading] = useState(null)
	const [account, setAccount] = useState(null)
	const [token, setToken] = useState(null)
	const [web3, setWeb3] = useState(null)

	useEffect(() => {
		const init = async () => {
			try {
				// Get network provider and web3 instance.
				const _web3 = await loadWeb3()
				setWeb3(_web3)

				// Use web3 to get the user's accounts.
				const [_account] = await _web3.eth.getAccounts()
				setAccount(_account)

				// Get the token contract.
				const networkId = await _web3.eth.net.getId()
				const network = MemoryToken.networks[networkId]
				const _token = new _web3.eth.Contract(MemoryToken.abi, network.address)
				setToken(_token)

				// Set loading.
				setLoading(false)
			} catch (error) {
				alert(
					'Failed to load web3, account, or token. Check console for details.'
				)
				console.log(error)
			}
		}

		init()
	}, [])

	return loading ? (
		<div>Loading blockchain data...</div>
	) : (
		<BlockchainContext.Provider value={{ account, token, web3 }}>
			{children}
		</BlockchainContext.Provider>
	)
}

function useBlockchain() {
	const context = useContext(BlockchainContext)

	if (context === undefined) {
		throw new Error('useBlockchain must be used within a BlockchainProvider')
	}

	return context
}

export { BlockchainProvider, useBlockchain }
