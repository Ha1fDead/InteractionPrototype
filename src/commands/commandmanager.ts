import { ICommand } from "./command.js";

export interface ICommandStack {
	PerformAction(command: ICommand): void;

	UndoLastAction(): void;

	RedoAction(): void;

	CanUndo(): boolean;

	CanRedo(): boolean;
}

export class CommandStack implements ICommandStack {
	private CommandHistory: ICommand[] = [];
	private RedoHistory: ICommand[] = [];

	PerformAction(command: ICommand): void {
		this.RedoHistory.length = 0;
		this.CommandHistory.push(command);
		command.Do();
	}
	UndoLastAction(): void {
		if(this.CommandHistory.length <= 0) {
			throw new Error('Cannot undo an action that does not exist');
		}
		let lastCommand = <ICommand>this.CommandHistory.pop();
		this.RedoHistory.push(lastCommand);
		lastCommand.Undo();
	}
	RedoAction(): void {
		if(this.RedoHistory.length <= 0) {
			throw new Error('Cannot redo an action that does not exist');
		}
		
		let nextCommand = <ICommand>this.RedoHistory.pop();
		nextCommand.Do();
		this.CommandHistory.push(nextCommand);
	}
	CanUndo(): boolean {
		return this.CommandHistory.length > 0;
	}
	CanRedo(): boolean {
		return this.RedoHistory.length > 0;
	}
}