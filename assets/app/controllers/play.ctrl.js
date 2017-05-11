'use strict';
(function () {
  angular.module('NChancellorsApp')
    .controller('PlayCtrl', PlayCtrl)
    .directive('compile', ['$compile', function ($compile) {
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
            // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
          },
          function(value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);

            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);
          }
      );
    };
  }]);

  PlayCtrl.$inject = ['$scope', 'Utils', 'FileReader', '$timeout', 'BackTrack'];

  function PlayCtrl($scope, Utils, FileReader, $timeout, BackTrack) {
    angular.element('.modal').modal();
    angular.element('.tap-target').tapTarget('open');

    /******************************************************
    * Scope Variables
    ******************************************************/
    let chancellor = '<i class="material-icons small">android</i>';
    $scope.puzzle = [];
    $scope.playerName = '';
    $scope.chancellorsLeft = 0;
    $scope.timer = 0;
    $scope.boardHTML = '';
    $scope.solutionHTML = '';

    /******************************************************
    * Scope Functions
    ******************************************************/
    $scope.NewGame = function (size, name) {
      if(!name || name.trim()==''){
        Materialize.toast('Please enter your name!', 3000);
        return;
      }

      $scope.playerName = name;
      $scope.puzzle = BackTrack.NewBoard(size);
      $scope.chancellorsLeft = size;
      let table = '<table class="chessboard">';
      // generate table
      for (var i = 0; i < size; i++) {
        table += '<tr class="chessboard">';

        for (var j = 0; j < size; j++) {
          table += '<td class="chessboard center white-text flow-text" ng-click="placeChancellor('+i+','+j+', $event)"></td>';
        }
        table += '</tr>';
      }
      table += '</table>';

      $scope.boardHTML = table;
      $scope.solutionHTML = '';
      $scope.name = '';
      $scope.size = 4;
      angular.element('form').get(0).reset();
      angular.element('.modal').modal('close');

      /*
        Start Timer here
      */
    }

    $scope.ShowSolution = function () {
      angular.element('#solutionModal').modal('open');
      $scope.generatingSolution = true;
      $timeout(function () {
        let sol = BackTrack.SolveChancellors(BackTrack.GetInitialBoard($scope.puzzle), true);
        $scope.solutionHTML = Utils.generateBoard(sol, true);
        $scope.generatingSolution = false;
      }, 1000);

    }

    $scope.placeChancellor = function (i, j, $event) {
      if(!BackTrack.CheckMove(i, j, $scope.puzzle)){
        Materialize.toast('Chancellor can\'t be placed!', 1000, 'game-toast');
        return;
      }

      if ($scope.chancellorsLeft > 0 && $scope.puzzle[i][j]==0) {
        $scope.puzzle[i][j] = 1;
        $event.currentTarget.innerHTML = chancellor;
        $scope.chancellorsLeft--;
      }
      else {
        $scope.puzzle[i][j] = 0;
        $event.currentTarget.innerHTML = '';
        $scope.chancellorsLeft++;
      }

      let print = '';
      for (let x=0; x<$scope.puzzle.length; x+=1) {
        for (let y=0; y<$scope.puzzle.length; y+=1){
          print += $scope.puzzle[x][y] + ' ';
        }
        print += "\n";
      }

      /*
        Check here if player has won, get time
      */

    }
  }
})();
