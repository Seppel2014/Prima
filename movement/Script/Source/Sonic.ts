namespace Script {
    import f = FudgeCore;

    export class Sonic {
        public sonic: f.Node = undefined;
        public position: f.Vector3 = undefined;

        private speed: f.Vector3 = new f.Vector3(0,0,0);
        private maxSpeed: number = 0.08;
        //private isGrounded: boolean = false;


        constructor(viewport: f.Viewport) {
            this.sonic = viewport.getBranch().getChildrenByName("Character")[0];
            this.position = this.sonic.mtxLocal.translation;

            f.Debug.info("Added SONIC at X: " + this.sonic.mtxWorld.translation.x + "    Y: " + this.sonic.mtxWorld.translation.y);

        }
    
        public update(): void {
            this.input();

        }

        private movement(): void {
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
        private input():void {
            this.speed = new f.Vector3(0,0,0);

            if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D])) {
                this.speed = new f.Vector3(this.maxSpeed,0,0)
                //f.Debug.info("right");
              }
          
              if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A])) {
                this.speed = new f.Vector3(-this.maxSpeed,0,0)
                //f.Debug.info("left");
              }
          
              if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W])) {
                this.speed = new f.Vector3(0,this.maxSpeed,0)
                //f.Debug.info("up");
              }
            
            /*if (!this.isGrounded) {
                this.speed = new f.Vector3(this.speed.x, -this.maxSpeed, this.speed.z);
            }*/
            this.movement();
        } 
    }
}