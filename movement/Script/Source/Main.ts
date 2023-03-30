namespace Script {
  //mainly adjusted code from the pickComponent Test to my existing scene https://jirkadelloro.github.io/FUDGE/Test/

  //ƒ replaced with f for easier usage

  import f = FudgeCore;
  let viewport: f.Viewport;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  f.Debug.info("Main Program Template running!");


  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    
    //f.Loop.start();
    //f.Debug.info(viewport.camera);

    viewport.camera.mtxPivot.translateZ(10);
    viewport.camera.mtxPivot.translateX(10);
    viewport.camera.mtxPivot.rotateY(180);
    f.Debug.info("camera" + viewport.camera.mtxPivot);
  }

    
  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    f.AudioManager.default.update();

    f.Debug.info("update")
  }
}