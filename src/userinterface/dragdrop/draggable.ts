import ITransferable from "../interaction/transferable";

/**
 * Something that can invoke Dragable actions from the Browser. Generally avoid this interface, and use DragableElement instead.
 * 
 * They are separated because of the Transferable interface -- you can't "Get a Canvas's Transferable" directly, but can invoke a canvas's "HandleDragStart".
 * 
 * Note: MDN defines an "OnDragExit" that is only supported in Firefox
 */
export default interface IDragable {
	/**
	 * Fired when the user starts dragging an element or text selection. (See Starting a Drag Operation.)
	 * 
	 * Does not fire from system-level drags (e.g. desktop files)
	 */
	HandleDragStart(event: DragEvent): void;

	/**
	 * Fired when a drag operation is being ended (for example, by releasing a mouse button or hitting the escape key)
	 * 
	 * Does not fire from system-level drags (e.g. desktop files)
	 */
	HandleDragEnd(event: DragEvent): void;

	/**
	 * Fired when an element or text selection is being dragged.
	 * 
	 * Potentially continuous, and fires every "couple hundred of MS"
	 */
	HandleDrag(event: DragEvent): void;
}

/**
 * A dragable element. Generally, use this interface everywhere you intend to actually "Drag Something"
 */
export interface IDragableElement extends IDragable, ITransferable {

}