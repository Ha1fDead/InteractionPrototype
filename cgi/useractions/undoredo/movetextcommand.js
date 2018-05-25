export default class MoveTextCommand {
    constructor(sourceIndex, destIndex, text, sourceContext, destContext) {
        this.sourceIndex = sourceIndex;
        this.destIndex = destIndex;
        this.text = text;
        this.sourceContext = sourceContext;
        this.destContext = destContext;
    }
    Do() {
        this.destContext.AddText(this.text, this.destIndex);
        this.sourceContext.RemoveText(this.sourceIndex);
    }
    Undo() {
        this.sourceContext.AddText(this.text, this.sourceIndex);
        this.destContext.RemoveText(this.destIndex);
    }
}
//# sourceMappingURL=movetextcommand.js.map