import React from 'react'

import { BlockchainProvider } from '../context/Blockchain'

import Navbar from './Navbar.js'
import Main from './Main.js'

const App = () => (
	<BlockchainProvider>
		<Navbar />

		<div className="container-fluid mt-5">
			<div className="row">
				<Main />
			</div>
		</div>
	</BlockchainProvider>
)

export default App
