var myApp = angular.module('myApp', []);

myApp.controller('loadDeck', function($scope, $http, $interval){

    function Card(name, suit, rank) {
        this.name = name;
        this.suit = suit;
        this.rank = rank;
        this.keep = false;
    }

    Card.prototype.toggle = function() {
        this.keep = !this.keep;
    };

    $scope.topFiveDisplay = [{},{},{},{},{}];
    $scope.gamePlaying = false;
    $scope.getInitialDisplayed = false;
    $scope.cardFace = "covered-card";
    $scope.gameSubmitted = false;

    function Deck() {
        var names = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        var suits = ['clubs', 'diamonds', 'hearts', 'spades'];
        this.cards = [];

        for(var n = 0; n < names.length; n++) {
            for(var s = 0; s < suits.length; s++) {
                this.cards.push(new Card(names[n], suits[s], n+1));
            }
        }

        // shuffle cards
        for(var i = 0; i < this.cards.length; i++) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }

    Deck.prototype.getCard = function() {
        return this.cards.pop();
    };

    Deck.prototype.initialDisplay = function() {
        $scope.topFiveDisplay = [];
        // display first five
        for(var i = 0; i < 5; i++) {
            $scope.topFiveDisplay.push(this.cards.pop());
        }

        $scope.getInitialDisplayed = true;
        $scope.gamePlaying = true;
        $scope.cardFace = "uncovered-card";

        $('.msg').html('<div>select which cards to keep, then click Go button</div>');
    };

    $scope.deal = function(){
        $scope.deck = new Deck();
        this.deck.initialDisplay();
    };

    $scope.go = function() {
        $scope.gameSubmitted = true;
        $scope.gamePlaying = false;
        $scope.getInitialDisplayed = false;
        $scope.cardFace = "computing-card";

        $('.msg').html('<div>computing your score ...</div>');

        $scope.topFiveDisplay.forEach(function(card, index) {
           if(!card.keep) {
               var replacement = $scope.deck.getCard();
               $scope.topFiveDisplay.splice(index, 1, replacement);
           }
        });

        var cards = $scope.topFiveDisplay;
        var score = 0;

        if(isFlush(cards)) {
            score = 2000;
        }else if(isStraight(cards)) {
            score = 500;
        }else if(isPair(cards)) {
            score = 100;
        }

        setTimeout(function(){
            sumbitScore(score);
        }, 3000);
    };

    function sumbitScore(score) {
        $scope.gameSubmitted = false;
        $('.msg').html('<div>your score is ' + score + ', click Deal to start new game. </div>');
        $scope.cardFace = "gray-out-card";
        $scope.topFiveDisplay.forEach(function(card) {
            card.keep = false;
        });
        $(".card-inner").click();
    }

    $scope.toggleCard = function($index) {
        if($scope.getInitialDisplayed && !$scope.gameSubmitted) {
            $scope.topFiveDisplay[$index].toggle();
        }
    };

    function isFlush(cards) {
        // check if is flush
        var isFlush = true;
        var suit = cards[0].suit;

        for(var i = 1; i < cards.length; i++) {
            if(suit != cards[i].suit) {
                isFlush = false;
                break;
            }
        }
        return isFlush;
    }

    function isStraight(cards) {
        // check if is straight
        var isStraight = true;
        var ranks = [];

        for(var i = 0; i < cards.length; i++) {
            ranks.push(cards[i].rank);
        }

        ranks.sort(function(a, b) {
            return a - b;
        });

        var rank = ranks[0];

        for(var i = 1; i < ranks.length; i++) {
            if(rank + 1 != ranks[i]) {
                isStraight = false;
                break;
            }else{
                rank = ranks[i];
            }
        }
        return isStraight;
    }

    function isPair(cards) {
        // check if has two same card (rank)
        var ranks = [];
        for(var i = 0; i < cards.length; i++) {
            ranks.push(cards[i].rank);
        }

        var uniqueArray = ranks.filter(function(item, pos) {
            return ranks.indexOf(item) == pos;
        });

        return Math.abs(ranks.length - uniqueArray.length) > 0;
    }
});
