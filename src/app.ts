import { ClipboardManager, CanvasListener } from "./clipboard.js";

class App {
	private ClipboardManager: ClipboardManager = new ClipboardManager();

	Run(): void {
		let canvasListener = new CanvasListener('prototypeCanvas');
		let canvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('prototypeCanvas');
		// these methods will never be called because the canvas is not "contenteditable"
		canvasElement.oncut = this.ClipboardManager.OnInternalCut;
		canvasElement.onpaste = this.ClipboardManager.OnInternalPaste;
		canvasElement.oncopy = this.ClipboardManager.OnInternalCopy;

		canvasElement.onmousedown = (ev: MouseEvent) => {
			console.log(ev);
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

		document.documentElement.oncut = this.ClipboardManager.OnExternalCut;
		document.documentElement.onpaste = this.ClipboardManager.OnExternalPaste;
		document.documentElement.oncopy = this.ClipboardManager.OnExternalCopy;
	}
}

let app = new App();
app.Run();