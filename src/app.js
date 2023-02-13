const machine = new Machine(model);
const tokens = new Tokens(tokenAgents);
const cards = new Cards(cardAgents);

$(() => {
	machine.trigger("Ready");
	$("#btnBetAdd").on("click", (e) => {
		machine.trigger("BetAdd");
	});
	$("#btnBetSubtract").on("click", (e) => {
		machine.trigger("BetSubtract");
	});
	$("#btnDeal").on("click", (e) => {
		machine.trigger("Deal");
	});
	$("#btnHit").on("click", (e) => {
		machine.trigger("Hit");
	});
	$("#btnStay").on("click", (e) => {
		machine.trigger("Stay");
	});
	$("#btnNewGame").on("click", (e) => {
		machine.trigger("newGame");
	});
});
