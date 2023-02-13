// @ts-check
/**
 * @typedef {Object} AgentType
 * @property {string} name agent name
 * @property {JQuery} el agent dom element
 * @property {Object} props Object container for custom props
 */
/**
 * @typedef {Array.<AgentType>} AgentsType
 */
/**
 * Generic handler for game items, ie cards or tokens
 * Store item specific props in this.props
 */
class Item {
	/**
	 * @param {AgentType} agent
	 */
	constructor(agent, props = {}) {
		try {
			this._owner = agent.name;
			this._parentEl = agent.el;
			this._parentEl;
			this.cat = [];
		} catch (error) {
			console.error(`Failed to create item for agent:${agent}`);
			return;
		}
		this._props = props;
		this._id = uuid();
		this._el = $(`<div id="${this._id}">📄</div>`);
		if ($(this._parentEl)) {
			$(this._parentEl).append(this._el);
		} else {
			console.error(`Failed to add item to parent for ${this._owner}`);
		}
		// console.log(`created token with id:${this._el.attr("id")}`);
	}
	/**
	 * @returns {JQuery | undefined}
	 */
	get el() {
		return this._el;
	}
	get owner() {
		return this._owner;
	}
	get id() {
		return this._id;
	}
	get props() {
		return this._props;
	}
	set props(props) {
		this._props = props;
	}
	/**
	 * Transfer item ownership to another agent
	 * @param {AgentType} agent
	 * @returns {Item}
	 */
	transfer(agent) {
		// console.log(
		// 	`Transferring token ${this._id} from ${this._owner} to ${agent.name}`
		// );
		// @ts-ignore
		$(this.el).parentToAnimate(agent.el, 500);
		this._owner = agent.name;
		return this;
	}
}
/**
 * Generic handler for game collections, ie cards or tokens
 * @description
 * Populate collection after creation with **manual** call to initAll or
 * add to extended constructor\
 * initAll calls init for each agent in agents\
 * Overwrite init beforehand for custom structures
 */
class Collection {
	/**
	 * @param {AgentsType} agents
	 */
	constructor(agents) {
		if (!agents) {
			console.error("Failed to init, pass agent");
		}
		this._items = [];
		this._agents = agents;
	}
	/**
	 * @param {string} name
	 */
	agent(name) {
		return this._agents.find((agent) => agent.name === name);
	}
	/**
	 * @param {string} name
	 */
	agentExists(name) {
		return this.agent(name) !== undefined;
	}
	/**
	 * @param {AgentType} agent
	 */
	init(agent) {
		console.error(`init not implemented!`);
	}
	initAll() {
		this._agents.forEach((agent) => {
			console.log(`Initing Collection, creating items for ${agent.name}`);
			this.init(agent);
		});
	}
	/**
	 * @param {AgentType} agent
	 */
	create(agent, props = {}) {
		const index = this._items.push(new Item(agent, props)) - 1;
		return this._items[index];
	}
	/**
	 * @param {string} id
	 */
	item(id) {
		return this._items.find((item) => {
			return item.id === id;
		});
	}
	/**
	 * @param {string} agentName
	 */
	items(agentName) {
		return this._items.filter((item) => item.owner === agentName);
	}
	/**
	 * Returns agent balance / item count
	 * @param {string} name
	 * @returns {Number}
	 */
	balance(name) {
		return this._items.reduce(
			(runningTotal, item) =>
				item.owner === name ? runningTotal + 1 : runningTotal,
			0
		);
	}
	/**
	 * Transfers item ownership from one agent to another\
	 * Also does a cute little animation
	 * @param {Number} amount
	 * @param {string} from
	 * @param {string} to
	 * @returns {Item | Array.<Item>} items(s) affected.\
	 * As single item if only one, otherwise as array
	 */
	transfer(amount, from, to) {
		// console.log(`transferring ${amount} from ${from} => ${to}`);
		let transfers = [];
		if (
			Number.isInteger(amount) &&
			amount > 0 &&
			this.agentExists(from) &&
			this.agentExists(to)
		) {
			for (let i = 0; i < amount; i++) {
				const item = this._items.find((item) => {
					return item.owner === from;
				});
				if (item) {
					transfers.push(item.transfer(this.agent(to)));
				} else {
					console.warn(`${from} owns no items`);
				}
			}
		} else {
			console.warn(
				`Failed to transfer ${amount} item(s) from ${from} to ${to} `
			);
		}
		return transfers.length === 1 ? transfers[0] : transfers;
	}

	/**
	 * Transfer ownership of all items to agentName
	 * @param {string} from
	 * @param {string} to
	 */
	transferAll(from, to) {
		this.transfer(this.balance(from), from, to);
	}
}
