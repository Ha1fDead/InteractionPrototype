import { IUndoRedoCommandStack } from '../useractions/undoredo/undoredocommandmanager.js';
import RemoveTextCommand from '../useractions/undoredo/removetextcommand.js';
import AddTextCommand from '../useractions/undoredo/addtextcommand.js';
import { DraggableDropEffectsTypes, DraggableEffectAllowedTypes, DraggableEffectMoveTypes, DraggableEffectCopyTypes } from './dragdrop/dragdropdict.js';
import { IInteractionContext } from "./interaction/interactioncontext.js";
import { InteractionManager } from "./interaction/interactionmanager.js";
import { DataTransferTypes } from './interaction/datatransfertypes.js';
import ClipboardManager from './clipboard/clipboardmanager.js';
import IContextAction from './contextual/contextaction.js';
import HelloWorldAction from '../useractions/helloworldaction.js';
import { InteractiveElement, IInteractiveElement } from './interaction/interactiveelement.js';
import TextStore from '../data/textstore.js';
import PasteUserAction from '../useractions/pasteaction.js';

export class CanvasContext implements IInteractionContext {
	private selectedIndex: number | null = null;
	private interactiveElements: InteractiveElement[] = [];

	constructor(
		public Id: string,
		uiManager: InteractionManager,
		private clipboardManager: ClipboardManager,
		private commandManager: IUndoRedoCommandStack,
		private textStore: TextStore) {
			
		let canvas = <HTMLCanvasElement | null>document.getElementById(Id);
		if(canvas === null) {
			throw new Error('Canvas Id could not be bound to the CanvasContext component');
		}

		this.subscribeToChanges();
		// are "this" references preserved here?
		this.textStore.AddCallback( () => { this.subscribeToChanges() } );
		
		canvas.onmousedown = (ev: MouseEvent) => {
			if(ev.shiftKey) {
				clipboardManager.OnContextCopy();
			}
			if(ev.ctrlKey) {
				clipboardManager.OnContextCut();
			}
			if(ev.altKey) {
				clipboardManager.OnContextPaste();
			}

			let potentialIndex = Math.floor(ev.y / 50);
			if(potentialIndex < this.interactiveElements.length) {
				this.selectedIndex = potentialIndex;
			} else {
				this.selectedIndex = null;
			}
		};

		// drop controls
		canvas.ondrop = (event: DragEvent) => { this.HandleDrop(event); };
		canvas.ondragover = (event: DragEvent) => { this.HandleDragOver(event); };

		canvas.ondragenter = (event: DragEvent) => { this.HandleDragEnter(event); };
		canvas.ondragleave = (event: DragEvent) => { this.HandleDragLeave(event); };

		canvas.ondragstart = (event: DragEvent) => { this.HandleDragStart(event); };
		canvas.ondragend = (event: DragEvent) => { this.HandleDragEnd(event); };

		canvas.ondrag = (event: DragEvent) => { this.HandleDrag(event); };
		uiManager.SubscribeContext(this);

		window.requestAnimationFrame((timestamp: number) => { this.Draw() });
	}

	private subscribeToChanges() {
		this.interactiveElements.length = 0;
		for(let data of this.textStore.GetAllData()) {
			this.interactiveElements.push(new InteractiveElement(data, this.clipboardManager));
		}
	}

	GetContextActions(): IContextAction[] {
		 let actions: IContextAction[] = [];
		 let pasteAction: IContextAction = {
			 Name: "Paste",
			 Action: new PasteUserAction(this.clipboardManager),
			 ActionList: null
		 };
		 actions.push(pasteAction);
		 return actions;
	}

    /**
     * The element's custom handled 'Cut' operation
     *
     * This method should REMOVE the element via a command (so the user can undo it) and return a DataTransfer object representing the data entirely so it can be replicated
     */

	 // MOVE TO ACTION
	HandleCut(): DataTransfer {
		let data = new DataTransfer();
		let indexToUse = this.selectedIndex === null ? this.interactiveElements.length - 1 : this.selectedIndex;
		let cutElement = this.interactiveElements[indexToUse];
		let removeTextCommand = new RemoveTextCommand(this.textStore, indexToUse);
		this.commandManager.PerformAction(removeTextCommand, false);
		cutElement.PopulateDataTransfer(data);
		return data;
	}

    /**
     * The element's custom handled 'Copy' operation
     *
     * This method should make a copy of the data in a DataTransfer object so it can be replicated at-will from the user
     */
	 // MOVE TO ACTION
	HandleCopy(): DataTransfer {
		let transfer = new DataTransfer();
		if(this.selectedIndex !== null) {
			this.interactiveElements[this.selectedIndex].PopulateDataTransfer(transfer);
		}

		return transfer;
	}

