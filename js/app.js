
(function(){
    'use strict';

    const app  = {
        init: function() {
            app.basics = {};
            app.basics.amount = 8;
            app.basics.run = 0;
            app.basics.openCards = [];
            app.basics.matchCounter = 0;
            app.prepareDom();
            app.provideCards();
        },
        prepareDom: function() {

            // get elements
            app.el = {};
            app.el.cardWrapper = document.getElementById('cardWrapper');

            // set up event listeners
        },
        provideCards: function() {
            app.render(app.getIconData());
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
            if (openCards.length === 1) {
                if (openCards[0] === card) {
                    card.className = 'card';
                }
                else if (openCards[0].dataset.matchIndex === card.dataset.matchIndex) {
                    openCards[0].className = card.className = 'card match';

                    if(++app.basics.matchCounter === app.basics.amount)
                        app.handleWin();
                } 
                else {
                    card.className = 'card open show';
                    setTimeout(function() {
                        openCards[0].className = card.className = 'card';
                    }, 750);
                }
                app.basics.openCards = [];
            }
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
            //TODO: prevent double selection
            let usedIndexes = JSON.parse(localStorage.getItem('usedIconDataIndexes')) || [];
            let newIndex = app.randomNumBetween(0, data.length);

            if (usedIndexes.indexOf(newIndex) > 0)
                app.getNewDataIndex();
            else
                return newIndex;
        },
        render: function(cardPoolData) {
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
                        <div class="label">${cardData.label}</div>
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
        }
    };


    /*
    * Display the cards on the page
    *   - shuffle the list of cards using the provided 'shuffle' method below
    *   - loop through each card and create its HTML
    *   - add each card's HTML to the page
    */

    // Shuffle function from http://stackoverflow.com/a/2450976
    // function shuffle(array) {
    //     var currentIndex = array.length, temporaryValue, randomIndex;

    //     while (currentIndex !== 0) {
    //         randomIndex = Math.floor(Math.random() * currentIndex);
    //         currentIndex -= 1;
    //         temporaryValue = array[currentIndex];
    //         array[currentIndex] = array[randomIndex];
    //         array[randomIndex] = temporaryValue;
    //     }

    //     return array;
    // }


    /*
    * set up the event listener for a card. If a card is clicked:
    *  - display the card's symbol (put this functionality in another function that you call from this one)
    *  - add the card to a *list* of 'open' cards (put this functionality in another function that you call from this one)
    *  - if the list already has another card, check to see if the two cards match
    *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
    *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
    *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
    *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
    */
    app.init();

    return app;
})();
