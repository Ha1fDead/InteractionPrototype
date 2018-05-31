export interface ICopyable {
	/**
	 * The context's custom handled 'Copy' operation
	 * 
	 * This method should make a copy of the data in a DataTransfer object so it can be replicated at-will from the user
	 */
	HandleCopy(): DataTransfer;
}