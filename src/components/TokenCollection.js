import React from 'react'

const TokenCollection = ({ tokenURIs }) => (
	<>
		{tokenURIs.map((tokenURI, key) => (
			<img key={key} src={tokenURI} alt="token" />
		))}
	</>
)

export default TokenCollection
