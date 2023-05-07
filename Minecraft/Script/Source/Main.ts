namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  export let viewport: f.Viewport;

  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    for(let x = 0; x < 4; x++){
      let blockX:Block = new Block(new f.Vector3(x,0,0));
      viewport.getBranch().addChild(blockX)
      
      for(let y = 0; y < 4; y++){
        let blockY:Block = new Block(new f.Vector3(x,y,0));
        viewport.getBranch().addChild(blockY);

        for(let z = 0; z < 4; z++){
          let blockZ:Block = new Block(new f.Vector3(x,y,z));
          viewport.getBranch().addChild(blockZ);
        }
      }
    }

    //@ts-ignore
    viewport.canvas.addEventListener("pointerdown", pick);
    
    document.addEventListener("keydown", handleKeyboard)
    //@ts-ignore
    //viewport.getBranch().addEventListener("mousemove", hit);

    adjustCamera();
  
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    //f.AudioManager.default.update();
    
  }
}
