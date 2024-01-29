namespace Script {
    import f = FudgeCore;
    
    export class Trap extends f.Node {
        position: f.Vector3;
        hierarchy: f.Node = viewport.getBranch();
        hierarchyBlocks: f.Node = viewport.getBranch().getChildrenByName("TrapsBlocks")[0];
        hinge:f.Node;
        block:f.Node;
        joint:f.JointRevolute;
        
    constructor(_position: f.Vector3, _name: string) {
        super("Trap");
    
        this.name = _name
        this.position = _position

        this.create(this.position)
    }

    public create(_position: f.Vector3): void {
        this.hinge = createCompleteMeshNode("Hinge", new f.Material("Cube", f.ShaderFlat, new f.CoatRemissive(new f.Color(0, 0, 0, 0))), new f.MeshCube(), 1, f.BODY_TYPE.STATIC, f.COLLISION_GROUP.GROUP_1);
        this.hierarchy.appendChild(this.hinge);
        this.hinge.mtxLocal.translate(this.position);
        this.hinge.mtxLocal.rotate(new f.Vector3(0,90,90))
        this.hinge.mtxLocal.scale(new f.Vector3(0.5, 0.1, 1));

        let imgSpriteSheet: f.TextureImage = new f.TextureImage();
        imgSpriteSheet.load("Image/Floor.png");

        this.block = createCompleteMeshNode("Block", new f.Material("Cube", f.ShaderFlatTextured, new f.CoatRemissiveTextured(new f.Color(1, 1, 1, trapsVisibility),imgSpriteSheet)), new f.MeshCube(), 1, f.BODY_TYPE.DYNAMIC, f.COLLISION_GROUP.GROUP_1);
        this.hierarchyBlocks.appendChild(this.block);
        this.block.mtxLocal.translate(this.position);
        this.block.mtxLocal.rotate(new f.Vector3(0,90,90))
        this.block.mtxLocal.scale(new f.Vector3(0.0001, 1, 1));

        this.joint = new f.JointRevolute(this.hinge.getComponent(f.ComponentRigidbody), this.block.getComponent(f.ComponentRigidbody), new f.Vector3(0, 0, 1));
        this.hinge.addComponent(this.joint);
        this.joint.minMotor = 0;
        this.joint.maxMotor = 0;
        this.joint.breakForce = 10;
      }
    }
    
}