export default class RemoveTextCommand {
    constructor(sourceContext, textIndex) {
        this.sourceContext = sourceContext;
        this.textIndex = textIndex;
        this.removedText = null;
    }
    Do() {
        this.removedText = this.sourceContext.RemoveText(this.textIndex);
    }
    Undo() {
        if (this.removedText === null) {
            throw new Error('Invalid command state');
        }
        this.sourceContext.AddText(this.removedText, this.textIndex);
    }
}
//# sourceMappingURL=removetextcommand.js.map