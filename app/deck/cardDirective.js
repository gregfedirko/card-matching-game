'use strict';
(function() {
  angular
    .module('app')
    .directive('mgCard', mgCard);

    function mgCard() {

      return {
        restrict: 'E',
        scope: {
          suit: "=",
          value: "=", 
          show: "="
        },
        templateUrl: 'app/deck/cardTemplate.html'
      }
    }
})();