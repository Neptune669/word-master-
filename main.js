const letters = document.querySelectorAll(".scoreboard-litter");
const loadDiv = document.querySelector(".loading-screen");
const answerLength = 5;
const rounds = 6;
async function init() {
  let currentGuess = "";
  let currentRow = 0;
  let isLoading = true;

  const res = await fetch(" https://words.dev-apis.com/word-of-the-day");
  const resObj = await res.json();
  const word = resObj.word.toUpperCase();
  const wordParts = word.split("");
  let done = false;
  setLoading(false);
  isLoading = false;

  function addLitter(letter) {
    if (currentGuess.length < answerLength) {
      currentGuess += letter;
    } else {
      currentGuess =
        currentGuess.substring(0, currentGuess.length - 1) + letter;
    }
    letters[currentRow * answerLength + currentGuess.length - 1].innerText =
      letter;
  }
  async function commit() {
    if (currentGuess.length !== answerLength) {
      return;
    }
    isLoading = true;
    setLoading(true);
    const res = await fetch(" https://words.dev-apis.com/validate-word", {
      method: "POST",
      body: JSON.stringify({ word: currentGuess }),
    });
    const resObj = await res.json();
    const validWord = resObj.validWord;

    isLoading = false;
    setLoading(false);

    if (!validWord) {
      markInvalidWord();
      return;
    }

    const guessParts = currentGuess.split("");
    const map = makeMap(wordParts);
    for (let i = 0; i < answerLength; i++) {
      if (guessParts[i] === wordParts[i]) {
        letters[currentRow * answerLength + i].classList.add("correct");
        map[guessParts[i]]--;
      }
    }
    for (let i = 0; i < answerLength; i++) {
      if (guessParts[i] === wordParts[i]) {
      } else if (wordParts.includes(guessParts[i] && map[guessParts[i]] > 0)) {
        letters[currentRow * answerLength + i].classList.add("close");
      } else {
        letters[currentRow * answerLength + i].classList.add("wrong");
      }
    }
    currentRow++;

    if (currentGuess === word) {
      alert("you win !!");
      done = true;
      return;
    } else if (currentRow === rounds) {
      alert(`you lose the word was ${word}`);
      done = true;
    }
    currentGuess = "";
  }
  function Backspace() {
    currentGuess = currentGuess.substring(0, currentGuess.length - 1);
    letters[currentRow * answerLength + currentGuess.length].innerText = "";
  }
  function markInvalidWord() {
    for (let i = 0; i < answerLength; i++) {
      letters[currentRow * answerLength + i].classList.remove("invalid");
      setTimeout(() => {
        letters[currentRow * answerLength + i].classList.add("invalid");
      }, 10);
    }
  }

  document.addEventListener("keydown", function handleKeyPress(event) {
    if (done || isLoading) {
      return;
    }
    const action = event.key;
    if (action === "Enter") {
      commit();
    } else if (action === "Backspace") {
      Backspace();
    } else if (isLetter(action)) {
      addLitter(action.toUpperCase());
    } else {
      // do no thing
    }
  });
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}
function setLoading(isLoading) {
  loadDiv.classList.toggle("hidden", !isLoading);
}
function makeMap(array) {
  const obj = {};
  for (let i = 0; i < array.length; i++) {
    if (obj[array[i]]) {
      obj[array[i]]++;
    } else {
      obj[array[i]] = 1;
    }
  }
  return obj;
}

init();
