import { ClipboardManager, CanvasContext } from "./clipboard.js";

class App {
	private ClipboardManager: ClipboardManager = new ClipboardManager();

	Run(): void {
		let canvasListener = new CanvasContext('prototypeCanvas');
		this.ClipboardManager.SubscribeContext(canvasListener);
		let canvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('prototypeCanvas');
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

		document.documentElement.oncut = this.ClipboardManager.OnExternalCut;
		document.documentElement.onpaste = this.ClipboardManager.OnExternalPaste;
		document.documentElement.oncopy = this.ClipboardManager.OnExternalCopy;
	}
}

let app = new App();
app.Run();