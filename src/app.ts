import { ClipboardManager, CanvasContext } from "./clipboard.js";

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
		canvasElement = <HTMLCanvasElement>document.getElementById('prototypeCanvas2');
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