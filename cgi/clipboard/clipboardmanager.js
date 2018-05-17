import { ClipboardDict } from './clipboarddict.js';
import { DataTransferTypes } from '../datatransfertypes.js';
export default class ClipboardManager {
    constructor(uiManager) {
        this.uiManager = uiManager;
        this.OnClipboardChange = (event) => {
            this.internalClipboardData = event.clipboardData;
        };
        this.internalClipboardData = null;
        document.documentElement.oncut = (event) => { this.OnExternalCut(event); };
        document.documentElement.onpaste = (event) => { this.OnExternalPaste(event); };
        document.documentElement.oncopy = (event) => { this.OnExternalCopy(event); };
    }
    async AttemptReadClipboardData() {
        let clipboard = navigator.clipboard;
        return clipboard.read();
    }
    OnExternalCopy(event) {
        if (event.type !== ClipboardDict.Copy) {
            throw new Error(`Cannot perform ${event.type} action on copy`);
        }
        if (!event.isTrusted) {
            throw new Error('All external clipboard events must be trusted.');
        }
        let activeContext = this.uiManager.FindActiveContext();
        if (activeContext === null) {
            this.internalClipboardData = null;
            return;
        }
        event.preventDefault();
        let ctxCopiedData = activeContext.HandleCopy();
        if (ctxCopiedData.items.length <= 0) {
            return;
        }
        this.internalClipboardData = ctxCopiedData;
        this.AttemptCopyClipboardData(this.internalClipboardData, event);
    }
    OnInternalCopy() {
        let activeContext = this.uiManager.FindActiveContext();
        if (activeContext === null) {
            this.internalClipboardData = null;
            return;
        }
        let ctxCopiedData = activeContext.HandleCopy();
        if (ctxCopiedData.items.length <= 0) {
            return;
        }
        this.internalClipboardData = ctxCopiedData;
        this.AttemptCopyClipboardData(this.internalClipboardData);
    }
    OnExternalCut(event) {
        if (event.type !== ClipboardDict.Cut) {
            throw new Error(`Cannot perform ${event.type} action on cut`);
        }
        if (!event.isTrusted) {
            throw new Error('All external clipboard events must be trusted.');
        }
        let activeContext = this.uiManager.FindActiveContext();
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
    }
    OnInternalCut() {
        let activeContext = this.uiManager.FindActiveContext();
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
    OnExternalPaste(event) {
        if (event.type !== ClipboardDict.Paste) {
            throw new Error(`Cannot perform ${event.type} action on paste`);
        }
        if (!event.isTrusted) {
            throw new Error('All external clipboard events must be trusted.');
        }
        let activeContext = this.uiManager.FindActiveContext();
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
    }
    OnInternalPaste() {
        if (this.internalClipboardData == null) {
            return;
        }
        let activeContext = this.uiManager.FindActiveContext();
        if (activeContext === null) {
            return;
        }
        activeContext.HandlePaste(this.internalClipboardData);
    }
    async AttemptCopyClipboardData(data, event) {
        let clipboard = navigator.clipboard;
        await clipboard.writeText(data.getData(DataTransferTypes.Text));
    }
}
//# sourceMappingURL=clipboardmanager.js.map