import { IContextual } from './contextual.js';
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
	private _contextable: IContextual | null;

	constructor() {
		super();

		this._contextable = null;
		var shadow = this.attachShadow({ mode: 'open' });
		shadow.appendChild(template.content.cloneNode(true));
	}

	HandleUserSelectAction(event: MouseEvent): void {
		let action = (<HTMLButtonElement>event.target).value;
		(<IContextual>this._contextable).InvokeAction(action);

		// TODO -- have context manager kill this component, because an item was selected the menu should close
	}

	set contextable(contextable: IContextual) {
		this._contextable = contextable;
		let rootElement = <HTMLUListElement>(<ShadowRoot>this.shadowRoot).querySelector('ul');
		let actions = contextable.GetContextActions();
		for(let action of actions) {
			let listElement = document.createElement('li');
			let buttonElement = document.createElement('button');
			buttonElement.value = action.Name;
			buttonElement.onmousedown = (ev: MouseEvent) => {
				// prevent mouse down so it doesn't change the focus to the context menu
				// context menu doesn't "Get" focus
				ev.preventDefault();
			};
			buttonElement.onclick = (ev: MouseEvent) => { 
				this.HandleUserSelectAction(ev);
			};
			buttonElement.innerText = action.Name;
			listElement.appendChild(buttonElement);
			rootElement.appendChild(listElement);
		}
	}
}

customElements.define('context-menu', ContextMenuElement);