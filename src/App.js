import { useState, useEffect, useRef } from "react";
import generate4DigitNumber from "./utils/generate4DigitNumber";

function App() {
  const [randomNumbers, setRandomNumbers] = useState([]);
  const [numberOfTries, setNumberOfTries] = useState(10);
  const [gameOver, setGameOver] = useState(false);
  const [wonGame, setWonGame] = useState(false);
  const [hints, setHints] = useState("");
  const [winningTracker, setWinningTracker] = useState([0, 0, 0, 0]);

  const inputOne = useRef(undefined);
  const inputTwo = useRef(undefined);
  const inputThree = useRef(undefined);
  const inputFour = useRef(undefined);

  useEffect(() => {
    (async () => {
      setRandomNumbers(await generate4DigitNumber());
    })();
  }, []);

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

  // resets all the state effectively restarting the game
  const handleRestart = async () => {
    setNumberOfTries(10);
    setRandomNumbers(await generate4DigitNumber());
    setGameOver(false);
    setWonGame(false);
    setWinningTracker([0, 0, 0, 0]);
  };

  useEffect(() => {
    if (numberOfTries === 0) {
      setGameOver(true);
    }
  }, [numberOfTries]);

  useEffect(() => {
    setWonGame(winningTracker.every((currentElement) => currentElement === 1));
  }, [winningTracker]);

  const determineDisplayBasedOnGameState = () => {
    if (wonGame) {
      return (
        <div>
          <h1>Congrats! You've won!</h1>
          <button onClick={handleRestart}>Restart</button>
        </div>
      );
    } else if (gameOver) {
      return (
        <div>
          <h1>GameOver</h1>
          <button onClick={handleRestart}>Restart</button>
        </div>
      );
    } else {
      return (
        <div>
          <h1>Type in numbers 0-7 to guess the right code!</h1>
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
        </div>
      );
    }
  };

  return determineDisplayBasedOnGameState();
}

export default App;
