"use strict";
var Script;
(function (Script) {
    var f = FudgeCore;
    class Block extends f.Node {
        static meshCube = new f.MeshCube("Block");
        static mtrCube = new f.Material("Block", f.ShaderFlat, new f.CoatRemissive());
        constructor(_position, _color) {
            super("Block");
            this.addComponent(new f.ComponentMesh(Block.meshCube));
            let cmpMaterial = new f.ComponentMaterial(Block.mtrCube);
            cmpMaterial.clrPrimary = _color;
            this.addComponent(cmpMaterial);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(_position)));
            this.getComponent(f.ComponentTransform).mtxLocal.scale(new f.Vector3(0.9, 0.9, 0.9));
            console.log();
        }
    }
    Script.Block = Block;
})(Script || (Script = {}));
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
    //read about rays and picking 3d
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    let viewport;
    //@ts-ignore
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        viewport = _event.detail;
        for (let x = 0; x < 5; x++) {
            let blockX = new Script.Block(new f.Vector3(x, 0, 0), rndColor());
            viewport.getBranch().addChild(blockX);
            for (let y = 0; y < 5; y++) {
                let blockY = new Script.Block(new f.Vector3(x, y, 0), rndColor());
                viewport.getBranch().addChild(blockY);
                for (let z = 0; z < 5; z++) {
                    let blockZ = new Script.Block(new f.Vector3(x, y, -z), rndColor());
                    viewport.getBranch().addChild(blockZ);
                }
            }
        }
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function randomNumber(_max, _min) {
        let randomnumber = Math.random() * (_max - _min) + _min;
        return randomnumber;
    }
    function rndColor() {
        let color = f.Color.CSS("rgb(" + randomNumber(255, 1) + "," + randomNumber(255, 1) + "," + randomNumber(255, 1) + ")");
        return color;
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        viewport.draw();
        f.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map