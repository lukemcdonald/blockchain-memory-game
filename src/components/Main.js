import React from 'react'
import { useToken } from '../context/Token'

import Cards from './Cards'
import TokenCollection from './TokenCollection'

const Main = () => {
	const {
		state: { tokenURIs },
	} = useToken()

	return (
		<main role="main" className="col-lg-12 d-flex text-center">
			<div className="content mx-auto">
				<h1 className="mt-4">Blockchain Memory Game</h1>

				<div className="mt-4">
					<p>Start matching images by clicking on a square.</p>
					<div className="grid mt-4 mx-auto">
						<Cards />
					</div>
				</div>

				<div className="mt-4">
					<h2>Tokens Collected: {tokenURIs.length}</h2>

					<div className="grid mt-4 mx-auto">
						<TokenCollection tokenURIs={tokenURIs} />
					</div>
				</div>
			</div>
		</main>
	)
}

export default Main
