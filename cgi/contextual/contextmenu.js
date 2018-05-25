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
    connectedCallback() {
    }
    set actions(actions) {
        let rootElement = this.shadowRoot.querySelector("ul");
        for (let action of actions) {
            let listElement = document.createElement('li');
            let buttonElement = document.createElement('button');
            buttonElement.onclick = action.Action.Perform;
            buttonElement.innerText = action.Name;
            listElement.appendChild(buttonElement);
            rootElement.appendChild(listElement);
        }
    }
}
customElements.define('context-menu', ContextMenuElement);
//# sourceMappingURL=contextmenu.js.map