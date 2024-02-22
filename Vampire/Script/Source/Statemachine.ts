namespace Script {
    export enum JOB {
      PATROL, DIE
    }
  
    import ƒAid = FudgeAid;
  
    export class LightMachine extends ƒAid.ComponentStateMachine<JOB> {
      private static instructions: ƒAid.StateMachineInstructions<JOB> = LightMachine.get();

      public constructor() {
        super();
        this.instructions = LightMachine.instructions;

        if (ƒ.Project.mode == ƒ.MODE.EDITOR)
          return;
        this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
        this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
      }

      public static get(): ƒAid.StateMachineInstructions<JOB> {
        let setup: ƒAid.StateMachineInstructions<JOB> = new ƒAid.StateMachineInstructions();
        setup.transitDefault = LightMachine.transitDefault;
        setup.actDefault = LightMachine.patrol;
        setup.setAction(JOB.DIE, <f.General>this.die);
        return setup;
      }
  
      public static transitDefault(_machine: LightMachine): void {
        //console.log(_machine, `TransitDefault   ${JOB[_machine.stateCurrent]} -> ${JOB[_machine.stateNext]}`);
      }

      private static async patrol(_machine: LightMachine): Promise<void> {
        //console.log(_machine, `patrol       ${JOB[_machine.stateCurrent]}`);
      }

      private static async die(_machine: LightMachine): Promise<void> {
        //console.log(_machine, `die       ${JOB[_machine.stateCurrent]}`);
        // @ts-ignore 
        _machine.node.node.getComponent(f.ComponentRigidbody).typeBody = 0
        
      }

      public hndEvent = (_event: Event): void => {
        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, this.update);
      }

      public update = (_event: Event): void => {
        this.act();
      }
    }
  }