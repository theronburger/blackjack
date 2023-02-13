const model = {
	initial: "init",
	states: {
		init: {
			events: {
				Ready: [
					{
						target: "ready",
						conditions: [],
						actions: [],
					},
				],
			},
		},
		ready: {
			onEntry: [
				{
					target: "",
					conditions: [],
					actions: ["returnCards", "shuffleDeck"],
				},
			],
			events: {
				BetAdd: [
					{
						target: "",
						conditions: [],
						actions: ["betAdd"],
					},
				],
				BetSubtract: [
					{
						target: "",
						conditions: ["betAboveZero"],
						actions: ["betSubtract"],
					},
				],
				Deal: [
					{
						target: "round",
						conditions: ["betAboveZero"],
						actions: ["deal"],
					},
				],
			},
		},
		round: {
			onEntry: [
				{
					target: "bust",
					conditions: ["playerBust"],
					actions: [],
				},
			],
			events: {
				Hit: [
					{
						target: "round",
						conditions: [],
						actions: ["addPlayerCard"],
					},
					{
						target: "bust",
						conditions: ["playerBust"],
						actions: ["showBust"],
					},
					{
						target: "blackJack",
						conditions: ["playerBlackJack"],
						actions: ["showBlackJack"],
					},
				],
				Stay: [
					{
						target: "",
						conditions: [],
						actions: ["showDealerCards", "doDealerRound"],
					},
					{
						target: "loose",
						conditions: ["playerLooses"],
						actions: [],
					},
					{
						target: "win",
						conditions: ["playerWins"],
						actions: [],
					},
					{
						target: "push",
						conditions: ["playerTies"],
						actions: [],
					},
				],
			},
		},
		win: {
			onEntry: [
				{
					target: "",
					conditions: [],
					actions: ["payPlayer", "returnBet", "alertWin"],
				},
			],
			events: {
				newGame: [
					{
						target: "ready",
						conditions: [],
						actions: ["hideModal"],
					},
				],
			},
		},
		push: {
			onEntry: [
				{
					target: "",
					conditions: [],
					actions: ["returnBet", "alertPush"],
				},
			],
			events: {
				newGame: [
					{
						target: "ready",
						conditions: [],
						actions: ["hideModal"],
					},
				],
			},
		},
		loose: {
			onEntry: [
				{
					target: "",
					conditions: [],
					actions: ["betToDealer", "alertLoose"],
				},
			],
			events: {
				newGame: [
					{
						target: "ready",
						conditions: [],
						actions: ["hideModal"],
					},
				],
			},
		},
		bust: {
			onEntry: [
				{
					target: "",
					conditions: [],
					actions: ["betToDealer", "alertBust"],
				},
			],
			events: {
				newGame: [
					{
						target: "ready",
						conditions: [],
						actions: ["hideModal"],
					},
				],
			},
		},
	},
	conditions: {
		betAboveZero: () => {
			return tokens.balance("bet") > 0;
		},
		playerBust: () => {
			return cards.tally("player") > 21;
		},
		playerWins: () => {
			const dealerScore = cards.tally("dealer");
			const playerScore = cards.tally("player");
			return (
				dealerScore > 21 ||
				(playerScore <= 21 && playerScore > dealerScore)
			);
		},
		playerTies: () => {
			const dealerScore = cards.tally("dealer");
			const playerScore = cards.tally("player");
			return dealerScore === playerScore;
		},
		playerLooses: () => {
			const dealerScore = cards.tally("dealer");
			const playerScore = cards.tally("player");
			return dealerScore <= 21 && playerScore < dealerScore;
		},
	},
	actions: {
		// actions: ["returnCards", "shuffleDeck"],
		returnCards: () => {
			cards.transferAll("player", "deck");
			cards.transferAll("dealer", "deck");
			cards.items("deck").forEach((card) => {
				card?.el?.addClass("stacked");
				card?.el?.removeClass("flipped");
			});
		},
		shuffleDeck: () => {
			cards.reshuffle("deck");
		},
		betAdd: () => {
			tokens.transfer(1, "pot", "bet");
		},
		betSubtract: () => {
			tokens.transfer(1, "bet", "pot");
		},
		deal: () => {
			cards.transfer(2, "deck", "dealer")[1].el?.toggleClass("flipped");
			cards.items("dealer").forEach((card) => {
				card?.el?.removeClass("stacked");
			});
			cards.transfer(2, "deck", "player");
			cards.items("player").forEach((card) => {
				card?.el?.toggleClass("flipped");
				card?.el?.removeClass("stacked");
			});
		},
		addPlayerCard: () => {
			cards
				.transfer(1, "deck", "player")
				.el.removeClass("stacked")
				.toggleClass("flipped");
		},
		showDealerCards: () => {
			cards.items("dealer").forEach((card) => {
				if (!card.el.hasClass("flipped")) {
					card.el.toggleClass("flipped");
				}
			});
		},
		doDealerRound: () => {
			let dealerCards = cards.items("dealer");
			while (cards.tally("dealer") < 17) {
				cards
					.transfer(1, "deck", "dealer")
					.el.removeClass("stacked")
					.toggleClass("flipped");
			}
		},
		payPlayer: () => {
			console.log(`House pays player ${tokens.balance("bet")}`);
			tokens.transfer(tokens.balance("bet"), "dealer", "pot");
		},
		returnBet: () => {
			console.log(
				`player is returned their bet of ${tokens.balance("bet")}`
			);
			tokens.transfer(tokens.balance("bet"), "bet", "pot");
		},
		betToDealer: () => {
			tokens.transfer(tokens.balance("bet"), "bet", "dealer");
		},
		alertWin: () => {
			$("#modalText").html(
				`Bam, you won ${cards.tally("player")} to ${cards.tally(
					"dealer"
				)} and win ${tokens.balance("bet")}💰`
			);
			setTimeout(() => {
				$(".modal").css("display", "flex");
			}, 250);
		},
		alertLoose: () => {
			$("#modalText").html(
				`Aww, you lost ${cards.tally("player")} to ${cards.tally(
					"dealer"
				)}`
			);
			setTimeout(() => {
				$(".modal").css("display", "flex");
			}, 250);
		},
		alertPush: () => {
			$("#modalText").html(`It's a tie`);
			setTimeout(() => {
				$(".modal").css("display", "flex");
			}, 250);
		},
		alertBust: () => {
			$("#modalText").html(`Oops, you're over 21 and bust!`);
			setTimeout(() => {
				$(".modal").css("display", "flex");
			}, 250);
		},
		hideModal: () => {
			$(".modal").css("display", "none");
		},
	},
};
