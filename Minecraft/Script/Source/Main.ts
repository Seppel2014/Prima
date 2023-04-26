namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;

  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;

    for(let x = 0; x < 4; x++){
      let blockX:Block = new Block(new f.Vector3(x,0,-10));
      viewport.getBranch().addChild(blockX)
      
      for(let y = 0; y < 4; y++){
        let blockY:Block = new Block(new f.Vector3(x,y,-10));
        viewport.getBranch().addChild(blockY);

        for(let z = 12; z < 16; z++){
          let blockZ:Block = new Block(new f.Vector3(x,y,-z));
          viewport.getBranch().addChild(blockZ);
        }
      }
    }

    //@ts-ignore
    viewport.canvas.addEventListener("mousemove", pick);
    //@ts-ignore
    viewport.getBranch().addEventListener("mousemove", hit);

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function pick(_event:PointerEvent): void {
    viewport.draw();
    viewport.dispatchPointerEvent(_event);
  }

  function hit(_event:PointerEvent): void {
    let node: f.Node = (<f.Node>_event.target);
    let cmpPick: f.ComponentPick = node.getComponent(f.ComponentPick);

    document.querySelector("div").innerHTML = cmpPick.node.getComponent(f.ComponentMaterial).clrPrimary + "<br/>";
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    f.AudioManager.default.update();
    
  }
}
