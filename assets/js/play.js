'use strict';
$( document ).ready(function() {
  $('.tap-target').tapTarget('open');
  $('.modal').modal();
  $('#startGame').click(generateTables);

  function generateTables() {
    // get size of board
    let size = $('#size').val();

    let table = '<table class="chessboard">';

    let board = NewBoard(size);
    // generate table
    for (var i = 0; i < size; i++) {
      table += '<tr class="chessboard">';

      for (var j = 0; j < size; j++) {
        let id = i.toString() + j.toString();
        table += '<td class="chessboard center white-text flow-text" id="'+id+'"></td>';
      }

      table += '</tr>';
    }
    table += '</table>';

    $('.board-container').html(table);

    $('td.chessboard').click(function () {
      var col = $(this).parent().children().index($(this));
      var row = $(this).parent().parent().children().index($(this).parent());

      if($(this).html().trim()==''){
        $(this).html('<h4>C</h4>');
        board[row][col] = 1;
      }else{
        $(this).html('');
        board[row][col] = 0;
      }

      if(checkGameOver(board, size)){
        //End Game
        console.log("You Win");
      }
    });

    $('.modal').modal('close');
  }

  function checkGameOver(board, size) {
    // checks if there is at least 1 chancellor every row
    for(var i = 0; i < size; i++){
      for(var j = 0; j < size; j++){
        if(board[i][j] == 1)
          break;
        if(j == size-1 && board[i][j] == 0)
          return false;
      }
    }

    // checks if all the placements of the chancellors are valid
    if(Valid(board))
      return true;
    else
      return false;
  }

});
