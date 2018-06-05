import { ICopyable } from './copyable';

export default interface ICutable extends ICopyable {
	/**
	 * Will make a copy of this element into the clipboard, and then remove this element from the relevant Store
	 * @param dataTransfer object to put the copy of the Cut contents into
	 */
	HandleCut(dataTransfer: DataTransfer): void;
}