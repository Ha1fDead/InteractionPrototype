import IUserAction from "./useraction.js";
// eventually move this to the clipboard store
import ClipboardManager from "../userinterface/clipboard/clipboardmanager.js";
import { ICopyable } from "../userinterface/clipboard/copyable.js";

export default class CopyUserAction implements IUserAction {
	constructor(private clipboardManager: ClipboardManager) {

	}

	Perform(): void {
		this.clipboardManager.OnCopy(null);
	}

	ExampleCopy(copyableElement: ICopyable, clipboardDataStore: ClipboardManager): void {
		let dataTransfer = new DataTransfer();
		copyableElement.PopulateDataTransfer(dataTransfer);
	}
}