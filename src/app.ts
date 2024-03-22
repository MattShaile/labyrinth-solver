import { Grid } from "./grid";
import { Puzzle } from "./puzzle";
import { Solver } from "./solver";

const easy: Puzzle = {
    start: [0, 4],
    end: [4, 0],
    clues: [
        [[0], [2], [2], [0]],
        [[1, 1], [1, 1], [4], [4]]
    ]
};

const hard: Puzzle = {
    start: [3, 3],
    end: [0, 9],
    clues: [
        [[4, 1], [2, 1], [4, 1], [2, 1, 1], [2, 1, 1], [2, 4], [2, 1, 1], [2, 2], [2]],
        [[2, 2], [2], [4], [7], [2, 1], [6, 1], [4, 1], [2, 2, 3], [2, 3]]
    ]
};

const grid = new Grid(easy);
const solver = new Solver();
const solution = solver.solve(easy);

grid.drawSolution(solution);