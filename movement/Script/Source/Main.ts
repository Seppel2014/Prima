namespace Script {
  //mainly adjusted code from the pickComponent Test to my existing scene https://jirkadelloro.github.io/FUDGE/Test/

  //ƒ replaced with f for easier usage

  import f = FudgeCore;
  
  let viewport: f.Viewport;

  let character: f.Node;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  f.Debug.info("Main Program Template running!");


  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    character = viewport.getBranch().getChildrenByName("Character")[0];
    f.Debug.info(character);

    /*
    let root: f.Node = viewport.getBranch();
    root.addEventListener("mousemove", hit);
    viewport.canvas.addEventListener("mousemove", pick);
    */

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    
    let cmpCamera:f.ComponentCamera = viewport.getBranch().getComponent(f.ComponentCamera)
    viewport.camera = cmpCamera;
    f.Loop.start();
  }

  function checkCollision(_event: PointerEvent): void {
    let node: f.Node = (<f.Node>_event.target);
    let cmpPick: f.ComponentPick = node.getComponent(f.ComponentPick);
  }

  function update(_event: Event): void {
    if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D])) {
      character.mtxLocal.translateX(0.1);
      f.Debug.info("right");
    }

    if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A])) {
      character.mtxLocal.translateX(-0.1);
      f.Debug.info("left");
    }

    if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_UP, f.KEYBOARD_CODE.W])) {
      character.mtxLocal.translateY(0.1);
      f.Debug.info("up");
    }

    if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_DOWN, f.KEYBOARD_CODE.S])) {
      character.mtxLocal.translateY(-0.1);
      f.Debug.info("down");
    }


    // ƒ.Physics.simulate();  // if physics is included and used
    //f.AudioManager.default.update();
    
    viewport.draw();
    f.Debug.info("update")
  }
}
    /*
    function pick(_event: PointerEvent): void {
      document.querySelector("div").innerHTML = "";
      viewport.draw();
      viewport.dispatchPointerEvent(_event);
    }

    function hit(_event: PointerEvent): void {
      let node: f.Node = (<f.Node>_event.target);
      let cmpPick: f.ComponentPick = node.getComponent(f.ComponentPick);

      document.querySelector("div").innerHTML += cmpPick.node.name + "<br/>";
    }
    */