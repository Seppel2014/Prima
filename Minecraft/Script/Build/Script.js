"use strict";
var Script;
(function (Script) {
    var f = FudgeCore;
    class Block extends f.Node {
        static meshCube = new f.MeshCube("Block");
        static mtrCube = new f.Material("Block", f.ShaderFlat, new f.CoatRemissive());
        constructor(_position) {
            super("Block");
            this.addComponent(new f.ComponentMesh(Block.meshCube));
            let cmpMaterial = new f.ComponentMaterial(Block.mtrCube);
            cmpMaterial.clrPrimary = rndColor();
            this.addComponent(cmpMaterial);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(_position)));
            this.getComponent(f.ComponentTransform).mtxLocal.scale(new f.Vector3(1, 1, 1));
            let cmpPick = new f.ComponentPick;
            cmpPick.pick = f.PICK.CAMERA;
            this.addComponent(cmpPick);
        }
    }
    Script.Block = Block;
    function randomNumber(_max, _min) {
        let randomnumber = Math.random() * (_max - _min) + _min;
        return randomnumber;
    }
    function rndColor() {
        let color = f.Color.CSS("rgb(" + randomNumber(255, 1) + "," + randomNumber(255, 1) + "," + randomNumber(255, 1) + ")");
        return color;
    }
    //copied from Avel
    function pick(_event) {
        const nearestPick = getSortedPicksByCamera(_event)[0];
        const block = nearestPick?.node;
        block.getParent().removeChild(block);
    }
    Script.pick = pick;
    function getSortedPicksByCamera(_event) {
        let picks = f.Picker.pickViewport(Script.viewport, new f.Vector2(_event.clientX, _event.clientY));
        picks.sort((_a, _b) => _a.zBuffer - _b.zBuffer);
        return picks;
    }
})(Script || (Script = {}));
var Script;
(function (Script) {
    let camera;
    function adjustCamera() {
        camera = Script.viewport.camera;
        camera.mtxPivot.rotateY(45);
        camera.mtxPivot.rotateX(45);
        camera.mtxPivot.translateZ(-20);
        camera.mtxPivot.translateY(2);
    }
    Script.adjustCamera = adjustCamera;
    function handleKeyboard(_event) {
        console.log(_event);
        if (_event.key == "d") {
            camera.mtxPivot.translateX(-0.3);
            //camera.mtxPivot.translateY(-0.1);
        }
        else if (_event.key == "a") {
            camera.mtxPivot.translateX(0.3);
            //camera.mtxPivot.translateY(0.1);
        }
        else if (_event.key == "s") {
            camera.mtxPivot.translateY(-0.3);
            camera.mtxPivot.translateZ(-0.3);
        }
        else if (_event.key == "w") {
            camera.mtxPivot.translateY(0.3);
            camera.mtxPivot.translateZ(0.3);
        }
    }
    Script.handleKeyboard = handleKeyboard;
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
    var f = FudgeCore;
    f.Debug.info("Main Program Template running!");
    //@ts-ignore
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        Script.viewport = _event.detail;
        for (let x = 0; x < 4; x++) {
            let blockX = new Script.Block(new f.Vector3(x, 0, 0));
            Script.viewport.getBranch().addChild(blockX);
            for (let y = 0; y < 4; y++) {
                let blockY = new Script.Block(new f.Vector3(x, y, 0));
                Script.viewport.getBranch().addChild(blockY);
                for (let z = 0; z < 4; z++) {
                    let blockZ = new Script.Block(new f.Vector3(x, y, z));
                    Script.viewport.getBranch().addChild(blockZ);
                }
            }
        }
        //@ts-ignore
        Script.viewport.canvas.addEventListener("pointerdown", Script.pick);
        document.addEventListener("keydown", Script.handleKeyboard);
        //@ts-ignore
        //viewport.getBranch().addEventListener("mousemove", hit);
        Script.adjustCamera();
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        // ƒ.Physics.simulate();  // if physics is included and used
        Script.viewport.draw();
        //f.AudioManager.default.update();
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map