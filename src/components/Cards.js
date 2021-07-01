import React, { useEffect, useState } from 'react'

const CARDS_ARRAY = [
	'fries',
	'cheeseburger',
	'ice-cream',
	'pizza',
	'milkshake',
	'hotdog',
]

const Cards = () => {
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

	const checkForMatch = async () => {
		const [first, second] = cardsChosenId
		const isSelectLimit = cardsChosen.length >= 2
		const currentScore = score + 1

		if (first === second) {
			alert('You have clicked on the same image.')
		} else if (cardsChosen[0] === cardsChosen[1]) {
			alert(`You have found a match!`)
			setCardsWon((prevState) => [...prevState, first, second])
			// setTokenURIs: [prevState => cards[first].src]
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
		}
	}

	useEffect(() => {
		const isChosen = cardsChosen.length >= 2

		if (isChosen) {
			setScore((prevScore) => prevScore + 1)
			setTimeout(checkForMatch, 100)
		}
	}, [cardsChosen])

	const handleOnClickCard = (event) => {
		const cardId = event.target.getAttribute('data-id')

		if (!cardsWon.includes(cardId)) {
			flipCard(cardId)
		}
	}

	const loadCardData = () => {
		const data = CARDS_ARRAY.map((name) => ({
			name,
			src: `/images/${name}.png`,
		}))

		setCards(data.concat(data).sort(() => 0.5 - Math.random()))
	}

	useEffect(() => {
		loadCardData()
	}, [])

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
