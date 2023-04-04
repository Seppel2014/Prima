namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;
  let sonic: f.Node;
  const gravity: number = -9.81;
  let ySpeed: number = 0;
  let isGrounded: boolean = true;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);
  // document.addEventListener("keydown", hndKeyboard)


  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    sonic = viewport.getBranch().getChildrenByName("Sonic")[0];
    console.log(sonic);

    let cmpCamera: f.ComponentCamera = viewport.getBranch().getComponent(f.ComponentCamera);
    viewport.camera = cmpCamera;


    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    let timeFrame: number = f.Loop.timeFrameGame / 1000; // time since last frame in seconds
    // ƒ.Physics.simulate();  // if physics is included and used
    if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D]))
      sonic.mtxLocal.translateX(1 * timeFrame);
    if (isGrounded && f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
      ySpeed = 5;
      isGrounded = false;
    }


    ySpeed += gravity * timeFrame;
    let pos: f.Vector3 = sonic.mtxLocal.translation;
    pos.y += ySpeed * timeFrame;

    let tileCollided: f.Node = checkCollision(pos);
    if (tileCollided) {
      ySpeed = 0;
      pos.y = tileCollided.mtxWorld.translation.y + 0.5;
      isGrounded = true;
    }
    sonic.mtxLocal.translation = pos;


    viewport.draw();
    // ƒ.AudioManager.default.update();
  }

  function checkCollision(_posWorld: f.Vector3): f.Node {
    let tiles: f.Node[] = viewport.getBranch().getChildrenByName("Terrain")[0].getChildren()
    for (let tile of tiles) {
      let pos: f.Vector3 = f.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
      if (pos.y < 0.5 && pos.x > -0.5 && pos.x < 0.5)
        return tile;
    }

    return null;
  }
}
