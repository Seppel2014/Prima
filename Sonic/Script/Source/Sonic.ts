namespace Script {
    import f = FudgeCore;
  
    export class Sonic extends f.Node {
    sonic: f.Node = viewport.getBranch().getChildrenByName("Sonic")[0];
    gravity: number = -9.81;
    ySpeed: number = 0;
    isGrounded: boolean = true;
    sonicStartPoint: f.Vector3 = new f.Vector3(-2,0,0);
    xSpeed: number = 5;
    
    constructor() {
        super("Sonic");
        console.log(this)
        this.sonic.getComponent(f.ComponentRigidbody).addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, this.hndCollisions)
    }
    
    public hndCollisions(_event: f.EventPhysics): void {
      let parent:f.Node = _event.cmpRigidbody.node.getParent();
      if (parent.name == "TrapsBlocks") {
        ui.traps+=1
      }
      
      if (_event.cmpRigidbody.node.name == "EndPost") {
        EndGame("end");
        changeLight(1)
      }
    }

    public move(): void {
        if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D])) {
            this.sonic.mtxLocal.translateX(this.xSpeed * timeFrame);
            this.updateAnimation("runningright");
            }
        
        else if(f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A])) {
            this.sonic.mtxLocal.translateX(-this.xSpeed * timeFrame);
            this.updateAnimation("runningleft")
            }
       
        else {this.updateAnimation("idle")};
    
        if(this.isGrounded && f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
            this.ySpeed = 5;
            this.isGrounded = false;
            sounds[2].play(true);
        }
    
        else if(!this.isGrounded) {
            this.updateAnimation("jumping")
        }
    
        this.ySpeed += this.gravity * timeFrame;
        
        let pos = this.sonic.mtxLocal.translation;
        
        pos.y += this.ySpeed * timeFrame;

        let tileCollided: f.Node = this.checkCollisionWithBlock(pos);
        if (tileCollided) {
          this.ySpeed = 0;
          pos.y = tileCollided.mtxWorld.translation.y + 0.45;
          this.isGrounded = true;
        }
        
        if (pos.y < -5) {
          this.ySpeed = 0;
          pos = this.sonicStartPoint;
          ui.lives--;
          sounds[3].play(true);
    
          if (ui.lives < 1){
            EndGame("lives");
          }
        }
    
        this.sonic.mtxLocal.translation = pos;

        this.checkCollisionWithGold(pos);
    
        viewport.draw();
        f.AudioManager.default.update();
      }
    
    public updateAnimation(_animation: string): void {
        let currentAnimation = this.sonic.getChildrenByName("SonicAnimation")[0].getComponent(f.ComponentAnimator);
        let transformMtx: f.Matrix4x4 = this.sonic.getChildrenByName("SonicAnimation")[0].getComponent(f.ComponentTransform).mtxLocal;
        let newAnimation: f.Animation;
    
        switch(_animation) {
          case "idle": {
            newAnimation = (f.Project.getResourcesByName("animation_idle")[0]) as f.Animation
            let newrotation = new f.Vector3(transformMtx.rotation.x, 0, transformMtx.rotation.z)
            transformMtx.rotation = newrotation;
            break;
          }
          case "runningleft": {
            newAnimation = (f.Project.getResourcesByName("animation_running")[0]) as f.Animation
            let newrotation = new f.Vector3(transformMtx.rotation.x, 180, transformMtx.rotation.z)
            transformMtx.rotation = newrotation;
            break;
          }
          case "runningright": {
            newAnimation = (f.Project.getResourcesByName("animation_running")[0]) as f.Animation
            let newrotation = new f.Vector3(transformMtx.rotation.x, 0, transformMtx.rotation.z)
            transformMtx.rotation = newrotation;
            break;
          }
          case "jumping": {
            newAnimation = (f.Project.getResourcesByName("animation_jumping")[0]) as f.Animation
            let newrotation = new f.Vector3(transformMtx.rotation.x, 0, transformMtx.rotation.z)
            transformMtx.rotation = newrotation;
            break;
          }
        }
    
        if(currentAnimation.animation !== newAnimation) {
        currentAnimation.animation = newAnimation;
        }
      }
    
    public checkCollisionWithBlock(_posWorld: f.Vector3): f.Node {
        let tiles: f.Node[] = viewport.getBranch().getChildrenByName("Terrain")[0].getChildren()
        for (let tile of tiles) {
          let pos: f.Vector3 = f.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
          if (pos.y < 0.45 && pos.x > -0.6 && pos.x < 0.6){
            if(pos.y < -1) {
              break;
            }
            else {
              return tile;
            }
          }
        }
        return null;
      }
    
    public checkCollisionWithGold(_posWorld: f.Vector3): f.Node {
        let golds: f.Node[] = viewport.getBranch().getChildrenByName("Golds")[0].getChildren()
        for (let gold of golds) {
          let pos: f.Vector3 = f.Vector3.TRANSFORMATION(_posWorld, gold.mtxWorldInverse, true);
          if (pos.y < 0.45 && pos.x > -0.6 && pos.x < 0.6){
            if(pos.y < -1) {
              break;
            }
            else {
              viewport.getBranch().getChildrenByName("Golds")[0].removeChild(gold);
              ui.coins++;
              sounds[1].play(true);
            }
          }
        }
        return null;
      }
    }
}