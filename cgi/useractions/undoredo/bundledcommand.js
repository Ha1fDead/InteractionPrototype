export default class BundledCommand {
    constructor() {
        this.commandsToUndo = [];
    }
    RegisterCommand(command) {
        this.commandsToUndo.push(command);
    }
    Do() {
        for (let command of this.commandsToUndo) {
            command.Do();
        }
    }
    Undo() {
        for (let command of this.commandsToUndo) {
            command.Undo();
        }
    }
}
//# sourceMappingURL=bundledcommand.js.map