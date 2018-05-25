export default interface IPasteable {
	/**
	 * The context's custom handled 'Paste' operation
	 * 
	 * This method should build a "Paste Event" into the command stack so the user can undo this.
	 * @param data to be pasted
	 */
	HandlePaste(data: DataTransfer): void;
}