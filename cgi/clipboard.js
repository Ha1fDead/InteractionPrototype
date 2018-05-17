import { ClipboardDict } from "./clipboard/clipboarddict.js";
export var DataTransferTypes;
(function (DataTransferTypes) {
    DataTransferTypes["Text"] = "text/plain";
})(DataTransferTypes || (DataTransferTypes = {}));
export class ClipboardManager {
    constructor() {
        this.OnClipboardChange = (event) => {
            this.internalClipboardData = event.clipboardData;
        };
        this.OnExternalCopy = (event) => {
            if (event.type !== ClipboardDict.Copy) {
                throw new Error(`Cannot perform ${event.type} action on copy`);
            }
            if (!event.isTrusted) {
                throw new Error('All external clipboard events must be trusted.');
            }
            let activeContext = this.FindActiveContext();
            if (activeContext === null) {
                this.internalClipboardData = null;
                return;
            }
            event.preventDefault();
            let ctxCopiedData = activeContext.HandleCut();
            if (ctxCopiedData.items.length <= 0) {
                return;
            }
            this.internalClipboardData = ctxCopiedData;
            this.AttemptCopyClipboardData(this.internalClipboardData, event);
        };
        this.OnExternalCut = (event) => {
            if (event.type !== ClipboardDict.Cut) {
                throw new Error(`Cannot perform ${event.type} action on cut`);
            }
            if (!event.isTrusted) {
                throw new Error('All external clipboard events must be trusted.');
            }
            let activeContext = this.FindActiveContext();
            if (activeContext === null) {
                this.internalClipboardData = null;
                return;
            }
            event.preventDefault();
            let ctxCutData = activeContext.HandleCut();
            if (ctxCutData.items.length <= 0) {
                return;
            }
            this.internalClipboardData = ctxCutData;
            this.AttemptCopyClipboardData(this.internalClipboardData, event);
        };
        this.OnExternalPaste = (event) => {
            if (event.type !== ClipboardDict.Paste) {
                throw new Error(`Cannot perform ${event.type} action on paste`);
            }
            if (!event.isTrusted) {
                throw new Error('All external clipboard events must be trusted.');
            }
            let activeContext = this.FindActiveContext();
            if (activeContext === null) {
                return;
            }
            let dataToUse;
            if (this.internalClipboardData === null) {
                dataToUse = event.clipboardData;
            }
            else {
                dataToUse = this.internalClipboardData;
            }
            event.preventDefault();
            activeContext.HandlePaste(dataToUse);
        };
        this.internalClipboardData = null;
        this.InterfaceContexts = [];
    }
    async AttemptReadClipboardData() {
        let clipboard = navigator.clipboard;
        return clipboard.read();
    }
    OnInternalCopy() {
        let activeContext = this.FindActiveContext();
        if (activeContext === null) {
            this.internalClipboardData = null;
            return;
        }
        let ctxCopiedData = activeContext.HandleCut();
        if (ctxCopiedData.items.length <= 0) {
            return;
        }
        this.internalClipboardData = ctxCopiedData;
        this.AttemptCopyClipboardData(this.internalClipboardData);
    }
    OnInternalCut() {
        let activeContext = this.FindActiveContext();
        if (activeContext === null) {
            this.internalClipboardData = null;
            return;
        }
        let ctxCutData = activeContext.HandleCut();
        if (ctxCutData.items.length <= 0) {
            return;
        }
        this.internalClipboardData = ctxCutData;
        this.AttemptCopyClipboardData(this.internalClipboardData);
    }
    OnInternalPaste() {
        if (this.internalClipboardData == null) {
            return;
        }
        let activeContext = this.FindActiveContext();
        if (activeContext === null) {
            return;
        }
        activeContext.HandlePaste(this.internalClipboardData);
    }
    HandleDragOver(event) {
        let activeContext = this.FindActiveContext();
        if (activeContext === null) {
            return;
        }
        activeContext.HandleDragOver(event);
    }
    HandleDrop(event) {
        let activeContext = this.FindActiveContext();
        if (activeContext === null) {
            return;
        }
        activeContext.HandleDrop(event);
    }
    SubscribeContext(context) {
        if (this.InterfaceContexts.map(sub => sub.Id).indexOf(context.Id) !== -1) {
            throw new Error('Duplicate subscription');
        }
        this.InterfaceContexts.push(context);
    }
    UnsubscribeContext(context) {
        let index = this.InterfaceContexts.indexOf(context);
        this.InterfaceContexts.splice(index, 1);
    }
    async AttemptCopyClipboardData(data, event) {
        let clipboard = navigator.clipboard;
        await clipboard.writeText(data.getData(DataTransferTypes.Text));
    }
    FindActiveContext() {
        let activeElement = document.activeElement;
        let activeElementId = activeElement.id;
        let activeContext = this.InterfaceContexts.find(sub => sub.Id === activeElementId);
        if (activeContext === undefined) {
            return null;
        }
        return activeContext;
    }
}
//# sourceMappingURL=clipboard.js.map