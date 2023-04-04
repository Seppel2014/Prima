namespace Script {
  //mainly adjusted code from the pickComponent Test to my existing scene https://jirkadelloro.github.io/FUDGE/Test/

  //ƒ replaced with f for easier usage

  import f = FudgeCore;
  
  export let viewport: f.Viewport;

  let sonic: Sonic;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  f.Debug.info("Main Program Template running!");


  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    sonic = new Sonic(viewport);
    
    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    
    let charNode:f.Node = viewport.getBranch().getChildrenByName("Character")[0];
    let cmpCamera = charNode.getChildrenByName("Sonic")[0].getComponent(f.ComponentCamera);

    viewport.camera = cmpCamera;
    f.Loop.start();
  }

  function update(_event: Event): void {
    sonic.update();

    
    // ƒ.Physics.simulate();  // if physics is included and used
    //f.AudioManager.default.update();
    
    viewport.draw();
    f.Debug.info("update")
  }
}

/*function checkBoxes(): void {
    let floors: f.Node = viewport.getBranch().getChildrenByName("terrain")[0];
    
    for (let floor of floors.getChildren()) {
      
      let floorMesh = floor.getComponent(f.ComponentMesh);
      

      let topLeft = floorMesh.mesh.vertices[0].position.x + floorMesh.mtxWorld.translation.x;
      let topRight = floorMesh.mesh.vertices[3].position.x + floorMesh.mtxWorld.translation.x
     
      f.Debug.info(floorMesh);
      f.Debug.info(topLeft + " topleft");
      f.Debug.info(topRight + " topright");
      
    }
  }*/