import IDropContainer from "../dragdrop/dropcontainer.js";
import IDragable from "../dragdrop/draggable.js";
import { IContextual } from "../contextual/contextual.js";
import { IInteractiveElement } from "./interactiveelement.js";
import { ICopyable } from "../../useractions/clipboard/copyable.js";
import ICutable from "../../useractions/clipboard/cutable.js";
import IPasteContainer from "../../useractions/clipboard/pastecontainer.js";

/**
 * Interactive Contexts are glue layers to give native functionality to all of my components, such as:
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
export interface IInteractionContext extends IDropContainer, IDragable, ICopyable, IPasteContainer, ICutable, IContextual {
	/**
	 * The Id of the DOM element that you want to bind the InterfaceContext to
	 */
	Id: string;

	/**
	 * Returns the active interactive element, or null if there is none
	 * 
	 * In the future, this will return a "Selection" which contains the interactive element
	 */
	GetActiveSelection(): IInteractiveElement | null;
}