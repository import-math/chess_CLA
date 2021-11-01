export enum Piece {
    king = "K",
    queen = "Q",
    rook = "R",
    bishop = "B",
    knight = "N",
    pawn = "P"
}

export enum Color {
    black = "b",
    white = "w"
}

export class Figure {
    constructor(
        public readonly color: Color,
        public readonly piece: Piece,
        public hasMoved = false
        ) {}

    toString(){
        return `${this.color}${this.piece}`
    }

    static ofString(code: string | null): Figure | null {
        switch (typeof code) {
            case "undefined": return null
            case "string":
                if (code.length === 2) {
                    const [color, piece] = code
                    if (Color[color] !== null && Piece[piece] !== null) 
                        return new Figure(color as any, piece as any)
                }
            default: break;
        }
        throw new Error(`invalid figure ${code}`)
    }
}