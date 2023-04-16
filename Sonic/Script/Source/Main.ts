namespace Script {
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  //values for internal Use
  let viewport: f.Viewport;
  let sonic: f.Node;
  const gravity: number = -9.81;
  let ySpeed: number = 0;
  let isGrounded: boolean = true;
  let sonicStartPoint: f.Vector3;
  let xSpeed: number = 5;


  //values for Hud
  let sonicDeaths: number = 0;
  let sonicGold: number = 0;
  let time: number[];

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    sonic = viewport.getBranch().getChildrenByName("Sonic")[0];
    sonicStartPoint = sonic.mtxLocal.translation;
    
    let cmpCamera: f.ComponentCamera = viewport.getBranch().getChildrenByName("Sonic")[0].getComponent(f.ComponentCamera);
    viewport.camera = cmpCamera;

    f.Time.game.set(0);
    let hud:HTMLDivElement = document.querySelector("div");
    hud.style.width = "20%";
    hud.style.height = "20%";

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    let timeFrame: number = f.Loop.timeFrameGame / 1000; // time since last frame in seconds
    // ƒ.Physics.simulate();  // if physics is included and used
    if (f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_RIGHT, f.KEYBOARD_CODE.D])) {
      sonic.mtxLocal.translateX(xSpeed * timeFrame);
      updateAnimation("runningright");
    }
    
    else if(f.Keyboard.isPressedOne([f.KEYBOARD_CODE.ARROW_LEFT, f.KEYBOARD_CODE.A])) {
      sonic.mtxLocal.translateX(-xSpeed * timeFrame);
      updateAnimation("runningleft")
    }
   
    else {updateAnimation("idle")};

    if(isGrounded && f.Keyboard.isPressedOne([f.KEYBOARD_CODE.SPACE])) {
      ySpeed = 5;
      isGrounded = false;
    }

    else if(!isGrounded) {
      updateAnimation("idle")

      //create jumpanimation
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
    
    if (pos.y < -5) {
      ySpeed = 0;
      pos = sonicStartPoint;
      sonicDeaths++;
    }

    sonic.mtxLocal.translation = pos;

    checkTime();
    updateHUD();

    viewport.draw();
    // ƒ.AudioManager.default.update();
  }

  function updateAnimation(_animation: string): void {
    let currentAnimation = sonic.getChildrenByName("SonicAnimation")[0].getComponent(f.ComponentAnimator);
    let sonicTransform: f.ComponentTransform = sonic.getChildrenByName("SonicAnimation")[0].getComponent(f.ComponentTransform);
    let newAnimation: f.Animation;

    switch(_animation) {
      case "idle": {
        newAnimation = (f.Project.getResourcesByName("animation_idle")[0]) as f.Animation
        sonicTransform.mtxLocal.rotateY(calcRotation(sonicTransform,0))
        break;
      }
      case "runningleft": {
        newAnimation = (f.Project.getResourcesByName("animation_running")[0]) as f.Animation
        sonicTransform.mtxLocal.rotateY(calcRotation(sonicTransform,180))
        break;
      }
      case "runningright": {
        newAnimation = (f.Project.getResourcesByName("animation_running")[0]) as f.Animation
        sonicTransform.mtxLocal.rotateY(calcRotation(sonicTransform,0))
        break;
      }
    }

    if(currentAnimation.animation !== newAnimation) {
    currentAnimation.animation = newAnimation;
    }
  }


  //function for changing direction of animation (not mesh), right is 0 and left 180
  function calcRotation(_transform:f.ComponentTransform,_targetRotation: number): number{
    let currentRotation: number = Math.abs(_transform.mtxLocal.rotation.y);
    let targetRotation: number = Math.abs(_targetRotation);
    let value: number = 0;

    if(currentRotation <90) {
      currentRotation = 0;
    }

    if(currentRotation >90) {
      currentRotation = 180;
    }
    
    if (currentRotation == targetRotation) {
      value = 0;
    }

    if (currentRotation !== targetRotation) {
      value = 180;
    }
  return value;
  }

  function updateHUD(): void {
    let hudTime = document.querySelector("#hudTime");
    hudTime.innerHTML = "Time: " + time[2] + ":" + time[1] + ":" + time[0]
    
    let hudDeaths = document.querySelector("#hudDeaths");
    hudDeaths.innerHTML = "Deaths: " + sonicDeaths.toString();
  
    let goldCollected = document.querySelector("#hudGold")
    goldCollected.innerHTML = "Gold: " + sonicGold.toString();
  }

  function checkTime(): void {
    let timeTotal = f.Time.game.get();

    let minutes: number = Math.floor(timeTotal/60000);
    timeTotal -= minutes*60000;
    
    let seconds: number = Math.floor(timeTotal/1000);
    timeTotal -= seconds*1000;

    let ms: number = Math.floor(timeTotal)

    time = [ms, seconds, minutes];
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
