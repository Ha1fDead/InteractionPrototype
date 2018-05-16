import { CanvasContext } from './../canvascontext';
import { ICommand } from './command.js';
export default class RemoveTextCommand implements ICommand {
	private removedText: string | null;
	constructor(private sourceContext: CanvasContext, private textIndex: number) {
		this.removedText = null;
	}

	Do(): void {
		this.removedText = this.sourceContext.RemoveText(this.textIndex);
		this.sourceContext.Draw();
	}
	Undo(): void {
		if(this.removedText === null) {
			throw new Error('Invalid command state');
		}

		this.sourceContext.AddText(this.removedText, this.textIndex);
		this.sourceContext.Draw();
	}
}