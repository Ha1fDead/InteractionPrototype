/**
 * Enum representing all of the types for "effectAllowed" properties on DataTransfer object
 */
export enum DraggableDropEffectsTypes {
	/**
	 * Nothing will happen if the dragged element is dropped here
	 */
	None = "none",
	/**
	 * The "Default" drag and drop, no specification, unknown behavior. This appears to only happen in Firefox.
	 */
	Unitialized = "uninitialized",
	/**
	 * The dragged element will be copied into the drop container
	 */
	Copy = "copy",
	/**
	 * The dragged element will be moved into the drop container
	 * (and the previous element should be removed)
	 */
	Move = "move",
	/**
	 * The dragged element will be linked to the drop container
	 */
	Link = "link",
};

export enum DraggableEffectAllowedTypes {
	/**
	 * no operation is permitted
	 */
	None = "none",
	/**
	 * The "Default" drag and drop
	 */
	Unitialized = "uninitialized",
	/**
	 * Copy only is permitted
	 */
	Copy = "copy",
	/**
	 * Move only is permitted
	 */
	Move = "move",
	/**
	 * Link only is permitted
	 */
	Link = "link",
	/**
	 * Copy or Move is permitted
	 */
	CopyMove = "copyMove",
	/**
	 * Copy or Link is permitted
	 */
	CopyLink = "copyLink",
	/**
	 * Link or Move is permitted
	 */
	LinkMove = "linkMove",
	/**
	 * Copy, Link, or Move is permitted
	 */
	All = "all"
};

export const DraggableEffectMoveTypes: DraggableEffectAllowedTypes[] = [
	DraggableEffectAllowedTypes.Move,
	DraggableEffectAllowedTypes.LinkMove,
	DraggableEffectAllowedTypes.CopyMove,
	DraggableEffectAllowedTypes.All
];

export const DraggableEffectCopyTypes: DraggableEffectAllowedTypes[] = [
	DraggableEffectAllowedTypes.All,
	DraggableEffectAllowedTypes.Copy,
	DraggableEffectAllowedTypes.CopyLink,
	DraggableEffectAllowedTypes.CopyMove
];