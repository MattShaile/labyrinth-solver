import { Grid } from "./grid";
import { Puzzle } from "./puzzle";

const easy: Puzzle = {
    start: [4, 0],
    end: [0, 4],
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

new Grid(easy);