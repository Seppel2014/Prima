declare namespace Script {
    import f = FudgeCore;
    class Block extends f.Node {
        static meshCube: f.MeshCube;
        static mtrCube: f.Material;
        constructor(_position: f.Vector3);
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
}
