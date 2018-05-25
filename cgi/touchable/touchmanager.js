var TouchTypes;
(function (TouchTypes) {
    TouchTypes["Start"] = "touchstart";
    TouchTypes["End"] = "touchend";
    TouchTypes["Move"] = "touchmove";
    TouchTypes["Cancel"] = "touchcancel";
})(TouchTypes || (TouchTypes = {}));
;
const LONGTOUCH_TIMER_MS = 400;
export class TouchManager {
    constructor(contextManager) {
        this.contextManager = contextManager;
        this.ongoingTouches = [];
        document.documentElement.ontouchstart = (ev) => { return this.HandleTouchStart(ev); };
        document.documentElement.ontouchend = (ev) => { return this.HandleTouchEnd(ev); };
        document.documentElement.ontouchcancel = (ev) => { return this.HandleTouchCancel(ev); };
        document.documentElement.ontouchmove = (ev) => { return this.HandleTouchMove(ev); };
    }
    HandleTouchStart(event) {
        let shouldKeepContextMenu = false;
        for (let x = 0; x < event.changedTouches.length; x++) {
            let newTouch = event.changedTouches.item(x);
            if (newTouch === null) {
                throw new Error();
            }
            shouldKeepContextMenu = shouldKeepContextMenu || this.contextManager.ShouldClearMenu(event.target);
            let storedTouch = this.StoreTouch(newTouch);
        }
        if (shouldKeepContextMenu) {
            this.contextManager.ClearMenu();
        }
        return true;
    }
    HandleTouchEnd(event) {
        for (let x = 0; x < event.changedTouches.length; x++) {
            let removedTouch = event.changedTouches.item(x);
            if (removedTouch === null) {
                throw new Error();
            }
            this.CancelTouch(removedTouch.identifier);
        }
        return true;
    }
    HandleTouchCancel(event) {
        for (let x = 0; x < event.changedTouches.length; x++) {
            let cancelledTouches = event.changedTouches.item(x);
            if (cancelledTouches === null) {
                throw new Error();
            }
            this.CancelTouch(cancelledTouches.identifier);
        }
        return true;
    }
    HandleTouchMove(event) {
        for (let x = 0; x < event.changedTouches.length; x++) {
            let movedTouch = event.changedTouches.item(x);
            if (movedTouch === null) {
                throw new Error();
            }
            let storedTouch = this.GetOngoingTouchById(movedTouch.identifier);
            if (storedTouch === null) {
                throw new Error('Cannot process a moved touch if there was no start touch');
            }
            for (let timer of storedTouch.Timers) {
                clearTimeout(timer);
            }
            this.UpdateTouch(movedTouch.identifier, movedTouch);
        }
        return true;
    }
    GetOngoingTouchById(id) {
        let touch = this.ongoingTouches.find(touch => touch.identifier === id);
        if (touch === undefined) {
            return null;
        }
        return touch;
    }
    StoreTouch(touch) {
        let vTouch = {
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
    UpdateTouch(touchId, touch) {
        let storedTouch = this.GetOngoingTouchById(touchId);
        if (storedTouch === null) {
            throw new Error('Cannot update touch on a touch not stored!');
        }
    }
    CancelTouch(touchId) {
        let storedIndex = null;
        for (let x = 0; x < this.ongoingTouches.length; x++) {
            if (this.ongoingTouches[x].identifier === touchId) {
                storedIndex = x;
                break;
            }
        }
        if (storedIndex === null) {
            throw new Error('attempted to cancel a touch that could not be found');
        }
        let cancelledTouch = this.ongoingTouches.splice(storedIndex, 1)[0];
        for (let timer of cancelledTouch.Timers) {
            clearTimeout(timer);
        }
        console.log(`touch duration: ${performance.now() - cancelledTouch.TouchStart}`);
    }
    HandleLongTouch(touch) {
        this.contextManager.HandleLongPress(touch);
        console.log(`long touch ;)`, touch);
    }
}
//# sourceMappingURL=touchmanager.js.map