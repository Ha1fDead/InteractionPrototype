/**
 * Enum representing all of the types for "effectAllowed" properties on DataTransfer object
 */
export enum DraggableDropEffectsTypes {
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