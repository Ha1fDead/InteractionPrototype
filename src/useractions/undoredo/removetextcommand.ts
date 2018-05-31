import { CanvasContext } from '../../userinterface/canvascontext.js';
import { IUndoRedoCommand } from './undoredocommand.js';
export default class RemoveTextCommand implements IUndoRedoCommand {
	private removedText: string | null;
	constructor(private sourceContext: CanvasContext, private textIndex: number) {
		this.removedText = null;
	}

	Do(): void {
		this.removedText = this.sourceContext.RemoveText(this.textIndex);
	}
	Undo(): void {
		if(this.removedText === null) {
			throw new Error('Invalid command state');
		}

		this.sourceContext.AddText(this.removedText, this.textIndex);
	}
}