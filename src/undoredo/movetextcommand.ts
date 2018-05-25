import { ICommand } from "./command";
import { CanvasContext } from "../canvascontext";

export default class MoveTextCommand implements ICommand {
	constructor(
		private sourceIndex: number,
		private destIndex: number,
		private text: string,
		private sourceContext: CanvasContext,
		private destContext: CanvasContext) {

	}

	Do(): void {
		this.destContext.AddText(this.text, this.destIndex);
		this.sourceContext.RemoveText(this.sourceIndex);
	}
	Undo(): void {
		this.sourceContext.AddText(this.text, this.sourceIndex);
		this.destContext.RemoveText(this.destIndex);
	}
}