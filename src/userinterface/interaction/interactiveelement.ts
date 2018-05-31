import { IContextual } from './../contextual/contextual.js';
import IContextAction from '../contextual/contextaction.js';
import IDragable from '../dragdrop/draggable.js';
import { DataTransferTypes } from './datatransfertypes.js';
import IUserAction from '../../useractions/useraction.js';
import { ICopyable } from '../../useractions/clipboard/copyable.js';
import HelloWorldAction from '../../useractions/helloworldaction.js';

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
export interface IInteractiveElement extends IDragable, IContextual {
	/**
	 * Used for drag and drop, copy + paste actions
	 */
	GetDataTransfer(): DataTransfer;
}

export class InteractiveElement implements IInteractiveElement {
	constructor(public text: string) {

	}

	GetContextActions(): IContextAction[] {
		let actions: IContextAction[] = [];
		let helloWorldAction: IContextAction = {
			Name: "say hello",
			Action: new HelloWorldAction(),
			ActionList: null
		}
		actions.push(helloWorldAction);
		return actions;
	}

	// TODO -- "Drag" needs to populate a data transfer object, so it would make more sense to take one in here
	GetDataTransfer(): DataTransfer {
		let data = new DataTransfer();
		data.setData(DataTransferTypes.Text, this.text);
		return data;
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