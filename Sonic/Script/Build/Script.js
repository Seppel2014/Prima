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
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class GetTraps extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(Script.CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        //public message: string = "HideMaterial added to ";
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
                    //ƒ.Debug.log(this.message, this.node);
                    this.node.getComponent(Script.f.ComponentMaterial).activate(false);
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
    Script.GetTraps = GetTraps;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    class Light extends f.Node {
        stateMachine;
        rigidbody;
        node;
        constructor(_name) {
            super("Light");
            this.node = Script.viewport.getBranch().getChildrenByName("StateMachines")[0].getChildrenByName(_name)[0];
            this.rigidbody = this.node.getComponent(f.ComponentRigidbody);
            this.stateMachine = new Script.LightMachine;
            this.addComponent(this.stateMachine);
            this.stateMachine.transit(Script.JOB.PATROL);
            this.rigidbody.addEventListener("ColliderEnteredCollision" /* f.EVENT_PHYSICS.COLLISION_ENTER */, (_event) => {
                if (_event.cmpRigidbody.node.name == "Sonic") {
                    Script.changeLight(Script.lightBoost);
                    this.stateMachine.transit(Script.JOB.DIE);
                }
            });
        }
    }
    Script.Light = Light;
})(Script || (Script = {}));
var Script;
(function (Script) {
    Script.f = FudgeCore;
    Script.fAid = FudgeAid;
    //sonic
    let sonic;
    let audioListener;
    let config;
    Script.trapsTriggered = 0;
    let light;
    document.addEventListener("interactiveViewportStarted", start);
    async function start(_event) {
        await getExternalData();
        Script.viewport = _event.detail;
        light = Script.viewport.getBranch().getChildrenByName("AmbientLight")[0].getComponent(Script.f.ComponentLight);
        sonic = new Script.Sonic();
        let cmpCamera = Script.viewport.getBranch().getChildrenByName("Sonic")[0].getComponent(Script.f.ComponentCamera);
        Script.viewport.camera = cmpCamera;
        Script.timer = new Script.f.Timer(new Script.f.Time, 1000, 0, updateTimer);
        Script.ui = new Script.UI(Script.maxTime);
        Script.sounds = Script.viewport.getBranch().getComponents(Script.f.ComponentAudio);
        Script.sounds[0].play(true);
        audioListener = Script.viewport.getBranch().getComponent(Script.f.ComponentAudioListener);
        Script.f.AudioManager.default.listenWith(audioListener);
        Script.f.AudioManager.default.listenTo(Script.viewport.getBranch());
        createTraps();
        createMachines();
        Script.f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        Script.f.Loop.start(); // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    }
    function update(_event) {
        Script.timeFrame = Script.f.Loop.timeFrameGame / 1000; // time since last frame in seconds
        Script.f.Physics.simulate(); // if physics is included and used
        sonic.move();
        changeLight(0);
        Script.viewport.draw();
        Script.f.AudioManager.default.update();
    }
    function changeLight(_value) {
        let color = light.light.color;
        let reduced = color.r - 0.001 + _value;
        //console.log((1+_value-(f.Time.game.get()/1000)/maxTime))
        if (reduced > Script.maxDarkness) {
            let reducedColor = new Script.f.Color(reduced, reduced, reduced);
            light.light.color = reducedColor;
        }
    }
    Script.changeLight = changeLight;
    async function getExternalData() {
        let response = await fetch("Script/config.json");
        config = await response.json();
        Script.ammountLives = config["lives"];
        Script.maxTime = config["maxTime"];
        Script.trapsVisibility = config["trapsVisibility"];
        Script.maxDarkness = config["maxDarkness"];
        Script.lightBoost = config["lightboost"];
    }
    function createTraps() {
        let TrapsPlaceholders = Script.viewport.getBranch().getChildrenByName("TrapPlaceholders")[0].getChildren();
        for (let trapP of TrapsPlaceholders) {
            new Script.Trap(trapP.getComponent(Script.f.ComponentMesh).mtxPivot.translation, trapP.name);
        }
    }
    function createMachines() {
        let StateMachines = Script.viewport.getBranch().getChildrenByName("StateMachines")[0].getChildren();
        for (let machine of StateMachines) {
            new Script.Light(machine.name);
        }
    }
    function updateTimer() {
        Script.ui.time -= 1;
        if (Script.ui.time < 0) {
            EndGame("time");
        }
    }
    function EndGame(_endReason) {
        Script.ui.ui.style.visibility = "hidden";
        Script.ui.time = 10000;
        let endDiv = document.getElementById("endDiv");
        endDiv.style.display = "flex";
        switch (_endReason) {
            case "time": {
                console.log("ran out of time");
                Script.sounds[3].play(true);
                endDiv.innerHTML = "YOU RAN OUT OF TIME<br>You collected " + Script.ui.coins + " coins, <br> you triggered " + Script.ui.traps + " traps <br> You had " + Script.ui.lives + " lives left";
                break;
            }
            case "lives": {
                console.log("ran out of lives");
                endDiv.innerHTML = "YOU RAN OUT OF LIVES<br>You collected " + Script.ui.coins + " coins <br> You triggered " + Script.ui.traps + " traps";
                Script.sounds[3].play(true);
                break;
            }
            case "end": {
                console.log("reached End");
                endDiv.innerHTML = "YOU REACHED THE END<br>You collected " + Script.ui.coins + " coins <br> You triggered " + Script.ui.traps + " traps <br> You had " + Script.ui.lives + " lives left";
                Script.sounds[4].play(true);
                break;
            }
        }
        Script.f.Loop.removeEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
    }
    Script.EndGame = EndGame;
    function createCompleteMeshNode(_name, _material, _mesh, _mass, _physicsType, _group = Script.f.COLLISION_GROUP.DEFAULT, _colType = Script.f.COLLIDER_TYPE.CUBE) {
        let node = new Script.f.Node(_name);
        let cmpMesh = new Script.f.ComponentMesh(_mesh);
        let cmpMaterial = new Script.f.ComponentMaterial(_material);
        let cmpTransform = new Script.f.ComponentTransform();
        let cmpRigidbody = new Script.f.ComponentRigidbody(_mass, _physicsType, _colType, _group);
        cmpRigidbody.restitution = 0.2;
        cmpRigidbody.friction = 0.8;
        cmpRigidbody.dampTranslation = 0;
        node.addComponent(cmpMesh);
        node.addComponent(cmpMaterial);
        cmpMaterial.mtxPivot.rotate(-90);
        node.addComponent(cmpTransform);
        node.addComponent(cmpRigidbody);
        return node;
    }
    Script.createCompleteMeshNode = createCompleteMeshNode;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    class Sonic extends f.Node {
        sonic = Script.viewport.getBranch().getChildrenByName("Sonic")[0];
        gravity = -9.81;
        ySpeed = 0;
        isGrounded = true;
        sonicStartPoint = new f.Vector3(-2, 0.4, 0);
        xSpeed = 5;
        constructor() {
            super("Sonic");
            console.log(this);
            this.sonic.getComponent(f.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* f.EVENT_PHYSICS.COLLISION_ENTER */, this.hndCollisions);
        }
        hndCollisions(_event) {
            let parent = _event.cmpRigidbody.node.getParent();
            if (parent.name == "TrapsBlocks") {
                Script.ui.traps += 1;
            }
            if (_event.cmpRigidbody.node.name == "EndPost") {
                Script.EndGame("end");
                Script.changeLight(1);
            }
        }
        move() {
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D])) {
                this.sonic.mtxLocal.translateX(this.xSpeed * Script.timeFrame);
                this.updateAnimation("runningright");
            }
            else if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A])) {
                this.sonic.mtxLocal.translateX(-this.xSpeed * Script.timeFrame);
                this.updateAnimation("runningleft");
            }
            else {
                this.updateAnimation("idle");
            }
            ;
            if (this.isGrounded && f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
                this.ySpeed = 5;
                this.isGrounded = false;
                Script.sounds[2].play(true);
            }
            else if (!this.isGrounded) {
                this.updateAnimation("jumping");
            }
            this.ySpeed += this.gravity * Script.timeFrame;
            let pos = this.sonic.mtxLocal.translation;
            pos.y += this.ySpeed * Script.timeFrame;
            let tileCollided = this.checkCollisionWithBlock(pos);
            if (tileCollided) {
                this.ySpeed = 0;
                pos.y = tileCollided.mtxWorld.translation.y + 0.45;
                this.isGrounded = true;
            }
            if (pos.y < -5) {
                this.ySpeed = 0;
                pos = this.sonicStartPoint;
                Script.ui.lives--;
                Script.sounds[3].play(true);
                if (Script.ui.lives < 1) {
                    Script.EndGame("lives");
                }
            }
            this.sonic.mtxLocal.translation = pos;
            this.checkCollisionWithGold(pos);
            Script.viewport.draw();
            f.AudioManager.default.update();
        }
        updateAnimation(_animation) {
            let currentAnimation = this.sonic.getChildrenByName("SonicAnimation")[0].getComponent(f.ComponentAnimator);
            let transformMtx = this.sonic.getChildrenByName("SonicAnimation")[0].getComponent(f.ComponentTransform).mtxLocal;
            let newAnimation;
            switch (_animation) {
                case "idle": {
                    newAnimation = (f.Project.getResourcesByName("animation_idle")[0]);
                    let newrotation = new f.Vector3(transformMtx.rotation.x, 0, transformMtx.rotation.z);
                    transformMtx.rotation = newrotation;
                    break;
                }
                case "runningleft": {
                    newAnimation = (f.Project.getResourcesByName("animation_running")[0]);
                    let newrotation = new f.Vector3(transformMtx.rotation.x, 180, transformMtx.rotation.z);
                    transformMtx.rotation = newrotation;
                    break;
                }
                case "runningright": {
                    newAnimation = (f.Project.getResourcesByName("animation_running")[0]);
                    let newrotation = new f.Vector3(transformMtx.rotation.x, 0, transformMtx.rotation.z);
                    transformMtx.rotation = newrotation;
                    break;
                }
                case "jumping": {
                    newAnimation = (f.Project.getResourcesByName("animation_jumping")[0]);
                    let newrotation = new f.Vector3(transformMtx.rotation.x, 0, transformMtx.rotation.z);
                    transformMtx.rotation = newrotation;
                    break;
                }
            }
            if (currentAnimation.animation !== newAnimation) {
                currentAnimation.animation = newAnimation;
            }
        }
        checkCollisionWithBlock(_posWorld) {
            let tiles = Script.viewport.getBranch().getChildrenByName("Terrain")[0].getChildren();
            for (let tile of tiles) {
                let pos = f.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
                if (pos.y < 0.45 && pos.x > -0.6 && pos.x < 0.6) {
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
        checkCollisionWithGold(_posWorld) {
            let golds = Script.viewport.getBranch().getChildrenByName("Golds")[0].getChildren();
            for (let gold of golds) {
                let pos = f.Vector3.TRANSFORMATION(_posWorld, gold.mtxWorldInverse, true);
                if (pos.y < 0.45 && pos.x > -0.6 && pos.x < 0.6) {
                    if (pos.y < -1) {
                        break;
                    }
                    else {
                        Script.viewport.getBranch().getChildrenByName("Golds")[0].removeChild(gold);
                        Script.ui.coins++;
                        Script.sounds[1].play(true);
                    }
                }
            }
            return null;
        }
    }
    Script.Sonic = Sonic;
})(Script || (Script = {}));
var Script;
(function (Script) {
    let JOB;
    (function (JOB) {
        JOB[JOB["PATROL"] = 0] = "PATROL";
        JOB[JOB["DIE"] = 1] = "DIE";
    })(JOB = Script.JOB || (Script.JOB = {}));
    var ƒAid = FudgeAid;
    class LightMachine extends ƒAid.ComponentStateMachine {
        static instructions = LightMachine.get();
        constructor() {
            super();
            this.instructions = LightMachine.instructions;
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* ƒ.EVENT.COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* ƒ.EVENT.COMPONENT_REMOVE */, this.hndEvent);
        }
        static get() {
            let setup = new ƒAid.StateMachineInstructions();
            setup.transitDefault = LightMachine.transitDefault;
            setup.actDefault = LightMachine.patrol;
            setup.setAction(JOB.DIE, this.die);
            return setup;
        }
        static transitDefault(_machine) {
            //console.log(_machine, `TransitDefault   ${JOB[_machine.stateCurrent]} -> ${JOB[_machine.stateNext]}`);
        }
        static async patrol(_machine) {
            //console.log(_machine, `patrol       ${JOB[_machine.stateCurrent]}`);
        }
        static async die(_machine) {
            //console.log(_machine, `die       ${JOB[_machine.stateCurrent]}`);
            // @ts-ignore 
            _machine.node.node.getComponent(Script.f.ComponentRigidbody).typeBody = 0;
        }
        hndEvent = (_event) => {
            Script.f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, this.update);
        };
        update = (_event) => {
            this.act();
        };
    }
    Script.LightMachine = LightMachine;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    class Trap extends f.Node {
        position;
        hierarchy = Script.viewport.getBranch();
        hierarchyBlocks = Script.viewport.getBranch().getChildrenByName("TrapsBlocks")[0];
        hinge;
        block;
        joint;
        constructor(_position, _name) {
            super("Trap");
            this.name = _name;
            this.position = _position;
            this.create(this.position);
        }
        create(_position) {
            this.hinge = Script.createCompleteMeshNode("Hinge", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0, 0, 0, 0))), new f.MeshCube(), 1, f.BODY_TYPE.STATIC, f.COLLISION_GROUP.GROUP_1);
            this.hierarchy.appendChild(this.hinge);
            this.hinge.mtxLocal.translate(this.position);
            this.hinge.mtxLocal.rotate(new f.Vector3(0, 90, 90));
            this.hinge.mtxLocal.scale(new f.Vector3(0.5, 0.1, 1));
            let imgSpriteSheet = new f.TextureImage();
            imgSpriteSheet.load("Image/Floor.png");
            this.block = Script.createCompleteMeshNode("Block", new f.Material("Cube", f.ShaderFlatTextured, new f.CoatRemissiveTextured(new f.Color(1, 1, 1, Script.trapsVisibility), imgSpriteSheet)), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1);
            this.hierarchyBlocks.appendChild(this.block);
            this.block.mtxLocal.translate(this.position);
            this.block.mtxLocal.rotate(new f.Vector3(0, 90, 90));
            this.block.mtxLocal.scale(new f.Vector3(0.0001, 1, 1));
            this.joint = new f.JointRevolute(this.hinge.getComponent(f.ComponentRigidbody), this.block.getComponent(f.ComponentRigidbody), new f.Vector3(0, 0, 1));
            this.hinge.addComponent(this.joint);
            this.joint.minMotor = 0;
            this.joint.maxMotor = 0;
            this.joint.breakForce = 10;
        }
    }
    Script.Trap = Trap;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var f = FudgeCore;
    var fUI = FudgeUserInterface;
    class UI extends f.Mutable {
        ui = document.getElementById("UI");
        time = Script.maxTime;
        coins = 0;
        lives = Script.ammountLives;
        traps = Script.trapsTriggered;
        constructor(_time) {
            super();
            new fUI.Controller(this, this.ui);
            this.time = _time;
        }
        reduceMutator(_mutator) {
            //unused but necessary for baseclass f.mutable 
        }
    }
    Script.UI = UI;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map