import ITransferable from "../interaction/transferable";

export interface ICopyable extends ITransferable{
	/**
	 * Inserts a copy of the data into the ClipboardStore
	 * @param dataTransfer object to put the copied data into
	 */
	HandleCopy(dataTransfer: DataTransfer): void;
}