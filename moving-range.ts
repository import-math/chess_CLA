import { Piece } from "./figure";
import { Position } from "./position";
type PosIndex = Position.Index

function ordered(prev: PosIndex, next: PosIndex) {
    const {column: prevCol, row: prevRow } = prev,
    { column: nextCol, row: nextRow } = next
    const [beginCol, endCol] = prevCol < nextCol ? [prevCol, nextCol] : [nextCol, prevCol]
    const [beginRow, endRow] = prevRow < nextRow ? [prevRow, nextRow] : [nextRow, prevRow]

    return [beginCol, beginRow, endCol, endRow] as const
}

function range (begin: number, end: number) {
    const res = new Array<number>() 
    for (let i = begin + 1; i < end; i++)
        res.push(i)
    return res
}

function direct(prev: PosIndex, next: PosIndex) {
    const [beginCol, beginRow, endCol, endRow] = ordered(prev, next)
    if (prev.column === next.column) 
        return range(beginRow, endRow).map(rowIndex => Position.ofIndex(beginCol, rowIndex))
    
    else if (prev.row === next.row)
        return range(beginCol, endCol).map(colIndex => Position.ofIndex(colIndex, beginRow))
    return null
}

function diagonal(prev: PosIndex, next: PosIndex) {
    const [beginCol, beginRow, endCol, endRow] = ordered(prev, next)
    const diff = endCol - beginCol
    if (endRow - beginRow !== diff)
        return null

    const res = new Array<Position>()
    for (let col = beginCol + 1, row = beginRow + 1; col < endCol && row < endRow; col++, row++)
        res.push(Position.ofIndex(col, row))
    return res
}
const checkForKnight = (prev: PosIndex, next: PosIndex) => {
    const movableOffSets = ['1/2', '-1/2', '2/1', '-2/1', '1/-2', '-1/-2', '-2/-1', '2/-1'];
    const rowOffset = prev.row - next.row;
    const columnOffset = prev.column - next.column;
    if(movableOffSets.includes(`${rowOffset}/${columnOffset}`)) return []
    return null
}
const checkForKing = (diff: number) => [0, 1, -1].includes(diff)

export interface MovingRange {
    (prev: PosIndex, next: PosIndex, isTaking?: boolean, hasMoved?: boolean): Position[] | null
}

export const MovingRange: Record<Piece, MovingRange> = {
    [Piece.knight]: (prev, next) => checkForKnight(prev, next),
    [Piece.bishop]: diagonal,
    [Piece.rook]: direct,
    [Piece.queen]: (prev, next) => direct(prev, next) ?? diagonal(prev, next),
    [Piece.pawn]: (prev, next, isTaking, hasMoved) => {
        const [beginCol, beginRow, endCol, endRow] = ordered(prev, next);
        if (isTaking) {
            if (beginRow + 1 === endRow && Math.abs(beginCol - endCol) === 1)
                return []
        }
        else if (prev.column === next.column)
            switch (endRow - beginRow) {
                case 1: return []
                case 2:
                    if (!hasMoved)
                        return [Position.ofIndex(prev.column, beginRow + 1)] 
                default: break
            }
        return null
    },
    [Piece.king]: (prev, next) =>
        checkForKing(next.column - prev.column) && checkForKing(next.row - prev.row) ? [] : null
}