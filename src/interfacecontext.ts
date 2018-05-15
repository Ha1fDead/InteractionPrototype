import IDroppable from "./dragdrop/droppable.js";
import IDragable from "./dragdrop/draggable.js";
import { ICopyable } from "./clipboard/copyable.js";
import IPasteable from "./clipboard/pasteable.js";

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
export interface IInterfaceContext extends IDroppable, IDragable, ICopyable, IPasteable {
	/**
	 * The Id of the DOM element that you want to bind the InterfaceContext to
	 */
	Id: string;
}