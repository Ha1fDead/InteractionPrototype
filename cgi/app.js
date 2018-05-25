import { TouchManager } from './touchable/touchmanager.js';
import { UndoRedoCommandStack } from './useractions/undoredo/undoredocommandmanager.js';
import { DraggableEffectAllowedTypes } from './dragdrop/dragdropdict.js';
import { InteractionManager } from "./interaction/interactionmanager.js";
import { CanvasContext } from "./canvascontext.js";
import ClipboardManager from './useractions/clipboard/clipboardmanager.js';
import ContextManager from './contextual/contextmanager.js';
class App {
    constructor() {
        this.CommandManager = new UndoRedoCommandStack();
        this.InterfaceManager = new InteractionManager(this.CommandManager);
        this.ContextManager = new ContextManager(this.InterfaceManager);
        this.TouchManager = new TouchManager(this.ContextManager);
        this.ClipboardManager = new ClipboardManager(this.InterfaceManager);
    }
    Run() {
        let canvasListener1 = new CanvasContext('prototypeCanvas1', this.InterfaceManager, this.ClipboardManager, this.CommandManager);
        let canvasListener2 = new CanvasContext('prototypeCanvas2', this.InterfaceManager, this.ClipboardManager, this.CommandManager);
        let dragElement1 = document.getElementById('drag1');
        dragElement1.ondragstart = (dragEvent) => {
            dragEvent.dataTransfer.effectAllowed = DraggableEffectAllowedTypes.Move;
            dragEvent.dataTransfer.setData("text/plain", dragEvent.target.id);
            dragEvent.dataTransfer.setData("text/html", "<p>Example paragraph</p>");
            dragEvent.dataTransfer.setData("text/uri-list", "http://developer.mozilla.org");
        };
        let dragElement2 = document.getElementById('drag2');
    }
}
let app = new App();
app.Run();
//# sourceMappingURL=app.js.map