interface CustomElement {
	connectedCallback(): void;

	disconnectedCallback(): void;

	adoptedCallback(): void;

	attributeChangedCallback(): void;
}

// step 1, display absolute and move with mouse

const template = document.createElement('template');
template.innerHTML = `
	<ul>
		<li><button>Action</button></li>
		<li><button>Action</button></li>
		<li><button>Action</button></li>
		<li><button>Action</button></li>
	</ul>
`;


export default class ContextMenuElement extends HTMLElement {
	constructor() {
		super();

		var shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(template.content.cloneNode(true));
	}
}

customElements.define('context-menu', ContextMenuElement);