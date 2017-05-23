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

  PlayCtrl.$inject = ['$scope', 'Utils', 'FileReader', '$timeout', 'BackTrack', '$interval', '$http'];

  function PlayCtrl($scope, Utils, FileReader, $timeout, BackTrack, $interval, $http) {
    angular.element('.modal').modal();
    angular.element('.tap-target').tapTarget('open');

    /******************************************************
    * Scope Variables
    ******************************************************/
    let chancellor = '<i class="material-icons small">android</i>';
    $scope.puzzle = [];
    $scope.playerName = '';
    $scope.chancellorsLeft = 0;
    $scope.guides = false;
    $scope.timer;
    $scope.time = 0;
    $scope.scores;
    $scope.highScoreNotif;
    $scope.end = false;
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
      getScores();

      $scope.playerName = name;
      $scope.puzzle = BackTrack.NewBoard(size);
      $scope.chancellorsLeft = size;
      let table = '<table class="chessboard">';
      // generate table
      for (var i = 0; i < size; i++) {
        table += '<tr class="chessboard">';

        for (var j = 0; j < size; j++) {
          table += '<td class="chessboard center white-text flow-text lighten-2" id="'+i+'-'+j+'" ng-click="placeChancellor('+i+','+j+', $event)"></td>';
        }
        table += '</tr>';
      }
      table += '</table>';
      $scope.boardHTML = table;
      angular.element('.modal').modal('close');

      /*
        Start Timer here
      */
      startTimer();
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
        // darken affected tiles
        if($scope.guides) toggleTiles(i, j, 'darken');
      }
      else {
        $scope.puzzle[i][j] = 0;
        $event.currentTarget.innerHTML = '';
        $scope.chancellorsLeft++;
        // lighten affected tiles
        if($scope.guides) toggleTiles(i, j, 'lighten');
      }



      // current board in console
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
      if(gameOver()){
        updateScores();
        $scope.end = true;
        angular.element('#gameOverModal').modal('open');
      }
    }

    $scope.new = function () {
      if($scope.boardHTML.trim()!=''){
        if(!confirm('Your current game will be lost. Proceed?')){
          return;
        }
      }
      angular.element('#highScoresModal').modal('close');
      angular.element('form').get(0).reset();
      $scope.solutionHTML = '';
      $scope.puzzle = [];
      $scope.boardHTML = '';
      $scope.name = '';
      $scope.size = 4;
      $scope.guides = false;
      stopTimer();  
      $scope.time = 0;
      $scope.highScoreNotif = null;
      $scope.end = false;
      angular.element('#newGameModal').modal('open');
    }

    $scope.viewHighScores = function () {
      angular.element('#gameOverModal').modal('close');
      angular.element('#highScoresModal').modal('open');
    }

    $scope.$on('$destroy', function() {
      stopTimer();
    });

    function darken(x, y) {
      let tile = angular.element('td.chessboard#'+x+'-'+y);
      if(!tile.attr('hits'))
        tile.attr('hits', "0");

      tile.attr('hits', parseInt(tile.attr('hits')) + 1);
    }

    function lighten(x, y) {
      let tile = angular.element('td.chessboard#'+x+'-'+y);
      tile.attr('hits', parseInt(tile.attr('hits')) - 1);

      if(parseInt(tile.attr('hits')) <= 0){
        tile.removeAttr('hits');
      }
    }

    function toggleTiles(x, y, option) {
      let foo = (option == 'darken');
      for(let i=0; i<$scope.puzzle.length; i+=1){
        if (x+'-'+y != x+'-'+i) foo? darken(x, i) : lighten(x, i);
        if (x+'-'+y != i+'-'+y) foo? darken(i, y) : lighten(i, y);
      }
      // Knight
      if(x+1<$scope.puzzle.length  && y+2<$scope.puzzle.length ) foo? darken(x+1, y+2) : lighten(x+1, y+2);
      if(x+1<$scope.puzzle.length  && y-2>=0) foo? darken(x+1, y-2) : lighten(x+1, y-2);
      if(x-1>=0 && y+2<$scope.puzzle.length ) foo? darken(x-1, y+2) : lighten(x-1, y+2);
      if(x-1>=0 && y-2>=0) foo? darken(x-1, y-2) : lighten(x-1, y-2);
      if(x+2<$scope.puzzle.length  && y+1<$scope.puzzle.length ) foo? darken(x+2, y+1) : lighten(x+2, y+1);
      if(x+2<$scope.puzzle.length  && y-1>=0) foo? darken(x+2, y-1) : lighten(x+2, y-1);
      if(x-2>=0 && y+1<$scope.puzzle.length ) foo? darken(x-2, y+1) : lighten(x-2, y+1);
      if(x-2>=0 && y-1>=0) foo? darken(x-2, y-1) : lighten(x-2, y-1);
    }

    function gameOver(){
      for (let x=0; x<$scope.puzzle.length; x+=1) {
        for (let y=0; y<$scope.puzzle.length; y+=1){
          if($scope.puzzle[x][y] == 1)
            break;
          if($scope.puzzle[x][y] == 0 && y == $scope.puzzle.length - 1)
            return false;            
        }
      }
      return true;
    }

    function startTimer(){
      if(angular.isDefined($scope.timer))
        return;

      $scope.timer = $interval(function(){
        if(!$scope.end)
          $scope.time+=1;
        else
          stopTimer();
      }, 1000);    
    }

    function stopTimer(){
      if(angular.isDefined($scope.timer)){
        $interval.cancel($scope.timer);
        $scope.timer = undefined;
      }
    }

    function uploadFile(file){
      $http.post("http://localhost:8000/", JSON.stringify(file), {
        transformRequest: angular.identity,
        headers: {'Content-Type': undefined},
        withCredentials: true
      })
    }

    function getScores(){
      $http.get("http://localhost:8000/score.json", {
        withCredentials: true
      }).then(success, error);

      function success(response){
        $scope.scores = response.data;
      };

      function error(response){
        console.log(response.data);
      };
    }

    function updateScores(){
      var tempName1, tempScore1, tempName2, tempScore2, index = -1;
      
      for(var i = 1; i <= 5; i++){
        if($scope.scores[$scope.puzzle.length][i].score > $scope.time){
          index = i;
          tempName1 = $scope.scores[$scope.puzzle.length][i].name;
          tempScore1 = $scope.scores[$scope.puzzle.length][i].score;
          $scope.scores[$scope.puzzle.length][i].name = $scope.name;
          $scope.scores[$scope.puzzle.length][i].score = $scope.time;
          $scope.highScoreNotif = 'You scored a HIGHSCORE!';
          uploadFile($scope.scores);
          break;
        }
      }

      if(index != -1){
        for(var i = index+1; i <= 5; i++){
          tempName2 = $scope.scores[$scope.puzzle.length][i].name;
          tempScore2 = $scope.scores[$scope.puzzle.length][i].score;

          $scope.scores[$scope.puzzle.length][i].name = tempName1;
          $scope.scores[$scope.puzzle.length][i].score = tempScore1;

          tempName1 = tempName2;
          tempScore1 = tempScore2;
        }
      }
    }
  }


  
})();
