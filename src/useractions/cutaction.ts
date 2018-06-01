import IUserAction from "./useraction.js";
import ClipboardManager from "./clipboard/clipboardmanager.js";

export default class CutUserAction implements IUserAction {
	constructor(private clipboardManager: ClipboardManager) {

	}

	Perform(): void {
		this.clipboardManager.OnContextCut();
	}
}