import { CanvasContext } from '../../userinterface/canvascontext.js';
import { IUndoRedoCommand } from './undoredocommand.js';
import TextStore from '../../data/textstore.js';

// HOW
export default class MoveTextCommand implements IUndoRedoCommand {
	constructor(
		private sourceIndex: number,
		private destIndex: number,
		private text: string,
		private textStore: TextStore) {

	}

	Do(): void {
		// yes I know this is broken
		this.textStore.InsertData(this.destIndex, this.text);
		this.textStore.RemoveData(this.sourceIndex);
	}
	Undo(): void {
		this.textStore.InsertData(this.sourceIndex, this.text);
		this.textStore.RemoveData(this.destIndex);
	}
}