const ContextMenuId = 'contextmenu';
export default class ContextManager {
    constructor(interactionManager) {
        this.interactionManager = interactionManager;
        document.documentElement.oncontextmenu = (ev) => { this.ContextEvent(ev); };
        document.documentElement.onmouseup = (ev) => {
            if (this.ShouldClearMenu(ev.target)) {
                this.ClearMenu();
            }
        };
    }
    ShouldClearMenu(target) {
        return target == null || target.id !== ContextMenuId;
    }
    ClearMenu() {
        let contextMenu = document.getElementById(ContextMenuId);
        if (contextMenu !== null) {
            contextMenu.parentElement.removeChild(contextMenu);
        }
    }
    HandleLongPress(event) {
        if (this.ShouldSpawnContextMenu(event.target)) {
            this.SpawnContextMenu(event.pageX, event.pageY);
        }
    }
    ContextEvent(event) {
        if (event.ctrlKey) {
            return;
        }
        event.preventDefault();
        if (this.ShouldSpawnContextMenu(event.target)) {
            this.SpawnContextMenu(event.pageX, event.pageY);
        }
    }
    ShouldSpawnContextMenu(target) {
        return target !== null && target.id !== ContextMenuId && this.interactionManager.FindActiveContext() !== null;
    }
    SpawnContextMenu(positionX, positionY) {
        let mainElement = document.getElementsByTagName("main")[0];
        let contextMenu = document.createElement("context-menu");
        contextMenu.id = ContextMenuId;
        contextMenu.style.background = "white";
        contextMenu.style.position = "absolute";
        contextMenu.style.border = "1px solid black";
        contextMenu.style.boxShadow = "4px 4px 4px 0px #bb7474";
        contextMenu.style.top = positionY.toString();
        contextMenu.style.left = positionX.toString();
        contextMenu.actions = this.interactionManager.FindActiveContext().GetContextActions();
        mainElement.appendChild(contextMenu);
    }
}
//# sourceMappingURL=contextmanager.js.map