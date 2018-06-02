import IUserAction from "./useraction.js";
import ClipboardManager from "../userinterface/clipboard/clipboardmanager.js";
import { ICopyable } from '../userinterface/clipboard/copyable';

export default class CutUserAction implements IUserAction {
	constructor(private clipboardManager: ClipboardManager) {

	}

	Perform(): void {
		this.clipboardManager.OnContextCut();
	}

	ExampleCopy(copyableElement: ICopyable, clipboardDataStore: ClipboardManager): void {
		
	}
}