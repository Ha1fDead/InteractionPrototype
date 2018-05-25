export interface ICopyable {
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
}