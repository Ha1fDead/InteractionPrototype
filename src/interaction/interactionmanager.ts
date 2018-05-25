import { IUndoRedoCommandStack } from '../useractions/undoredo/undoredocommandmanager.js';
import { IInteractionContext } from "./interactioncontext.js";
import { DraggableDropEffectsTypes, DraggableEffectAllowedTypes } from "../dragdrop/dragdropdict.js";

export class InteractionManager {
	private InterfaceContexts: IInteractionContext[];

	constructor(private commandStack: IUndoRedoCommandStack) {
		this.InterfaceContexts = [];
		this.init();
	}

	private init(): void {
		window.ondrop = (event: DragEvent) => {
			this.HandleWindowDrag(event);
		};
		window.ondragenter = (event: DragEvent) => {
			this.HandleWindowDrag(event);
		};
		window.ondragover = (event: DragEvent) => {
			this.HandleWindowDrag(event);
		};
		window.onkeyup = (event: KeyboardEvent) => {
			if (event.ctrlKey && event.code === 'KeyZ' && this.commandStack.CanUndo()) {
				this.commandStack.UndoLastAction();
			} else if (event.ctrlKey && event.code === 'KeyY' && this.commandStack.CanRedo()) {
				this.commandStack.RedoAction();
			}
		}
	}

	private HandleWindowDrag(event: DragEvent): void {
		// If the "drop target" is one of our elements, permit it through
		// This allows us to "global permit", while still restricting external file copies
		if(this.InterfaceContexts.map(ctx => ctx.Id).includes((<HTMLElement>event.target).id)) {
			return;
		}
		// https://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
		// prevent someone from dragging a file onto the page and having the browser load it...
		event.dataTransfer.effectAllowed = DraggableEffectAllowedTypes.None;
		event.dataTransfer.dropEffect = DraggableDropEffectsTypes.None;
		event.preventDefault();
	}

	SubscribeContext(context: IInteractionContext): void {
		if(this.InterfaceContexts.map(sub => sub.Id).indexOf(context.Id) !== -1) {
			throw new Error('Duplicate subscription');
		}

		this.InterfaceContexts.push(context);
	}

	// what happens if this is called twice asynchronously?
	UnsubscribeContext(context: IInteractionContext): void {
		let index = this.InterfaceContexts.indexOf(context);
		this.InterfaceContexts.splice(index, 1);
	}

	public FindActiveContext(): IInteractionContext | null {
		// currently I require all contexts to have a tab-index to use active element
		// in the future, I can swap this to have a "Virtual" active context by intercepting all mouse click / tap events and updating the active context accordingly
		let activeElement = document.activeElement;
		let activeElementId = activeElement.id;
		let activeContext = this.InterfaceContexts.find(sub => sub.Id === activeElementId);
		if(activeContext === undefined) {
			return null;
		}

		return activeContext;
	}
}