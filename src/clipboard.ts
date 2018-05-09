interface IClipboardData {

}

/**
 * CURRENT PROBLEM:
 * 
 * How to resolve discrepencies with undo / redo between the two clipboards?
 * 
 * E.g.:
 * 
 * 1. User copies and pastes a string of text within the browser context
 * 2. User copies and pastes a string of text within the app context
 * 3. User initiates an undo action (ctrl-z) expecting pasted content in #2 to go away, but #1 actually goes away
 * 
 * Or
 * 
 * 1. User enters text into a form
 * 2. User places several goblins
 * 3. User hits "ctrl-z" / "undo" gesture
 * 
 * #1 AND #2 would undo without careful consideration. The big question:
 * 
 * Does this f'ing matter?
 * 
 * Potential Solutions:
 * 
 * 1. https://dom.spec.whatwg.org/#mutation-observers
 * 2. prevent (known) undo/redos in the browser until a better solution (standardized) comes around
 * 		CAVEAT: cannot prevent "undo" context menu in browser, or "shake" in iOS
 * 
 * Problem #2 - On Command Pattern undo/redo, should "Clipboard State" be undone? E.g.:
 * 1. User copies Goblin
 * 2. User pastes Goblin
 * 3. User copies Fighter
 * 4. User pastes Fighter
 * 5. User undoes Fighter paste
 * (Should Goblin be in the paste bin?)
 * 6. User undoes Goblin paste
 * (Should Goblin be in the paste bin?)
 * 
 * Command Pattern Notes:
 * 
 * - The ONLY things that should be able to be undone/redone are VISUAL, PERMANENT, changes.
 * - User should never hit "Undo" and nothing happens
 */
class Clipboard {
	private isCutting: boolean;
	private clippedData: IClipboardData | null;

	constructor() {
		this.isCutting = false;
		this.clippedData = null;
	}

	/**
	 * When a browser clipboard copy event is intercepted, check which element has the current focus
	 * If it is the INTERNAL clipboard element, then procede with our app-specific copy rules
	 * Otherwise, let the action persist natively.
	 * 
	 * Fired:  right-click -> `copy`, ctrl-c, etc. in the browser context
	 * 
	 * Behavior:
	 * 1. User fires action request
	 * 2. App checks if any canvas / internal elements have focus. If they don't, exit and let the action persist as normal
	 * 3. The canvas element has focus, check the current "selected" element. If there is no "selected" element and no judgement can be made, exit and let the action persist as normal
	 * 4. Copy the data to both the internal AND external clipboard
	 * 
	 * We copy to both the internal and external buffers so all copy/paste instances are unified.
	 */
	OnExternalCopy(): void {

	}

	/**
	 * Internal Copy is fired when we do not have a browser-specific copy context. 
	 * 
	 * Fired: `right-click -> copy` in a canvas or any other non-native elements that custom clipboard code must be bound to
	 * 
	 * Behavior:
	 * 1. User fires action request
	 * 2. Grab the "Selected" item from the current context
	 * 3. Copy the data into the internal buffer, and ATTEMPT to copy the data into the external buffer
	 * 
	 * After we copy into our INTERNAL clipboard, we want to attempt to persist the copy in the SYSTEM clipboard. This requires external permissions, however.
	 * 
	 * Without these permissions, the UNDESIRABLE workflow could be:
	 * 
	 * 1. User copies text outside of app
	 * 2. User copies text within app (without using browser-level copy like ctrl-c)
	 * 3. User pastes text ouside of app, which is the same text as #1
	 * 
	 * With the permissions, the workflow would be:
	 * 
	 * 1. User copies text outside of app
	 * 2. User copies text within app (without using browser-level copy like ctrl-c)
	 * 3. User pastes text outside of app, which is the same text as #2
	 * 
	 * @param dataReference 
	 */
	OnInternalCopy(dataReference: IClipboardData): void {
		this.clippedData = dataReference;
		this.isCutting = false;
	}

	/**
	 * External browser-controlled cut action.
	 * 
	 * Fired: ctrl-x, right click -> cut
	 * 
	 * Behavior:
	 * 
	 * 1. User fires action request
	 * 2. App checks if any canvas / internal elements have focus. If they don't, exit and let the action persist as normal
	 * 3. The canvas element has focus, check the current "selected" element. If there is no "selected" element and no judgement can be made, exit and let the action persist as normal
	 * 4a. Fire a "Cut" action and push onto the command stack
	 * 4b. Remove the "Selected" element and copy the data to both the internal AND external clipboard
	 * 
	 * We copy to both the internal and external clipboards so all copy/paste instances are unified.
	 */
	OnExternalCut(): void {

	}

	/**
	 * Internal app-controlled cut action.
	 * 
	 * Fired: right click -> cut within app context
	 * 
	 * Behavior:
	 * 
	 * 1. User fires action request
	 * 2. Grab the "selected" element context from the action
	 * 3a. Fire a "Cut" action and push onto the command stack
	 * 3b. Remove the "Selected" element, copy the element into the internal clipboard, and ATTEMPT to copy the element into the external clipboard
	 * 
	 * @param cutData 
	 */
	OnInternalCut(cutData: IClipboardData): void {
		this.clippedData = cutData;
		this.isCutting = true;
	}

	/**
	 * External browser-controlled paste action
	 * 
	 * Fired: ctrl-v, right click -> paste within browser context
	 * 
	 * Behavior:
	 * 
	 * 1. User fires action request
	 * 2. App checks if any canvas / internal elements have focus. If they don't, exit and let the action persist as normal
	 * 3. The canvas element has focus, check the current "selected" element. If there is no "selected" element and no judgement can be made, exit and let the action persist as normal
	 * 4. Fire a "Paste" action into the command stack with the most-recent "copied" item
	 * 
	 * There is a nuance between the two buffers and "paste". If we DON'T have permission to asynchronously control the buffer, there can be two different sets of data in the "paste" context. Example:
	 * 
	 * 1. User uses browser context to "Copy" a string of data at T:00
	 * 2. User uses app context to "Copy" a string of data at T:10
	 * 3. User fires an external "Paste" request that can be bound to a context
	 * 
	 * The data that SHOULD be bound would be data #2.
	 */
	OnExternalPaste(): void {

	}

	OnInternalPaste(): void {
		if(this.isCutting) {
			// must delete old data reference
			this.isCutting = false;
		}
	}
}