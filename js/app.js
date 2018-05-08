$(document).ready(() => {
    // Event Listeners for game
    startGame();
    boxEventListeners();
    
    prepareGame();

});

// Array to keep track of which spaces are filled
let gameBoard = [0,1,2,3,4,5,6,7,8];

// Number of spaces filled
let fillCount = 0;

// array of spaces on board
const boxes = $('.box');

// True when single player has been chosen
let singlePlayer = false;

// True for player 1 turn, false for player 2
let activePlayer = true;

let player1 = {
    name: "",
    flag: "O",
}

let player2 = {
    name: "",
    flag: "X",
}

// Will initiate a move by the computer
let computerMove = () => {
    let bestChoice = minimax(gameBoard, player2);
    $(boxes[bestChoice.index]).trigger('click');
}

let howManyPlayers = () =>{
    $('#start h1').after(`
        <div class="users" >
            <a class="single-player">Single Player</a>
            <a class="two-players">Two Players</a>
        </div >
    `);
    playerMode();
}

// Adds input for player's name
let getUserName = () => {
    if (singlePlayer) {
        $('#start h1').after(`
            <div class="user_name">
                <label for="player1-name">
                    Please enter your name
                    <input type="text" id="player1-name">
                </label> 
            </div>
        `);
    } else {
        $('#start h1').after(`
            <div class="user_name">
                <p>Please enter your names</p>
                <label for="player1-name">Player 1 <input type="text" id="player1-name"></label> 
                <label for="player2-name">Player 2 <input type="text" id="player2-name"></label> 
            </div>
        `);
    }
}

// Adds player's name to gameboard
let addUserName = (player1, player2) => {
    $('.board header').append(`
        
            <p class="p1">${player1}</p>
            <p class="p2">${player2}</p>
        
    `)
}

// Prepare game for player
let prepareGame = () => {
    $('.button').hide();
    $('#board').hide();
    $('#finish').hide();
    $('#player1').addClass('active');
    howManyPlayers();
    //getUserName();
    
}

let playerMode = () => {
    $('.users a').on('click', e => {
        console.log(e.target.textContent);
        if (e.target.textContent === "Single Player") {
            singlePlayer = true;
        } 

        $('.users').hide();
        getUserName();
        $('.button').show();
    });
}

// Makes sure everything is reset for each
// game start
let startGame = () => {
    $('.button').on('click', (e) => {

        // If start game button is clicked, will
        // take value from input and add it to 
        // the game board
        if (e.target.textContent === 'Start game') {
            
            if ($('#player1-name')[0].value !== "") {
                player1.name = $('#player1-name')[0].value;
            } else {
                player1.name = 'Player 1';
            }
            
            if (!singlePlayer) {
                if ($('#player2-name')[0].value !== "") {
                    player2.name = $('#player2-name')[0].value;
                } else {
                    player2.name = 'Player 2';
                }
            } else {
                player2.name = "Computer";
            }

            addUserName(player1.name, player2.name);
        }

        // Empties every space on the board
        boxes.each(function() {
            $(this).removeClass('box-filled-1');
            $(this).removeClass('box-filled-2');
        });

        // Removes screen win class from the win screen
        $('#finish').removeClass('screen-win-tie');
        $('#finish').removeClass('screen-win-one');
        $('#finish').removeClass('screen-win-two');

        
        $('#player1').addClass('active');
        $('.board .p1').addClass('active');
        $('#player2').removeClass('active');
        $('.board .p2').removeClass('active');
        $('#start').fadeOut(1000);
        $('#finish').fadeOut(1000);
        $('#board').fadeIn(1000);

        activePlayer = true;
        gameBoard = [0,1,2,3,4,5,6,7,8];
        fillCount = 0;
    })
}

// Returns true if the selected space is filled or not
let isFilled = box => {
    if ($(box).hasClass('box-filled-1') || $(box).hasClass('box-filled-2')) {
        return true;
    } else {
        return false;
    }
}

// Adds event listeners for each space on board
let boxEventListeners = () => {

    // If space isn't filled will display the
    // image for the active player when mouse
    // hovers over
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


    boxes.each( (index, box) => {
        $(box).click(function() {
            if (!isFilled(this)) {
                if (activePlayer) {
                    // Fills space will player's image
                    $(this).addClass('box-filled-1');

                    // Adds player's flag to the gameBoard array
                    gameBoard[index] = player1.flag;

                    // Will check to seen if player has made a 
                    // winning move
                    checkWin(player1);

                    // Sets player two to as the active player
                    activePlayer = false;

                    // Changes visual cues for player's turn
                    $('#player1').removeClass('active');
                    $('.board .p1').removeClass('active');
                    $('#player2').addClass('active');
                    $('.board .p2').addClass('active');

                    // Calls the computer to make a move
                    // after the human player's move
                    if (singlePlayer) {
                        setTimeout(computerMove, 750);
                    }
                } else {
                    // Fills space will player's image
                    $(this).addClass('box-filled-2');

                    // Adds player's flag to the gameBoard array
                    gameBoard[index] = player2.flag;

                    // Will check to seen if player has made a 
                    // winning move
                    checkWin(player2);

                    // Sets player two to as the active player
                    activePlayer = true;

                    // Changes visual cues for player's turn
                    $('#player2').removeClass('active');
                    $('.board .p2').removeClass('active');
                    $('#player1').addClass('active');
                    $('.board .p1').addClass('active');
                }
            }
        });
    })
}



