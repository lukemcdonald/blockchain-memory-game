import Web3 from 'web3'

export default async () => {
	let web3

	if (window.ethereum) {
		web3 = new Web3(window.ethereum)
		await window.ethereum.enable()
	} else if (window.web3) {
		web3 = new Web3(window.web3.currenProvider)
	} else {
		window.alert(
			'Non-Ethereum browser detected. You should consider trying MetaMask!'
		)
	}

	return web3
}
