/**
 * Interface Contexts are used to bind DOM functionality into virtual elements, such as:
 * 
 * 1. Clipboard copy / cut / paste
 * 2. Local undo/redo (unsupported atm)
 * 3. Drag n Drop
 * 4. Contextual "Tab" to select unique items (unsupported atm)
 * 
 * All "Windows" are InterfaceContexts, but not all "InterfaceContexts" are windows
 * 
 * Example contexts:
 * 
 * 1. Character Sheet (multiple sheets can be loaded at one time)
 * 2. Canvas / Scene (could potentially have multiple scenes open at any time)
 */
export interface IInterfaceContext {
	/**
	 * The Id of the DOM element that you want to bind the InterfaceContext to
	 */
	Id: string;

	/**
	 * The context's custom handled 'Cut' operation
	 * 
	 * This method should REMOVE the cut item via a command (so the user can undo it) and return a DataTransfer object representing the data entirely so it can be replicated
	 */
	HandleCut(): DataTransfer;

	/**
	 * The context's custom handled 'Copy' operation
	 * 
	 * This method should make a copy of the data in a DataTransfer object so it can be replicated at-will from the user
	 */
	HandleCopy(): DataTransfer;

	/**
	 * The context's custom handled 'Paste' operation
	 * 
	 * This method should build a "Paste Event" into the command stack so the user can undo this.
	 * @param data to be pasted
	 */
	HandlePaste(data: DataTransfer): void;
}