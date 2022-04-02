// Helpers
const API_URL = `https://api.adviceslip.com/advice`;
const TIMEOUT_SEC = 10;

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${res.message} (${res.status})`);
    return data;
  } catch (err) {
    console.error(err);
  }
};

// Fetch data from API
const getAdvice = async function () {
  try {
    const data = await getJSON(API_URL).then((data) => {
      const advice = data.slip.advice;

      //   Store data in state
      state.id = data.slip.id;
      state.advice = data.slip.advice;
    });
  } catch (err) {
    console.log(err);
  }
};

// Stored data
let state = {
  id: "",
  advice: "",
};

// Function to generate advice
const generateAdvice = async function (advice) {
  // Await for API data
  await getAdvice();

  // Add content to DOM
  document.querySelector(".box__title").innerHTML = `Advice #${state.id}`;
  document.querySelector(".box__quote__text").innerHTML = `${state.advice}`;
};

// Call function on click
document.querySelector(".box__dice").addEventListener("click", generateAdvice);

// Main init to generate content before you click on dice
generateAdvice();
