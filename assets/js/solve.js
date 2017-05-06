'use strict';
$( document ).ready(function() {
  $('.tap-target').tapTarget('open');
  $('.modal').modal();

  $('#getSolution').click(function () {
    if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    }

    let input = $('#file_input');
    if (!input) {
      alert("Um, couldn't find the fileinput element."); return;
    }
    else if (!input[0].files || !input[0].files[0]) {
      alert("Please select a file before clicking 'Get Solutions'"); return;
    }
    else {
      var file = input[0].files[0];
      var fr = new FileReader();
      fr.onload = read;
      fr.readAsText(file);
      function read() {
        let lines = fr.result.trim().split("\n");
        solve(lines);
        $('form').get(0).reset();
        $('ul.tabs').tabs();
        $('ul.tabs').tabs('select_tab', 'puzzle1');
        $('.modal').modal('close');
      }
    }
  });

  function solve(lines) {
    let numPuzzles = parseInt(lines.splice(0, 1));

    $('#results').html('');
    let results = '';
    // generate tabs
    results += '<div class="col s12"><ul class="tabs tabs-fixed-width">';
    for(let i=1; i<=numPuzzles; i+=1){
      results += '<li class="tab"><a href="#puzzle'+i+'" class="orange-text">Puzzle #'+i+'</a></li>';
    }
    results += '</ul><div>';

    for (let i = 0; i < numPuzzles; i++) {
      let puzzleSection = '<div id="puzzle'+(i+1)+'" class="col s12 center">';

      let board = [], dimension = parseInt(lines.splice(0, 1));
      for (let j = 0; j < dimension; j++) {
        let row = lines.splice(0, 1).toString();
        row = row.split(' ');
        for(let k=0; k<row.length; k++) row[i] = +row[i];
        board[j] = row;
      }

      puzzleSection += generateBoard(board);
      puzzleSection += '<h5 class="grey-text game">Initial Board</h5><div class="divider"></div><div class="left-align">';

      if(Valid(board)){
        puzzleSection += '<h4 class="grey-text flow-text">Solutions</h4>';
        let solutions = SolveChancellors(GetInitialBoard(board));
        for (let index in solutions) {
          puzzleSection += generateBoard(solutions[index], true);
          // console.log(solutions[]);
        }
      }
      else{
        puzzleSection += "<br/><br/><h3 class=\"grey-text flow-text center\"> No solutions for this board! </h3>";
      }


      puzzleSection += '</div></div>';
      results += puzzleSection;
    }

    $('#results').html(results);
  }

  function generateBoard(board, isSolution) {
    if(isSolution){
      let table = '<table class="chessboard hoverable solution" style="display: inline-block;">';
      for (var i = 0; i < board.length; i++) {
        table += '<tr class="chessboard">';
        for (var j = 0; j < board.length; j++) {
          if(board[i]-1 != j)
            table += '<td class="chessboard"></td>';
          else
            table += '<td class="chessboard center">C</td>';
        }
        table += '</tr>';
      }
      table += '</table>';
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
            table += '<td class="chessboard center">C</td>';
        }
        table += '</tr>';
      }
      table += '</table>';
      return table;
    }

  }

});
