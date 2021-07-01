import React, { useState, useEffect } from 'react'
import MemoryToken from '../abis/MemoryToken.json'
import loadWeb3 from '../utils/loadWeb3'

import Navbar from './Navbar.js'
import Main from './Main.js'
import Loader from './Loader.js'

import BlockchainContext from '../context/Blockchain'

const App = () => {
	const [loading, setLoading] = useState(true)
	const [account, setAccount] = useState(null)
	const [token, setToken] = useState(null)
	const [tokenURIs, setTokenURIs] = useState([])
	const [totalSupply, setTotalSupply] = useState(null)
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
					'Failed to load web3, account, or contract. Check console for details.'
				)
				console.log(error)
			}
		}

		init()
	}, [])

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

		if (web3 && token && account) {
			load()
		}
	}, [web3, account, token])

	return (
		<BlockchainContext.Provider
			value={{ account, token, totalSupply, tokenURIs, web3 }}
		>
			<Navbar />

			<div className="container-fluid mt-5">
				<div className="row">{loading ? <Loader /> : <Main />}</div>
			</div>
		</BlockchainContext.Provider>
	)
}

export default App
