import {setAttributes} from './attributes';
import {Seht} from '../index';

export function getName(original: string): string {
	return `data-${original.replace(/^data-/i, '')}`;
}

function getValue(element: HTMLElement | undefined, name: string) {
	const value = element?.getAttribute(getName(name));

	if (value == null) {
		return value;
	}

	return JSON.parse(value);
}

export class Data {
	constructor(private readonly seht: Seht) {}

	get(name: string) {
		return getValue(this.seht.elements[0], name);
	}

	set(attributes: Record<string, any>): Seht {
		return setAttributes(this.seht.elements, attributes, true) ?? this.seht;
	}
}
