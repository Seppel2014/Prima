namespace Script {
  
  
  //read about rays and picking 3d
  
  
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;

  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    for(let x = 0; x < 5; x++){
      let blockX:Block = new Block(new f.Vector3(x,0,0), rndColor());
      viewport.getBranch().addChild(blockX)
      
      for(let y = 0; y < 5; y++){
        let blockY:Block = new Block(new f.Vector3(x,y,0), rndColor());
        viewport.getBranch().addChild(blockY);

        for(let z = 0; z < 5; z++){
          let blockZ:Block = new Block(new f.Vector3(x,y,-z), rndColor());
          viewport.getBranch().addChild(blockZ);
        }
      }
    }

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function randomNumber(_max: number, _min: number): number {
    let randomnumber: number = Math.random() * (_max-_min) + _min;
    return randomnumber;
  }

  function rndColor(): f.Color {
    let color: f.Color = f.Color.CSS("rgb("+randomNumber(255,1)+","+randomNumber(255,1)+","+randomNumber(255,1)+")");
    return color;
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    f.AudioManager.default.update();
    
  }
}
