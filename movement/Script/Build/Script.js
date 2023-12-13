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
    let sonic;
    document.addEventListener("interactiveViewportStarted", start);
    f.Debug.info("Main Program Template running!");
    function start(_event) {
        Script.viewport = _event.detail;
        sonic = new Script.Sonic(Script.viewport);
        f.Loop.addEventListener("loopFrame" /* f.EVENT.LOOP_FRAME */, update);
        let charNode = Script.viewport.getBranch().getChildrenByName("Character")[0];
        let cmpCamera = charNode.getChildrenByName("Sonic")[0].getComponent(f.ComponentCamera);
        Script.viewport.camera = cmpCamera;
        f.Loop.start();
    }
    function update(_event) {
        sonic.update();
        // ƒ.Physics.simulate();  // if physics is included and used
        //f.AudioManager.default.update();
        Script.viewport.draw();
        f.Debug.info("update");
    }
})(Script || (Script = {}));
/*function checkBoxes(): void {
    let floors: f.Node = viewport.getBranch().getChildrenByName("terrain")[0];
    
    for (let floor of floors.getChildren()) {
      
      let floorMesh = floor.getComponent(f.ComponentMesh);
      

      let topLeft = floorMesh.mesh.vertices[0].position.x + floorMesh.mtxWorld.translation.x;
      let topRight = floorMesh.mesh.vertices[3].position.x + floorMesh.mtxWorld.translation.x
     
      f.Debug.info(floorMesh);
      f.Debug.info(topLeft + " topleft");
      f.Debug.info(topRight + " topright");
      
    }
  }*/ 
var Script;
(function (Script) {
    var f = FudgeCore;
    class Sonic {
        sonic = undefined;
        position = undefined;
        speed = new f.Vector3(0, 0, 0);
        maxSpeed = 0.08;
        //private isGrounded: boolean = false;
        constructor(viewport) {
            this.sonic = viewport.getBranch().getChildrenByName("Character")[0];
            this.position = this.sonic.mtxLocal.translation;
            f.Debug.info("Added SONIC at X: " + this.sonic.mtxWorld.translation.x + "    Y: " + this.sonic.mtxWorld.translation.y);
        }
        update() {
            this.input();
        }
        movement() {
            this.sonic.mtxLocal.translate(this.speed);
        }
        /*private checkCollision(): void {

            let floors: f.Node = viewport.getBranch().getChildrenByName("terrain")[0];
            let pos: f.Vector3 = this.position;
            
            for (let floor of floors.getChildren()) {
              let posFloor: f.Vector3 = floor.mtxWorld.translation;
              
              //Multiple cases for collision
              
              if (Math.abs(pos.x - posFloor.x) < 0.5) {
                f.Debug.info(floor);
                f.Debug.info(pos);
                if (pos.y < posFloor.y + 0.01) {
                  pos.y = posFloor.y + 0.01;
                  this.position = pos;
                  this.speed = new f.Vector3(0,0,0);
                }
              }
            }
          }
          */
        input() {
            this.speed = new f.Vector3(0, 0, 0);
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D])) {
                this.speed = new f.Vector3(this.maxSpeed, 0, 0);
                //f.Debug.info("right");
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A])) {
                this.speed = new f.Vector3(-this.maxSpeed, 0, 0);
                //f.Debug.info("left");
            }
            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W])) {
                this.speed = new f.Vector3(0, this.maxSpeed, 0);
                //f.Debug.info("up");
            }
            /*if (!this.isGrounded) {
                this.speed = new f.Vector3(this.speed.x, -this.maxSpeed, this.speed.z);
            }*/
            this.movement();
        }
    }
    Script.Sonic = Sonic;
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map