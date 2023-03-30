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
    //mainly adjusted code from the pickComponent Test to my existing scene https://jirkadelloro.github.io/FUDGE/Test/
    //ƒ replaced with f for easier usage
    var f = FudgeCore;
    let viewport;
    let character;
    document.addEventListener("interactiveViewportStarted", start);
    f.Debug.info("Main Program Template running!");
    function start(_event) {
        viewport = _event.detail;
        character = viewport.getBranch().getChildrenByName("Character")[0];
        f.Debug.info(character);
        /*
        let root: f.Node = viewport.getBranch();
        root.addEventListener("mousemove", hit);
        viewport.canvas.addEventListener("mousemove", pick);
        */
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        let cmpCamera = viewport.getBranch().getComponent(f.ComponentCamera);
        viewport.camera = cmpCamera;
        f.Loop.start();
    }
    function checkCollision(_event) {
        let node = _event.target;
        let cmpPick = node.getComponent(f.ComponentPick);
    }
    function update(_event) {
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D])) {
            character.mtxLocal.translateX(0.1);
            f.Debug.info("right");
        }
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A])) {
            character.mtxLocal.translateX(-0.1);
            f.Debug.info("left");
        }
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W])) {
            character.mtxLocal.translateY(0.1);
            f.Debug.info("up");
        }
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S])) {
            character.mtxLocal.translateY(-0.1);
            f.Debug.info("down");
        }
        // ƒ.Physics.simulate();  // if physics is included and used
        //f.AudioManager.default.update();
        viewport.draw();
        f.Debug.info("update");
    }
})(Script || (Script = {}));
/*
function pick(_event: PointerEvent): void {
  document.querySelector("div").innerHTML = "";
  viewport.draw();
  viewport.dispatchPointerEvent(_event);
}

function hit(_event: PointerEvent): void {
  let node: f.Node = (<f.Node>_event.target);
  let cmpPick: f.ComponentPick = node.getComponent(f.ComponentPick);

  document.querySelector("div").innerHTML += cmpPick.node.name + "<br/>";
}
*/ 
//# sourceMappingURL=Script.js.map