import React, { createContext, useContext, useEffect, useReducer } from 'react'
import { useBlockchain } from './Blockchain'

const TokenContext = createContext()

const actionTypes = {
	setTokenURIs: 'SET_TOKEN_URIS',
	setTotalSupply: 'SET_TOTAL_SUPPLY',
}

const initialState = {
	tokenURIs: [],
	totalSupply: null,
}

function tokenReducer(state, action) {
	const { tokenURIs } = state

	switch (action.type) {
		case actionTypes.setTokenURIs: {
			return { ...state, tokenURIs: [...tokenURIs, action.value] }
		}
		case actionTypes.setTotalSupply: {
			return { ...state, totalSupply: action.value }
		}
		default: {
			throw new Error(`Unhandled type: ${action.type}`)
		}
	}
}

function TokenProvider({ children }) {
	const [state, dispatch] = useReducer(tokenReducer, initialState)
	const {
		state: { account, token, web3 },
	} = useBlockchain()

	useEffect(() => {
		const init = async () => {
			// Get list of token URI's and add them to state.
			const balanceOf = await token.methods.balanceOf(account).call()

			for (let index = 0; index < balanceOf; index += 1) {
				const tokenId = await token.methods
					.tokenOfOwnerByIndex(account, index)
					.call()
				const tokenURI = await token.methods.tokenURI(tokenId).call()
				dispatch({ type: actionTypes.setTokenURIs, value: tokenURI })
			}

			// Get total supply.
			const totalSupply = await token.methods.totalSupply().call()
			dispatch({ type: actionTypes.setTotalSupply, value: totalSupply })
		}

		if (account && token && web3) {
			init()
		}
	}, [web3, account, token])

	const value = { state, dispatch }

	return <TokenContext.Provider value={value}>{children}</TokenContext.Provider>
}

function useToken() {
	const context = useContext(TokenContext)

	if (context === undefined) {
		throw new Error('useToken must be used within a TokenProvider')
	}

	return context
}

export { TokenProvider, useToken, actionTypes, tokenReducer }
