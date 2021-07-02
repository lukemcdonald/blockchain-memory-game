import React from 'react'

import { BlockchainProvider } from '../context/Blockchain'
import { TokenProvider } from '../context/Token'

import Navbar from './Navbar.js'
import Main from './Main.js'

const App = () => (
	<BlockchainProvider>
		<Navbar />

		<div className="container-fluid mt-5">
			<div className="row">
				<TokenProvider>
					<Main />
				</TokenProvider>
			</div>
		</div>
	</BlockchainProvider>
)

export default App