    /**
     * The element's custom handled 'Paste' operation
     *
     * This method should build a "Paste Event" into the command stack so the user can undo this.
     * @param data to be pasted
     */
	 // MOVE TO ACTION
	HandlePaste(data: DataTransfer): void {
		let textToAdd = data.getData(DataTransferTypes.Text);
		let addTextCommand = new AddTextCommand(this.textStore, textToAdd, this.interactiveElements.length);
		this.commandManager.PerformAction(addTextCommand, false);
	}

	HandleDragOver(event: DragEvent): void {
		// prevent the default as this could cause button clicks
		// also, if the user drops a File into one of these zones the browser will auto-interpret it as a load and change the webpage
		event.preventDefault();
	}

	 // MOVE TO ACTION
	HandleDrop(event: DragEvent): void {
		event.preventDefault();
		let dropEffectAllowed = <DraggableEffectAllowedTypes>event.dataTransfer.effectAllowed;
		if(!DraggableEffectMoveTypes.includes(dropEffectAllowed)
		&& !DraggableEffectCopyTypes.includes(dropEffectAllowed)) {
			console.log('dropped but the effect is not allowed', event.dataTransfer.effectAllowed);
			return;
		}
		if(!event.dataTransfer.types.includes(DataTransferTypes.Text)) {
			console.log('dropped but the type is not allowed', event.dataTransfer.types);
			return;
		}

		let dropIndex = this.selectedIndex === null ? this.interactiveElements.length : this.selectedIndex;
		let addTextCommand = new AddTextCommand(this.textStore, event.dataTransfer.getData(DataTransferTypes.Text), dropIndex);
		this.commandManager.PerformAction(addTextCommand, false);
	}

	HandleDragStart(event: DragEvent): void {
		if(this.interactiveElements.length === 0) {
			// can't drag
			event.preventDefault();
		}

		let indexToUse = this.selectedIndex === null ? this.interactiveElements.length - 1 : this.selectedIndex;
		this.interactiveElements[indexToUse].PopulateDataTransfer(event.dataTransfer);
		event.dataTransfer.effectAllowed = DraggableEffectAllowedTypes.All;
		event.dataTransfer.dropEffect = DraggableDropEffectsTypes.Move;
	}
	HandleDragEnd(event: DragEvent): void {
		if(event.dataTransfer.dropEffect === DraggableEffectAllowedTypes.None) {
			// event was cancelled
			return;
		}

		let index = this.selectedIndex === null ? this.interactiveElements.length - 1 : this.selectedIndex;
		this.selectedIndex = null;
		if(event.dataTransfer.dropEffect === DraggableDropEffectsTypes.Move) {
			let removeTextCommand = new RemoveTextCommand(this.textStore, index);
			this.commandManager.PerformAction(removeTextCommand, true);
		}
	}
	HandleDrag(event: DragEvent): void {
		// Fires a TON
	}
	HandleDragEnter(event: DragEvent): void {
		if(!event.dataTransfer.types.includes(DataTransferTypes.Text)) {
			console.log('text type was not detected, available types: ', event.dataTransfer.types);
			return;
		}

		event.dataTransfer.dropEffect = DraggableDropEffectsTypes.Move;
	}
	HandleDragLeave(event: DragEvent): void {
		event.dataTransfer.dropEffect = DraggableDropEffectsTypes.None;
	}
	
	GetActiveSelection(): IInteractiveElement | null {
		if(this.selectedIndex !== null) {
			return this.interactiveElements[this.selectedIndex];
		}
		
		return null;
	}

	public Draw(): void {
		// quick and dirty paste demonstration
		let canvas = <HTMLCanvasElement>document.getElementById(this.Id);
		let canvasCtx = <CanvasRenderingContext2D>canvas.getContext("2d");
		canvasCtx.fillStyle = "white";
		canvasCtx.clearRect(0, 0, 400, 600);
		for(let x = 0; x < this.interactiveElements.length; x++) {
			if(this.selectedIndex !== null && this.selectedIndex === x) {
				canvasCtx.fillStyle = "green";
				canvasCtx.fillRect(100, (x+1) * 50 - 25, 300, 25);
			}
			canvasCtx.fillStyle = "black";
			canvasCtx.fillText(this.interactiveElements[x].text, 100, (x+1) * 50, 300);
		}

		window.requestAnimationFrame((timestamp: number) => { this.Draw() });
	}
}