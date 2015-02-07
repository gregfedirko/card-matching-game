// Game logic and state:
'use strict';
(function() {
  angular
    .module('app')
    .factory('gameManager', GameManager);

    function GameManager(deck, $timeout) {
      var delay = 1000;
      var service = {};
      service.isPlayerTurn = false;
      service.isGameInSession = false;
      service.playerHand = [];
      service.computerHand = [];

      var memoryBank = {
        memory: [],
        limit: 6,
        add: function(cardValue, index) {
          if (memoryBank.memory.length > 5) {
            memoryBank.memory.shift();
          }
          memoryBank.memory.push([cardValue, index]);
        },
        get: function(cardValue) {
          for (var i = 0; i < memoryBank.memory.length; i++) {
            if (memoryBank.memory[i][0] === cardValue) {
              return memoryBank.memory[i][1];
            }
          }
          return undefined;
        }
      };

      var checkRemainingCards = function() {
        if (service.playerHand.length + service.computerHand.length === deck.deck.length) {
          service.isGameInSession = false;
        }
      }

      service.initializeGame = function() {
        deck.refreshDeck();
        deck.shuffle();
        service.isGameInSession = true;
        service.isPlayerTurn = true;
        service.playerHand.splice(0);
        service.computerHand.splice(0);
      };

      // COMPUTER TURN

      var computerTurn = function() {
        var computerHandBuffer = [];

        var chooseIndex = function(value) {
          if (value) {
            var rememberedIndex = memoryBank.get(value);
            if (rememberedIndex !== undefined && deck.deck[rememberedIndex].inGame && !deck.deck[rememberedIndex].show) {
              console.log('found match');
              return rememberedIndex;
            } 
          }

          var availableIndices = deck.getAvailableIndices();
          return availableIndices[Math.floor(Math.random() * availableIndices.length)];
        };

        var subRoutine = function() {
          checkRemainingCards();

          if (!service.isGameInSession) {
            return;
          }
          // Select 2 cards
          var index1 = chooseIndex();
          var card1 = deck.deck[index1];
          memoryBank.add(card1.value, index1);
          card1.show = true;

          var index2 = chooseIndex(card1.value);
          var card2 = deck.deck[index2];
          memoryBank.add(card2.value, index2);
          card2.show = true;

          // push the selected cards into the buffer
          computerHandBuffer.push(index1, index2);
          $timeout(function() {
            // evaluate the buffer:
            if ( card1.value === card2.value ) {
              card1.inGame = false;
              card2.inGame = false;
              service.computerHand.push(computerHandBuffer[0]);
              service.computerHand.push(computerHandBuffer[1]);
              computerHandBuffer = [];

              subRoutine();

            } else {
              card1.show = false;
              card2.show = false;
              computerHandBuffer = [];
              service.isPlayerTurn = true;
            }
          }, delay);
        }
        subRoutine();
      };

      var playerHandBuffer = [];

      // PLAYER TURN

      service.playerTurn = function(index) {
        // Short out if the index is not in play or if it is already showing
        if (!deck.deck[index].inGame || deck.deck[index].show) {
          return;
        }

        // push the selected card into the buffer
        var selectedCard = deck.deck[index];

        // add selection to memory bank
        memoryBank.add(selectedCard.value, index);
        selectedCard.show = true;
        playerHandBuffer.push(index);
        checkRemainingCards();

        $timeout(function() {
          // if the buffer has two cards; evaluate
          if (playerHandBuffer.length === 2) {
            var card1 = deck.deck[playerHandBuffer[0]];
            var card2 = deck.deck[playerHandBuffer[1]];
            if ( card1.value === card2.value ) {
              card1.inGame = false;
              card2.inGame = false;
              service.playerHand.push(playerHandBuffer[0]);
              service.playerHand.push(playerHandBuffer[1]);
              playerHandBuffer = [];
            } else {
              card1.show = false;
              card2.show = false;
              playerHandBuffer = [];
              service.isPlayerTurn = false;
              computerTurn();
            }
          }
        }, delay);

      }

      return service;
    }
})();