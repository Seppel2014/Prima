namespace Script {
    import f = FudgeCore;

    let camera: f.ComponentCamera;
    
    export function adjustCamera(): void {
    camera = viewport.camera;
    camera.mtxPivot.rotateY(45);
    camera.mtxPivot.rotateX(45);
    camera.mtxPivot.translateZ(-20);
    camera.mtxPivot.translateY(2);
    }
    
    export function handleKeyboard(_event: KeyboardEvent): void {
        console.log(_event);

    if (_event.key == "d") {
        camera.mtxPivot.translateX(-0.3);
        //camera.mtxPivot.translateY(-0.1);
      }
      
    else if(_event.key == "a") {
        camera.mtxPivot.translateX(0.3);
        //camera.mtxPivot.translateY(0.1);
      }

    else if(_event.key == "s") {
        camera.mtxPivot.translateY(-0.3);
        camera.mtxPivot.translateZ(-0.3);
      }

    else if(_event.key == "w") {
        camera.mtxPivot.translateY(0.3);
        camera.mtxPivot.translateZ(0.3);
      }
    }

}