const { EmbedBuilder } = require('discord.js');
const words = require('./Words.js')
const { createCanvas } = require('canvas');

class CodenamesGame {
        constructor(client, channelId) {
        console.log("Creating a new game");
        this.client = client;
        this.channelId = channelId;
        this.redTeam = [];
        this.blueTeam = [];
        this.players = [];
        this.teams = {
            red: { spymaster: null, operators: [], score: 0 },
            blue: { spymaster: null, operators: [], score: 0 },
        }; 
        this.board = []; // Fill this with your words
        this.turn = 'red'; // Start with red
        console.log("Initializing the game board");
        this.board = this.setupBoard(words);
        console.log("Game created");
        this.guessedWords = [];
        } 
        hasPlayer(player) {
            return this.players.includes(player);
        }

    addPlayer(player, role) {
            console.log(`Adding player: ${player}`);
            if (this.players.includes(player)) {
                console.log(`Player already in the game: ${player}`);
                
        }

            // Determine which team the player should be on
            let team = 'red';
            if (this.teams.red.operators.length > this.teams.blue.operators.length) {
            team = 'blue';
        }

        // Check if the selected team already has a spymaster
        if (role === 'spymaster' && this.teams[team].spymaster) {
            role = 'operator'; // If yes, change the role to operator
        }

        // Assign the player to the selected role and team
        if (role === 'spymaster') {
            this.teams[team].spymaster = player;
        } else {
            this.teams[team].operators.push(player);
        } 

        // Add the player to the list of players
        this.players.push(player);

    }
    getTeamOfPlayer(player) {
        // Go through both teams and return the team of the player
        for (const team of ['red', 'blue']) {
            if (this.teams[team].spymaster === player || this.teams[team].operators.includes(player)) {
                return team;
            }
        } 
        return null;
    } 

    getBotUser() {
        // Get the current team
        const team = this.turn === 'red' ? this.redTeam : this.blueTeam;
    
        // Find a bot on the team
        const botUser = team.find(user => user.bot === true);
    
        return botUser;
    }
    

    removePlayer(player) {
        // Remove the player from their team and role
        const team = this.getTeamOfPlayer(player);
        if (this.teams[team].spymaster === player) {
            this.teams[team].spymaster = null;
        } else {
            const index = this.teams[team].operators.indexOf(player);
            if (index !== -1) {
                this.teams[team].operators.splice(index, 1);
            }}};
    

    createBotUser(team) {
                // Generate a unique id for the bot
                const id = (this.redTeam.length + this.blueTeam.length + 1).toString();
            
                // Create a new bot "user" object
                const botUser = {
                    id: `bot${id}`,
                    username: `Bot${id}`,
                    bot: true,
                    team: team,
                    guess: this.botGuess.bind(this)
                };

                if (team === 'red') {
                    this.redTeam.push(botUser);
                } else if (team === 'blue') {
                    this.blueTeam.push(botUser);
                }
            
                console.log(`Bot${id} added to ${team} team`);  // Debug line
            
                return botUser;
            }



    botGuess() {
                console.log("Bot is about to guess."); // Debug line
            

                // Get a list of words that have not been guessed yet
                const unguessedWords = this.board.filter(tile => !this.guessedWords.includes(tile.word));
            
                console.log("Unguessed words: ", unguessedWords); // Debug line
            
                // Choose a random word from the unguessed words
                const randomIndex = Math.floor(Math.random() * unguessedWords.length);
                const guess = unguessedWords[randomIndex].word;
            
                console.log(`Bot is guessing: ${guess}`); // Debug line
            
                return guess;
            }
            
            
            
    setupBoard(wordList) {
        console.log("In setupBoard method");
        // Randomly select 25 words from the word list
        const selectedWords = this.shuffle(wordList).slice(0, 25);
    
        // Assign 8 words to each team and 1 to the assassin, the rest are neutral
        const assignments = ['red', 'red', 'red', 'red', 'red', 'red', 'red', 'red',
                             'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue', 'blue',
                             'assassin'].concat(new Array(8).fill('neutral'));
        
                // Shuffle the assignments
                const shuffledAssignments = this.shuffle(assignments);
        
                // Create the board
                let board = [];
                for (let i = 0; i < 25; i++) {
                    board.push({ word: selectedWords[i], team: shuffledAssignments[i] });
                }
                console.log("Board setup complete");
                return board;
            }
        
    shuffle(array) {
        console.log("In shuffle method");
        console.log(`Array length: ${array.length}`);  // Log the array length
                let currentIndex = array.length, temporaryValue, randomIndex;
        
                // While there remain elements to shuffle...
                while (0 !== currentIndex) {
                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;
        
                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;
                }
                console.log("Shuffling complete");
                return array;
            }
    giveClue(user, clue, number) {
                const team = this.getTeamOfPlayer(user);
                if (team !== this.turn || !this.isSpymaster(user)) {
                    throw new Error("It's not your turn or you're not a spymaster!");
                }
        
                // Save the clue and number for this turn
                this.clue = clue;
                this.number = number;
        
                // Send a message to the channel with the clue and number
                // You need to add code here to send the message...
            }
        
