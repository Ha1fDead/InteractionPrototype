import { IUndoRedoCommandStack } from './../../useractions/undoredo/undoredocommandmanager';
import { ICopyable } from './../clipboard/copyable';
import { IDragableElement } from './../dragdrop/draggable';
import { IContextual } from './../contextual/contextual.js';
import IContextAction from '../contextual/contextaction.js';
import { DataTransferTypes } from './datatransfertypes.js';
import IUserAction from '../../useractions/useraction.js';
import HelloWorldAction from '../../useractions/helloworldaction.js';
import ClipboardManager from '../clipboard/clipboardmanager.js';
import ICuttable from '../clipboard/cuttable.js';
import ClipboardStore from '../clipboard/clipboardstore.js';
import RemoveTextCommand from '../../useractions/undoredo/removetextcommand.js';
import TextStore from '../../data/textstore.js';

/**
 * Interactive Elements are the core "Visual" element of the system. Essentially anything that can be "Rendered" in both the Canvas and HTML is an Interactive Item
 * 
 * Examples of Interactive Elements:
 * 
 * 1. Props
 * 2. Items
 * 3. Walls & Tiles
 * 4. Dice
 * 5. Commands
 * 6. Individual Roster Window Entries
 * 
 * These may be structured better in an Entity-Component system, and this component may be made even more generic into the future.
 * 
 * Unknowns:
 * 
 * 1. Should Interactive Elements be Renderable? How would I control how they are rendered from the Canvas and normal HTML components?
 * 		a. ALL interactive Elements are renderable in both the Canvas and HTML. There are no exceptions to this rule
 * 2. Should InteractiveItem be a class or an interface?
 * 3. Should Dragable / Copyable just have functions for "GetDataTransfer"?
 */
export interface IInteractiveElement extends IDragableElement, IContextual, ICopyable, ICuttable {
}

export class InteractiveElement implements IInteractiveElement {
	constructor(public text: string, private clipboardStore: ClipboardStore, private textStore: TextStore, private commandManager: IUndoRedoCommandStack) {

	}

	GetContextActions(): IContextAction[] {
		let copyAction: IContextAction = {
			Name: "Copy",
			ActionList: null
		};
		let cutAction: IContextAction = {
			Name: "Cut",
			ActionList: null
		};
		let actions: IContextAction[] = [
			copyAction,
			cutAction
		];
		return actions;
	}

	HandleCopy(dataTransfer: DataTransfer): void {
		this.PopulateDataTransfer(dataTransfer);
		this.clipboardStore.data = dataTransfer;
	}

	HandleCut(dataTransfer: DataTransfer): void {
		this.HandleCopy(dataTransfer);
		let removeTextCommand = new RemoveTextCommand(this.textStore, this.textStore.GetAllData().indexOf(this.text));
		this.commandManager.PerformAction(removeTextCommand, false);
	}

	InvokeAction(action: string): void {
		switch(action) {
			case "Copy":
				this.HandleCopy(new DataTransfer());
				break;
			case "Cut":
				this.HandleCut(new DataTransfer());
				break;
			default:
				throw new Error("Could not find requested action");
		}
	}

	PopulateDataTransfer(dataTransfer: DataTransfer): void {
		dataTransfer.setData(DataTransferTypes.Text, this.text);
	}

	// should this be a drag behavior?
	// I imagine 99% of my drag operations are going to be identical
	HandleDragStart(event: DragEvent): void {
		throw new Error("Method not implemented.");
	}
	HandleDragEnd(event: DragEvent): void {
		throw new Error("Method not implemented.");
	}
	HandleDrag(event: DragEvent): void {
		throw new Error("Method not implemented.");
	}
}