import { ICommandStack, CommandStack } from './commands/commandmanager.js';
import { DraggableEffectAllowedTypes } from './dragdrop/dragdropdict.js';
import { InteractionManager } from "./interactionmanager.js";
import { CanvasContext } from "./canvascontext.js";
import ClipboardManager from './clipboard/clipboardmanager.js';

class App {
	private CommandManager: ICommandStack;
	private InterfaceManager: InteractionManager;
	private ClipboardManager: ClipboardManager;

	constructor() {
		this.CommandManager = new CommandStack();
		this.InterfaceManager = new InteractionManager(this.CommandManager);
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