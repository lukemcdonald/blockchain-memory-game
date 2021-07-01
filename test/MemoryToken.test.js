const { assert } = require('chai')

const MemoryToken = artifacts.require('./MemoryToken.sol')

require('chai').use(require('chai-as-promised')).should()

contract('Memory Token', (accounts) => {
	let _test
	let token

	before(async () => {
		_test = {
			token: {
				name: 'Memory Token',
				symbol: 'MEMORY',
				uri: 'https://test.com/nft',
			},
		}

		token = await MemoryToken.deployed()
	})

	describe('Deployment', async () => {
		it('deploys successfully', async () => {
			assert.notEqual(token.address, 0x0 || '' || null || undefined)
		})

		it('has a name', async () => {
			const name = await token.name()
			assert.equal(name, _test.token.name)
		})

		it('has a symbol', async () => {
			const symbol = await token.symbol()
			assert.equal(symbol, _test.token.symbol)
		})
	})

	describe('Token distribution', async () => {
		let result

		it('mint tokens', async () => {
			const [owner] = accounts

			// Mint tokens.
			await token.mint(owner, _test.token.uri)

			// Total supply should increase.
			result = await token.totalSupply()
			assert.equal(result.toString(), '1', 'total supply is correct')

			// Owner blance should increase.
			result = await token.balanceOf(owner)
			assert.equal(result.toString(), '1', 'balance is correct')

			// Owner should own token.
			result = await token.ownerOf('1')
			assert.equal(result.toString(), owner.toString(), 'owner is correct.')

			// Check that owner indeed now owns a token.
			result = await token.tokenOfOwnerByIndex(owner, 0)

			// Owner can see all tokens.
			const balanceOf = await token.balanceOf(owner)
			const tokenIds = []

			for (let index = 0; index < balanceOf; index += 1) {
				const tokenId = await token.tokenOfOwnerByIndex(owner, index)
				tokenIds.push(tokenId.toString())
			}

			assert.equal(
				tokenIds.toString(),
				['1'].toString(),
				'Token IDs are correct'
			)

			const tokenURI = await token.tokenURI('1')
			assert.equal(tokenURI, _test.token.uri)
		})
	})
})
