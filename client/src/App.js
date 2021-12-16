import { useState, useEffect, useRef } from "react";
import generate4DigitNumber from "./utils/generate4DigitNumber";
import { io } from "socket.io-client";

function App() {
  //game state
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [numberOfTries, setNumberOfTries] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [wonGame, setWonGame] = useState(false);
  const [hints, setHints] = useState("");
  const [winningTracker, setWinningTracker] = useState([0, 0, 0, 0]);

  //state related to socket io
  const [referenceToSocket, setReferenceToSocket] = useState();
  const [enemyclientId, setEnemyClientid] = useState(undefined);
  const [myClientId, setMyClientid] = useState(undefined);

  const [enemyClientGameState, setEnemyClientGameState] = useState({
    winningTracker: [0, 0, 0, 0],
    wonGame: false,
    gameOver: false,
    numberOfTries: 10,
  });

  //take this client states and turn it into a format the enemy client can read
  const createSnapshotOfMyState = () => {
    return {
      winningTracker,
      wonGame,
      gameOver,
      numberOfTries,
    };
  };

  //references to input elements
  const inputOne = useRef(undefined);
  const inputTwo = useRef(undefined);
  const inputThree = useRef(undefined);
  const inputFour = useRef(undefined);
  //join game input element
  const joinGameInput = useRef(undefined);

  //socketio
  const SERVER = "http://localhost:8080";
  useEffect(() => {
    const socket = io(SERVER, {
      cors: {
        origin: "*",
      },
    });
    socket.on("receive:personal_id", (data) => {
      setMyClientid(data);
    });
    socket.on("being_joined", (data) => {
      console.log("being_joined", data);
      setEnemyClientid(data.myClientId);
    });
    //implement these
    socket.on("i_lost", () => {
      setWonGame(true);
    });
    socket.on("i_won", () => {
      setGameOver(true);
    });
    socket.on("receive:updated_enemy_state", (data) => {
      setEnemyClientGameState(data);
    });

    setReferenceToSocket(socket);
    return () => socket.disconnect();
  }, []);

  //set the initials numbers to guess when the component first loads
  useEffect(() => {
    (async () => {
      setRandomNumbers(await generate4DigitNumber());
    })();
  }, []);

  //determine which message to display as a hint when the user makes a guess
  const messageMultiplexer = (numberInput, location) => {
    const correctNumber = randomNumbers[location];
    let message = "";
    console.log(randomNumbers);
    console.log(correctNumber, "correctNumber");
    console.log(numberInput, "numberinput");

    if (parseInt(numberInput) === correctNumber) {
      message = "You've guessed the right number in the right location";
      const newWinnings = [...winningTracker];
      newWinnings[location] = 1;
      setWinningTracker(newWinnings);
    } else if (randomNumbers.includes(parseInt(numberInput))) {
      message = "You've guessed the right number but not in the right location";
    } else {
      message = "You've guessed the wrong number. Try again!";
    }
    setHints(message);
  };

  //handlers for every button. could be done using #id's of the button elements
  const handleButtonClickOne = () => {
    setNumberOfTries(numberOfTries - 1);
    messageMultiplexer(inputOne.current.value, 0);
  };
  const handleButtonClickTwo = () => {
    setNumberOfTries(numberOfTries - 1);
    messageMultiplexer(inputTwo.current.value, 1);
  };
  const handleButtonClickThree = () => {
    setNumberOfTries(numberOfTries - 1);
    messageMultiplexer(inputThree.current.value, 2);
  };
  const handleButtonClickFour = () => {
    setNumberOfTries(numberOfTries - 1);
    messageMultiplexer(inputFour.current.value, 3);
  };

  //check if the user is out of tried
  useEffect(() => {
    if (numberOfTries === 0) {
      setGameOver(true);
    }
  }, [numberOfTries]);

  // check is the user won the game
  useEffect(() => {
    setWonGame(winningTracker.every((currentElement) => currentElement === 1));
  }, [winningTracker]);

  const determineDisplayBasedOnGameState = () => {
    if (!enemyclientId) {
      return (
        <div>
          <h1>Waiting for another client to connect</h1>
          <h2>Send this id: {myClientId}</h2>
          <h3>Or you can join another client by typing in their id</h3>
          <input ref={joinGameInput}></input>
          <button
            onClick={() => {
              setEnemyClientid(joinGameInput.current.value);
              referenceToSocket.emit("joining_you", {
                myClientId,
                enemyclientId: joinGameInput.current.value,
              });
            }}
          >
            Join Game
          </button>
        </div>
      );
    }

    if (wonGame) {
      referenceToSocket.emit("i_won", enemyclientId);
      return (
        <div>
          <h1>Congrats! You've won!</h1>
          <h2>The numbers were: {randomNumbers}</h2>
          <p>Refresh the page to start again</p>
        </div>
      );
    } else if (gameOver) {
      referenceToSocket.emit("i_lost", enemyclientId);
      return (
        <div>
          <h1>GameOver</h1>
          <h2>The numbers were: {randomNumbers}</h2>
          <p>Refresh the page to start again</p>
        </div>
      );
    } else {
      return (
        <div>
          <h1>
            Type in numbers 0-7 to guess the right code! Find it faster than
            your opponent!
          </h1>
          <h2>You have {numberOfTries} guesses, Choose wisely</h2>
          <p>{hints}</p>
          <input ref={inputOne} type="number"></input>
          <button onClick={handleButtonClickOne}>Guess!</button>
          <input ref={inputTwo} type="number"></input>
          <button onClick={handleButtonClickTwo}>Guess!</button>
          <input ref={inputThree} type="number"></input>
          <button onClick={handleButtonClickThree}>Guess!</button>
          <input ref={inputFour} type="number"></input>
          <button onClick={handleButtonClickFour}>Guess!</button>
          <p>{`${2}`}</p>
        </div>
      );
    }
  };

  return determineDisplayBasedOnGameState();
}

export default App;
