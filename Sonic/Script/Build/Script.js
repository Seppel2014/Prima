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
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    let viewport;
    let sonic;
    const gravity = -9.81;
    let ySpeed = 0;
    let isGrounded = true;
    document.addEventListener("interactiveViewportStarted", start);
    // document.addEventListener("keydown", hndKeyboard)
    function start(_event) {
        viewport = _event.detail;
        sonic = viewport.getBranch().getChildrenByName("Sonic")[0];
        console.log(sonic);
        let cmpCamera = viewport.getBranch().getComponent(f.ComponentCamera);
        viewport.camera = cmpCamera;
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let timeFrame = f.Loop.timeFrameGame / 1000; // time since last frame in seconds
        // ƒ.Physics.simulate();  // if physics is included and used
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D]))
            sonic.mtxLocal.translateX(1 * timeFrame);
        if (isGrounded && f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
            ySpeed = 5;
            isGrounded = false;
        }
        ySpeed += gravity * timeFrame;
        let pos = sonic.mtxLocal.translation;
        pos.y += ySpeed * timeFrame;
        let tileCollided = checkCollision(pos);
        if (tileCollided) {
            ySpeed = 0;
            pos.y = tileCollided.mtxWorld.translation.y + 0.5;
            isGrounded = true;
        }
        sonic.mtxLocal.translation = pos;
        viewport.draw();
        // ƒ.AudioManager.default.update();
    }
    function checkCollision(_posWorld) {
        let tiles = viewport.getBranch().getChildrenByName("Terrain")[0].getChildren();
        for (let tile of tiles) {
            let pos = f.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
            if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
                return tile;
        }
        return null;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map