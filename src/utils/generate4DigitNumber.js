import axios from "axios";
import qs from "query-string";

const generate4DigitNumber = async () => {
  const baseURl = "https://www.random.org/integers/?";
  const parameters = {
    num: 4,
    min: 0,
    max: 7,
    col: 1,
    base: 10,
    format: "plain",
    rnd: "new",
  };
  const parametersString = qs.stringify(parameters);
  const queryURL = `${baseURl}${parametersString}`;
  const randomNumbers = await axios
    .get(queryURL)
    .then((response) => response.data);

  let randomNumbersArray = randomNumbers.split("\n");
  randomNumbersArray = randomNumbersArray.slice(0, 4);
  randomNumbersArray = randomNumbersArray.map((currentElement) =>
    currentElement.trim()
  );
  randomNumbersArray = randomNumbersArray.map((currentElement) =>
    parseInt(currentElement, 10)
  );

  return randomNumbersArray;
};

export default generate4DigitNumber;
