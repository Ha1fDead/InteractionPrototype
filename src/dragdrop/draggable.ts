
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
	 * Fired when an element is no longer the drag operation's immediate selection target.
	 */
	HandleDragExit(event: DragEvent): void;

	/**
	 * Fired when an element or text selection is being dragged.
	 * 
	 * Potentially continuous, and fires every "couple hundred of MS"
	 */
	HandleDrag(event: DragEvent): void;
}