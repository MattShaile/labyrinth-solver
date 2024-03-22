import { Puzzle } from "./puzzle";
import { Solution } from "./solution";
import { WALL_CONVERSIONS } from "./wall";

export class Solver {
    public solve(puzzle: Puzzle): Solution {
        const size = puzzle.clues[0].length + 1;

        const allClues = [...puzzle.clues[0], ...puzzle.clues[1]];
        const possibleSolutions = allClues.map((clues) => this.generateWallPossibilities(size, clues));

        let totalPossibilities = 1;
        possibleSolutions.forEach((n) => {
            totalPossibilities *= n.length
        });
        console.log("Trying ", totalPossibilities, " solutions");

        const possibleCombinations = this.generateWallPossibilityCombinations(possibleSolutions);

        while (possibleCombinations.length > 0) {
            const solution = possibleCombinations.pop();
            // Convert wall possibilities to wall grid
            let wallGrid: number[][];
            try {
                wallGrid = this.createWallGrid(solution);
            } catch (e) {
                continue;
            }

            // Check if path works
            const path = this.createPath(puzzle, wallGrid);

            if (!path || path.length < size * size) {
                continue;
            }

            const convertedWallGrid = wallGrid.map((row) => row.map((cell) => WALL_CONVERSIONS.get(cell)));

            return { path, walls: convertedWallGrid };
        }
    }

    protected generateWallPossibilityCombinations(possibilities: number[][][]): number[][][] {
        // Base case: if there is only one array, return its elements as individual combinations
        if (possibilities.length === 1) {
            return possibilities[0].map(item => [item]);
        }

        // Get the first array and the remaining arrays
        const firstArray = possibilities[0];
        const remainingArrays = possibilities.slice(1);

        // Recursively generate combinations for the remaining arrays
        const remainingCombinations = this.generateWallPossibilityCombinations(remainingArrays);

        // Generate combinations by combining elements from the first array with each combination from the remaining arrays
        const combinations = [];
        for (const item of firstArray) {
            for (const combination of remainingCombinations) {
                combinations.push([item, ...combination]);
            }
        }

        return combinations;
    }

    // Recursive function to generate solutions
    protected generateWallPossibilities(length: number, clues: number[]): number[][] {
        const solutions: number[][] = [];

        // Recursive function to generate solutions
        function generate(currentSolution: number[], index: number, remainingBlocks: number): void {
            // Base case: if no more blocks left to add
            if (remainingBlocks === 0) {
                // Check if the solution length matches the given length
                if (currentSolution.length === length) {
                    solutions.push([...currentSolution]); // Add the solution to the list of solutions
                }
                return;
            }

            // Iterate through possible positions to add the next block
            for (let i = index; i < currentSolution.length; i++) {
                // Create a copy of the current solution
                const newSolution = [...currentSolution];

                // If the clue is 0, fill the remaining cells with 0's and exit the loop
                if (clues[clues.length - remainingBlocks] === 0) {
                    for (let j = i; j < currentSolution.length; j++) {
                        newSolution[j] = 0;
                    }
                    solutions.push(newSolution);
                    return;
                }

                // Add the block of 1's
                for (let j = 0; j < clues[clues.length - remainingBlocks]; j++) {
                    newSolution[i + j] = 1;
                }

                // Recur to add the next block
                generate(newSolution, i + clues[clues.length - remainingBlocks] + 1, remainingBlocks - 1);
            }
        }

        // Start the recursive generation process
        generate(new Array(length).fill(0), 0, clues.length);

        return solutions;
    }

    protected createWallGrid(walls: number[][]) {
        const size = walls[0].length;

        const wallGrid: number[][] = [];
        for (let y = 0; y < size; y++) {
            wallGrid.push([]);
            for (let x = 0; x < size; x++) {
                let wallType = 0;
                // Check walls surrounding grid space
                for (let ox = -1; ox < 2; ox++) {
                    for (let oy = -1; oy < 2; oy++) {
                        if (Math.abs(ox) === Math.abs(oy)) {
                            // Only check up, left, right and down
                            continue;
                        }

                        // Edge walls
                        let isEdge = false;
                        if (x === 0 && ox === -1) {
                            isEdge = true;
                            wallType |= 8;
                        } else if (x === size - 1 && ox === 1) {
                            isEdge = true;
                            wallType |= 2;
                        }
                        if (y === 0 && oy === -1) {
                            isEdge = true;
                            wallType |= 1;
                        } else if (y === size - 1 && oy === 1) {
                            isEdge = true;
                            wallType |= 4;
                        }

                        // Non-edge walls
                        if (!isEdge) {
                            if (ox === 1) {
                                // Check right
                                wallType |= (2 * walls[x][y]);
                            } else if (ox === -1) {
                                // Check left
                                wallType |= (8 * walls[x - 1][y]);
                            } else if (oy === 1) {
                                // Check down
                                wallType |= (4 * walls[size + y - 1][x]);
                            } else {
                                // Check up
                                wallType |= (1 * walls[size + y - 2][x]);
                            }
                        }

                    }
                }

                if (!WALL_CONVERSIONS.has(wallType)) {
                    throw new Error();
                }
                wallGrid[y].push(wallType);
            }
        }

        return wallGrid;
    }

    private createPath(puzzle: Puzzle, wallGrid: number[][]) {
        const path = [puzzle.start];
        const size = puzzle.clues[0].length + 1;

        while (path.length < size * size) {
            const previousCell = path[path.length - 2] || null;
            const currentCell = path[path.length - 1];
            const cellWalls = wallGrid[currentCell[1]][currentCell[0]];

            const possibleMoves = [];
            if ((cellWalls & 1) === 0) {
                possibleMoves.push([currentCell[0], currentCell[1] - 1]);
            }
            if ((cellWalls & 2) === 0) {
                possibleMoves.push([currentCell[0] + 1, currentCell[1]]);
            }
            if ((cellWalls & 4) === 0) {
                possibleMoves.push([currentCell[0], currentCell[1] + 1]);
            }
            if ((cellWalls & 8) === 0) {
                possibleMoves.push([currentCell[0] - 1, currentCell[1]]);
            }

            const move = possibleMoves.find((move) => {
                return !previousCell || !(move[0] === previousCell[0] && move[1] === previousCell[1]);
            });

            if (!move) {
                break;
            }

            path.push(move);
        }

        return path;
    }
}