    isSpymaster(user) {
        if (user.isBot) return false;

                return this.teams.red.spymaster === user || this.teams.blue.spymaster === user;
                
            }

    guessWord(user, word) {
        console.log(`guessWord called by ${user.username} for word: ${word}`);  // add this line

                const team = this.getTeamOfPlayer(user);
                if (team !== this.turn || this.isSpymaster(user)) {
                    // some code here
                }
            
                // Find the word on the board
                const tile = this.board.find(tile => tile.word.trim().toLowerCase() === word.trim().toLowerCase());
            
                if (!tile) {
                    return "That word isn't on the board!";
                }
            
                // Check which team the word belongs to
                if (tile.team === 'assassin') {
                    // If it's the assassin, the game is over
                    this.endGame(this.turn === 'red' ? 'blue' : 'red');
                    console.log(this.board)
                    return "You guessed the assassin! Game over.";
                } else if (tile.team === 'neutral') {
                    // If it's neutral, the turn ends
                    this.endTurn();
                    console.log('endTurn called after guessing neutral word');
                    this.guessedWords.push(word);
                    console.log(this.board)
                    return "You guessed a neutral word. Your turn is over.";
                } else if (tile.team === this.turn) {
                    // If it's their own team, they can guess again
                    this.number--;
                    if (this.number === 0) {
                        // If they've guessed the number of words indicated by the spymaster, end the turn
                        this.endTurn();
                        console.log();
                        this.guessedWords.push(word);
                        console.log('guessedWords after other team\'s word:', this.guessedWords); // Debug line
                        console.log(this.board)
                        return `Correct! You've guessed all the words for this clue. It's now the other team's turn.`;
                    } else {
                        this.guessedWords.push(word);
                        console.log(this.board)
                        return `Correct! You can make ${this.number} more guesses.`;
                    }
                } else {
                    // If it's the other team's word, the turn ends and the other team gets a point
                    this.endTurn();
                    this.teams[tile.team].score++;
                    console.log(this.board)
                    return `You guessed a word belonging to the other team! Your turn is over.`;
                }            
            
        } 
        
    initiateTurn() {
            console.log("Initiating turn...");
            let team = this.turn; // Get the current team
            console.log(`Team: ${team}`);  // Debug line

            let player = this.getTeamOfPlayer(team)[0]; // Get the first player of this team
            console.log(`Player: ${player}`);  // Debug line

            

            // Only ask to guess if it's not a bot's turn
            if (!this.isBotTurn()) {
                let guess = player.guess(); // Ask the player to guess a word
                this.guessWord(player, guess); // Process the guessed word
            }
        
            // If it's a bot's turn, delay the bot's guess
            if (this.isBotTurn()) {
                setTimeout(() => {
                    let guess = player.guess(); // Ask the bot to guess a word
                    this.guessWord(player, guess); // Process the guessed word
                }, 2000); // Wait for 2 seconds before the bot makes a guess
            }
        }
    
    isBotTurn() {
            // Get the current team
            const team = this.turn === 'red' ? this.redTeam : this.blueTeam;
            
            // Check if there's a bot on the current team
            const botOnTeam = team.some(user => user.bot === true);
            console.log(`Checking if it's bot's turn. Result: ${botOnTeam}`);  // Debug line

            return botOnTeam;
        }
                

        
    endTurn() {
            // Switch to the other team
            console.log("Before endTurn()"); // debug
            
            if (this.turn === 'red') {
                this.turn = 'blue';
            } else {
                this.turn = 'red';
               
    console.log("Turn changed to: ", this.turn); // debug
            }
        
            // Check if the next team has a bot player and if so, make it guess after a delay
        
            if (this.isBotTurn()) {
                const botUser = this.getBotUser();
                console.log("Bot's turn"); // debug
                console.log("Current turn: ", this.turn);
                console.log("List of bot users: ", this.getBotUsers());
                console.log("Next bot user: ", this.getBotUser());
                const guess = botUser = 
                console.log("Bot guessed: ", guess); // debug
        
                const response = this.guessWord(this.getBotUser(), guess);
                console.log("Bot guessWord response: ", response); // debug
        
                this.sendMessage(response);
            } this.initiateTurn();
        
            console.log("After endTurn()"); // debug
        }
        

    endGame(winningTeam) {
        if (this.teams.red.score === this.teams.blue.score) {
            // It's a tie
            // Send a message to the channel announcing the tie
        } else {
            // There's a clear winner
            const winningTeam = this.teams.red.score > this.teams.blue.score ? 'red' : 'blue';
            // Send a message to the channel announcing the winner
        }

        // Remove the game from the client's game collection
        game.endGame(winningTeam);
        client.games.delete(game.channelId);
    }

