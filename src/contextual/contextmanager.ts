import ContextMenuElement from "./contextmenu.js";
import VTouch from "../touchable/vtouch.js";

const ContextMenuId = 'contextmenu';

/**
 * Class is responsible for global context manager support
 */
export default class ContextManager {

	constructor() {
		// this would be moved to the IInterfaceContext
		document.documentElement.oncontextmenu = (ev: MouseEvent) => { this.ContextEvent(ev); };
		// this would be moved to the IInterfaceContext
		document.documentElement.onmouseup = (ev: MouseEvent) => {
			if(this.ShouldClearMenu(ev.target)) {
				this.ClearMenu();
			}
		};
	}

	ShouldClearMenu(target: EventTarget | null): boolean {
		return target == null || (<HTMLElement>target).id !== ContextMenuId;
	}

	ClearMenu(): void {
		let contextMenu = <ContextMenuElement | null>document.getElementById(ContextMenuId);
		if(contextMenu !== null) {
			(<HTMLElement>contextMenu.parentElement).removeChild(contextMenu);
		}
	}

	HandleLongPress(event: VTouch): void {
		if(this.ShouldSpawnContextMenu(event.target)) {
			this.SpawnContextMenu(event.pageX, event.pageY);
		}
	}

	ContextEvent(event: MouseEvent): void {
		if(event.ctrlKey) {
			// let normal context menu proceed
			return;
		}
		event.preventDefault();

		if(this.ShouldSpawnContextMenu(event.target)) {
			this.SpawnContextMenu(event.pageX, event.pageY);
		}
	}

	/**
	 * Given a target element, determines if the context menu should spawn
	 */
	private ShouldSpawnContextMenu(target: EventTarget | null): boolean {
		// Create context menu if the right click is not already on a context menu
		return target !== null && (<HTMLElement>target).id !== ContextMenuId;
	}

	private SpawnContextMenu(positionX: number, positionY: number): void {
		let mainElement = <HTMLElement>document.getElementsByTagName("main")[0];
		let contextMenu = <ContextMenuElement>document.createElement("context-menu");
		contextMenu.id = ContextMenuId;
		contextMenu.style.background = "white";
		contextMenu.style.position = "absolute";
		contextMenu.style.border = "1px solid black";
		contextMenu.style.boxShadow = "4px 4px 4px 0px #bb7474";
		contextMenu.style.top = positionY.toString();
		contextMenu.style.left = positionX.toString();
		mainElement.appendChild(contextMenu);
	}
}