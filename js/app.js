
(function(){
    'use strict';

    const app  = {
        init: function() {
            app.basics = {};
            app.basics.amount = 8;
            app.basics.run = 0;
            app.basics.openCards = [];
            app.basics.matchCounter = 0;
            app.basics.moveCounter = 0;
            app.basics.timer = 0;
            app.prepareDom();
            app.provideCards();
        },
        prepareDom: function() {

            // get elements
            app.el = {};
            app.el.cardWrapper = document.getElementById('cardWrapper');

            // set up event listener
            document.getElementById('restart').addEventListener('click', function() {
                app.resetPuzzle();
            });
        },
        provideCards: function() {
            app.renderCards(app.getIconData());
            var cards = app.el.cardWrapper.querySelectorAll('li');
            app.el.cardWrapper.innerHTML = '';
            // modified from https://stackoverflow.com/questions/3199588/fastest-way-to-convert-javascript-nodelist-to-array
            cards = app.shuffleCards([].slice.call(cards));

            cards.forEach(function(card){
                app.el.cardWrapper.appendChild(card);
                card.addEventListener('click', function(e) {
                    app.handleClick(e.target);
                });
            });
        },
        handleClick: function(card) {

            var openCards = app.basics.openCards;

            // if you click on the same card again
            if (openCards[0] === card)
                return;

            // starts the timer if the first move is made
            if (app.basics.moveCounter === 0)
                app.startTimer();

            app.updateMoveCounter();

            // if one card has already been selected
            if (openCards.length === 1) {

                // if the old and new card match
                if (openCards[0].dataset.matchIndex === card.dataset.matchIndex) {
                    openCards[0].className = card.className = 'card match';

                    // all cards have been matched
                    if (++app.basics.matchCounter === app.basics.amount)
                        app.handleWin();
                }
                // if the old and new card dont match
                else {
                    //show new card, then hide both
                    card.className = 'card open show';
                    setTimeout(function() {
                        openCards[0].className = card.className = 'card';
                    }, 1500);
                }
                app.basics.openCards = [];
            }
            // first card is simply shown
            else {
                card.className = 'card open show';
                openCards.push(card);
            }
        },
        getIconData: function() {

            let newData = [];

            for (let i = 0; i < app.basics.amount; i++)
                newData.push(data[app.getNewDataIndex()]);

            return newData;
        },
        getNewDataIndex: function() {
            let usedIndexes = JSON.parse(localStorage.getItem('usedIconDataIndexes')) || [];
            let newIndex = app.randomNumBetween(0, data.length);

            if (usedIndexes.indexOf(newIndex) > 0)
                app.getNewDataIndex();
            else
                return newIndex;
        },
        renderCards: function(cardPoolData) {
            for (let i = 0; i < cardPoolData.length; i++) {
                app.el.cardWrapper.appendChild(app.createCardSet(cardPoolData[i], 'icon'));
                app.el.cardWrapper.appendChild(app.createCardSet(cardPoolData[i], 'text'));
            }
        },
        createCardSet: function(cardData, type) {

            let container = document.createElement('li');
            container.className = 'card';
            container.dataset.matchIndex = cardData.shortLabel;

            if (type === 'icon') {
                let icon = document.createElement('i');
                icon.className = cardData.styles[0] === "brands" ? `fab fa-${cardData.shortLabel}` : `far fa-${cardData.shortLabel}`;

                container.appendChild(icon);
            } else {
                container.innerHTML = `
                    <div class="iconCode">
                        <div class="unicode">${cardData.unicode}</div>
                        <div class="shortLabel">fa-${cardData.shortLabel}</div>
                    </div>
                    `;
            }
            return container;
        },
        shuffleCards: function(array) {
            var currentIndex = array.length, temporaryValue, randomIndex;

            while (currentIndex !== 0) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        },
        randomNumBetween: function(max, min) {
            if (typeof max === 'undefined'){
                console.log('max undefined');
                return false;
            }
            if (typeof min === 'undefined') {
                min = 0;
            }
            return Math.floor( Math.random() * (max - min) + min);
        },
        updateMoveCounter: function() {
            app.basics.moveCounter++;
            document.getElementById('moveCounter').textContent = app.basics.moveCounter;

            if (app.basics.moveCounter === 35 || app.basics.moveCounter === 50) {
                var stars = document.querySelector('.stars');
                stars.removeChild(stars.lastElementChild);
            }
        },
        startTimer: function() {
            app.basics.timerInterval = setInterval(app.updateTimer, 1000);
        },
        updateTimer: function() {
            app.basics.timer++;
            if (app.basics.timer > 3599) {
                alert("You took to long to figure out the puzzle, please try again with a new set.");
                app.resetPuzzle();
            } else {
                app.renderTimer();
            }
        },
        stopTimer: function() {
            clearInterval(app.basics.timerInterval);
        },
        renderTimer: function() {
            document.getElementById('timer').innerText = app.getTime();
        },
        getTime: function() {
            return (app.basics.timer / 60 < 1 ? 0 : Math.floor(app.basics.timer / 60)) + ':' + app.basics.timer % 60;
        },
        resetPuzzle: function() {
            window.location.reload();
        },
        handleWin: function() {

            app.stopTimer();
            var starRating = document.querySelectorAll('.stars li').length;

            setTimeout(function() {
                if (confirm("Congratulations, you won! Your star rating was " + starRating + " out of 3 Stars. You took " + app.getTime() + " to finish the puzzle. Do you want to play again?")) {
                    app.resetPuzzle();
                }
            }, 1000);
        }
    };

    app.init();

    return app;
})();
