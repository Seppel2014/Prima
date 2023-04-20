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

    console.log(viewport.getBranch().getChildrenByName("EndPost")[0].mtxLocal.translation);

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
      updateAnimation("jumping")
    }

    ySpeed += gravity * timeFrame;
    let pos: f.Vector3 = sonic.mtxLocal.translation;
    pos.y += ySpeed * timeFrame;

    let tileCollided: f.Node = checkCollisionWithBlock(pos);
    if (tileCollided) {
      ySpeed = 0;
      pos.y = tileCollided.mtxWorld.translation.y + 0.45;
      isGrounded = true;
    }
    
    if (pos.y < -5) {
      ySpeed = 0;
      pos = sonicStartPoint;
      sonicDeaths++;
    }

    sonic.mtxLocal.translation = pos;
    checkEnd();
    checkTime();
    updateHUD();
    checkCollisionWithGold(pos);

    viewport.draw();
    // ƒ.AudioManager.default.update();
  }

  function checkEnd() {
    let pos: f.Vector3 = viewport.getBranch().getChildrenByName("EndPost")[0].mtxLocal.translation
      if (sonic.mtxLocal.translation.x > pos.x - 0.5 && sonic.mtxLocal.translation.y > pos.y - 3 && sonic.mtxLocal.translation.y < pos.y + 3){
      
      //big delay on github, direct reload offline, replace with endscreen or next level
      location.reload(); //show some kind of endscreen or next level
    }
  }

  function updateAnimation(_animation: string): void {
    let currentAnimation = sonic.getChildrenByName("SonicAnimation")[0].getComponent(f.ComponentAnimator);
    let transformMtx: f.Matrix4x4 = sonic.getChildrenByName("SonicAnimation")[0].getComponent(f.ComponentTransform).mtxLocal;
    let newAnimation: f.Animation;

    switch(_animation) {
      case "idle": {
        newAnimation = (f.Project.getResourcesByName("animation_idle")[0]) as f.Animation
        let newrotation = new f.Vector3(transformMtx.rotation.x, 0, transformMtx.rotation.z)
        transformMtx.rotation = newrotation;
        break;
      }
      case "runningleft": {
        newAnimation = (f.Project.getResourcesByName("animation_running")[0]) as f.Animation
        let newrotation = new f.Vector3(transformMtx.rotation.x, 180, transformMtx.rotation.z)
        transformMtx.rotation = newrotation;
        break;
      }
      case "runningright": {
        newAnimation = (f.Project.getResourcesByName("animation_running")[0]) as f.Animation
        let newrotation = new f.Vector3(transformMtx.rotation.x, 0, transformMtx.rotation.z)
        transformMtx.rotation = newrotation;
        break;
      }
      case "jumping": {
        newAnimation = (f.Project.getResourcesByName("animation_jumping")[0]) as f.Animation
        let newrotation = new f.Vector3(transformMtx.rotation.x, 0, transformMtx.rotation.z)
        transformMtx.rotation = newrotation;
        break;
      }
    }

    if(currentAnimation.animation !== newAnimation) {
    currentAnimation.animation = newAnimation;
    }
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

  function checkCollisionWithBlock(_posWorld: f.Vector3): f.Node {
    let tiles: f.Node[] = viewport.getBranch().getChildrenByName("Terrain")[0].getChildren()
    for (let tile of tiles) {
      let pos: f.Vector3 = f.Vector3.TRANSFORMATION(_posWorld, tile.mtxWorldInverse, true);
      if (pos.y < 0.45 && pos.x > -0.6 && pos.x < 0.6){
        if(pos.y < -1) {
          break;
        }
        else {
          return tile;
        }
      }
    }
    return null;
  }

  function checkCollisionWithGold(_posWorld: f.Vector3): f.Node {
    let golds: f.Node[] = viewport.getBranch().getChildrenByName("Golds")[0].getChildren()
    for (let gold of golds) {
      let pos: f.Vector3 = f.Vector3.TRANSFORMATION(_posWorld, gold.mtxWorldInverse, true);
      if (pos.y < 0.45 && pos.x > -0.6 && pos.x < 0.6){
        if(pos.y < -1) {
          break;
        }
        else {
          viewport.getBranch().getChildrenByName("Golds")[0].removeChild(gold);
          sonicGold++;
          return gold;
        }
      }
    }
    return null;
  }
}