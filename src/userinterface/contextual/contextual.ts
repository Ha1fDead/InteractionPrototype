import IContextAction from './contextaction.js';

/**
 * Signifies that this renderable object (either in Canvas or HTML) can be "RightClicked"
 * 
 * This would be bound from InterfaceContexts -- they would search for any "IContextual" under the mouse / button / thumb press and load the actions from there
 */
export interface IContextual {
    /**
     * Retrieves the eligible actions that a user can perform on this interactive element
     */
	GetContextActions(): IContextAction[];
}