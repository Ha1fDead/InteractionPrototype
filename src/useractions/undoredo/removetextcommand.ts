import { IUndoRedoCommand } from './undoredocommand.js';
import TextStore from '../../data/textstore.js';
export default class RemoveTextCommand implements IUndoRedoCommand {
	private removedText: string | null;
	constructor(private textStore: TextStore, private textIndex: number) {
		this.removedText = null;
	}

	Do(): void {
		this.removedText = this.textStore.RemoveData(this.textIndex);
	}
	Undo(): void {
		if(this.removedText === null) {
			throw new Error('Invalid command state');
		}

		this.textStore.InsertData(this.textIndex, this.removedText);
	}
}