import { TouchManager } from './userinterface/touchable/touchmanager.js';
import { DraggableEffectAllowedTypes } from './userinterface/dragdrop/dragdropdict.js';
import { InteractionManager } from "./userinterface/interaction/interactionmanager.js";
import { CanvasContext } from "./userinterface/canvascontext.js";
import ContextManager from './userinterface/contextual/contextmanager.js';
import ClipboardManager from './useractions/clipboard/clipboardmanager.js';
import { IUndoRedoCommandStack, UndoRedoCommandStack } from './useractions/undoredo/undoredocommandmanager.js';

class App {
	private CommandManager: IUndoRedoCommandStack;
	private InterfaceManager: InteractionManager;
	private ClipboardManager: ClipboardManager;
	private ContextManager: ContextManager;
	private TouchManager: TouchManager;

	constructor() {
		this.CommandManager = new UndoRedoCommandStack();
		this.InterfaceManager = new InteractionManager(this.CommandManager);
		this.ContextManager = new ContextManager(this.InterfaceManager);
		this.TouchManager = new TouchManager(this.ContextManager);
		this.ClipboardManager = new ClipboardManager(this.InterfaceManager);
	}

	Run(): void {
		let canvasListener1 = new CanvasContext('prototypeCanvas1', this.InterfaceManager, this.ClipboardManager, this.CommandManager);
		let canvasListener2 = new CanvasContext('prototypeCanvas2', this.InterfaceManager, this.ClipboardManager, this.CommandManager);

		let dragElement1 = <HTMLElement>document.getElementById('drag1');
		dragElement1.ondragstart = (dragEvent: DragEvent) => {
			dragEvent.dataTransfer.effectAllowed = DraggableEffectAllowedTypes.Move;
			dragEvent.dataTransfer.setData("text/plain", (<HTMLElement>dragEvent.target).id);
			dragEvent.dataTransfer.setData("text/html", "<p>Example paragraph</p>");
			dragEvent.dataTransfer.setData("text/uri-list", "http://developer.mozilla.org");
		};
		let dragElement2 = <HTMLElement>document.getElementById('drag2');
	}
}

let app = new App();
app.Run();