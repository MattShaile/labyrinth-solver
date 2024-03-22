import { Puzzle } from "./puzzle";

export class Grid {

    constructor(
        protected puzzle: Puzzle,
    ) {
        this.drawTable();
    }

    protected drawTable() {
        const table = document.createElement("table");

        const size = this.puzzle.clues[0].length + 1;

        for (let y = 0; y < size + 1; y++) {

            const row = document.createElement("tr");
            table.appendChild(row);

            for (let x = 0; x < size + 1; x++) {
                const isLabel = y === 0 || x === 0;
                const cell = document.createElement(isLabel ? "th" : "td");
                row.appendChild(cell);

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

}