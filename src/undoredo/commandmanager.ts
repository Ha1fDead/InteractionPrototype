import { ICommand } from "./command.js";
import BundledCommand from "./bundledcommand.js";

export interface ICommandStack {
	PerformAction(command: ICommand, bundleLast: boolean): void;

	UndoLastAction(): void;

	RedoAction(): void;

	CanUndo(): boolean;

	CanRedo(): boolean;
}

export class CommandStack implements ICommandStack {
	private CommandHistory: ICommand[] = [];
	private RedoHistory: ICommand[] = [];

	PerformAction(command: ICommand, bundleLast: boolean): void {
		this.RedoHistory.length = 0;

		command.Do();
		if(bundleLast) {
			if(this.CommandHistory.length === 0) {
				throw new Error('Cannot bundle a command if there are no commands to bundle!');
			}

			let lastCommand = <ICommand>this.CommandHistory.pop();
			if(typeof lastCommand === typeof BundledCommand) {
				(<BundledCommand>lastCommand).RegisterCommand(command);
				this.CommandHistory.push(lastCommand);
			} else {
				let commandBundle = new BundledCommand();
				commandBundle.RegisterCommand(lastCommand);
				commandBundle.RegisterCommand(command);
				this.CommandHistory.push(commandBundle);
			}
		} else {
			this.CommandHistory.push(command);
		}
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