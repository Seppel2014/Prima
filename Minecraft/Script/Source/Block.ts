namespace Script {
    import f = FudgeCore;
    
    export class Block extends f.Node {
        static meshCube: f.MeshCube = new f.MeshCube("Block");
        static mtrCube: f.Material = new f.Material("Block",f.ShaderFlat, new f.CoatRemissive());
        
        constructor(_position: f.Vector3){
            super("Block")
            this.addComponent(new f.ComponentMesh(Block.meshCube));
            
            let cmpMaterial: f.ComponentMaterial = new f.ComponentMaterial(Block.mtrCube);
            cmpMaterial.clrPrimary =rndColor();

            this.addComponent(cmpMaterial);


            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(_position)));
            this.getComponent(f.ComponentTransform).mtxLocal.scale(new f.Vector3(0.9,0.9,0.9));

            let cmpPick: f.ComponentPick = new f.ComponentPick
            cmpPick.pick = f.PICK.CAMERA;
            
            this.addComponent(cmpPick);
        }
    }

    function randomNumber(_max: number, _min: number): number {
        let randomnumber: number = Math.random() * (_max-_min) + _min;
        return randomnumber;
    }
    
    function rndColor(): f.Color {
        let color: f.Color = f.Color.CSS("rgb("+randomNumber(255,1)+","+randomNumber(255,1)+","+randomNumber(255,1)+")");
        return color;
    }
    
}