import ContextManager from "../contextual/contextmanager.js";
import VTouch from "./vtouch.js";

enum TouchTypes {
	Start = "touchstart",
	End = "touchend",
	Move = "touchmove",
	Cancel = "touchcancel"
};

const LONGTOUCH_TIMER_MS = 400;

export class TouchManager {
	private ongoingTouches: VTouch[] = [];

	constructor(private contextManager: ContextManager) {
		document.documentElement.ontouchstart = (ev: TouchEvent) => { return this.HandleTouchStart(ev); };
		document.documentElement.ontouchend = (ev: TouchEvent) => { return this.HandleTouchEnd(ev); };
		document.documentElement.ontouchcancel = (ev: TouchEvent) => { return this.HandleTouchCancel(ev); };
		document.documentElement.ontouchmove = (ev: TouchEvent) => { return this.HandleTouchMove(ev); };
	}

	/**
	 * Bevavior Note:
	 * 
	 * Calling "PreventDefault" here will prevent "MouseClicks"
	 * 
	 * e.g. user taps on a link. If you "PreventDefault" the link won't be opened.
	 * 
	 * @param event 
	 */
	HandleTouchStart(event: TouchEvent): boolean {
		let shouldKeepContextMenu: boolean = false;
		for(let x = 0; x < event.changedTouches.length; x++) {
			let newTouch = event.changedTouches.item(x);
			if(newTouch === null) {
				throw new Error();
			}

			shouldKeepContextMenu = shouldKeepContextMenu || this.contextManager.ShouldClearMenu(event.target);
			
			let storedTouch = this.StoreTouch(newTouch);
		}

		if(shouldKeepContextMenu) {
			this.contextManager.ClearMenu();
		}

		return true;
	}

	HandleTouchEnd(event: TouchEvent): boolean {
		for(let x = 0; x < event.changedTouches.length; x++) {
			let removedTouch = event.changedTouches.item(x);
			if(removedTouch === null) {
				throw new Error();
			}

			// todo - broadcast touch end to components listening

			this.CancelTouch(removedTouch.identifier);
		}
		return true;
	}

	HandleTouchCancel(event: TouchEvent): boolean {
		for(let x = 0; x < event.changedTouches.length; x++) {
			let cancelledTouches = event.changedTouches.item(x);
			if(cancelledTouches === null) {
				throw new Error();
			}

			// todo - broadcast touch cancel to components listening

			this.CancelTouch(cancelledTouches.identifier);
		}
		return true;
	}

	HandleTouchMove(event: TouchEvent): boolean {
		for(let x = 0; x < event.changedTouches.length; x++) {
			let movedTouch = event.changedTouches.item(x);
			if(movedTouch === null) {
				throw new Error();
			}

			let storedTouch = this.GetOngoingTouchById(movedTouch.identifier);
			if(storedTouch === null) {
				throw new Error('Cannot process a moved touch if there was no start touch');
			}

			// long touch isn't supposed to work if the user moves their finger
			for(let timer of storedTouch.Timers) {
				clearTimeout(timer);
			}

			// todo - broadcast touch move to components listening

			this.UpdateTouch(movedTouch.identifier, movedTouch);
		}
		return true;
	}

	private GetOngoingTouchById(id: number): VTouch | null {
		let touch = this.ongoingTouches.find(touch => touch.identifier === id);
		if(touch === undefined) {
			return null;
		}

		return touch;
	}

	/**
	 * According to MDN, the touch data can be recycled; so reference it
	 * 
	 * Future touch parameters will include "radiusX", "radiusY", "rotationAngle", and "force"
	 * @param touch 
	 */
	private StoreTouch(touch: Touch): VTouch {
		let vTouch: VTouch =  {
			identifier: touch.identifier,
			clientX: touch.clientX,
			clientY: touch.clientY,
			pageX: touch.pageX,
			pageY: touch.pageY,
			screenX: touch.screenX,
			screenY: touch.screenY,
			target: touch.target,
			TouchStart: performance.now(),
			Timers: []
		};

		let longTouchTimer = setTimeout(() => {
			this.HandleLongTouch(vTouch);
		}, LONGTOUCH_TIMER_MS);

		vTouch.Timers.push(longTouchTimer);
		this.ongoingTouches.push(vTouch);

		return vTouch;
	}

	private UpdateTouch(touchId: number, touch: Touch): void {
		let storedTouch = this.GetOngoingTouchById(touchId);
		if(storedTouch === null) {
			throw new Error('Cannot update touch on a touch not stored!');
		}

		// TODO
	}

	private CancelTouch(touchId: number): void {
		let storedIndex: number | null = null;
		for(let x = 0;  x < this.ongoingTouches.length; x++) {
			if(this.ongoingTouches[x].identifier === touchId) {
				storedIndex = x;
				break;
			}
		}

		if(storedIndex === null) {
			throw new Error('attempted to cancel a touch that could not be found');
		}

		let cancelledTouch = this.ongoingTouches.splice(storedIndex, 1)[0];
		for(let timer of cancelledTouch.Timers) {
			// they didn't pan out
			clearTimeout(timer);
		}

		console.log(`touch duration: ${performance.now() - cancelledTouch.TouchStart}`);
	}

	private HandleLongTouch(touch: VTouch): void {
		this.contextManager.HandleLongPress(touch);
		// find the active context

		// grab its context menu items

		// load up the context menu from it

		console.log(`long touch ;)`, touch);
	}
}

// How to funnel both touch and mouse events into a context menu?

	// touch long press -> context menu -> interactionmanager -> gets everything
	
	// BUT, what about interactions that want to subscribe to specific gestures?
		// I imagine I would just add "HandleGesture" and take in a Gesture on the specific contexts