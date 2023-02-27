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
      `${questionObj.incorrect_answers}`,
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
  // Regex matches commas to separate array into 3 answers
  const regex =
    /(?<=,\d{3}),(?=[1-9])|(?<!\d)\b,\b(?!\d)|(?<=[1-9]),(?=[1-9])|(?<=\d),(?=[A-Z])|(?<=[a-z]\s),(?=[A-Z])|(?<=\d),(?=\s[A-Z])|(?<=[a-z]),(?=\d)|(?<=[a-z]),(?=\d)|(?<=\d),(?=1)|(?<=\)|\%),|(?<=0),(?=[1-9])|(?<=ć),(?=O|Ò)/gi;

  return incorrectAnswers.split(regex).map(
    (answer) => `
    <div class="answer__selection">
      <input type="radio" name="${question.question}" />
      <label>${answer}</label>
    </div>
   `
  );
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
  const userAnswers = [];

  const radioBtn = document.querySelectorAll('input[type="radio"]');

  radioBtn.forEach((btn) => {
    if (btn.checked === true) {
      userAnswers.push(btn.nextElementSibling.innerText);
    }
  });

  showResults(userAnswers);
}

function showResults(userAnswers) {
  const question_boxes = document.querySelectorAll(".question-box");
  let score = 0;

  userAnswers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) {
      score += Math.round((1 / parseInt(numberInput.value)) * 100);
    }
  });

  userScore.innerText = `${score}`;
  scoreHeading.classList.add("show");
  scoreHeading.scrollIntoView({ behavior: "smooth", block: "start" });
}
