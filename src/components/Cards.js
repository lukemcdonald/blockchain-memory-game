import React, { useEffect, useState } from 'react'

import { useBlockchain } from '../context/Blockchain'
import { useToken, actionTypes as tokenActionTypes } from '../context/Token'

const CARD_NAMES = [
	'fries',
	'cheeseburger',
	'ice-cream',
	'pizza',
	'milkshake',
	'hotdog',
]

const Cards = () => {
	const blockchain = useBlockchain()
	const token = useToken()

	const [cards, setCards] = useState([])
	const [cardsChosen, setCardsChosen] = useState([])
	const [cardsChosenId, setCardsChosenId] = useState([])
	const [cardsWon, setCardsWon] = useState([])
	const [score, setScore] = useState(0)

	const getImageSrc = (id) => {
		const cardId = id.toString()
		let src = `${window.location.origin}/images/blank.png`

		if (cardsWon.includes(cardId)) {
			src = `${window.location.origin}/images/white.png`
		} else if (cardsChosenId.includes(cardId)) {
			src = cards[cardId].src
		}

		return src
	}

	const flipCard = (id) => {
		setCardsChosen((prevState) => [...prevState, cards[id].name])
		setCardsChosenId((prevState) => [...prevState, id])
	}

	const resetCards = () => {
		setCardsChosen([])
		setCardsChosenId([])
	}

	const randomizeCards = (_cards) =>
		_cards.concat(_cards).sort(() => 0.5 - Math.random())

	const loadCards = () => {
		const data = CARD_NAMES.map((name) => ({
			name,
			src: `/images/${name}.png`,
		}))

		setCards(randomizeCards(data))
	}

	const checkForMatch = async () => {
		const [first, second] = cardsChosenId
		const isSelectLimit = cardsChosen.length >= 2
		const currentScore = score + 1

		if (first === second) {
			alert('You have clicked on the same image.')
		} else if (cardsChosen[0] === cardsChosen[1]) {
			alert(`You have found a match!`)

			const cardImg = cards[first].src.toString()

			blockchain.state.token.methods
				.mint(blockchain.state.account, window.location.origin + cardImg)
				.send({ from: blockchain.state.account })
				.on('transactionHash', (hash) => {
					setCardsWon((prevState) => [...prevState, first, second])

					token.dispatch({
						type: tokenActionTypes.setTokenURIs,
						value: cardImg,
					})
				})
		} else if (isSelectLimit) {
			alert('Sorry, try again.')
		}

		if (cardsChosen) {
			resetCards()
		}

		if (cards.length - 2 === cardsWon.length) {
			alert(
				`Congratulations, you have found all the matches! Your score is ${currentScore}!`
			)

			setCardsWon([])
			setScore(0)
			loadCards()
		}
	}

	const handleOnClickCard = (event) => {
		const cardId = event.target.getAttribute('data-id')

		if (!cardsWon.includes(cardId)) {
			flipCard(cardId)
		}
	}

	useEffect(() => {
		loadCards()
	}, [])

	useEffect(() => {
		const isChosen = cardsChosen.length >= 2

		if (isChosen) {
			setScore((prevScore) => prevScore + 1)
			setTimeout(checkForMatch, 100)
		}
	}, [cardsChosen])

	return cards.map((card, index) => (
		<button
			key={index}
			type="button"
			className="p-0 border-0"
			onClick={handleOnClickCard}
		>
			<img src={getImageSrc(index)} data-id={index} alt={card.name} />
		</button>
	))
}

export default Cards
