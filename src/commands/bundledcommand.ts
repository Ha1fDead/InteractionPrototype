import { ICommand } from './command';

export default class BundledCommand implements ICommand {
	private commandsToUndo: ICommand[] = [];

	RegisterCommand(command: ICommand): void {
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