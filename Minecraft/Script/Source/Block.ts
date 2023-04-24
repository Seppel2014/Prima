namespace Script {
    import f = FudgeCore;
    
    export class Block extends f.Node {
        static meshCube: f.MeshCube = new f.MeshCube("Block");
        static mtrCube: f.Material = new f.Material("Block",f.ShaderFlat, new f.CoatRemissive());
        
        constructor(_position: f.Vector3, _color: f.Color){
            super("Block")
            this.addComponent(new f.ComponentMesh(Block.meshCube));
            
            let cmpMaterial: f.ComponentMaterial = new f.ComponentMaterial(Block.mtrCube);
            cmpMaterial.clrPrimary =_color;

            this.addComponent(cmpMaterial);


            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(_position)));
            console.log()
        }
    }
}