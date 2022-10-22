const enter = document.getElementById("enter-options");
const submit = document.getElementById("submit-answers");
const increment = document.getElementById("increment");
const decrement = document.getElementById("decrement");
let numberInput = document.getElementById("number");
const quizContainer = document.getElementById("quiz-container");
const correctAnswers = [];

increment.addEventListener("click", () => numberInput.stepUp());

decrement.addEventListener("click", () => numberInput.stepDown());

enter.addEventListener("click", async () => {
  const res = await fetch(
    `https://opentdb.com/api.php?amount=${numberInput.value}&category=23`
  );

  const data = await res.json();

  const dataArray = await data.results;

  // buildQuiz(dataArray);
  console.log(dataArray);
});

function buildQuiz(dataArray) {
  dataArray.forEach((questionObj) => {
    // Wrap each question and answer in html tags
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
  return `<h2 class="question">${question}</h2>`;
}

function incorrectAnswers(incorrectAnswers, question) {
  // Regex matches commas to separate array into 3 answers
  const regex =
    /(?<=,\d{3}),(?=[1-9])|(?<!\d)\b,\b(?!\d)|(?<=[1-9]),(?=[1-9])|(?<=\d),(?=[A-Z])|(?<=[a-z]\s),(?=[A-Z])|(?<=\d),(?=\s[A-Z])|(?<=[a-z]),(?=\d)|(?<=[a-z]),(?=\d)|(?<=\d),(?=1)|(?<=\)|\%),|(?<=0),(?=[1-9])|(?<=ć),(?=O|Ò)/gi;

  return incorrectAnswers.split(regex).map(
    (answer) => `
    <div>
      <input type="radio" name="${question.question}" />
      <label>${answer}</label>
    </div>
   `
  );
}

function wrapCorrectAnswer(answer, question) {
  return `
  <div>
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
  let score = 0;

  userAnswers.forEach((answer, index) => {
    if (answer === correctAnswers[index]) {
      score += Math.round((1 / parseInt(numberInput.value)) * 100);
    }
  });

  const userScore = document.getElementById("score");
  const scoreHeading = document.querySelector(".score");

  userScore.innerText = `${score}`;
  scoreHeading.style.display = "block";
  scoreHeading.scrollIntoView({ behavior: "smooth", block: "start" });
}