    getBoardForSpymaster() {
        // Create a new canvas
        const canvas = createCanvas(500, 500); // Change the size as necessary
        const ctx = canvas.getContext('2d');
    
        // Draw the game board
        for (let i = 0; i < 25; i++) {
            let color;
            switch (this.board[i].team) {
                case 'red':
                    color = '#ff4d4d'; // Red
                    break;
                case 'blue':
                    color = '#4d4dff'; // Blue
                    break;
                case 'neutral':
                    color = '#ffcc99'; // White
                    break;
                case 'assassin':
                    color = '#000000'; // Black
                    break;
            }  
              
            
            // Calculate the position and size of the square

            const padding = 1; // Change as necessary
            const cellWidth = 100; // (500 - (2 * padding * 5)) / 5
            const cellHeight = 100; // (500 - (2 * padding * 5)) / 5

            const x = ((i % 5)  * (cellWidth + padding)); // Change the multiplier as necessary
            const y = (Math.floor(i / 5) * (cellHeight + padding)) ; // Change the multiplier as necessary
            const size = 100; // Change as necessary
    
        
            // Draw the square
            ctx.fillStyle = color;
            ctx.fillRect(x, y, size, size);
                      
            ctx.strokeStyle = 'black'; // Set the color of the border
            ctx.lineWidth = 2; // Set the width of the border
            ctx.strokeRect(x, y, cellWidth, cellHeight);


            // Draw the word
            
            let fontSize = 18; // Start with a maximum font size
            let textWidth;
            do {
                ctx.font = `${fontSize}px Trebuchet`;
                textWidth = ctx.measureText(this.board[i].word).width;
                fontSize--;
            } while (textWidth > size);
            
            

            if (this.board[i].team === 'assassin') {
                ctx.fillStyle = 'white';
            } else {
                ctx.fillStyle = 'black';
            }
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(this.board[i].word, x + cellWidth / 2, y + cellHeight / 2);
        } 
    
        // Convert the canvas to a buffer
        const buffer = canvas.toBuffer('image/png');
    
        // Return the buffer
        return buffer;
    
        }

        
    getBoardForOperator() {
    // Create a new canvas
    console.log('guessedWords at start of getBoardForOperator:', this.guessedWords); // Debug line

    const canvas = createCanvas(500, 500); // Change the size as necessary
    const ctx = canvas.getContext('2d');

    // Draw the game board
    for (let i = 0; i < 25; i++) {
        let color = '#ffffff'; // Set default color to white

        if (this.guessedWords.map(word => word.toLowerCase()).includes(this.board[i].word.toLowerCase()))
 {
            console.log('Word guessed:', this.board[i].word); // Debug line
            console.log('Team:', this.board[i].team); // New debug line

            // Change color if the word has been guessed
            switch (this.board[i].team) {
                case 'red':
                    color = '#ff4d4d'; // Red
                    console.log('Color should be Red'); // New debug line
                    break;
                case 'blue':
                    color = '#4d4dff'; // Blue
                    console.log('Color should be Blue'); // New debug line
                    break;
                case 'neutral':
                    color = '#ffcc99'; // Neutral
                    console.log('Color should be Neutral'); // New debug line
                    break;
                case 'assassin':
                    color = '#000000'; // Black
                    console.log('we dead'); // New debug line
                    break;
            }
        }

        // Calculate the position and size of the square
        const padding = 1; // Change as necessary
        const cellWidth = 100; // (500 - (2 * padding * 5)) / 5
        const cellHeight = 100; // (500 - (2 * padding * 5)) / 5

        const x = ((i % 5) * (cellWidth + padding)); // Change the multiplier as necessary
        const y = (Math.floor(i / 5) * (cellHeight + padding)); // Change the multiplier as necessary
        const size = 100; // Change as necessary

        // Draw the square
        ctx.fillStyle = color; // Use the color variable here
        ctx.fillRect(x, y, size, size);
                    
        ctx.strokeStyle = 'black'; // Set the color of the border
        ctx.lineWidth = 2; // Set the width of the border
        ctx.strokeRect(x, y, cellWidth, cellHeight);
    
    
                // Draw the word
                
                let fontSize = 18; // Start with a maximum font size
                let textWidth;
                do {
                    ctx.font = `${fontSize}px Trebuchet`;
                    textWidth = ctx.measureText(this.board[i].word).width;
                    fontSize--;
                } while (textWidth > size);
                
                
    
                ctx.fillStyle = 'black'
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(this.board[i].word, x + cellWidth / 2, y + cellHeight / 2);
            } 
        
            // Convert the canvas to a buffer
            const buffer = canvas.toBuffer('image/png');
        
            // Return the buffer
            return buffer;
        
            }

    }
 
module.exports = CodenamesGame;