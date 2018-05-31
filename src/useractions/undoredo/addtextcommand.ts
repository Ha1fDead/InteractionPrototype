import { IUndoRedoCommand } from './undoredocommand.js';
import TextStore from '../../data/textstore.js';

export default class AddTextCommand implements IUndoRedoCommand {
	constructor(private textStore: TextStore, private textToAdd: string, private textIndex: number) {

	}

	Do(): void {
		this.textStore.InsertData(this.textIndex, this.textToAdd);
	}
	Undo(): void {
		this.textStore.RemoveData(this.textIndex);
	}
}