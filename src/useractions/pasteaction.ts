import IUserAction from "./useraction.js";
import ClipboardManager from "../userinterface/clipboard/clipboardmanager.js";

export default class PasteUserAction implements IUserAction {
	constructor(private clipboardManager: ClipboardManager) {

	}

	Perform(): void {
		this.clipboardManager.OnPaste(null);
	}
}