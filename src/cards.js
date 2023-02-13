/**
 * Manages ownership of game cards\
 * Extends Collection
 */
class Cards extends Collection {
	/**
	 * @param {AgentsType} agents
	 */
	constructor(agents) {
		super(agents);
		this.initAll();
	}
	/**
	 * Initializes all items for agent
	 * @param {AgentType} agent
	 */
	init(agent) {
		let cardsInPlay = [];
		for (let i = 0; i < agent.props.decks; i++) {
			cardsInPlay.push(...cardList);
		}
		const shuffledCards = shuffle(shuffle(shuffle(cardsInPlay)));
		// for (let i = shuffledCards.length - 1; i > 0; i--) {
		for (let i = 0; i < shuffledCards.length; i++) {
			const card = shuffledCards[i];
			const item = this.create(agent, card);
			item.el.html(`
				<img
					class="front"
					src="assets/${item.props.name}of${item.props.suite}.png"
				>
				</img>
				<img
					class="back"
					src="assets/back.png"
				>
				</img>
			`);
			item.el.addClass("card");
			item.el.addClass("stacked");
			item.el.css(
				"--offsetX",
				`${parseInt(item.el.css("left")) + (Math.random() * 20 - 10)}px`
			);
			item.el.css(
				"--offsetY",
				`${parseInt(item.el.css("top")) + (Math.random() * 20 - 10)}px`
			);
			item.el.css("--rotate", `${Math.random() * 30 - 15}deg`);
		}
	}

	/**
	 * Reshuffle the order of an agent's cards
	 * @param {string} agentName
	 */
	reshuffle(agentName) {
		// Get all the cards of the agent
		const cards = this._items.filter((item) => item.owner === agentName);

		// Remove all the cards from this._items
		this._items = this._items.filter((item) => item.owner !== agentName);

		// Shuffle the cards
		const shuffledCards = shuffle(shuffle(shuffle(cards)));

		// Add the shuffled cards back to this._items
		this._items.push(...shuffledCards);
	}

	/**
	 * tally the agents cards
	 * @param {string} agentName
	 * @returns {Number}
	 */
	tally(agentName) {
		let runningTally = 0;
		// const agent = this._agents.find((agent) => agent.name === agentName);
		const cards = this._items.filter(
			(/** @type {Item} */ card) => card.owner === agentName
		);
		//tall for all non ace's first
		cards.forEach((/** @type {Item} */ card) => {
			if (card?.props?.name !== "ace") {
				runningTally = runningTally + card?.props?.score;
			}
		});
		//then check which ase state is best
		cards.forEach((/** @type {Item} */ card) => {
			if (card?.props?.name === "ace") {
				if (runningTally + 11 <= 21) {
					runningTally = runningTally + 11;
				} else {
					runningTally = runningTally + 1;
				}
			}
		});
		return runningTally;
	}
}
