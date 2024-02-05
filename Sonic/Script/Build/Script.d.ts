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
    import ƒ = FudgeCore;
    class GetTraps extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import f = FudgeCore;
    import fAid = FudgeAid;
    class Light extends f.Node {
        stateMachine: fAid.ComponentStateMachine<JOB>;
        rigidbody: f.ComponentRigidbody;
        node: f.Node;
        constructor(_name: string);
    }
}
declare namespace Script {
    export import f = FudgeCore;
    export import fAid = FudgeAid;
    let sonic: Sonic;
    let viewport: f.Viewport;
    let timeFrame: number;
    let ui: UI;
    let timer: f.Timer;
    let sounds: f.ComponentAudio[];
    let ammountLives: number;
    let maxTime: number;
    let trapsVisibility: number;
    let maxDarkness: number;
    let lightBoost: number;
    let trapsTriggered: number;
    function changeLight(_value: number): void;
    function EndGame(_endReason: string): void;
    function createCompleteMeshNode(_name: string, _material: f.Material, _mesh: f.Mesh, _mass: number, _physicsType: f.BODY_TYPE, _group?: f.COLLISION_GROUP, _colType?: f.COLLIDER_TYPE): f.Node;
}
declare namespace Script {
    import f = FudgeCore;
    class Sonic extends f.Node {
        sonic: f.Node;
        gravity: number;
        ySpeed: number;
        isGrounded: boolean;
        sonicStartPoint: f.Vector3;
        xSpeed: number;
        constructor();
        hndCollisions(_event: f.EventPhysics): void;
        move(): void;
        updateAnimation(_animation: string): void;
        checkCollisionWithBlock(_posWorld: f.Vector3): f.Node;
        checkCollisionWithGold(_posWorld: f.Vector3): f.Node;
    }
}
declare namespace Script {
    enum JOB {
        PATROL = 0,
        DIE = 1
    }
    import ƒAid = FudgeAid;
    class LightMachine extends ƒAid.ComponentStateMachine<JOB> {
        private static instructions;
        constructor();
        static get(): ƒAid.StateMachineInstructions<JOB>;
        static transitDefault(_machine: LightMachine): void;
        private static patrol;
        private static die;
        hndEvent: (_event: Event) => void;
        update: (_event: Event) => void;
    }
}
declare namespace Script {
    import f = FudgeCore;
    class Trap extends f.Node {
        position: f.Vector3;
        hierarchy: f.Node;
        hierarchyBlocks: f.Node;
        hinge: f.Node;
        block: f.Node;
        joint: f.JointRevolute;
        constructor(_position: f.Vector3, _name: string);
        create(_position: f.Vector3): void;
    }
}
declare namespace Script {
    import f = FudgeCore;
    class UI extends f.Mutable {
        ui: HTMLElement;
        time: number;
        coins: number;
        lives: number;
        traps: number;
        constructor(_time: number);
        protected reduceMutator(_mutator: f.Mutator): void;
    }
}
