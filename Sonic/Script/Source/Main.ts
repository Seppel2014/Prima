namespace Script {
  export import f = FudgeCore;
  export import fAid = FudgeAid;

  //sonic
  let sonic: Sonic;
  
  //general Variables
  export let viewport: f.Viewport;
  export let timeFrame: number;
  export let ui: UI;
  export let timer: f.Timer;

  //audio variables
  export let sounds: f.ComponentAudio[];
  let audioListener: f.ComponentAudioListener;

  //externalData
  interface ExternalData {
    [name: string]: number;
  }
  let config: ExternalData;

  export let ammountLives: number;
  export let maxTime: number;
  export let trapsVisibility: number;
  export let maxDarkness: number;
  export let lightBoost: number;
  export let trapsTriggered: number = 0;


  let light: f.ComponentLight;

  document.addEventListener("interactiveViewportStarted", <EventListener><unknown>start);

  async function start(_event: CustomEvent): Promise<void> {
    await getExternalData();

    viewport = _event.detail;

    light = viewport.getBranch().getChildrenByName("AmbientLight")[0].getComponent(f.ComponentLight)

    sonic = new Sonic();
    let cmpCamera: f.ComponentCamera = viewport.getBranch().getChildrenByName("Sonic")[0].getComponent(f.ComponentCamera);
    viewport.camera = cmpCamera;

    timer = new f.Timer(new f.Time, 1000, 0, updateTimer);
    ui = new UI(maxTime);
    
    sounds= viewport.getBranch().getComponents(f.ComponentAudio);
    sounds[0].play(true);
    audioListener = viewport.getBranch().getComponent(f.ComponentAudioListener);
    f.AudioManager.default.listenWith(audioListener);
    f.AudioManager.default.listenTo(viewport.getBranch());

    createTraps();
    createMachines();

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    timeFrame = f.Loop.timeFrameGame / 1000; // time since last frame in seconds
    f.Physics.simulate();  // if physics is included and used
    
    sonic.move();
    changeLight(0);

    viewport.draw();
    f.AudioManager.default.update();
  }

  export function changeLight(_value:number):void {
    let color:f.Color = light.light.color;
    let reduced:number = color.r-0.001+_value
    //console.log((1+_value-(f.Time.game.get()/1000)/maxTime))

    if(reduced > maxDarkness) {
      let reducedColor: f.Color = new f.Color(reduced,reduced,reduced);
      light.light.color = reducedColor
    }
  }

  async function getExternalData(): Promise<void> {
    let response: Response = await fetch("Script/config.json");
    config = await response.json();

    ammountLives = config["lives"];
    maxTime = config["maxTime"];
    trapsVisibility = config["trapsVisibility"]
    maxDarkness = config["maxDarkness"]
    lightBoost = config["lightboost"]
  }

  function createTraps():void {
    let TrapsPlaceholders = viewport.getBranch().getChildrenByName("TrapPlaceholders")[0].getChildren();
    for (let trapP of TrapsPlaceholders) {
      new Trap(trapP.getComponent(f.ComponentMesh).mtxPivot.translation,trapP.name)
    }
  }

  function createMachines():void {
    let StateMachines = viewport.getBranch().getChildrenByName("StateMachines")[0].getChildren();
    for (let machine of StateMachines) {
      new Light(machine.name)
    }
  }

  function updateTimer():void {
    ui.time-=1;
    if (ui.time < 0) {
      EndGame("time");
    }
  }

  export function EndGame(_endReason: string): void {
    ui.ui.style.visibility = "hidden";
    ui.time = 10000
    
    let endDiv = document.getElementById("endDiv");
    endDiv.style.display="flex";

    switch(_endReason) {
      case "time": {
        console.log("ran out of time")
        sounds[3].play(true);
        endDiv.innerHTML = "YOU RAN OUT OF TIME<br>You collected "+ui.coins+" coins, <br> you triggered "+ui.traps+" traps <br> You had "+ui.lives+" lives left" 
        break;
      }
      case "lives": {
        console.log("ran out of lives")
        endDiv.innerHTML = "YOU RAN OUT OF LIVES<br>You collected "+ui.coins+" coins <br> You triggered "+ui.traps+" traps" 
        sounds[3].play(true);
        break;
      }
      case "end": {
        console.log("reached End")
        endDiv.innerHTML = "YOU REACHED THE END<br>You collected "+ui.coins+" coins <br> You triggered "+ui.traps+" traps <br> You had "+ui.lives+" lives left" 
        sounds[4].play(true);
        break;
      }
    }
    f.Loop.removeEventListener(f.EVENT.LOOP_FRAME, update);
  }

  export function createCompleteMeshNode(_name: string, _material: f.Material, _mesh: f.Mesh, _mass: number, _physicsType: f.BODY_TYPE, _group: f.COLLISION_GROUP = f.COLLISION_GROUP.DEFAULT, _colType: f.COLLIDER_TYPE = f.COLLIDER_TYPE.CUBE): f.Node {
    let node: f.Node = new f.Node(_name);
    let cmpMesh: f.ComponentMesh = new f.ComponentMesh(_mesh);
    let cmpMaterial: f.ComponentMaterial = new f.ComponentMaterial(_material);

    let cmpTransform: f.ComponentTransform = new f.ComponentTransform();

    let cmpRigidbody: f.ComponentRigidbody = new f.ComponentRigidbody(_mass, _physicsType, _colType, _group);
    cmpRigidbody.restitution = 0.2;
    cmpRigidbody.friction = 0.8;
    cmpRigidbody.dampTranslation = 0
    
    node.addComponent(cmpMesh);
    node.addComponent(cmpMaterial);

    cmpMaterial.mtxPivot.rotate(-90)

    node.addComponent(cmpTransform);
    node.addComponent(cmpRigidbody);

    return node;
  }
}
