/**
 * Manages ownership of game tokens / chips\
 * Extends Collection
 */
class Tokens extends Collection {
	/**
	 * @param {AgentsType} agents
	 */
	constructor(agents) {
		super(agents);
		this.initAll();
		this._items.forEach((item) => {
			item.el.html(`💰`);
			item.el.addClass("token");
			item.el.css(
				"--offsetX",
				`${parseInt(item.el.css("left")) + (Math.random() * 50 - 25)}px`
			);
			item.el.css(
				"--offsetY",
				`${parseInt(item.el.css("top")) + (Math.random() * 50 - 25)}px`
			);
			item.el.css("--rotate", `${Math.random() * 30 - 15}deg`);
		});
	}
	/**
	 * Initializes token for agent
	 * @param {AgentType} agent
	 */
	init(agent) {
		for (let i = 0; i < agent.props.count; i++) {
			this.create(agent);
		}
	}
}