// Checks to see who wins, and changes the 
// screen based off it.
let checkWin = (player) => {
    fillCount++;
    if (
        (gameBoard[0] == player.flag && gameBoard[1] == player.flag && gameBoard[2] == player.flag) ||
        (gameBoard[3] == player.flag && gameBoard[4] == player.flag && gameBoard[5] == player.flag) ||
        (gameBoard[6] == player.flag && gameBoard[7] == player.flag && gameBoard[8] == player.flag) ||
        (gameBoard[0] == player.flag && gameBoard[3] == player.flag && gameBoard[6] == player.flag) ||
        (gameBoard[1] == player.flag && gameBoard[4] == player.flag && gameBoard[7] == player.flag) ||
        (gameBoard[2] == player.flag && gameBoard[5] == player.flag && gameBoard[8] == player.flag) ||
        (gameBoard[0] == player.flag && gameBoard[4] == player.flag && gameBoard[8] == player.flag) ||
        (gameBoard[2] == player.flag && gameBoard[4] == player.flag && gameBoard[6] == player.flag)
    ) {
        if (player.flag == player1.flag) {
            // Displays the winning screen for "O", and
            // displays player's name if set
            console.log('Player one won.');
            $('#board').fadeOut(1000);
            $('#finish').addClass('screen-win-one').fadeIn(1000);
            $('.message').html(`${player1.name} won!`);
        } else {
            // Displays the winning screen for "X"
            console.log('Player two won.');
            $('#board').fadeOut(1000);
            $('#finish').addClass('screen-win-two').fadeIn(1000);
            $('.message').html(`${player2.name} won!`);
        } 
    }
    // If every spaced is filled will display game tie screen
    if (fillCount >= 9) {
        console.log('Game is a draw');
        $('#board').fadeOut(1000);
        $('#finish').addClass('screen-win-tie').fadeIn(1000);
        $('.message').html('Tie');
    }
}

// Returns an array of empty spaces
let emptySpaces = board => {
    return board.filter(s => s != "O" && s != "X");
}

// Returns true if player has a winning move, and 
// false otherwise
let winning = (board, player) => {
    if (
        (board[0] == player.flag && board[1] == player.flag && board[2] == player.flag) ||
        (board[3] == player.flag && board[4] == player.flag && board[5] == player.flag) ||
        (board[6] == player.flag && board[7] == player.flag && board[8] == player.flag) ||
        (board[0] == player.flag && board[3] == player.flag && board[6] == player.flag) ||
        (board[1] == player.flag && board[4] == player.flag && board[7] == player.flag) ||
        (board[2] == player.flag && board[5] == player.flag && board[8] == player.flag) ||
        (board[0] == player.flag && board[4] == player.flag && board[8] == player.flag) ||
        (board[2] == player.flag && board[4] == player.flag && board[6] == player.flag)
    ) {
        return true;

    } else {
        return false;
    }
}

// Algorithm for computer's choice in move
let minimax = (newBoard, player) => {
    // An arrya of the empty spaces on the board
    let openSpaces = emptySpaces(newBoard);

    if (winning(newBoard, player1)) {
        // Returns a score of -10 if the human
        // player makes a winning move
        return { score: -10 };
    }
    else if (winning(newBoard, player2)) {
        // Returns a score of 10 if the computer
        // makes a winning move
        return { score: 10 };
    }
    else if (openSpaces.length === 0) {
        // Returns a score of 0 if there are
        // no open spaces left
        return { score: 0 };
    }

    // Creates an array for all the possible moves
    let moves = [];


    for (var i = 0; i < openSpaces.length; i++) {
        // Creates object for the selected move
        let move = {};

        // Sets the move's index to the index 
        // of the open space
        move.index = newBoard[openSpaces[i]];

        // Adds the player's tag to the open space
        // of the new board
        newBoard[openSpaces[i]] = player.flag;

        // Will recursively call the function for the
        // opposite player of who is currently runnint it
        if (player.flag == "X") {
            var result = minimax(newBoard, player1);
            move.score = result.score;
        }
        else {

            var result = minimax(newBoard, player2);
            move.score = result.score;
        }

        // Will reset the new board to it's default state
        newBoard[openSpaces[i]] = move.index;

        // Pushes the move to to the moves array
        moves.push(move);
    }


    let bestMove;

    // Will choose the best move for either the 
    // computer or human player, depending on who's running
    // the function and store it in the bestMove variable
    if (player.flag == "X") {
        // Will chose best move for computer
        let bestScore = -10000;
        for (var i = 0; i < moves.length; i++) {
            // If the moves[i].score is larger than
            // the best score then make that move 
            // the best move
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        // Will chose best move for human
        let bestScore = 10000;
        for (var i = 0; i < moves.length; i++) {
            // If the moves[i].score is less than
            // the best score then make that move 
            // the best move
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    // Function will return the best move from 
    // the moves array
    return moves[bestMove];
}

