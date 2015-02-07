'use strict';
(function() {
  angular
    .module('app')
    .controller('GameController', GameController);

    function GameController($scope, gameManager, deck) {
      $scope.start = function() {
        gameManager.initializeGame();
        $scope.deck = deck.deck;
      }

      $scope.selectCard = function(index) {
        if (gameManager.isPlayerTurn && gameManager.isGameInSession) {
          gameManager.playerTurn(index);
        }
      }

      $scope.computerHand = gameManager.computerHand;
      $scope.playerHand = gameManager.playerHand;
    }

})();