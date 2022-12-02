import {getName} from './data';
import {Seht} from '../index';

type Attribute = {
	name: string;
	value: string | null;
};

function getValid(attributes: Record<string, any>, data: boolean): Attribute[] {
	const valid: Attribute[] = [];

	if (typeof attributes !== 'object' || Array.isArray(attributes)) {
		return valid;
	}

	for (const name in attributes) {
		if (name.length < 1) {
			continue;
		}

		const attributeName = data
			? getName(name)
			: name;

			const attributeValue = attributes[name] == null
			? null
			: (data
				? JSON.stringify(attributes[name])
				: String(attributes[name]));

		valid.push({
			name: attributeName,
			value: attributeValue,
		});
	}

	return valid;
}

export function setAttributes(elements: HTMLElement[], attributes: Record<string, any>, data: boolean) {
	const valid = getValid(attributes, data);

	for (const attribute of valid) {
		const {name, value} = attribute;

		for (const element of elements) {
			if (value == null) {
				element.removeAttribute(name);
			} else {
				element.setAttribute(name, value);
			}
		}
	}

		return null;
}

export class Attributes {
	constructor(private readonly seht: Seht) {}

	get(name: string): string | undefined {
		return this.seht.elements[0]?.getAttribute(name) ?? undefined;
	}

	set(attributes: Record<string, any>): Seht {
		return setAttributes(this.seht.elements, attributes, false) ?? this.seht;
	}
}
