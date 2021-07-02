import React, { useState, useEffect, createContext, useContext } from 'react'
import { useBlockchain } from './Blockchain'

const TokenContext = createContext()

function TokenProvider({ children }) {
	const { account, token, web3 } = useBlockchain

	const [tokenURIs, setTokenURIs] = useState([])
	const [totalSupply, setTotalSupply] = useState(null)

	useEffect(() => {
		const load = async () => {
			// Get total supply.
			const _totalSupply = await token.methods.totalSupply().call()
			setTotalSupply(_totalSupply)

			// Get list of token URI's.
			const balanceOf = await token.methods.balanceOf(account).call()
			for (let index = 0; index < balanceOf; index += 1) {
				const tokenId = await token.methods
					.tokenOfOwnerByIndex(account, index)
					.call()
				const tokenURI = await token.methods.tokenURI(tokenId).call()
				setTokenURIs((state) => [...state, tokenURI])
			}
		}

		if (account && token && web3) {
			load()
		}
	}, [web3, account, token])

	return (
		<TokenContext.Provider value={{ tokenURIs, totalSupply }}>
			{children}
		</TokenContext.Provider>
	)
}

function useToken() {
	const context = useContext(TokenContext)

	if (context === undefined) {
		throw new Error('useToken must be used within a TokenProvider')
	}

	return context
}

export { TokenProvider, useToken }
