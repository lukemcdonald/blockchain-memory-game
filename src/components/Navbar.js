import React, { useContext } from 'react'
import BlockchainContext from '../context/Blockchain'

const Navbar = () => {
	const blockchainContext = useContext(BlockchainContext)
	const { account } = blockchainContext

	return (
		<nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
			<a className="navbar-brand col-sm-3 col-md-2 me-0" href="/">
				&nbsp; Memory Tokens
			</a>
			<ul className="navbar-nav px-3">
				<li className="nav-item text-nowrap d-none d-sm-block">
					<small className="text-muted">
						<span id="account">{account}</span>
					</small>
				</li>
			</ul>
		</nav>
	)
}

export default Navbar
