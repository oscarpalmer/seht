import {Attributes, Classes, Data, find, Selector} from './dom';
import {Events} from './events';

export class Seht {
	readonly elements: HTMLElement[];

	get attributes(): Attributes {
		return new Attributes(this);
	}

	get classes(): Classes {
		return new Classes(this);
	}

	get data(): Data {
		return new Data(this);
	}

	get events(): Events {
		return new Events(this);
	}

	constructor(selector: Selector, context?: Selector) {
		this.elements = find(selector, context);
	}

	each(callback: (element: HTMLElement, index: number, array: HTMLElement[]) => void): Seht {
		for (const element of this.elements) {
			callback.call(this, element, this.elements.indexOf(element), this.elements);
		}

		return this;
	}

	filter(callback: (element: HTMLElement, index: number, array: HTMLElement[]) => boolean): Seht {
		return new Seht(this.elements.filter(callback));
	}

	map(callback: (element: HTMLElement, index: number, array: HTMLElement[]) => HTMLElement): Seht {
		return new Seht(this.elements.map(callback));
	}
}

export function $(selector: Selector, context?: Selector): Seht {
	return new Seht(selector, context);
}
