namespace Script {
  //ƒ replaced with f for easier usage

  import f = FudgeCore;
  

  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  function start(_event: CustomEvent): void {
    let viewport: f.Viewport = _event.detail;
    let root: f.Node = viewport.getBranch();
    let zoo: f.Node = root.getChildrenByName("szene")[0];
    let radii: f.Node = new f.Node("Radii");
    root.replaceChild(zoo, radii);
    root.appendChild(zoo);

    root.addEventListener("mousemove", hit);

    f.Debug.branch(root);

    viewport.canvas.addEventListener("mousemove", pick);

    function pick(_event: PointerEvent): void {
      document.querySelector("div").innerHTML = "";
      viewport.draw();
      viewport.dispatchPointerEvent(_event);

      //f.Debug.info(_event);
    }

    function hit(_event: PointerEvent): void {
      let node: f.Node = (<f.Node>_event.target);
      let cmpPick: f.ComponentPick = node.getComponent(f.ComponentPick);

      f.Debug.info(cmpPick.node.name);

      document.querySelector("div").innerHTML += cmpPick.pick + ":" + node.name + "<br/>";
    }
  }
}