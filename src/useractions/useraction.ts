/**
 * User Actions are the "Default" thing that users can do. These can be actuated:
 * 
 * 1. From the UI as buttons ("Undo" button invokes an "Undo" user action)
 * 2. From the console / text as "/" syntax ("/roll 1d20")
 * 
 * Actions should be self-contained. Some example actions:
 * 
 * 1. Open a window
 * 2. "Attack" an actor
 * 3. Roll a dice
 * 4. Execute a macro (collection of useractions)
 * 
 * Some user actions can be undone and redone. In this way, user actions can push things into the undoredo stack.
 */
export default interface IUserAction {
	// ???
}