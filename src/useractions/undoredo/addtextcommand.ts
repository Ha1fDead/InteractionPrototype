import { CanvasContext } from '../../userinterface/canvascontext.js';
import { IUndoRedoCommand } from './undoredocommand.js';

export default class AddTextCommand implements IUndoRedoCommand {
	constructor(private sourceContext: CanvasContext, private textToAdd: string, private textIndex: number) {

	}

	Do(): void {
		this.sourceContext.AddText(this.textToAdd, this.textIndex);
	}
	Undo(): void {
		this.sourceContext.RemoveText(this.textIndex);
	}
}