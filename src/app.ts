class App {

	Run(): void {
		let canvasElement: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('prototypeCanvas');
		canvasElement.oncut = (event: ClipboardEvent) => { this.HandleCut('canvas', event) }
		canvasElement.onpaste = (event: ClipboardEvent) => { this.HandlePaste('canvas', event) }
		canvasElement.oncopy = (event: ClipboardEvent) => { this.HandleCopy('canvas', event) }

		document.documentElement.oncut = (event: ClipboardEvent) => { this.HandleCut('document', event) }
		document.documentElement.onpaste = (event: ClipboardEvent) => { this.HandlePaste('document', event) }
		document.documentElement.oncopy = (event: ClipboardEvent) => { this.HandleCopy('document', event) }

		// typescript doesn't support navigator.clipboard/permission yet
	}

	private HandleCopy(source: string, event: ClipboardEvent) {
		console.log(`copy from ${source}`, event);
	}

	private HandleCut(source: string, event: ClipboardEvent) {
		console.log(`cut from ${source}`, event);
	}

	private HandlePaste(source: string, event: ClipboardEvent) {
		console.log(`paste from ${source}`, event);
	}
}

let app = new App();
app.Run();