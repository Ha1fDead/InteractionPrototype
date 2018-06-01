import IUserAction from "./useraction.js";
import ClipboardManager from "./clipboard/clipboardmanager.js";

export default class CopyUserAction implements IUserAction {
	constructor(private clipboardManager: ClipboardManager) {

	}

	Perform(): void {
		this.clipboardManager.OnContextCopy();
	}
}