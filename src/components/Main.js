import React from 'react'
import { TokenProvider } from '../context/Token'
import Cards from './Cards'

const Main = () => (
	<main role="main" className="col-lg-12 d-flex text-center">
		<div className="content mx-auto">
			<h1 className="mt-4">Blockchain Memory Game</h1>

			<div className="grid mt-4 mx-auto">
				<TokenProvider>
					<Cards />
				</TokenProvider>
			</div>
		</div>
	</main>
)

export default Main
