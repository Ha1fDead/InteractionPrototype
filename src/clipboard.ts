export interface IClipboardSubscriber {
	/**
	 * The Id of the DOM element that you want to bind a clipboard to
	 */
	Id: string;

	/**
	 * The element's custom handled 'Cut' operation
	 * 
	 * This method should REMOVE the element via a command (so the user can undo it) and return a DataTransfer object representing the data entirely so it can be replicated
	 */
	HandleCut(): DataTransfer;

	/**
	 * The element's custom handled 'Copy' operation
	 * 
	 * This method should make a copy of the data in a DataTransfer object so it can be replicated at-will from the user
	 */
	HandleCopy(): DataTransfer;

	/**
	 * The element's custom handled 'Paste' operation
	 * 
	 * This method should build a "Paste Event" into the command stack so the user can undo this.
	 * @param data to be pasted
	 */
	HandlePaste(data: DataTransfer): void;
}

enum ClipboardDict {
	Cut = 'cut',
	Copy = 'copy',
	Paste = 'paste'
}

enum DataTransferTypes {
	Text = 'text/plain'
}

export class CanvasListener implements IClipboardSubscriber {
	constructor(public Id: string) {

	}

    /**
     * The element's custom handled 'Cut' operation
     *
     * This method should REMOVE the element via a command (so the user can undo it) and return a DataTransfer object representing the data entirely so it can be replicated
     */
	HandleCut(): DataTransfer {
		let data = new DataTransfer();
		data.setData(DataTransferTypes.Text, 'WOH SOME TEXT HERE');
		return data;
	}
    /**
     * The element's custom handled 'Copy' operation
     *
     * This method should make a copy of the data in a DataTransfer object so it can be replicated at-will from the user
     */
	HandleCopy(): DataTransfer {
		let data = new DataTransfer();
		data.setData(DataTransferTypes.Text, 'WOH SOME TEXT HERE');
		return data;
	}
    /**
     * The element's custom handled 'Paste' operation
     *
     * This method should build a "Paste Event" into the command stack so the user can undo this.
     * @param data to be pasted
     */
	HandlePaste(data: DataTransfer): void {
		console.log(data);
	}
}

/**
 * There should only ever be a single 'Clipboard' object in the entire application. Unlike undo/redo, the clipboard should always reference the same data.
 * 
 * The clipboard manager also allows clipboard operations with non "editablecontent" fields (https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)
 * 
 * Simply add a ClipboardSubscriber to the manager and go from there!
 * 
 * There is some nuance as we cannot completely control the browser's clipboard without explicit user permission. This manager makes interacting with the clipboard easier by abstracting
 * some of the permission nuance. 
 */
export class ClipboardManager {
	private clippedDataTimestamp: number | null;
	private clippedData: DataTransfer | null;
	private ClipboardSubscribers: IClipboardSubscriber[];

	// These functions are meant to be passed by reference, so capture 'this'
	private self = this;

	constructor() {
		this.clippedData = null;
		this.clippedDataTimestamp = null;
		this.ClipboardSubscribers = [];
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
	OnExternalCopy = (event: ClipboardEvent): void => {
		if(event.type !== ClipboardDict.Copy) {
			throw new Error(`Cannot perform ${event.type} action on copy`);
		}

		if(!event.isTrusted) {
			throw new Error('All external clipboard events must be trusted.');
		}

		let subscriber = this.FindActiveClipboardSubscriber();
		if(subscriber === null) {
			return;
		}

		event.preventDefault();
		this.clippedData = subscriber.HandleCopy();
		this.AttemptCopyClipboardData(this.clippedData, event);
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
	 */
	OnInternalCopy(): void {
		let subscriber = this.FindActiveClipboardSubscriber();
		if(subscriber === null) {
			return;
		}

		this.clippedData = subscriber.HandleCopy();
		this.AttemptCopyClipboardData(this.clippedData);
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
	OnExternalCut = (event: ClipboardEvent): void => {
		if(event.type !== ClipboardDict.Cut) {
			throw new Error(`Cannot perform ${event.type} action on cut`);
		}

		if(!event.isTrusted) {
			throw new Error('All external clipboard events must be trusted.');
		}

		let subscriber = this.FindActiveClipboardSubscriber();
		if(subscriber === null) {
			return;
		}
		
		event.preventDefault();
		this.clippedData = subscriber.HandleCut();
		this.AttemptCopyClipboardData(this.clippedData, event);
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
	 */
	OnInternalCut(): void {
		let subscriber = this.FindActiveClipboardSubscriber();
		if(subscriber === null) {
			return;
		}

		this.clippedData = subscriber.HandleCut();
		this.AttemptCopyClipboardData(this.clippedData);
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
	OnExternalPaste = (event: ClipboardEvent): void => {
		if(event.type !== ClipboardDict.Paste) {
			throw new Error(`Cannot perform ${event.type} action on paste`);
		}

		if(!event.isTrusted) {
			throw new Error('All external clipboard events must be trusted.');
		}

		let subscriber = this.FindActiveClipboardSubscriber();
		if(subscriber === null) {
			return;
		}

		let dataToUse: DataTransfer;
		if(this.clippedDataTimestamp === null || this.clippedDataTimestamp < event.timeStamp) {
			dataToUse = event.clipboardData;
		} else {
			dataToUse = <DataTransfer>this.clippedData;
		}

		event.preventDefault();
		subscriber.HandlePaste(dataToUse);
	}

	/**
	 * Internal element triggered paste event
	 * 
	 * Fired: right-click, paste or internal paste buttons
	 * 
	 * Behavior:
	 * 1. User fires action request
	 * 2. Find the component that the paste should be triggered into
	 * 3. Fire a "Paste" action into the command stack with the most-recent "copied" item
	 */
	OnInternalPaste(): void {
		if(this.clippedData == null) {
			return;
		}

		let subscriber = this.FindActiveClipboardSubscriber();
		if(subscriber === null) {
			return;
		}

		subscriber.HandlePaste(this.clippedData);
	}

	Subscribe(subscriber: IClipboardSubscriber): void {
		if(this.ClipboardSubscribers.map(sub => sub.Id).indexOf(subscriber.Id) !== -1) {
			throw new Error('Duplicate subscription');
		}

		this.ClipboardSubscribers.push(subscriber);
	}

	// what happens if this is called twice asynchronously?
	Unsubscribe(subscriber: IClipboardSubscriber): void {
		let index = this.ClipboardSubscribers.indexOf(subscriber);
		this.ClipboardSubscribers.splice(index, 1);
	}

	AttemptCopyClipboardData(data: DataTransfer, event?: ClipboardEvent): void {
		// TODO https://developer.mozilla.org/en-US/docs/Web/Events/paste
	}

	private FindActiveClipboardSubscriber(): IClipboardSubscriber | null {
		let activeElement = document.activeElement;
		let activeElementId = activeElement.id;
		let subscriber = this.ClipboardSubscribers.find(sub => sub.Id === activeElementId);
		if(subscriber === undefined) {
			return null;
		}

		return subscriber;
	}
}