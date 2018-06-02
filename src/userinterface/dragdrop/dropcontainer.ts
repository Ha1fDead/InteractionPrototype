/**
 * Unknowns:
 * 
 * 1. Is "Drop" fired before or after "End"
 * 2. For over/enter/leave, what is the "Drop Zone" and what is the "Dragged" element
 */
export default interface IDropContainer {
	/**
	 * Fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).
	 */
	HandleDragOver(event: DragEvent): void;
	/**
	 * Fired when an element or text selection is dropped on a valid drop target.
	 */
	HandleDrop(event: DragEvent): void;

	/**
	 * Fired when a dragged element or text selection enters a valid drop target.
	 * 
	 * Use this to style either the element being dragged (event source) or the drop target (event target)
	 */
	HandleDragEnter(event: DragEvent): void;
	
	/**
	 * Fired when a dragged element or text selection leaves a valid drop target.
	 * 
	 * Use this to style either the element being dragged (event source) or the drop target (event target)
	 */
	HandleDragLeave(event: DragEvent): void;
}
