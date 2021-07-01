import React from 'react'

import Cards from './Cards'

const Main = () => (
	<main role="main" className="col-lg-12 d-flex text-center">
		<div className="content mx-auto">
			<h1 className="d-4">App</h1>

			<div className="grid mb-4">
				<Cards />
			</div>

			<div>
				<div className="grid mb-4">{/* Code goes here... */}</div>
			</div>
		</div>
	</main>
)

export default Main
