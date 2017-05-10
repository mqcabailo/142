'use strict';

(() => {
  angular.module('NChancellorsApp')
         .factory('BackTrack', BackTrack);

  BackTrack.$inject = [];

  function BackTrack() {
    var service = {};
    service.NewBoard = NewBoard;
    service.Valid = Valid;
    service.GetInitialBoard = GetInitialBoard;
    service.SolveChancellors = SolveChancellors;
    return service;

    function NewBoard(size) {
      let board = [];
      for (let i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
          board[i][j] = 0;
        }
      }
      return board;
    }

    function Valid(board) {
      for(let x=0; x<board.length; x+=1){
        for(let y=0; y<board.length; y+=1){
          if(board[x][y] == 1){
            // Rook
            for(let i=0; i<board.length; i+=1){
              if ((i!=y && board[x][i]==1) || (i!=x && board[i][y]==1)) {
                return false;
              }
            }
            // Knight
            if(x+1<board.length  && y+2<board.length  && board[x+1][y+2]==1) return false;
            if(x+1<board.length  && y-2>=0 && board[x+1][y-2]==1) return false;
            if(x-1>=0 && y+2<board.length  && board[x-1][y+2]==1) return false;
            if(x-1>=0 && y-2>=0 && board[x-1][y-2]==1) return false;
            if(x+2<board.length  && y+1<board.length  && board[x+2][y+1]==1) return false;
            if(x+2<board.length  && y-1>=0 && board[x+2][y-1]==1) return false;
            if(x-2>=0 && y+1<board.length  && board[x-2][y+1]==1) return false;
            if(x-2>=0 && y-1>=0 && board[x-2][y-1]==1) return false;
          }
        }
      }
      return true;
    }

    function GetInitialBoard(board) {
      let initialSolution = [];
      for(let i=0; i<board.length; i+=1){
    		initialSolution[i] = 0;
    		for(let j=0; j<board.length; j+=1){
    			if(board[i][j]==1){
    				initialSolution[i] = j+1;
    				break;
    			}
    		}
    	}
      return initialSolution;
    }

    function SolveChancellors(board){
      let start = 0, row = 0;
      let nopts = [];
      let option = NewBoard(board.length+2);
      let i, j, candidate;
      let solutionList = [];

      nopts[start] = 1;
      while (nopts[start] > 0) {
        if (nopts[row] > 0) {
          row++;
          nopts[row] = 0;
          /* Found a solution */
          if (row == board.length+1) {
            let solution = [];
            for(i=0; i<board.length ;i++){
    					if(board[i]!=0 && board[i]!=option[i+1][nopts[i+1]]) break;
    				}
            if(i == board.length){
              for (i = 1; i < row; i++) {
                solution.push(option[i][nopts[i]]);
              }
              solutionList.push(solution);
            }
          }
          /* Get possible moves for first row */
          else if (row == 1) {
            for(candidate = board.length; candidate >=1; candidate --) {
    					nopts[row]++;
    					option[row][nopts[row]] = candidate;
    				}
          }
          /* Get possible moves for some row */
          else {
            for(candidate=board.length;candidate>=1;candidate--){
    					for(i=row-1;i>=1;i--){
    						// rook
    						if(candidate==option[i][nopts[i]]) break;
    						// knight
    						if(candidate-2>0 && row-1>0 && candidate-2==option[row-1][nopts[row-1]]) break;
    						if(candidate-1>0 && row-2>0 && candidate-1==option[row-2][nopts[row-2]]) break;
    						if(candidate+1<=board.length && row-2>0 && candidate+1==option[row-2][nopts[row-2]]) break;
    						if(candidate+2<=board.length && row-1>0 && candidate+2==option[row-1][nopts[row-1]]) break;
    					}
    					if(!(i>=1))
    						option[row][++nopts[row]] = candidate;
    				}
          }
        }
        else {
          row--;
          nopts[row]--;
        }
      }
      return solutionList;
    }
  }

})();
