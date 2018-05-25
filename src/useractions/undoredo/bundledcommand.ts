import { IUndoRedoCommand } from './undoredocommand.js';

export default class BundledCommand implements IUndoRedoCommand {
	private commandsToUndo: IUndoRedoCommand[] = [];

	RegisterCommand(command: IUndoRedoCommand): void {
		this.commandsToUndo.push(command);
	}

	Do(): void {
		for(let command of this.commandsToUndo) {
			command.Do();
		}
	}
	Undo(): void {
		for(let command of this.commandsToUndo) {
			command.Undo();
		}
	}
}