export var DraggableDropEffectsTypes;
(function (DraggableDropEffectsTypes) {
    DraggableDropEffectsTypes["None"] = "none";
    DraggableDropEffectsTypes["Unitialized"] = "uninitialized";
    DraggableDropEffectsTypes["Copy"] = "copy";
    DraggableDropEffectsTypes["Move"] = "move";
    DraggableDropEffectsTypes["Link"] = "link";
})(DraggableDropEffectsTypes || (DraggableDropEffectsTypes = {}));
;
export var DraggableEffectAllowedTypes;
(function (DraggableEffectAllowedTypes) {
    DraggableEffectAllowedTypes["None"] = "none";
    DraggableEffectAllowedTypes["Unitialized"] = "uninitialized";
    DraggableEffectAllowedTypes["Copy"] = "copy";
    DraggableEffectAllowedTypes["Move"] = "move";
    DraggableEffectAllowedTypes["Link"] = "link";
    DraggableEffectAllowedTypes["CopyMove"] = "copyMove";
    DraggableEffectAllowedTypes["CopyLink"] = "copyLink";
    DraggableEffectAllowedTypes["LinkMove"] = "linkMove";
    DraggableEffectAllowedTypes["All"] = "all";
})(DraggableEffectAllowedTypes || (DraggableEffectAllowedTypes = {}));
;
export const DraggableEffectMoveTypes = [
    DraggableEffectAllowedTypes.Move,
    DraggableEffectAllowedTypes.LinkMove,
    DraggableEffectAllowedTypes.CopyMove,
    DraggableEffectAllowedTypes.All
];
//# sourceMappingURL=dragdropdict.js.map