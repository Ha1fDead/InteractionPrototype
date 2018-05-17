export default class AddTextCommand {
    constructor(sourceContext, textToAdd, textIndex) {
        this.sourceContext = sourceContext;
        this.textToAdd = textToAdd;
        this.textIndex = textIndex;
    }
    Do() {
        this.sourceContext.AddText(this.textToAdd, this.textIndex);
    }
    Undo() {
        this.sourceContext.RemoveText(this.textIndex);
    }
}
//# sourceMappingURL=addtextcommand.js.map