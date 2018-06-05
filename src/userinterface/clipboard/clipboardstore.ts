import VDataStore from "../../data/store.js";
import { DataTransferTypes } from "../interaction/datatransfertypes.js";

/**
 * Contains an internal reference to the clipboard state. When writing the state it will also attempt to write to the browser's clipboard
 */
export default class ClipboardStore extends VDataStore{
	private _data: DataTransfer | null;

	constructor() {
		super();

		this._data = null;
	}

	get data(): DataTransfer | null {
		return this._data;
	}

	set data(dataTransfer: DataTransfer | null) {
		this._data = dataTransfer;
	}

	async AttemptCopyClipboardData(data: DataTransfer): Promise<void> {
		/**
		 * Note: Chrome does not currently support arbitrary "Write" operations
		 * 
		 * This means this will only support text copy for now. "Write" will probably (hopefully) be implemented within the next year.
		 * 
		 * https://developer.mozilla.org/en-US/docs/Web/Events/paste
		 */
		let clipboard: any = (<any>navigator).clipboard;
		await clipboard.writeText(data.getData(DataTransferTypes.Text));
		// await clipboard.write(data);
	}
}