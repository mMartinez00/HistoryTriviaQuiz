const enter = document.getElementById("enter-options");
const increment = document.getElementById("increment");
const decrement = document.getElementById("decrement");
let numberInput = document.getElementById("number");
const quizContainer = document.getElementById("quiz-container");

// Event lsiteners
increment.addEventListener("click", () => numberInput.stepUp());

decrement.addEventListener("click", () => numberInput.stepDown());

enter.addEventListener("click", async () => {
  const res = await fetch(
    `https://opentdb.com/api.php?amount=${numberInput.value}&category=23`
  );

  const data = await res.json();
  const questions = await data.results;

  outputQuiz(questions);
});

function outputQuiz(questions) {
  questions.forEach((question) => {
    const q = wrapQuestion(`${question.question}`);

    const incorrectAnswersArr = incorrectAnswers(
      `${question.incorrect_answers}`,
      question
    );

    const correct = wrapCorrectAnswer(`${question.correct_answer}`, question);

    let shuffledAnswers = shuffle([...incorrectAnswersArr, correct]);

    outputHTML(q, shuffledAnswers);
  });
}

function wrapQuestion(question) {
  return `<h2 class="question">${question}</h2>`;
}

function incorrectAnswers(answers, question) {
  return answers.split(",").map(
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

// Fisher-Yates shuffle
function shuffle(answers) {
  let m = answers.length,
    t,
    i;

  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
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

  document.getElementById("submit-answers").style.display = "block";
}
