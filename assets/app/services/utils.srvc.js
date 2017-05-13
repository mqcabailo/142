'use strict';
(function () {

  angular.module('NChancellorsApp')
         .factory('Utils', Utils);

  Utils.$inject = ['BackTrack'];

  function Utils(BackTrack) {
    var service = {};
    service.verifyFile = verifyFile;
    service.generateBoard = generateBoard;
    service.solve = solve;
    return service;

    // function for format verification
    function verifyFile(lines) {
      var numPuzzles = parseInt(lines.splice(0, 1));
      var i, temp, temp_line;
      while(numPuzzles){
        if(numPuzzles > 0 && lines.length == 0) return false;
        temp = parseInt(lines.splice(0, 1));
        for(i = 0; i < temp; i++){
          temp_line = (String(lines.splice(0, 1))).split(" ");
          if(temp_line.length != temp){
            return false;
          }
        }
        numPuzzles--;
      }
      if(lines.length > 0) return false;
      return true;
    }

    // generates html table
    function generateBoard(board, isSolution) {
      if(isSolution){
        let table = '<a class="tableSolutions" href="#table-container"><table class="chessboard hoverable solution" style="display: inline-block;">';
        for (var i = 0; i < board.length; i++) {
          table += '<tr class="chessboard">';
          for (var j = 0; j < board.length; j++) {
            if(board[i]-1 != j)
              table += '<td class="chessboard"></td>';
            else
              table += '<td class="chessboard center"><i class="material-icons">android</i></td>';
          }
          table += '</tr>';
        }
        table += '</table></a>';
        return table;
      }
      else{
        let table = '<table class="chessboard">';
        for (var i = 0; i < board.length; i++) {
          table += '<tr class="chessboard">';
          for (var j = 0; j < board.length; j++) {
            if(board[i][j] == 0)
              table += '<td class="chessboard"></td>';
            else
              table += '<td class="chessboard center"><i class="material-icons">android</i></td>';
          }
          table += '</tr>';
        }
        table += '</table>';
        return table;
      }
    }

    // solve
    function solve(lines) {
      let puzzles = [];
      let numPuzzles = parseInt(lines.splice(0, 1));
      for (let i = 0; i < numPuzzles; i++) {
        let puzzle = {
          id: 'upgrade'+i,
          initBoardHTML: '',
          solutions: []
        };
        let board = [], dimension = parseInt(lines.splice(0, 1));
        for (let j = 0; j < dimension; j++) {
          let row = lines.splice(0, 1).toString();
          row = row.split(' ');
          for(let k=0; k<row.length; k++) row[i] = +row[i];
          board[j] = row;
        }
        puzzle.initBoardHTML = generateBoard(board);
        if(BackTrack.Valid(board)){
          let solutions = BackTrack.SolveChancellors(BackTrack.GetInitialBoard(board));
          for (let index in solutions) {
            puzzle.solutions.push(generateBoard(solutions[index], true));
          }
        }
        puzzles.push(puzzle);
      }
      return puzzles;
    }
  }

})();
