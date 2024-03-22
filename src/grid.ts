import { Puzzle } from "./puzzle";

export class Grid {

    protected canvas: HTMLCanvasElement;
    protected cells: HTMLTableCellElement[][];

    constructor(
        protected puzzle: Puzzle,
    ) {
        this.drawTable();
        this.drawCanvas();

        window.onresize = () => this.resizeCanvas();
    }

    public drawSolution(path: number[][], walls: number[][]) {
        this.drawPath(path);
        this.drawWalls(walls);
    }

    protected drawPath(path: number[][]) {
        const ctx = this.canvas.getContext("2d");
        ctx.lineWidth = 10;
        ctx.strokeStyle = "#0000ff";
        const spacing = 1000 / (this.puzzle.clues[0].length + 1);

        const convert = (n: number) => {
            return (n + 0.5) * spacing
        }

        ctx.clearRect(0, 0, 1000, 1000);
        ctx.beginPath();
        ctx.moveTo(convert(path[0][0]), convert(path[0][1]));
        path.forEach((point) => {
            ctx.lineTo(convert(point[0]), convert(point[1]));
        });

        ctx.stroke();
    }

    protected drawWalls(walls: number[][]) {
        walls.forEach((rowWalls, y) => {
            rowWalls.forEach((wall, x) => {
                this.cells[y][x].classList.add(`wall-${wall}`);
            });
        });
    }

    protected drawTable() {
        const table = document.createElement("table");
        table.id = "grid";

        const size = this.puzzle.clues[0].length + 1;
        this.cells = [];

        for (let y = 0; y < size + 1; y++) {

            const row = document.createElement("tr");
            table.appendChild(row);

            if (y > 0) {
                this.cells.push([]);
            }

            for (let x = 0; x < size + 1; x++) {
                const isLabel = y === 0 || x === 0;
                const cell = document.createElement(isLabel ? "th" : "td");
                row.appendChild(cell);

                if (y > 0 && x > 0) {
                    this.cells[y - 1].push(cell);
                }

                if (this.puzzle.start[0] === x - 1 && this.puzzle.start[1] === y - 1) {
                    cell.classList.add("start");
                    console.log(cell);
                }
                if (this.puzzle.end[0] === x - 1 && this.puzzle.end[1] === y - 1) {
                    cell.classList.add("end");
                }

                if (isLabel) {
                    if (y > 0 && y < size || x > 0 && x < size) {
                        const cellText = document.createElement("div");
                        if (x > 0) {
                            cellText.classList.add("vertical-clue-text");
                            cellText.innerHTML = this.puzzle.clues[0][x - 1].join("<br>");
                        } else {
                            cellText.classList.add("clue-text");
                            cellText.innerHTML = this.puzzle.clues[1][y - 1].join(" ");
                        }
                        cell.appendChild(cellText);
                    }
                }
            }
        }

        document.getElementById("content").appendChild(table);
    }

    protected drawCanvas() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 1000;
        this.canvas.height = 1000;
        document.body.appendChild(this.canvas);

        this.resizeCanvas();
    }

    protected resizeCanvas() {
        const table = document.getElementById("grid") as HTMLTableElement;
        const topLeftCell = table.rows[0].cells[0];
        const startCell = table.rows[1].cells[1];
        const tableRect = table.getBoundingClientRect();
        const topLeftRect = topLeftCell.getBoundingClientRect();
        const cellRect = startCell.getBoundingClientRect();
        this.canvas.style.top = cellRect.top + 'px';
        this.canvas.style.left = cellRect.left + 'px';
        this.canvas.style.width = (tableRect.width - topLeftRect.width) + 'px';
        this.canvas.style.height = (tableRect.height - topLeftRect.height) + 'px';
    }

}