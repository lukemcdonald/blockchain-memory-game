import React, { createContext, useContext, useEffect, useReducer } from 'react'
import MemoryToken from '../abis/MemoryToken.json'
import loadWeb3 from '../utils/loadWeb3'

const BlockchainContext = createContext()

const actionTypes = {
	setAccount: 'SET_ACCOUNT',
	setLoading: 'SET_LOADING',
	setToken: 'SET_TOKEN',
	setWeb3: 'SET_WEB3',
}

const initialState = {
	account: null,
	loading: null,
	token: null,
	web3: null,
}

function blockchainReducer(state, action) {
	switch (action.type) {
		case actionTypes.setAccount: {
			return { ...state, account: action.value }
		}
		case actionTypes.setLoading: {
			return { ...state, loading: action.value }
		}
		case actionTypes.setToken: {
			return { ...state, token: action.value }
		}
		case actionTypes.setWeb3: {
			return { ...state, web3: action.value }
		}
		default: {
			throw new Error(`Unhandled type: ${action.type}`)
		}
	}
}

function BlockchainProvider({ children }) {
	const [state, dispatch] = useReducer(blockchainReducer, initialState)

	useEffect(() => {
		const init = async () => {
			try {
				// Get network provider and web3 instance.
				const web3 = await loadWeb3()
				dispatch({ type: actionTypes.setWeb3, value: web3 })

				// Use web3 to get the user's accounts.
				const [account] = await web3.eth.getAccounts()
				dispatch({ type: actionTypes.setAccount, value: account })

				// Get the token contract.
				const networkId = await web3.eth.net.getId()
				const network = MemoryToken.networks[networkId]
				const token = new web3.eth.Contract(MemoryToken.abi, network.address)
				dispatch({ type: actionTypes.setToken, value: token })

				// Set loading.
				dispatch({ type: actionTypes.setLoading, value: false })
			} catch (error) {
				alert(
					'Failed to load web3, account, or token. Check console for details.'
				)
				console.log(error)
			}
		}

		init()
	}, [])

	const value = { state, dispatch }

	return state.loading ? (
		<div>Loading blockchain data...</div>
	) : (
		<BlockchainContext.Provider value={value}>
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

export { BlockchainProvider, useBlockchain, actionTypes, blockchainReducer }
