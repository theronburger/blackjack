/**
 * @typedef {Object} ModelType
 * TODO neaten
 * @param {{ initial: any; states?: { init: { events: { Ready: { target: string; conditions: never[]; actions: never[]; }[]; }; }; ready: { events: { BetAdd: { target: string; conditions: never[]; actions: string[]; }[]; BetSubtract: { target: string; conditions: string[]; actions: string[]; }[]; Deal: { target: string; conditions: string[]; actions: string[]; }[]; }; }; round: { onEntry: {}; events: { BetAdd: { target: string; conditions: never[]; actions: string[]; }[]; Hit: { target: string; conditions: string[]; actions: string[]; }[]; Stay: { target: string; conditions: never[]; actions: never[]; }[]; }; }; }; conditions?: { betAboveZero: () => boolean; }; actions?: { betAdd: () => void; betSubtract: () => void; deal: () => void; }; }} model
 */
/**
 * @typedef {Object} EventType
 * @property {string} target target state
 * @property {Array.<string>} conditions Array of condition function names
 * @property {Array.<string>} actions Array of action function names
 */

class Machine {
	/**
	 * @param {ModelType} model
	 */
	constructor(model) {
		this._model = model;
		this._state = model.initial;
		console.log(`⚙️ Machine is up, state is ${this._state}`);
	}
	get state() {
		return this._state;
	}
	/**
	 * @returns {Array.<EventType>}
	 */
	get eventsAvailable() {
		return this._model.states[this._state].events;
	}
	/**
	 * Evaluate a "condition" function and return the result
	 * @param {string} conditionName
	 * @returns {boolean}
	 */
	_checkCondition(conditionName) {
		let met;
		const condition = this._model?.conditions[conditionName];
		// If the condition exists, evaluate it
		if (condition !== undefined) {
			met = condition();
			console.log(`Condition ${conditionName} evaluated as ${met}`);
		} else {
			console.log(`Condition ${conditionName} not found in model`);
		}
		return met;
	}
	/**
	 * Do a model action based on its name
	 * @param {string} actionName
	 */
	_doAction(actionName) {
		console.log(`Executing action ${actionName} `);
		const action = this._model?.actions[actionName];
		if (action !== undefined) {
			action();
		} else {
			console.log(`Condition ${actionName} not found in model`);
		}
	}
	/**
	 * Handles an event and returns true on transition (not result of conditions met!)
	 * @param {{ conditions: Array.<string>; actions: Array.<string>; target: string; }} event
	 * @returns {boolean}
	 */
	_handleEvent(event) {
		let met = true; //Assume true, as an empty condition array logically seems like 'no conditions'
		let causesTransition = false;
		//If there are conditions, check them
		if (event?.conditions?.length !== undefined) {
			event.conditions.forEach(
				(/** @type {string} */ conditionName) =>
					(met = met && this._checkCondition(conditionName))
			);
		}
		console.log(`Conditions ${met ? "" : "not"} met`);
		// If there are actions, run them
		if (met && event?.actions?.length !== undefined) {
			event.actions.forEach((/** @type {string} */ actionName) =>
				this._doAction(actionName)
			);
		}
		//If transition allowed and there is a target
		if (met && event.target) {
			//check if it exists
			if (this._model.states[event.target]) {
				//transition
				this._state = event.target;
				causesTransition = true;
				console.log(`Transitioning to ${event.target}.`);
				//if there are any onEntry events, do them
				if (this._model.states[this._state]?.onEntry?.length) {
					this._model.states[this._state].onEntry.forEach(
						(/** @type {EventType} */ onEntryEvent) => {
							console.log(
								`${event.target} has entry events, doing them`
							);
							this._handleEvent(onEntryEvent);
						}
					);
				}
			} else {
				console.error(`Target ${event.target} does not exist.`);
			}
		} else {
			console.log("Event has no target");
		}
		return causesTransition;
	}
	/**
	 * Try trigger an event on the current state
	 * @param {string} eventName
	 */
	trigger(eventName) {
		console.group(`New Event : ${eventName}`);
		//If state has events
		if (Object.keys(this._model.states[this._state]).length > 0) {
			const event = this.eventsAvailable[eventName];
			//If state has this event
			if (event !== undefined) {
				//for each event object
				//Note, if there are multiple exit targets, the first with its conditions met will be taken
				event.every((/** @type {EventType} */ exit) => {
					//New knowledge: Array.every stops on the return of false https://stackoverflow.com/questions/2641347/short-circuit-array-foreach-like-calling-break
					return !this._handleEvent(exit);
				});
			} else {
				console.warn(
					`Current state '${this._state}' has no event '${eventName}'`
				);
			}
		} else {
			console.warn(`Current state '${eventName}' has no events`);
		}
		console.groupEnd();
	}
}
