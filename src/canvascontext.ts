import { DraggableDropEffectsTypes, DraggableEffectAllowedTypes, DraggableEffectMoveTypes } from './dragdrop/dragdropdict.js';
import { IInterfaceContext } from "./interfacecontext.js";
import { InterfaceManager } from "./interfacemanager.js";
import { DataTransferTypes } from './datatransfertypes.js';

export class CanvasContext implements IInterfaceContext {
	private pasteHistory: string[] = [];
	constructor(public Id: string, uiManager: InterfaceManager) {
		this.pasteHistory.push("this line AAAA");
		this.pasteHistory.push("this line BBBB");
		this.pasteHistory.push("this line CCCC");
		this.pasteHistory.push("this line DDDD");
		this.pasteHistory.push("this line EEEE");

		let canvas = <HTMLCanvasElement | null>document.getElementById(Id);
		if(canvas === null) {
			throw new Error('Canvas Id could not be bound to the CanvasContext component');
		}
		
		canvas.onmousedown = (ev: MouseEvent) => {
			if(ev.shiftKey) {
				uiManager.OnInternalCopy();
			}
			if(ev.ctrlKey) {
				uiManager.OnInternalCut();
			}
			if(ev.altKey) {
				uiManager.OnInternalPaste();
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
		// typescript does not support -- but it is in the mdn tools
		(<any>canvas).ondragexit = (event: DragEvent) => { this.HandleDragExit(event); };
		uiManager.SubscribeContext(this);
		this.Draw();
	}

    /**
     * The element's custom handled 'Cut' operation
     *
     * This method should REMOVE the element via a command (so the user can undo it) and return a DataTransfer object representing the data entirely so it can be replicated
     */
	HandleCut(): DataTransfer {
		let data = new DataTransfer();
		if(this.pasteHistory.length > 0) {
			let lastItem = <string>this.pasteHistory.pop();
			data.setData(DataTransferTypes.Text, lastItem);
			this.Draw();
		}
		
		return data;
	}

    /**
     * The element's custom handled 'Copy' operation
     *
     * This method should make a copy of the data in a DataTransfer object so it can be replicated at-will from the user
     */
	HandleCopy(): DataTransfer {
		let data = new DataTransfer();
		if(this.pasteHistory.length > 0) {
			data.setData(DataTransferTypes.Text, this.pasteHistory[this.pasteHistory.length-1]);
		}
		return data;
	}

    /**
     * The element's custom handled 'Paste' operation
     *
     * This method should build a "Paste Event" into the command stack so the user can undo this.
     * @param data to be pasted
     */
	HandlePaste(data: DataTransfer): void {
		this.pasteHistory.push(data.getData(DataTransferTypes.Text));
		this.Draw();
	}

	HandleDragOver(event: DragEvent): void {
		if(!event.dataTransfer.types.includes(DataTransferTypes.Text)) {
			console.log('text type was not detected, available types: ', event.dataTransfer.types);
			return;
		}

		event.preventDefault();
		event.dataTransfer.dropEffect = DraggableDropEffectsTypes.Move;
	}

	HandleDrop(event: DragEvent): void {
		if(!DraggableEffectMoveTypes.includes(<DraggableEffectAllowedTypes>event.dataTransfer.effectAllowed)) {
			return;
		}
		if(!event.dataTransfer.types.includes(DataTransferTypes.Text)) {
			return;
		}

		this.pasteHistory.push(event.dataTransfer.getData(DataTransferTypes.Text));
		this.Draw();
	}

	HandleDragStart(event: DragEvent): void {
		if(this.pasteHistory.length === 0) {
			// can't drag
			event.preventDefault();
		}

		event.dataTransfer.setData(DataTransferTypes.Text, this.pasteHistory[this.pasteHistory.length-1]);
		event.dataTransfer.dropEffect = DraggableDropEffectsTypes.Move;
	}
	HandleDragEnd(event: DragEvent): void {
		if(this.pasteHistory.length === 0) {
			return;
		}
		if(event.dataTransfer.dropEffect === DraggableEffectAllowedTypes.None) {
			// event was cancelled
			return;
		}

		if(event.dataTransfer.dropEffect === DraggableDropEffectsTypes.Move) {
			this.pasteHistory.pop();
			this.Draw();
		}
	}
	HandleDragExit(event: DragEvent): void {
		console.log('drag HandleDragExit', event);
	}
	HandleDrag(event: DragEvent): void {
		// Fires a TON
	}
	HandleDragEnter(event: DragEvent): void {
		console.log('ENTERED YO');
		event.dataTransfer.dropEffect = DraggableDropEffectsTypes.Move;
	}
	HandleDragLeave(event: DragEvent): void {
		console.log('LEFT YO');
		event.dataTransfer.dropEffect = DraggableDropEffectsTypes.None;
	}

	private Draw(): void {
		// quick and dirty paste demonstration
		let canvas = <HTMLCanvasElement>document.getElementById(this.Id);
		let canvasCtx = <CanvasRenderingContext2D>canvas.getContext("2d");
		canvasCtx.clearRect(0, 0, 400, 600);
		let idx = 1;
		for (let paste of this.pasteHistory) {
			canvasCtx.fillText(paste, 100, idx * 50, 300);
			idx++;
		}
	}
}