import { ICommandStack } from './commands/commandmanager.js';
import { DraggableDropEffectsTypes, DraggableEffectAllowedTypes, DraggableEffectMoveTypes } from './dragdrop/dragdropdict.js';
import { IInterfaceContext } from "./interfacecontext.js";
import { InterfaceManager } from "./interfacemanager.js";
import { DataTransferTypes } from './datatransfertypes.js';
import RemoveTextCommand from './commands/removetextcommand.js';
import AddTextCommand from './commands/addtextcommand.js';
import ClipboardManager from './clipboard/clipboardmanager.js';

export class CanvasContext implements IInterfaceContext {
	private pasteHistory: string[] = [];
	constructor(public Id: string, uiManager: InterfaceManager, private clipboardManager: ClipboardManager, private commandManager: ICommandStack) {
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
				clipboardManager.OnInternalCopy();
			}
			if(ev.ctrlKey) {
				clipboardManager.OnInternalCut();
			}
			if(ev.altKey) {
				clipboardManager.OnInternalPaste();
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

	public AddText(text: string, index: number) {
		this.pasteHistory.splice(index, 0, text);
	}

	public GetText(index: number) {
		return this.pasteHistory[index];
	}

	public RemoveText(index: number): string {
		return this.pasteHistory.splice(index, 1)[0];
	}

    /**
     * The element's custom handled 'Cut' operation
     *
     * This method should REMOVE the element via a command (so the user can undo it) and return a DataTransfer object representing the data entirely so it can be replicated
     */
	HandleCut(): DataTransfer {
		let data = new DataTransfer();
		if(this.pasteHistory.length > 0) {
			let text = this.pasteHistory[this.pasteHistory.length-1];
			let removeTextCommand = new RemoveTextCommand(this, this.pasteHistory.length-1);
			this.commandManager.PerformAction(removeTextCommand, false);
			data.setData(DataTransferTypes.Text, text);
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
			data.setData(DataTransferTypes.Text, this.GetText(this.pasteHistory.length-1));
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
		let textToAdd = data.getData(DataTransferTypes.Text);
		let addTextCommand = new AddTextCommand(this, textToAdd, this.pasteHistory.length);
		this.commandManager.PerformAction(addTextCommand, false);
	}

	HandleDragOver(event: DragEvent): void {
		// prevent the default as this could cause button clicks
		// also, if the user drops a File into one of these zones the browser will auto-interpret it as a load and change the webpage
		event.preventDefault();
	}

	HandleDrop(event: DragEvent): void {
		event.preventDefault();
		if(!DraggableEffectMoveTypes.includes(<DraggableEffectAllowedTypes>event.dataTransfer.effectAllowed)) {
			console.log('dropped but the effect is not allowed', event.dataTransfer.effectAllowed);
			return;
		}
		if(!event.dataTransfer.types.includes(DataTransferTypes.Text)) {
			console.log('dropped but the type is not allowed', event.dataTransfer.types);
			return;
		}

		let addTextCommand = new AddTextCommand(this, event.dataTransfer.getData(DataTransferTypes.Text), this.pasteHistory.length);
		this.commandManager.PerformAction(addTextCommand, false);
	}

	HandleDragStart(event: DragEvent): void {
		if(this.pasteHistory.length === 0) {
			// can't drag
			event.preventDefault();
		}

		event.dataTransfer.setData(DataTransferTypes.Text, this.GetText(this.pasteHistory.length-1));
		event.dataTransfer.effectAllowed = DraggableEffectAllowedTypes.All;
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
			let removeTextCommand = new RemoveTextCommand(this, this.pasteHistory.length-1);
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

	public Draw(): void {
		// quick and dirty paste demonstration
		let canvas = <HTMLCanvasElement>document.getElementById(this.Id);
		let canvasCtx = <CanvasRenderingContext2D>canvas.getContext("2d");
		canvasCtx.clearRect(0, 0, 400, 600);
		let idx = 1;
		for (let paste of this.pasteHistory) {
			canvasCtx.fillText(paste, 100, idx * 50, 300);
			idx++;
		}

		window.requestAnimationFrame((timestamp: number) => { this.Draw() });
	}
}