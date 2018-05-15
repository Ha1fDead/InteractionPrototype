import { IInterfaceContext } from "./interfacecontext.js";
import { ClipboardDict } from "./clipboard/clipboarddict.js";

// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Recommended_drag_types
export enum DataTransferTypes {
	Text = 'text/plain'
}

/**
 * There should only ever be a single 'Clipboard' object in the entire application. Unlike undo/redo, the clipboard should always reference the same data.
 * 
 * The clipboard manager also allows clipboard operations with non "editablecontent" fields (https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/contenteditable)
 * 
 * Simply add an InterfaceContext to the manager and go from there!
 * 
 * There is some nuance as we cannot completely control the browser's clipboard without explicit user permission. This manager makes interacting with the clipboard easier by abstracting
 * some of the permission nuance. 
 */
export class ClipboardManager {
	private internalClipboardData: DataTransfer | null;
	private InterfaceContexts: IInterfaceContext[];

	// These functions are meant to be passed by reference, so capture 'this'
	private self = this;

	constructor() {
		this.internalClipboardData = null;
		this.InterfaceContexts = [];
	}

	/**
	 * NOTE: This is unsupported in ALL browsers
	 * https://www.w3.org/TR/clipboard-apis/#clipboard-events-and-interfaces
	 * 
	 * This should fire if a user copies something EXTERNALLY
	 */
	OnClipboardChange = (event: ClipboardEvent): void => {
		// When this is supported, it will solve the "System" -> "Internal" use case
		this.internalClipboardData = event.clipboardData;
	}

	/**
	 * Also solves the "External" -> "Internal" paste problem, but requires browser permissions so not ideal
	 */
	async AttemptReadClipboardData(): Promise<DataTransfer | null> {
		let clipboard: any = (<any>navigator).clipboard;
		return clipboard.read();
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

		let activeContext = this.FindActiveContext();
		if(activeContext === null) {
			// To support External -> Internal paste, I will have to manually convert the copy types
			// Is there a way to do this natively?
			
			// Alternatively, if "OnClipboardChange" fires, that will solve this use case
			this.internalClipboardData = null;
			return;
		}

		event.preventDefault();
		let ctxCopiedData = activeContext.HandleCut();
		if(ctxCopiedData.items.length <= 0) {
			return;
		}
		this.internalClipboardData = ctxCopiedData;
		this.AttemptCopyClipboardData(this.internalClipboardData, event);
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
		let activeContext = this.FindActiveContext();
		if(activeContext === null) {
			this.internalClipboardData = null;
			return;
		}

		let ctxCopiedData = activeContext.HandleCut();
		if(ctxCopiedData.items.length <= 0) {
			return;
		}
		this.internalClipboardData = ctxCopiedData;
		this.AttemptCopyClipboardData(this.internalClipboardData);
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

		let activeContext = this.FindActiveContext();
		if(activeContext === null) {
			this.internalClipboardData = null;
			return;
		}
		
		event.preventDefault();
		let ctxCutData = activeContext.HandleCut();
		if(ctxCutData.items.length <= 0) {
			return;
		}
		this.internalClipboardData = ctxCutData;
		this.AttemptCopyClipboardData(this.internalClipboardData, event);
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
		let activeContext = this.FindActiveContext();
		if(activeContext === null) {
			this.internalClipboardData = null;
			return;
		}

		let ctxCutData = activeContext.HandleCut();
		if(ctxCutData.items.length <= 0) {
			return;
		}
		this.internalClipboardData = ctxCutData;
		this.AttemptCopyClipboardData(this.internalClipboardData);
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

		let activeContext = this.FindActiveContext();
		if(activeContext === null) {
			return;
		}

		let dataToUse: DataTransfer;
		if(this.internalClipboardData === null) {
			dataToUse = event.clipboardData;
		} else {
			dataToUse = <DataTransfer>this.internalClipboardData;
		}
		event.preventDefault();
		activeContext.HandlePaste(dataToUse);
	}

	/**
	 * Internal element triggered paste event.
	 * 
	 * Fired: right-click, paste or internal paste buttons
	 * 
	 * Behavior:
	 * 1. User fires action request
	 * 2. Find the component that the paste should be triggered into
	 * 3. Fire a "Paste" action into the command stack with the most-recent "copied" item
	 */
	OnInternalPaste(): void {
		if(this.internalClipboardData == null) {
			return;
		}

		let activeContext = this.FindActiveContext();
		if(activeContext === null) {
			return;
		}

		activeContext.HandlePaste(this.internalClipboardData);
	}

	/**
	 * Fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).
	 * 
	 * Thing about drag and drop is there is no binding necessary with the browser, except 
	 */
	HandleDragOver(event: DragEvent): void {
		let activeContext = this.FindActiveContext();
		if(activeContext === null) {
			return;
		}

		activeContext.HandleDragOver(event);
	}
	/**
	 * Fired when an element or text selection is dropped on a valid drop target.
	 */
	HandleDrop(event: DragEvent): void {
		let activeContext = this.FindActiveContext();
		if(activeContext === null) {
			return;
		}

		activeContext.HandleDrop(event);
	}

	SubscribeContext(context: IInterfaceContext): void {
		if(this.InterfaceContexts.map(sub => sub.Id).indexOf(context.Id) !== -1) {
			throw new Error('Duplicate subscription');
		}

		this.InterfaceContexts.push(context);
	}

	// what happens if this is called twice asynchronously?
	UnsubscribeContext(context: IInterfaceContext): void {
		let index = this.InterfaceContexts.indexOf(context);
		this.InterfaceContexts.splice(index, 1);
	}

	async AttemptCopyClipboardData(data: DataTransfer, event?: ClipboardEvent): Promise<void> {
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

	private FindActiveContext(): IInterfaceContext | null {
		// currently I require all contexts to have a tab-index to use active element
		// in the future, I can swap this to have a "Virtual" active context by intercepting all mouse click / tap events and updating the active context accordingly
		let activeElement = document.activeElement;
		let activeElementId = activeElement.id;
		let activeContext = this.InterfaceContexts.find(sub => sub.Id === activeElementId);
		if(activeContext === undefined) {
			return null;
		}

		return activeContext;
	}
}