import { Component, OnInit } from '@angular/core';

import {Gamelogic} from '../gamelogic';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
  providers:[Gamelogic]
})
export class GameComponent implements OnInit {

  constructor(public game: Gamelogic) { }

  value: Array<string> = [];

  player1Loss: Number = 0 ;
  player2Loss: Number = 0 ;

  player1Win: Number = 0 ;
  player2Win: Number = 0 ;

  ngOnInit(): void {
  }

  startGame(): void{
    this.value = ['','','','','','','','',''];
    this.game.gamestart();
    const currentPlayer = 'Current turn: Player: ' + this.game.currentTurn;
    const information = document.querySelector('.current-status');
    if(information !== null){
      information.innerHTML = currentPlayer; 
    }

  }

  async clickSubfield (subfield:any ): Promise<void> {
    if(this.game.gameStatus === 1){
      
      const position = subfield.currentTarget.getAttribute('position');
      const information = document.querySelector('.current-status');
      console.log(position);
      this.value[position] = (this.game.currentTurn === 1)? 'X':'O';

      this.game.setField(position, this.game.currentTurn);
      const color = this.game.getPlayerColorClass();
      subfield.currentTarget.classList.add(color);
      
      let flag = 0;
      
      await this.game.checkGameEndWinner().then((end: boolean) => {
        if( this.game.gameStatus === 0 && end && information!==null){
          //console.log("abc");
          flag = 1;
          if(this.game.currentTurn === 1){
            this.player1Win = +this.player1Win + 1;
            this.player2Loss = +this.player2Loss + 1;
          }else{
            this.player2Win = +this.player2Win + 1;
            this.player1Loss = +this.player1Loss + 1;
          }
          information.innerHTML = 'The winner is player: ' + this.game.currentTurn ;
        }
      });

      if(!flag){
        await this.game.checkGameEndFull().then((end: boolean) => {
          if( this.game.gameStatus === 0 && end && information!=null){
            information.innerHTML = 'No winner, draw';
          }
        });
      }
      
      this.game.changePlayer();

      if(this.game.gameStatus === 1){
        const currentPlayer = 'Current turn: Player: ' + this.game.currentTurn;
        if(information !== null){
          information.innerHTML = currentPlayer; 
        }
      }
      
    }

    
  }

}
