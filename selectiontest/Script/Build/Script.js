"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* ƒ.EVENT.COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* ƒ.EVENT.NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    //ƒ replaced with f for easier usage
    var f = FudgeCore;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        let viewport = _event.detail;
        let root = viewport.getBranch();
        let zoo = root.getChildrenByName("szene")[0];
        let radii = new f.Node("Radii");
        root.replaceChild(zoo, radii);
        root.appendChild(zoo);
        root.addEventListener("mousemove", hit);
        f.Debug.branch(root);
        viewport.canvas.addEventListener("mousemove", pick);
        function pick(_event) {
            document.querySelector("div").innerHTML = "";
            viewport.draw();
            viewport.dispatchPointerEvent(_event);
            //f.Debug.info(_event);
        }
        function hit(_event) {
            let node = _event.target;
            let cmpPick = node.getComponent(f.ComponentPick);
            f.Debug.info(cmpPick.node.name);
            document.querySelector("div").innerHTML += cmpPick.pick + ":" + node.name + "<br/>";
        }
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map