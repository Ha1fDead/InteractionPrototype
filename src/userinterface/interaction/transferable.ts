export default interface ITransferable {
	/**
	 * Used for drag and drop, copy + paste actions
	 */
	PopulateDataTransfer(dataTransfer: DataTransfer): void;
}