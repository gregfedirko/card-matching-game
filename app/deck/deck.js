'use strict';
(function() {
  angular
    .module('app')
    .factory('deck', deck);

    function deck(lodash) {
      var service = {};

        var buildDeck = function() {
          var suits = ["spades", "clubs", "hearts", "diamonds"];
          var values = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "jack", "queen", "king"];
          var deck = [];
          lodash.forEach(suits, function(suit) {
            lodash.forEach(values, function(value) {
              var card = {
                suit: suit,
                value: value, 
                show: false, 
                inGame: true,
              };
              deck.push(card);
            });
          });
          return deck;
        };

        service.refreshDeck = function() {
          lodash.forEach(service.deck, function(card) {
            card.show = false;
            card.inGame = true;
          });
        }

        service.deck = buildDeck()

        // Fisher-Yates Shuffle Algorithm
        service.shuffle = function() {
          var i = this.deck.length;
          if ( i == 0 ) return false;
          while ( --i ) {
             var j = Math.floor( Math.random() * ( i + 1 ) );
             var tempi = this.deck[i];
             var tempj = this.deck[j];
             this.deck[i] = tempj;
             this.deck[j] = tempi;
           }
        };

        service.getAvailableIndices = function() {
          var indexArray = [];
          lodash.forEach(service.deck, function(card, index) {
            if (card.inGame && !card.show) {
              indexArray.push(index);
            }
          });
          return indexArray;
        };

      return service;
    };

})();