import { DragDropDict } from './dragdrop/dragdropdict.js';
import { InterfaceManager } from "./interfacemanager.js";
import { CanvasContext } from "./canvascontext.js";

class App {
	private InterfaceManager: InterfaceManager = new InterfaceManager();

	Run(): void {
		let canvasListener1 = new CanvasContext('prototypeCanvas1', this.InterfaceManager);
		let canvasListener2 = new CanvasContext('prototypeCanvas2', this.InterfaceManager);

		let dragElement1 = <HTMLElement>document.getElementById('drag1');
		dragElement1.ondragstart = (dragEvent: DragEvent) => {
			dragEvent.dataTransfer.dropEffect = DragDropDict.Move;
			dragEvent.dataTransfer.setData("text/plain", (<HTMLElement>dragEvent.target).id);
			dragEvent.dataTransfer.setData("text/html", "<p>Example paragraph</p>");
			dragEvent.dataTransfer.setData("text/uri-list", "http://developer.mozilla.org");
		};
		let dragElement2 = <HTMLElement>document.getElementById('drag2');

		document.documentElement.oncut = this.InterfaceManager.OnExternalCut;
		document.documentElement.onpaste = this.InterfaceManager.OnExternalPaste;
		document.documentElement.oncopy = this.InterfaceManager.OnExternalCopy;
		window.ondrop = (event: DragEvent) => {
			// https://stackoverflow.com/questions/6756583/prevent-browser-from-loading-a-drag-and-dropped-file
			// prevent someone from dragging a file onto the page and having the browser load it...
			event.preventDefault();
		};
		window.ondragenter = (event: DragEvent) => {
			// prevent someone from dragging a file onto the page and having the browser load it...
			event.preventDefault();
		};
		window.ondragover = (event: DragEvent) => {
			// prevent someone from dragging a file onto the page and having the browser load it...
			event.preventDefault();
		};
	}
}

let app = new App();
app.Run();