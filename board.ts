import { Figure, Piece } from "./figure"
import { Position } from "./position"
import { MovingRange } from "./moving-range"


export class Board {
    private figures: Map<Position, Figure | null>

    constructor(initial: { [position: string]: string }){
        const state = new Map<Position, Figure | null>()
        for (const position of Position.all()) {
            const figureCode = initial[position as string];
            state.set(position, Figure.ofString(figureCode))
        }
        this.figures = state;
    }

    tryToMove(fromPosition: Position, toPosition: Position) {
        const { figures } = this,
        from = Position.toIndex(fromPosition),
        to = Position.toIndex(toPosition)
        if (!(from.column === to.column && from.row === to.row)) {
            const figure = figures.get(fromPosition)
            if (figure !== null) {
                const pieceToTake = figures.get(toPosition)
                const isTaking = pieceToTake !== null

                if (pieceToTake === null || pieceToTake.color !== figure.color) {

                    const range = MovingRange[figure.piece](from, to, isTaking, figure.hasMoved);
                    if (range !== null && range.every(pos => figures.get(pos) === null)) {
                        if (isTaking)
                            figures.set(toPosition, null)
                        figures.set(fromPosition, null)
                        figures.set(toPosition, figure)
                        figure.hasMoved = true;
                        return true
                    }
                }
            }
        }
        return false
    }

}