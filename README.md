# Mastermind Game Demo

This is the basic structure for a mastermind game on the client.

I wanted this to be a multiplayer game that uses socket.io on a server to route messages in real-time to create a sort-of "race"
against your opponent.

Due to other projects I'm working on it is currently only the basic structure.

## Steps to run

`git clone` this repo

1. Inside the root folder run: `yarn install` or `npm install`
2. Then run: `yarn start` or `npm start`
3. Have fun playing the game!

### Thought Process

- I use the useState react hook to keep track of game state
- I have four input elements and i use useRef so that my buttons know which input elements to refer to
- I have a button that resets the state back to the initial values effectively restarting the game
- Whenever the player guesses a number, there is a function that determines which hint to display
- I use an array to track correct guess. When the player guesses everything correctly they win
- I use a counter to keep track of guesses. When they player runs out of guesses, they lose

### Improvements

- The reason the code is so verbose and doesn't folow standard practices is because I was very busy coding other projects this week
- I would use objects to group related state instead of creating state variables for every single piece of game state
- This would be good if I implement socket.io for multiplayer as I can group the state of client in one object and the state of the other client in another object
- I would add styling, soundsm animation
- The way the socket would work is that clients would maintain their own state and would send updates via websockets to other clients when certain ui elements are clicked
- I wouldn't need a database as data is being stored on the clients
- I would need a server that routes messages to the appropriate rooms
- Take more time doing the project. This was all done in 3 hours
