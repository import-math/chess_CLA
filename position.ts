export interface Position extends String { }
export namespace Position {
    export const columns = ["a", "b", "c", "d", "e", "f", "g", "h"]
    export const rows = ["1", "2", "3", "4", "5", "6", "7", "8"]

    export interface Index {
        readonly column: number
        readonly row: number
    }

    export const ofIndex = (column: number, row: number): Position =>
        `${columns[column]}${rows[row]}`

    export function toIndex(pos: Position): Index {
        if (typeof pos === "string" && pos.length === 2) {
            const column = columns.indexOf(pos[0]),
            row = rows.indexOf(pos[1])
            if (column > -1 && row > -1)
                return { column, row }
        }
        throw new Error(`invalid position ${pos}`)
    }

    export function* all() {
        for (let col of columns)
            for (let row of rows)
                yield col + row as Position
    }
}