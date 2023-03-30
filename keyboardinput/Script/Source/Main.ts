namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  //document.addEventListener("keydown", handleKeyboard)

  /*function handleKeyboard(_event: KeyboardEvent) {
    if(_event.code == "ArrowRight" || _event.code == "KeyD")
      

      //sonic.mtxLocal.translate()
  }*/


  //thursday implement fall aand jump, velocity forward and upward, reset after some time and strt fall


  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D])) {
      f.Debug.info("right");
      //sonic.mtxLocal.translate()
    }

    viewport.draw();
    f.AudioManager.default.update();
    
  }
}