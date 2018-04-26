$(document).ready(() => {
    // Event Listeners for game
    startGame();
    boxEventListeners();
    
    prepareBoard();

});

//Global variables

const solutions = [
    { 
        possibility: true,
        solution: [0, 1, 2]
    },
    {
        possibility: true,
        solution: [3, 4, 5]
    },
    {
        possibility: true,
        solution: [6, 7, 8]
    },
    {
        possibility: true,
        solution: [0, 3, 6]
    },
    {
        possibility: true,
        solution: [1, 4, 7]
    },
    {
        possibility: true,
        solution: [2, 5, 8]
    },
    {
        possibility: true,
        solution: [0, 4, 8]
    },
    {
        possibility: true,
        solution: [2, 4, 6]
    },
]

const boxes = $('.box');
let player1 = '';
let activePlayer = true;
let possibleSolutions = 8;

let prepareBoard = () => {
    $('#board').hide();
    $('#finish').hide();
    $('#player1').addClass('active');

    
}

let startGame = () => {
    $('.button').on('click', () => {

        boxes.each(function() {
            $(this).removeClass('box-filled-1');
            $(this).removeClass('box-filled-2');
        });

        $('#finish').removeClass('screen-win-tie');
        $('#finish').removeClass('screen-win-one');
        $('#finish').removeClass('screen-win-two');

        $(solutions).each(function() {
            this.possibility = true;
        })

        $('#player1').addClass('active');
        $('#player2').removeClass('active');
        $('#start').fadeOut(1000);
        $('#finish').fadeOut(1000);
        $('#board').fadeIn(1000);

        activePlayer = true;
        possibleSolutions = 8;
    })
}

let isFilled = box => {
    if ($(box).hasClass('box-filled-1') || $(box).hasClass('box-filled-2')) {
        return true;
    } else {
        return false;
    }
}

let boxEventListeners = () => {
    boxes.hover(
        function () {
            if (!isFilled(this)) {
                if (activePlayer) {
                    $(this).css('background-image', 'url(img/o.svg)');
                } else {
                    $(this).css('background-image', 'url(img/x.svg)');
                }
            }
        }, function () {
            $(this).css('background-image', '')
        }
    );

    boxes.click(function() {
        if (!isFilled(this)) {
            if (activePlayer) {
                $(this).addClass('box-filled-1');
                activePlayer = false;
                $('#player1').removeClass('active');
                $('#player2').addClass('active');

            } else {
                $(this).addClass('box-filled-2');
                activePlayer = true;
                $('#player2').removeClass('active');
                $('#player1').addClass('active');
            }

            checkWin();
        }
    });
}

let checkWin = () => {
    $(solutions).each(function(index) {
        if (this.possibility) {
            let fillCount = 0;
            let p1 = 0;
            let p2 = 0;

            $(this.solution).each( (index, value) => {
                if (isFilled(boxes[value])) {
                    fillCount++;
                    $(boxes[value]).hasClass('box-filled-1') ?
                        p1++ : p2++;
                }
            })

            console.log(index, p1,p2)

            if (fillCount === 2) {
                if (p1 === 1 && p2 === 1) {
                    this.possibility = false;
                    possibleSolutions--;
                }
            }
            
            if (fillCount === 3) {
                if (p1 === fillCount) {
                    console.log('Player one won.');
                    $('#board').fadeOut(1000);
                    $('#finish').addClass('screen-win-one').fadeIn(1000);
                    $('.message').html('Winner');
                } else if (p2 === fillCount) {
                    console.log('Player two won.');
                    $('#board').fadeOut(1000);
                    $('#finish').addClass('screen-win-two').fadeIn(1000);
                    $('.message').html('Winner');
                } else {
                    this.possibility = false;
                    possibleSolutions--;
                }
            }
        }
    })

    if (possibleSolutions === 0) {
        console.log('Game is a draw');
        $('#board').fadeOut(1000);
        $('#finish').addClass('screen-win-tie').fadeIn(1000);
        $('.message').html('Tie');
    }
}