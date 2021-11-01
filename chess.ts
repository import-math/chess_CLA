import config from './game-init.json';
import { Board } from './board';
import { Position } from './position';

enum Turn {
    white = 'White',
    black = 'Black'
}

interface Game {
    board: Board
    rl: any
    turn: Turn
}
class Game {
    constructor(
        ) {
            this.board = new Board(config.initialSetup);
            this.rl = require('readline').createInterface({
                input: process.stdin,
                output: process.stdout
            });

            this.turn = Turn.white
            this.init();
            // this.board.tryToMove('e7', 'e5')
        }


        init(){
            this.rl.write(`
            Welcome to the chess game.
            When it's your turn, type the cords of initial and final positions of your move, comma separated.
            for example: f2, f4
            
            
            
            
            `);
            this.writeRequest()

            this.rl.on('line', () => this.writeRequest());
            this.rl.on('close', () => console.log('\nbye, bye'))
        }



        validateInput(input: string) {
            const positions = input.trim().replace(/\s/g, '').split(',');
            if(positions.length === 2){
                const [prev, next] = positions;
           
            if  (
                Position.columns.includes(prev[0]) &&
                Position.columns.includes(next[0]) &&
                Position.rows.includes(prev[1]) &&
                Position.rows.includes(prev[1])
                ) return { prev, next }
            }
            return null
        }

        writeRequest(optionalMessage?: string){
            this.rl.question(optionalMessage ? optionalMessage : `write your move, ${this.turn}: `, (input) => {
                const validated = this.validateInput(input);
                if(validated){
                        const {prev, next} = validated;
                        const move = this.board.tryToMove(prev, next);
                        if(move === true){
                            if(this.turn === Turn.white){
                                this.turn = Turn.black;
                                this.writeRequest()
                            }  else {
                                this.turn = Turn.white;
                                this.writeRequest()
                            }
                        }
                        if(move === false){
                            this.writeRequest(`that move doesn't seem all correct to me.. Try one more time: `)
                        }
                } 
                if(validated === null){
                    this.writeRequest(`that move doesn't seem all correct to me.. Try one more time: `);
                }
            });
            
        }
}

const game = new Game();