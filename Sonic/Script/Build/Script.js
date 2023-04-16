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
    //values for internal Use
    let viewport;
    let sonic;
    const gravity = -9.81;
    let ySpeed = 0;
    let isGrounded = true;
    let sonicStartPoint;
    let xSpeed = 5;
    //values for Hud
    let sonicDeaths = 0;
    let sonicGold = 0;
    let time;
    document.addEventListener("interactiveViewportStarted", start);
    function start(_event) {
        viewport = _event.detail;
        sonic = viewport.getBranch().getChildrenByName("Sonic")[0];
        sonicStartPoint = sonic.mtxLocal.translation;
        let cmpCamera = viewport.getBranch().getChildrenByName("Sonic")[0].getComponent(f.ComponentCamera);
        viewport.camera = cmpCamera;
        f.Time.game.set(0);
        let hud = document.querySelector("div");
        hud.style.width = "20%";
        hud.style.height = "20%";
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        let timeFrame = f.Loop.timeFrameGame / 1000; // time since last frame in seconds
        // ƒ.Physics.simulate();  // if physics is included and used
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D])) {
            sonic.mtxLocal.translateX(xSpeed * timeFrame);
            updateAnimation("runningright");
        }
        else if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A])) {
            sonic.mtxLocal.translateX(-xSpeed * timeFrame);
            updateAnimation("runningleft");
        }
        else {
            updateAnimation("idle");
        }
        ;
        if (isGrounded && f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
            ySpeed = 5;
            isGrounded = false;
        }
        else if (!isGrounded) {
            updateAnimation("idle");
            //create jumpanimation
        }
        ySpeed += gravity * timeFrame;
        let pos = sonic.mtxLocal.translation;
        pos.y += ySpeed * timeFrame;
        let tileCollided = checkCollision(pos);
        if (tileCollided) {
            ySpeed = 0;
            pos.y = tileCollided.mtxWorld.translation.y + 0.45;
            isGrounded = true;
        }
        if (pos.y < -5) {
            ySpeed = 0;
            pos = sonicStartPoint;
            sonicDeaths++;
        }
        sonic.mtxLocal.translation = pos;
        checkTime();
        updateHUD();
        viewport.draw();
        // ƒ.AudioManager.default.update();
    }
    function updateAnimation(_animation) {
        let currentAnimation = sonic.getChildrenByName("SonicAnimation")[0].getComponent(f.ComponentAnimator);
        let sonicTransform = sonic.getChildrenByName("SonicAnimation")[0].getComponent(f.ComponentTransform);
        let newAnimation;
        switch (_animation) {
            case "idle": {
                newAnimation = (f.Project.getResourcesByName("animation_idle")[0]);
                sonicTransform.mtxLocal.rotateY(calcRotation(sonicTransform, 0));
                break;
            }
            case "runningleft": {
                newAnimation = (f.Project.getResourcesByName("animation_running")[0]);
                sonicTransform.mtxLocal.rotateY(calcRotation(sonicTransform, 180));
                break;
            }
            case "runningright": {
                newAnimation = (f.Project.getResourcesByName("animation_running")[0]);
                sonicTransform.mtxLocal.rotateY(calcRotation(sonicTransform, 0));
                break;
            }
        }
        if (currentAnimation.animation !== newAnimation) {
            currentAnimation.animation = newAnimation;
        }
    }
    //function for changing direction of animation (not mesh), right is 0 and left 180
    function calcRotation(_transform, _targetRotation) {
        let currentRotation = Math.abs(_transform.mtxLocal.rotation.y);
        let targetRotation = Math.abs(_targetRotation);
        let value = 0;
        if (currentRotation < 90) {
            currentRotation = 0;
        }
        if (currentRotation > 90) {
            currentRotation = 180;
        }
        if (currentRotation == targetRotation) {
            value = 0;
        }
        if (currentRotation !== targetRotation) {
            value = 180;
        }
        return value;
    }
    function updateHUD() {
        let hudTime = document.querySelector("#hudTime");
        hudTime.innerHTML = "Time: " + time[2] + ":" + time[1] + ":" + time[0];
        let hudDeaths = document.querySelector("#hudDeaths");
        hudDeaths.innerHTML = "Deaths: " + sonicDeaths.toString();
        let goldCollected = document.querySelector("#hudGold");
        goldCollected.innerHTML = "Gold: " + sonicGold.toString();
    }
    function checkTime() {
        let timeTotal = f.Time.game.get();
        let minutes = Math.floor(timeTotal / 60000);
        timeTotal -= minutes * 60000;
        let seconds = Math.floor(timeTotal / 1000);
        timeTotal -= seconds * 1000;
        let ms = Math.floor(timeTotal);
        time = [ms, seconds, minutes];
    }
    function checkCollision(_posWorld) {
        let tiles = viewport.getBranch().getChildrenByName("Terrain")[0].getChildren();
        for (let tile of tiles) {
            let pos = f.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
            if (pos.y < 0.45 && pos.x > -0.5 && pos.x < 0.5) {
                if (pos.y < -1) {
                    break;
                }
                else {
                    return tile;
                }
            }
        }
        return null;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map