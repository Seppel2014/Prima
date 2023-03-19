namespace Script {
  import ƒ = FudgeCore;
  
  let i:number = 0;
  let transform: ƒ.ComponentTransform;
 
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    let branch: ƒ.Node = viewport.getBranch();
    transform = branch.getComponent(ƒ.ComponentTransform);
    //ƒ.Debug.info(branch);
    ƒ.Debug.info(transform);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
    // ƒ.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    if(i < 100) {

    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    i++;
    
    let vectorrotate: ƒ.Vector3 = new ƒ.Vector3(20,0,0);
    transform.mtxLocal.rotate(vectorrotate);

    ƒ.Debug.info("running " + i);

    ƒ.AudioManager.default.update();
    } else {
      ƒ.Loop.stop();
    }
  }
}