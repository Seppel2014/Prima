namespace Script {
  //mainly adjusted code from the pickComponent Test to my existing scene https://jirkadelloro.github.io/FUDGE/Test/

  //ƒ replaced with f for easier usage

  import f = FudgeCore;
  let viewport: f.Viewport;

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  f.Debug.info("Main Program Template running!");


  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let root: f.Node = viewport.getBranch();
    let szene: f.Node = root.getChildrenByName("szene")[0];
    let radii: f.Node = new f.Node("Radii");
    root.replaceChild(szene, radii);
    root.appendChild(szene);

    root.addEventListener("mousemove", hit);

    viewport.canvas.addEventListener("mousemove", pick);

    f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
    
    //f.Loop.start();
  }

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

    function update(_event: Event): void {
      // ƒ.Physics.simulate();  // if physics is included and used
      viewport.draw();
      f.AudioManager.default.update();

      f.Debug.info("update")
    }
  }