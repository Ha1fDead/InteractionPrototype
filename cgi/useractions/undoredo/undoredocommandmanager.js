import BundledCommand from "./bundledcommand.js";
export class UndoRedoCommandStack {
    constructor() {
        this.CommandHistory = [];
        this.RedoHistory = [];
    }
    PerformAction(command, bundleLast) {
        this.RedoHistory.length = 0;
        command.Do();
        if (bundleLast) {
            if (this.CommandHistory.length === 0) {
                throw new Error('Cannot bundle a command if there are no commands to bundle!');
            }
            let lastCommand = this.CommandHistory.pop();
            if (typeof lastCommand === typeof BundledCommand) {
                lastCommand.RegisterCommand(command);
                this.CommandHistory.push(lastCommand);
            }
            else {
                let commandBundle = new BundledCommand();
                commandBundle.RegisterCommand(lastCommand);
                commandBundle.RegisterCommand(command);
                this.CommandHistory.push(commandBundle);
            }
        }
        else {
            this.CommandHistory.push(command);
        }
    }
    UndoLastAction() {
        if (this.CommandHistory.length <= 0) {
            throw new Error('Cannot undo an action that does not exist');
        }
        let lastCommand = this.CommandHistory.pop();
        this.RedoHistory.push(lastCommand);
        lastCommand.Undo();
    }
    RedoAction() {
        if (this.RedoHistory.length <= 0) {
            throw new Error('Cannot redo an action that does not exist');
        }
        let nextCommand = this.RedoHistory.pop();
        nextCommand.Do();
        this.CommandHistory.push(nextCommand);
    }
    CanUndo() {
        return this.CommandHistory.length > 0;
    }
    CanRedo() {
        return this.RedoHistory.length > 0;
    }
}
//# sourceMappingURL=undoredocommandmanager.js.map