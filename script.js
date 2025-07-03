let score = 0; 
let currentQuestionIndex = 0;
let questions = [];
let timerId;
let timeLeft;
let timer = document.createElement('div');
let gamee = document.getElementById('game');
gamee.appendChild(timer);

async function getQuestion() {
    let abc = await fetch(`https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=multiple`);
    let data = await abc.json();
    questions = data.results;
    renderQuestion();
}

function renderQuestion() {
    document.getElementById('displayoptions').innerHTML = "";
    let q1 = document.getElementById('question');
    let currentQuestion = questions[currentQuestionIndex];
    q1.textContent = currentQuestion.question;

    let cans = currentQuestion.incorrect_answers.concat(currentQuestion.correct_answer);
    cans.sort(() => Math.random() - 0.5);
    renderOption(cans, currentQuestion.correct_answer);

    timer.classList.add('settime');
    timeLeft = 15;
    timer.textContent = "time left : " + timeLeft;

    clearInterval(timerId); // clear old interval if any
    timerId = setInterval(() => {
        timeLeft--;
        timer.textContent = "time left : " + timeLeft;
        if (timeLeft === 0) {
            clearInterval(timerId);
            nextQuestion();
        }
    }, 1000);
}

function renderOption(cans, correct_answer) {
    for (let i = 0; i < cans.length; i++) {
        let diplayy = document.createElement('li');
        let ulid = document.getElementById('displayoptions');
        ulid.appendChild(diplayy);
        diplayy.textContent = cans[i];
        diplayy.classList.add('list');

        diplayy.addEventListener('click', () => {
            let allOptions = document.querySelectorAll('.list');
            allOptions.forEach(option => option.style.pointerEvents = 'none');

            if (cans[i] === correct_answer) {
                diplayy.style.border = "2px solid green";
                score++;
            } else {
                diplayy.style.border = "2px solid red";
                allOptions.forEach(option => {
                    if (option.textContent === correct_answer) {
                        option.style.border = "2px solid green";
                    }
                });
            }

            clearInterval(timerId);
            setTimeout(nextQuestion, 1000); // delay to show result
        });
    }
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        renderQuestion();
    } else {
        showResult();
    }
}

function showResult() {
    const game = document.getElementById('game');
    game.innerHTML = `
        <h1>Quiz Over!</h1>
        <p>Your score: ${score}/10</p>
        <h3>${score >= 7 ? "🎉 You Win!" : "❌ Try Again!"}</h3>
        <button style="
                padding: 10px 20px; 
                background-color:rgb(80, 64, 115); 
                color: white; 
                font-size: 16px; 
                border: none; 
                border-radius: 8px; 
                cursor: pointer; 
                margin-top: 20px;
            "
             onclick="location.reload()">Play Again</button>

    `;
}

getQuestion();
