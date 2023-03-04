const enter = document.getElementById("enter-options");
const submit = document.getElementById("submit-answers");
const increment = document.getElementById("increment");
const decrement = document.getElementById("decrement");
let numberInput = document.getElementById("number");
const quizContainer = document.getElementById("quiz-container");
const scoreHeading = document.querySelector(".score-heading");
const userScore = document.getElementById("user-score");
const correctAnswers = [];

increment.addEventListener("click", () => numberInput.stepUp());

decrement.addEventListener("click", () => numberInput.stepDown());

enter.addEventListener("click", () => {
  fetchQuiz()
    .then((dataArray) => buildQuiz(dataArray))
    .catch(() => {
      quizContainer.innerHTML = `<h1 class="error">There was an error.</h1>`;
    });
});

async function fetchQuiz() {
  const res = await fetch(
    `https://opentdb.com/api.php?amount=${numberInput.value}&category=23`
  );

  const data = await res.json();

  const dataArray = await data.results;

  return dataArray;
}

function buildQuiz(dataArray) {
  // Wrap each question and answers in html tags
  dataArray.forEach((questionObj) => {
    const question = wrapQuestion(`${questionObj.question}`);

    const incorrectAnswersArray = incorrectAnswers(
      questionObj.incorrect_answers,
      questionObj
    );

    const correct = wrapCorrectAnswer(
      `${questionObj.correct_answer}`,
      questionObj
    );

    let shuffledAnswers = shuffle([...incorrectAnswersArray, correct]);

    // Push each correct answer into array
    const { correct_answer } = questionObj;
    correctAnswers.push(correct_answer);

    outputHTML(question, shuffledAnswers);
  });

  // This will prevent the user from click the enter button multiple times and recieving additional questions
  enter.disabled = true;
}

function wrapQuestion(question) {
  return `<h2 class="question__title">${question}</h2>`;
}

function incorrectAnswers(incorrectAnswers, question) {
  return incorrectAnswers.map((answer) => {
    return `<div class="answer__selection">

         <input type="radio" name="${question.question}" />

         <label>${answer}</label>
         
       </div>`;
  });
}

function wrapCorrectAnswer(answer, question) {
  return `
  <div class="answer__selection">

    <input type="radio" name="${question.question}" />

    <label>${answer}</label>

  </div>
  `;
}

// Fisher-Yates shuffle (ALL ANSWERS)
function shuffle(answers) {
  let m = answers.length,
    t,
    i;

  while (m) {
    i = Math.floor(Math.random() * m--);

    t = answers[m];
    answers[m] = answers[i];
    answers[i] = t;
  }

  return answers;
}

function outputHTML(question, answers) {
  quizContainer.innerHTML += `
  <div class="question-box">
    ${question}
    ${answers.join("").toString()}
  </div>
  `;

  submit.style.display = "block";
}

// Submit Answers
submit.addEventListener("click", submitAnswers);

function submitAnswers() {
  const radioBtns = document.querySelectorAll('input[type="radio"]');
  const userAnswers = [];
  const checkedBtns = [];

  radioBtns.forEach((btn) => {
    if (btn.checked === true) {
      // Push user answers into userAnswers array and checked buttons in checkedBtnsarray
      userAnswers.push(btn.nextElementSibling.innerText);

      checkedBtns.push(btn);
    }
  });

  showResults(userAnswers, checkedBtns);
}

function showResults(userAnswers, checkedBtns) {
  let score = 0;

  // Check if user answers match correct answers
  userAnswers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) {
      score += Math.round((1 / parseInt(numberInput.value)) * 100);
    }
  });

  // Apply green border to question box if answer is correct
  checkedBtns.forEach((btn, index) => {
    if (btn.nextElementSibling.innerText === correctAnswers[index]) {
      btn.parentElement.parentElement.classList.add("green");
    } else {
      // Apply red border to question box if answer is wrong
      btn.parentElement.parentElement.classList.add("red");
    }
  });

  userScore.innerText = `${score}`;
  scoreHeading.classList.add("show");
  scoreHeading.scrollIntoView({ behavior: "smooth", block: "start" });
}
