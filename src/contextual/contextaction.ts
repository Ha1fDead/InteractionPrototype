import IUserAction from "../useractions/useraction.js";

/**
 * A contextual action, which is rendered in the "ContextMenu"
 * 
 * I expect ContextMenus to be nestable, such as:
 * 
 * "Bound Blueprints" -> "Sounds on Hit" -> "Add Sound" -> "Loud Yelling"
 * 
 * The whole tree would be:
 * 
 * 1. Copy
 * 2. Cut
 * 3. Delete
 * 4. Bound Actions
 * 		1. When You're Hit
 * 			A. Change Sound Blueprint (Loud Yelling)
 * 			B. Remove Bound Blueprint (Loud Yelling)
 * 			c. Edit Bound Blueprint (Loud Yelling)
 * 		2. When You Hit
 * 			A. Add Blueprint
 * 				i. Text Yelling
 * 				ii. Loud Yelling
 * 5. View Inventory
 * 6. Cast Spell
 * 7. Attack
 */
export default interface IContextAction {
	/**
	 * The name of the action, which is rendered on the Context Menu
	 */
	Name: string;

	/**
	 * If this action is a single Action, then this is the action that will be performed when "Selected"
	 */
	Action: IUserAction | null;

	/**
	 * If this action is a list of actions, then clicking on it will open another context menu (or dropdown, or radial menu)
	 */
	ActionList: IContextAction[] | null;
}