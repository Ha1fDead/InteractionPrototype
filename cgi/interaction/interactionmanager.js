import { DraggableDropEffectsTypes, DraggableEffectAllowedTypes } from "../dragdrop/dragdropdict.js";
export class InteractionManager {
    constructor(commandStack) {
        this.commandStack = commandStack;
        this.InterfaceContexts = [];
        this.init();
    }
    init() {
        window.ondrop = (event) => {
            this.HandleWindowDrag(event);
        };
        window.ondragenter = (event) => {
            this.HandleWindowDrag(event);
        };
        window.ondragover = (event) => {
            this.HandleWindowDrag(event);
        };
        window.onkeyup = (event) => {
            if (event.ctrlKey && event.code === 'KeyZ' && this.commandStack.CanUndo()) {
                this.commandStack.UndoLastAction();
            }
            else if (event.ctrlKey && event.code === 'KeyY' && this.commandStack.CanRedo()) {
                this.commandStack.RedoAction();
            }
        };
    }
    HandleWindowDrag(event) {
        if (this.InterfaceContexts.map(ctx => ctx.Id).includes(event.target.id)) {
            return;
        }
        event.dataTransfer.effectAllowed = DraggableEffectAllowedTypes.None;
        event.dataTransfer.dropEffect = DraggableDropEffectsTypes.None;
        event.preventDefault();
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
//# sourceMappingURL=interactionmanager.js.map