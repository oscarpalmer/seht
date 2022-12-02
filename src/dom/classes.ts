import {Seht} from '../index';

function get(names: string[]): string[] {
	return Array.isArray(names)
		? names.filter(name => typeof name === 'string' && name.length > 0)
		: [];
}

function set(type: 'add' | 'remove' | 'toggle', elements: HTMLElement[], names: string[]) {
	const valid = get(names);

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

export class Classes {
	constructor(private readonly seht: Seht) {}

	add(...names: string[]): Seht {
		return set('add', this.seht.elements, names) ?? this.seht;
	}

	has(name: string): boolean {
		return this.seht.elements[0]?.classList.contains(name) ?? false;
	}

	remove(...names: string[]): Seht {
		return set('remove', this.seht.elements, names) ?? this.seht;
	}

	toggle(...names: string[]): Seht {
		return set('toggle', this.seht.elements, names) ?? this.seht;
	}
}
