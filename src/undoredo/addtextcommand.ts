import { CanvasContext } from './../canvascontext';
import { ICommand } from './command.js';

export default class AddTextCommand implements ICommand {
	constructor(private sourceContext: CanvasContext, private textToAdd: string, private textIndex: number) {

	}

	Do(): void {
		this.sourceContext.AddText(this.textToAdd, this.textIndex);
	}
	Undo(): void {
		this.sourceContext.RemoveText(this.textIndex);
	}
}