/**
 * All user actions and interactions that are undoable/redoable are Commands. These should be "Complete", meaning any automatic action
 * that derived from user input (such as a cut and paste) all of it should be undone / redone with the flick of a button.
 * 
 * Implementing classes should hold references to any and all state to restore the State of the application on a whim.
 * 
 * Cut, Paste, Drag and Drop, etc..
 */
export interface ICommand {
	/**
	 * Performs the Command (or "Redoes" the command)
	 */
	Do(): void;

	/**
	 * "Undos" the "Done" action
	 */
	Undo(): void;
}

/**
 * CURRENT PROBLEM:
 * 
 * How to resolve discrepencies with undo / redo between the two clipboards?
 * 
 * E.g.:
 * 
 * 1. User copies and pastes a string of text within the browser context
 * 2. User copies and pastes a string of text within the app context
 * 3. User initiates an undo action (ctrl-z) expecting pasted content in #2 to go away, but #1 actually goes away
 * 
 * Or
 * 
 * 1. User enters text into a form
 * 2. User places several goblins
 * 3. User hits "ctrl-z" / "undo" gesture
 * 
 * #1 AND #2 would undo without careful consideration. The big question:
 * 
 * Does this f'ing matter?
 * 
 * Potential Solutions:
 * 
 * 1. https://dom.spec.whatwg.org/#mutation-observers
 * 2. prevent (known) undo/redos in the browser until a better solution (standardized) comes around
 * 		CAVEAT: cannot prevent "undo" context menu in browser, or "shake" in iOS, among potentially other actions
 * 
 * Problem #2 - On Command Pattern undo/redo, should "Clipboard State" be undone? E.g.:
 * 1. User copies Goblin
 * 2. User pastes Goblin
 * 3. User copies Fighter
 * 4. User pastes Fighter
 * 5. User undoes Fighter paste
 * (Should Goblin be in the paste bin?)
 * 6. User undoes Goblin paste
 * (Should Goblin be in the paste bin?)
 * 
 * Command Pattern Notes:
 * 
 * - The ONLY things that should be able to be undone/redone are VISUAL, PERMANENT, changes.
 * - User should never hit "Undo" and nothing happens
 */