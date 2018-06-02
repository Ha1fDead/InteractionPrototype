import IUserAction from "./useraction.js";
// eventually move this to the clipboard store
import ClipboardManager from "../userinterface/clipboard/clipboardmanager.js";

export default class CopyUserAction implements IUserAction {
	constructor(private clipboardManager: ClipboardManager) {

	}

	Perform(): void {
		this.clipboardManager.OnContextCopy();
	}
}