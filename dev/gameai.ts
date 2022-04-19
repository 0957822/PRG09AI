/// <reference path="knight.ts" />

class GameAI {
    // let the AI choose a move, and update both the
    // knight and the gamestate

    //Gandalf is Max, he needs to get 100
    //The Knights are Min, They need to get -100

    private static difficulty:number  = 8; // Make MinMax search  depth deeper

    public static GetDiffilcuty () { // Loggs difficulty in console
        return GameAI.difficulty;
    }
    

	public static MoveKnight(king: King, knights: Knight[], gameState: GameState) {
		let t0 = performance.now();

		let bestMove = this.BestMove(king, knights, gameState);

		gameState.knightPositions[bestMove[0]] = bestMove[1];
		//setTimeout(() => { //Wait for Gandalf to move before moving the Unicorns. -> Replaced this code in Game.ts:112
		knights[bestMove[0]].setPosition(bestMove[1]);
		//}, 1500)

		let t1 = performance.now();
		console.log("AI move took " + (t1 - t0) + " milliseconds.");

		console.log(king); // only to avoid error: 'king' is declared but its value is never read.

	}

	//MiniMax Algoritm 
	public static minimax(gameState: GameState, king: King, knights: Knight[], depth: number, isMax: boolean): number {
		let score: [number, boolean] = gameState.getScore(depth);
		
		//console.log("Difficulty = " + this.difficulty);

		if (score[1]) {
			return score[0];
		} else if (depth > this.difficulty) { //Use difficulty as depth level;
			return 0;
		}

		if (isMax) { //Maximizers Turn (Gandalf)
			let bestScore = -Infinity; //Default it to lowest Infinity

			king.getMoves(gameState.kingPos).forEach(kingMove => { // Check the possible moves, for each move store the previous position of the king.
				let previousKingPos = gameState.kingPos;

				gameState.kingPos = kingMove;

				bestScore = Math.max(bestScore, this.minimax(gameState, king, knights, depth + 1, !isMax)); // Use the highest score in MiniMax algorithm and store it in BestScore

				gameState.kingPos = previousKingPos; //Set the position of Gandalf back to the previous stored position.
			});

			return bestScore
		} else { //Minimizers Turn (Unicorn)
			let bestScore = +Infinity; //Default it to highest Infinity

			for (let i = 0; i < knights.length; i++) { //Added for loop to check all the Unicorns instead of only one
				
				knights[i].getMoves(gameState.knightPositions[i]).forEach(knightMove => { // Check the possible moves, for each move store the previous position of the current Unicorn.
					let previousKnightPos = gameState.knightPositions[i];

					gameState.knightPositions[i] = knightMove;

					bestScore = Math.min(bestScore, this.minimax(gameState, king, knights, depth + 1, !isMax)); // Use the lowest score in MiniMax algorithm per Unicorn and store it in BestScore

					gameState.knightPositions[i] = previousKnightPos; //Restore the position of the current Unicorn back to the previous position
				});
			}
			return bestScore;
		}
	}

	public static BestMove(king: King, knights: Knight[], gameState: GameState) {

		let bestMove: [number, [number, number]] = [1,[1,1]]; //default it to 1 otherwise an error occurs
		let bestScore = +Infinity; //Default it to highest Infinity

		for (let i = 0; i < knights.length; i++) { // For loop for each Unicorn

			console.log("Calculating Unicorn " + i + "...");

			knights[i].getMoves().forEach(move => { //loop thru every move possible

				let previousKnightPos = gameState.knightPositions[i];

				gameState.knightPositions[i] = move; // Move the unicorn
				
				let moveScore = this.minimax(gameState, king, knights, 0, true); // Calculate the score of the current move

				console.log(moveScore) //For testing

				gameState.knightPositions[i] = previousKnightPos;
				
				if (moveScore < bestScore) { //Check if the current move is lower than the bestScore, bestScore should be as low as possible for the unicorns
					bestMove = [i, move];
					bestScore = moveScore;
				}
			})
		}

		console.log("Win probability:" + bestScore);

		return bestMove;
	}

}