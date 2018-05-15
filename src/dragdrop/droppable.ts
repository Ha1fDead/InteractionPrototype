/**
 * Unknowns:
 * 
 * 1. Is "Drop" fired before or after "End"
 * 2. For over/enter/leave, what is the "Drop Zone" and what is the "Dragged" element
 */
export default interface IDroppable {
	/**
	 * Fired when an element or text selection is being dragged over a valid drop target (every few hundred milliseconds).
	 */
	HandleDragOver(event: DragEvent): void;
	/**
	 * Fired when an element or text selection is dropped on a valid drop target.
	 */
	HandleDrop(event: DragEvent): void;
}
