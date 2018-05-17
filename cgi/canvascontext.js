import { DraggableDropEffectsTypes, DraggableEffectAllowedTypes, DraggableEffectMoveTypes } from './dragdrop/dragdropdict.js';
import { DataTransferTypes } from './datatransfertypes.js';
import RemoveTextCommand from './commands/removetextcommand.js';
import AddTextCommand from './commands/addtextcommand.js';
export class CanvasContext {
    constructor(Id, uiManager, clipboardManager, commandManager) {
        this.Id = Id;
        this.clipboardManager = clipboardManager;
        this.commandManager = commandManager;
        this.pasteHistory = [];
        this.selectedIndex = null;
        this.pasteHistory.push("this line AAAA");
        this.pasteHistory.push("this line BBBB");
        this.pasteHistory.push("this line CCCC");
        this.pasteHistory.push("this line DDDD");
        this.pasteHistory.push("this line EEEE");
        let canvas = document.getElementById(Id);
        if (canvas === null) {
            throw new Error('Canvas Id could not be bound to the CanvasContext component');
        }
        canvas.onmousedown = (ev) => {
            if (ev.shiftKey) {
                clipboardManager.OnInternalCopy();
            }
            if (ev.ctrlKey) {
                clipboardManager.OnInternalCut();
            }
            if (ev.altKey) {
                clipboardManager.OnInternalPaste();
            }
            let potentialIndex = Math.floor(ev.y / 50);
            if (potentialIndex < this.pasteHistory.length) {
                this.selectedIndex = potentialIndex;
            }
        };
        canvas.ondrop = (event) => { this.HandleDrop(event); };
        canvas.ondragover = (event) => { this.HandleDragOver(event); };
        canvas.ondragenter = (event) => { this.HandleDragEnter(event); };
        canvas.ondragleave = (event) => { this.HandleDragLeave(event); };
        canvas.ondragstart = (event) => { this.HandleDragStart(event); };
        canvas.ondragend = (event) => { this.HandleDragEnd(event); };
        canvas.ondrag = (event) => { this.HandleDrag(event); };
        uiManager.SubscribeContext(this);
        window.requestAnimationFrame((timestamp) => { this.Draw(); });
    }
    AddText(text, index) {
        this.pasteHistory.splice(index, 0, text);
    }
    GetText(index) {
        return this.pasteHistory[index];
    }
    RemoveText(index) {
        return this.pasteHistory.splice(index, 1)[0];
    }
    HandleCut() {
        let data = new DataTransfer();
        if (this.selectedIndex !== null) {
            let text = this.pasteHistory[this.selectedIndex];
            let removeTextCommand = new RemoveTextCommand(this, this.selectedIndex);
            this.commandManager.PerformAction(removeTextCommand, false);
            data.setData(DataTransferTypes.Text, text);
        }
        return data;
    }
    HandleCopy() {
        let data = new DataTransfer();
        if (this.selectedIndex !== null) {
            data.setData(DataTransferTypes.Text, this.GetText(this.selectedIndex));
        }
        return data;
    }
    HandlePaste(data) {
        let textToAdd = data.getData(DataTransferTypes.Text);
        let addTextCommand = new AddTextCommand(this, textToAdd, this.pasteHistory.length);
        this.commandManager.PerformAction(addTextCommand, false);
    }
    HandleDragOver(event) {
        event.preventDefault();
    }
    HandleDrop(event) {
        event.preventDefault();
        if (!DraggableEffectMoveTypes.includes(event.dataTransfer.effectAllowed)) {
            console.log('dropped but the effect is not allowed', event.dataTransfer.effectAllowed);
            return;
        }
        if (!event.dataTransfer.types.includes(DataTransferTypes.Text)) {
            console.log('dropped but the type is not allowed', event.dataTransfer.types);
            return;
        }
        let dropIndex = this.selectedIndex === null ? this.pasteHistory.length : this.selectedIndex;
        let addTextCommand = new AddTextCommand(this, event.dataTransfer.getData(DataTransferTypes.Text), dropIndex);
        this.commandManager.PerformAction(addTextCommand, false);
    }
    HandleDragStart(event) {
        if (this.pasteHistory.length === 0) {
            event.preventDefault();
        }
        let indexToUse = this.selectedIndex === null ? this.pasteHistory.length - 1 : this.selectedIndex;
        event.dataTransfer.setData(DataTransferTypes.Text, this.GetText(indexToUse));
        event.dataTransfer.effectAllowed = DraggableEffectAllowedTypes.All;
        event.dataTransfer.dropEffect = DraggableDropEffectsTypes.Move;
    }
    HandleDragEnd(event) {
        if (this.selectedIndex === null) {
            return;
        }
        if (event.dataTransfer.dropEffect === DraggableEffectAllowedTypes.None) {
            return;
        }
        if (event.dataTransfer.dropEffect === DraggableDropEffectsTypes.Move) {
            let removeTextCommand = new RemoveTextCommand(this, this.selectedIndex);
            this.commandManager.PerformAction(removeTextCommand, true);
        }
    }
    HandleDrag(event) {
    }
    HandleDragEnter(event) {
        if (!event.dataTransfer.types.includes(DataTransferTypes.Text)) {
            console.log('text type was not detected, available types: ', event.dataTransfer.types);
            return;
        }
        event.dataTransfer.dropEffect = DraggableDropEffectsTypes.Move;
    }
    HandleDragLeave(event) {
        event.dataTransfer.dropEffect = DraggableDropEffectsTypes.None;
    }
    Draw() {
        let canvas = document.getElementById(this.Id);
        let canvasCtx = canvas.getContext("2d");
        canvasCtx.fillStyle = "white";
        canvasCtx.clearRect(0, 0, 400, 600);
        for (let x = 0; x < this.pasteHistory.length; x++) {
            if (this.selectedIndex !== null && this.selectedIndex === x) {
                canvasCtx.fillStyle = "green";
                canvasCtx.fillRect(100, (x + 1) * 50 - 25, 300, 25);
            }
            canvasCtx.fillStyle = "black";
            canvasCtx.fillText(this.pasteHistory[x], 100, (x + 1) * 50, 300);
        }
        window.requestAnimationFrame((timestamp) => { this.Draw(); });
    }
}
//# sourceMappingURL=canvascontext.js.map