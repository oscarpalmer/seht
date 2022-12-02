import {Seht} from './index';

function dispatchEvents(elements: HTMLElement[], events: string | DispatchObject | Array<string | DispatchObject>) {
	const extended = getExtendedDispatches(events);

	for (const event of extended) {
		for (const element of elements) {
			if (typeof event === 'string') {
				element.dispatchEvent(new Event(event));
			} else {
				element.dispatchEvent(new CustomEvent(event.name, {
					detail: event.data,
				}));
			}
		}
	}

	return null;
}

export type DispatchObject = {
	data: any;
	name: string;
}

export type EventObject = {
	listener: (event: Event) => void;
	options?: boolean | AddEventListenerOptions | EventListenerOptions;
};

type ExtendedEventObject = {
	name: string;
} & EventObject;

export type EventObjects = Record<string, EventObject>;

export class Events {
	constructor(private readonly seht: Seht) {}

	add(events: EventObjects): Seht {
		return setEvents(this.seht.elements, events, true) ?? this.seht;
	}

	dispatch(events: string | DispatchObject | Array<string | DispatchObject>): Seht {
		return dispatchEvents(this.seht.elements, events) ?? this.seht;
	}

	remove(events: EventObjects): Seht {
		return setEvents(this.seht.elements, events, false) ?? this.seht;
	}
}

function getExtendedDispatches(events: string | DispatchObject | Array<string | DispatchObject>) {
	if (typeof events === 'string') {
		return [events];
	}

	if (typeof events !== 'object') {
		return [];
	}

	if (!Array.isArray(events)) {
		return typeof events.name === 'string'
			? [events]
			: [];
	}

	const extended: Array<string | DispatchObject> = [];

	for (const event of events) {
		if (typeof event === 'string') {
			extended.push(event);
		}

		if (typeof event === 'object' && typeof event.name === 'string') {
			extended.push(event);
		}
	}

	return extended;
}

function getExtendedEvents(events: EventObjects): ExtendedEventObject[] {
	const extended: ExtendedEventObject[] = [];

	if (typeof events !== 'object') {
		return extended;
	}

	for (const name in events) {
		const {listener, options} = events[name] ?? {};

		if (typeof listener === 'function') {
			extended.push({listener, name, options});
		}
	}

	return extended;
}

function setEvents(elements: HTMLElement[], events: EventObjects, add: boolean) {
	const method = add
		? 'addEventListener'
		: 'removeEventListener';

	const extended = getExtendedEvents(events);

	for (const event of extended) {
		for (const element of elements) {
			element[method](event.name, event.listener, event.options);
		}
	}

	return null;
}
