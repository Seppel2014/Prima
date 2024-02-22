namespace Script {
    import f = FudgeCore;
    import fAid = FudgeAid
    export class Light extends f.Node{
        stateMachine: fAid.ComponentStateMachine<JOB>;
        rigidbody: f.ComponentRigidbody;
        node: f.Node;

        constructor(_name:string){
            super("Light")
            this.node = viewport.getBranch().getChildrenByName("StateMachines")[0].getChildrenByName(_name)[0];
            this.rigidbody = this.node.getComponent(f.ComponentRigidbody);
            this.stateMachine = new LightMachine
            this.addComponent(this.stateMachine)

            this.stateMachine.transit(JOB.PATROL);

            this.rigidbody.addEventListener(f.EVENT_PHYSICS.COLLISION_ENTER, (_event: ƒ.EventPhysics) => {
                if (_event.cmpRigidbody.node.name == "Vampire") {
                    changeLight(lightBoost)
                    this.stateMachine.transit(JOB.DIE);
                }
            });
        }

    }
}