export type Selector = string | Node | Node[] | NodeList | NodeListOf<any>;

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

function uniqueFilter<T>(value: T, index: number, array: T[]): boolean {
	return array.indexOf(value) === index;
}
