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
    import f = FudgeCore;
    let viewport: f.Viewport;
}
declare namespace Script {
    import f = FudgeCore;
    class Sonic {
        sonic: f.Node;
        position: f.Vector3;
        private speed;
        private maxSpeed;
        constructor(viewport: f.Viewport);
        update(): void;
        private movement;
        private input;
    }
}
