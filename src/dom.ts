import {Seht} from './index';

type Attribute = {
	name: string;
	value: string | null;
};

export type Selector = string | Node | Node[] | NodeList | NodeListOf<any>;

function getDataAttributeName(original: string): string {
	return `data-${original.replace(/^data-/i, '')}`;
}

function getDataAttributeValue(element: HTMLElement | undefined, name: string) {
	const value = element?.getAttribute(getDataAttributeName(name));

	if (value == null) {
		return value;
	}

	return JSON.parse(value);
}

function getValidAttributes(attributes: Record<string, any>, data: boolean): Attribute[] {
	const valid: Attribute[] = [];

	if (typeof attributes !== 'object' || Array.isArray(attributes)) {
		return valid;
	}

	for (const name in attributes) {
		if (name.length < 1) {
			continue;
		}

		const attributeName = data
			? getDataAttributeName(name)
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

function getValidClassNames(names: string[]): string[] {
	return Array.isArray(names)
		? names.filter(name => typeof name === 'string' && name.length > 0)
		: [];
}

export function find(selector: Selector, context?: Selector): HTMLElement[] {
	if (selector instanceof Node) {
		return [selector]
			.filter(nodeFilter)
			.filter(uniqueFilter) as never;
	}

	if (Array.isArray(selector)) {
		return selector
			.filter(nodeFilter)
			.filter(uniqueFilter) as never;
	}

	if (selector instanceof NodeList) {
		return Array
			.from(selector)
			.filter(nodeFilter)
			.filter(uniqueFilter) as never;
	}

	if (typeof selector !== 'string') {
		return [];
	}

	const contexts = context == null
		? [globalThis.document]
		: find(context);

	const elements: HTMLElement[] = [];

	for (const context of contexts) {
		const found = Array.from(context.querySelectorAll(selector)) as HTMLElement[];

		elements.push(...found);
	}

	return elements
		.filter(nodeFilter)
		.filter(uniqueFilter);
}

function nodeFilter(node: Node): boolean {
	return node.nodeType === 1 || node.nodeType > 8;
}

function setAttributes(elements: HTMLElement[], attributes: Record<string, any>, data: boolean) {
	const valid = getValidAttributes(attributes, data);

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

function setClassNames(type: 'add' | 'remove' | 'toggle', elements: HTMLElement[], names: string[]) {
	const valid = getValidClassNames(names);

	for (const element of elements) {
		if (type === 'toggle') {
			for (const name of names) {
				element.classList.toggle(name);
			}
		} else {
			element.classList[type](...valid);
		}
	}

	return null;
}

function uniqueFilter<T>(value: T, index: number, array: T[]): boolean {
	return array.indexOf(value) === index;
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

export class Classes {
	constructor(private readonly seht: Seht) {}

	add(...names: string[]): Seht {
		return setClassNames('add', this.seht.elements, names) ?? this.seht;
	}

	has(name: string): boolean {
		return this.seht.elements[0]?.classList.contains(name) ?? false;
	}

	remove(...names: string[]): Seht {
		return setClassNames('remove', this.seht.elements, names) ?? this.seht;
	}

	toggle(...names: string[]): Seht {
		return setClassNames('toggle', this.seht.elements, names) ?? this.seht;
	}
}

export class Data {
	constructor(private readonly seht: Seht) {}

	get(name: string) {
		return getDataAttributeValue(this.seht.elements[0], name);
	}

	set(attributes: Record<string, any>): Seht {
		return setAttributes(this.seht.elements, attributes, true) ?? this.seht;
	}
}
