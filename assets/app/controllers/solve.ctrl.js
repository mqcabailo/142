'use strict';
(function () {
  angular.module('NChancellorsApp')
    .controller('SolveCtrl', SolveCtrl);

  SolveCtrl.$inject = ['$scope', 'Utils', 'FileReader', '$timeout'];

  function SolveCtrl($scope, Utils, FileReader, $timeout) {
    angular.element('.tap-target').tapTarget('open');
    angular.element('.modal').modal();


    /******************************************************
    * Scope Variables
    ******************************************************/
    $scope.puzzles = [];

    /******************************************************
    * Scope Functions
    ******************************************************/
    /* Solve board puzzles inside 'file' */

    $scope.GetSolutions = function (file) {
      if(!file){
        Materialize.toast('No file uploaded!', 4000);
        return;
      }

      // read
      FileReader.readAsText(file, 'UTF-8', $scope)
      .then(function (text) {
          let lines = text.trim().split("\n");
          var linesTemp = lines.slice(0);
          if(Utils.verifyFile(linesTemp)){
            $scope.generatingSolutions = true;
            $timeout(function () {
              $scope.puzzles = Utils.solve(lines);
              $('.modal').modal('close');
              $scope.generatingSolutions = false;
              $scope.inputFile = null;
            }, 1000);
          }
          else{
            Materialize.toast('Format was not followed. Please refer to guide.', 4000);
            return;
          }
      });

      angular.element('form').get(0).reset();
    }

    function getString(file) {
      var fr = new FileReader();
      fr.onload = Read;
      fr.readAsText(file);
      var text = '';
      function Read() {
        text = fr.result.trim().split("\n");
        console.log(text);
        return text;
      }
    }
  }

  $(document).ready(function() {
    $('.modal').modal();
  });

  $(document).on('click', '.tableSolutions', function (content) {
    $("#modalContent").html($(content.target).closest("table").html());
    $("#modalTable").modal('open');
  });

})();
