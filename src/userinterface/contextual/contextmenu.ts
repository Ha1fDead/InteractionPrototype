import IContextAction from "./contextaction.js";
import IUserAction from "../../useractions/useraction";

interface CustomElement {
	connectedCallback(): void;

	disconnectedCallback(): void;

	adoptedCallback(): void;

	attributeChangedCallback(): void;
}

const template = document.createElement('template');
template.innerHTML = `
	<ul>
	</ul>
`;


export default class ContextMenuElement extends HTMLElement {
	constructor() {
		super();

		var shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(template.content.cloneNode(true));
	}

	connectedCallback(): void {
	}

	set actions(actions: IContextAction[]) {
		let rootElement = <HTMLUListElement>(<ShadowRoot>this.shadowRoot).querySelector("ul");
		for(let action of actions) {
			let listElement = document.createElement('li');
			let buttonElement = document.createElement('button');
			buttonElement.onclick = (<IUserAction>action.Action).Perform;
			buttonElement.innerText = action.Name;
			listElement.appendChild(buttonElement);
			rootElement.appendChild(listElement);
		}
	}
}

customElements.define('context-menu', ContextMenuElement);