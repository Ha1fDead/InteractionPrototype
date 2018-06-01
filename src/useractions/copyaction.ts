import IUserAction from "./useraction";
import ClipboardManager from "./clipboard/clipboardmanager";

export default class CopyUserAction implements IUserAction {
	constructor(private clipboardManager: ClipboardManager) {

	}

	Perform(): void {
		this.clipboardManager.OnContextCopy();
	}
}