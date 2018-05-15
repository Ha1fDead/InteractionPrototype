import { DragDropDict } from './dragdrop/dragdropdict.js';
import { ClipboardManager } from "./clipboard.js";
import { CanvasContext } from "./canvascontext.js";

class App {
	private ClipboardManager: ClipboardManager = new ClipboardManager();

	Run(): void {
		let canvasListener1 = new CanvasContext('prototypeCanvas1');
		let canvasListener2 = new CanvasContext('prototypeCanvas2');
		this.ClipboardManager.SubscribeContext(canvasListener1);
		this.ClipboardManager.SubscribeContext(canvasListener2);
		let canvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('prototypeCanvas1');
		canvasElement.onmousedown = (ev: MouseEvent) => {
			if(ev.shiftKey) {
				this.ClipboardManager.OnInternalCopy();
			}
			if(ev.ctrlKey) {
				this.ClipboardManager.OnInternalCut();
			}
			if(ev.altKey) {
				this.ClipboardManager.OnInternalPaste();
			}
		};
		canvasElement.ondrop = (event: DragEvent) => { canvasListener1.HandleDrop(event); };
		canvasElement.ondragover = (event: DragEvent) => { canvasListener1.HandleDragOver(event); };
		let canvasElement2 = <HTMLCanvasElement>document.getElementById('prototypeCanvas2');
		canvasElement2.onmousedown = (ev: MouseEvent) => {
			if(ev.shiftKey) {
				this.ClipboardManager.OnInternalCopy();
			}
			if(ev.ctrlKey) {
				this.ClipboardManager.OnInternalCut();
			}
			if(ev.altKey) {
				this.ClipboardManager.OnInternalPaste();
			}
		};
		canvasElement2.ondrop = (event: DragEvent) => { canvasListener2.HandleDrop(event); };
		canvasElement2.ondragover = (event: DragEvent) => { canvasListener2.HandleDragOver(event); };

		let dragElement1 = <HTMLElement>document.getElementById('drag1');
		dragElement1.ondragstart = (dragEvent: DragEvent) => {
			dragEvent.dataTransfer.dropEffect = DragDropDict.Move;
			dragEvent.dataTransfer.setData("text/plain", (<HTMLElement>dragEvent.target).id);
			dragEvent.dataTransfer.setData("text/html", "<p>Example paragraph</p>");
			dragEvent.dataTransfer.setData("text/uri-list", "http://developer.mozilla.org");
		};
		let dragElement2 = <HTMLElement>document.getElementById('drag2');

		document.documentElement.oncut = this.ClipboardManager.OnExternalCut;
		document.documentElement.onpaste = this.ClipboardManager.OnExternalPaste;
		document.documentElement.oncopy = this.ClipboardManager.OnExternalCopy;
	}
}

let app = new App();
app.Run();