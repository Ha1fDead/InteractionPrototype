import { CommandStack } from './commands/commandmanager.js';
import { DraggableEffectAllowedTypes } from './dragdrop/dragdropdict.js';
import { InterfaceManager } from "./interfacemanager.js";
import { CanvasContext } from "./canvascontext.js";
import ClipboardManager from './clipboard/clipboardmanager.js';
class App {
    constructor() {
        this.CommandManager = new CommandStack();
        this.InterfaceManager = new InterfaceManager(this.CommandManager);
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