# Mastermind Game Demo

This is the basic structure for a mastermind game on the client.

This is a multiplayer game where 2 people can join each other through web sockets and race to see who can figure out the code first

## Steps to run

1. `git clone` this repo
2. Inside the client folder run: `yarn install` or `npm install`
3. Then run: `yarn start` or `npm start`
4. Open another terminal
5. Go into the server folder
6. Run: `yarn install` or `npm install`
7. Then run: `yarn start` or `npm start`
8. Have fun playing the game!

### Thought Process

- I use the useState react hook to keep track of game state
- I have four input elements and i use useRef so that my buttons know which input elements to refer to
- Whenever the player guesses a number, there is a function that determines which hint to display
- I use an array to track correct guess. When the player guesses everything correctly they win
- I use a counter to keep track of guesses. When they player runs out of guesses, they lose
- the server only routes messages to the appropriate clients
- game state is held in each client

### Improvements

- Seperate functionality into different files
- I would use objects to group related state instead of creating state variables for every single piece of game state
- I would add styling, sounds, and animation
