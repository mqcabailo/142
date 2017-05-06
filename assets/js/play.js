'use strict';
$( document ).ready(function() {
  $('.tap-target').tapTarget('open');
  $('.modal').modal();
  $('#startGame').click(generateTables);

  function generateTables() {
    // get size of board
    let size = $('#size').val();

    let table = '<table class="chessboard">';
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
      if($(this).html().trim()=='')
        $(this).html('<h4>C</h4>');
      else
        $(this).html('');
    });

    $('.modal').modal('close');
  }

});
