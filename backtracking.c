#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#define TRUE 1
#define FALSE 0

typedef struct list{
	int * x;
	int count;
	struct list * next;
} ITEM;

int isValid(int x, int y, int boardSize, int** board){
	int i, n = boardSize;
	// Rook
	for(i=0; i<n; i+=1){
		if ((i!=y && board[x][i]==1) || (i!=x && board[i][y]==1)) {
			return FALSE;
		}
	}
	// Knight
	if(x+1<n  && y+2<n  && board[x+1][y+2]==1) return FALSE;
	if(x+1<n  && y-2>=0 && board[x+1][y-2]==1) return FALSE;
	if(x-1>=0 && y+2<n  && board[x-1][y+2]==1) return FALSE;
	if(x-1>=0 && y-2>=0 && board[x-1][y-2]==1) return FALSE;
	if(x+2<n  && y+1<n  && board[x+2][y+1]==1) return FALSE;
	if(x+2<n  && y-1>=0 && board[x+2][y-1]==1) return FALSE;
	if(x-2>=0 && y+1<n  && board[x-2][y+1]==1) return FALSE;
	if(x-2>=0 && y-1>=0 && board[x-2][y-1]==1) return FALSE;
	// safe
	return TRUE;
}

ITEM* solve(int* solution, int N){
	ITEM * solutionList = NULL;
	ITEM * temp;
	ITEM * p;

	int start, row;
	int nopts[N+2]; 				// array of top of stacks
	int option[N+2][N+2]; 	// array of stacks of options
	int i, j, candidate;

	int count = 0; 					// count of solutions
	row = start = 0;
	nopts[start]= 1;

	while (nopts[start] >0){	// while dummy stack not empty
		if(nopts[row]>0){
			row++;
			nopts[row]=0;

			// found a solution
			if (row==N+1) {
				// check if match with initial solution
				for(i=0;i<N;i++){
					if(solution[i]!=0 && solution[i]!=option[i+1][nopts[i+1]]) break;
				}
				if(i==N){
					temp = (ITEM*) malloc(sizeof(ITEM));
					temp->x = (int*) malloc(N*sizeof(int));
					temp->next = NULL;

					if(solutionList != NULL){
						p = solutionList;
						while(p->next != NULL) p = p->next;
						p->next = temp;
					}
					else{
						solutionList = temp;
					}
					// print solution and store in list
					for(i=1;i<row;i++){
						(temp->x)[i-1] = option[i][nopts[i]];
					}
					count++;
				}
			}

			// get possible moves
			else if(row == 1){
				for(candidate = N; candidate >=1; candidate --) {
					nopts[row]++;
					option[row][nopts[row]] = candidate;
				}
			}
			else{
				for(candidate=N;candidate>=1;candidate--){
					for(i=row-1;i>=1;i--){
						// same row
						if(candidate==option[i][nopts[i]]) break;
						// knight moves
						if(candidate-2>0 && row-1>0 && candidate-2==option[row-1][nopts[row-1]]) break;
						if(candidate-1>0 && row-2>0 && candidate-1==option[row-2][nopts[row-2]]) break;
						if(candidate+1<=N && row-2>0 && candidate+1==option[row-2][nopts[row-2]]) break;
						if(candidate+2<=N && row-1>0 && candidate+2==option[row-1][nopts[row-1]]) break;
					}
					if(!(i>=1)){
						option[row][++nopts[row]] = candidate;
						// printf("Inserting candidate [%d] at row [%d]\n", candidate, row);
					}
				}
			}
		}
		else {
			row--;
			nopts[row]--;
		}
	}

	solutionList->count = count;
	return solutionList;
}

int * getInitialSolution(int **board, int boardSize){
	int i, j, *solution = (int*) malloc(boardSize*sizeof(int));

	for(i=0; i<boardSize; i+=1){
		solution[i] = 0;
		for(j=0; j<boardSize; j+=1){
			if(board[i][j]==1){
				solution[i] = j+1;
				break;
			}
		}
	}
	return solution;
}

int PrintSolutions(int **board, int boardSize){
	int i, j;
	// check board if valid
	for(i=0; i<boardSize; i+=1){
		for(j=0; j<boardSize; j+=1){
			if(board[i][j]==1 && isValid(i, j, boardSize, board)==FALSE){
				printf("No possible solutions for this board!\n");
				return FALSE;
			}
		}
	}

	ITEM* solutions = solve(getInitialSolution(board, boardSize), boardSize);
	printf("\nSOLUTIONS (%d) **\n", solutions->count);
	while(solutions!=NULL){
		for (i = 0; i < boardSize; i++) {
			for (j = 0; j < boardSize; j++) {
				if(j == (solutions->x)[i]-1)
					printf("1 ");
				else
					printf("0 ");
			}
			printf("\n");
		}
		printf("\n");
		solutions = solutions->next;
	}
	return TRUE;
}

int** newBoard(int size){
	int** board, i;

	board = (int**) malloc(size * sizeof(int*));
	for(i=0; i<size; i+=1){
		board[i] = (int*) malloc(size * sizeof(int));
	}

	return board;
}

void printBoard(int **board, int size){
	int i, j;
	for(i=0; i<size; i+=1){
		for(j=0; j<size; j+=1){
			printf("%d ", board[i][j]);
		}
		printf("\n");
	}
}

void freeBoard(int ***board, int size){
	int i;
	for(i=0; i<size; i+=1)
		free((*board)[i]);
	free(*board);
	*board = NULL;
}

int main(int argc, char const *argv[]) {
	if(argc != 2){
		printf("\nERROR: Invalid number of arguments!\n");
		printf("Usage: ./<program_name> <file_name>\n");
		return 1;
	}

	FILE *fp;
	int ** board, i, j, x, y;
	int numPuzzles; // number of puzzles
	int size; 			// holder for the dimension size of a puzzle

	fp = fopen(argv[1], "r");

	/* Number of puzzles */
	fscanf(fp, "%d", &numPuzzles);
	printf("Number of puzzles: %d\n", numPuzzles);
	/* Iterate each puzzle */
	for(i=0; i<numPuzzles; i++){
		/* Get puzzle size */
		fscanf(fp, "%d", &size);

		/* Allocate puzzle */
		board = newBoard(size);

		/* Initialize puzzle */
		for (x = 0; x < size; x++) {
			for (y = 0; y < size; y++) {
				fscanf(fp, "%d", &(board[x][y]));
			}
		}

		/* Solve puzzle */
		printf("\nPuzzle #%d ------------------------------\n", i+1);
		printBoard(board, size);
		PrintSolutions(board, size);

		/* Delete puzzle */
		freeBoard(&board, size);
	}

  fclose(fp);
}
