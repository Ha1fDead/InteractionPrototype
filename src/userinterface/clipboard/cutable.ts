export default interface ICutable {
	/**
	 * The context's custom handled 'Cut' operation
	 * 
	 * This method should REMOVE the cut item via a command (so the user can undo it) and return a DataTransfer object representing the data entirely so it can be replicated
	 */
	HandleCut(): DataTransfer;
}