namespace Script {
    import f = FudgeCore;
    import fUI = FudgeUserInterface;

    export class UI extends f.Mutable {
        public ui: HTMLElement = document.getElementById("UI");
        
        public time: number = maxTime;
        public coins: number = 0;
        public lives: number = ammountLives;
        public traps: number = trapsTriggered;

        public constructor(_time: number) {
          super();
          new fUI.Controller(this, this.ui);
          this.time = _time;
        }

        protected reduceMutator(_mutator: f.Mutator): void {
            //unused but necessary for baseclass f.mutable 
        }
    }

    
}