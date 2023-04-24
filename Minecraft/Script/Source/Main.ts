namespace Script {
  
  
  //read about rays and picking 3d
  
  
  import f = FudgeCore;
  f.Debug.info("Main Program Template running!");

  let viewport: f.Viewport;

  //@ts-ignore
  document.addEventListener("interactiveViewportStarted", start);

  async function start(_event: CustomEvent): Promise<void> {
    viewport = _event.detail;
    /*let graph1: f.Graph = <f.Graph>f.Project.resources["Graph|2023-04-23T13:10:15.212Z|78039"];
    let instance: f.GraphInstance = await f.Project.createGraphInstance(graph1);
    console.log(instance.mtxLocal.translation);
    */


    
    /*let block:Block = new Block(f.Vector3.X(0),f.Color.CSS("red"));
    viewport.getBranch().addChild(block)
    console.log(block.mtxLocal);
*/
    for(let i = 0; i < 100; i++){
      let block:Block = new Block(f.Vector3.X(i),f.Color.CSS("red"));
      viewport.getBranch().addChild(block)
    }

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    f.Loop.start();  // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
  }

  function update(_event: Event): void {
    // ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    f.AudioManager.default.update();
    
  }
}
