var questionTracker = -1, totalQuestions, timeLeft = 16;
var ansOptions = [], questions = [];
var unanswered, correctAnswers, wrongAnswers;

function frameQuestions(ques, ansCh, correct) {
    console.log("ques: " + ques + "ans: " + ansCh + "correct: " + correct);
    this.q = ques;
    this.a = ansCh;
    this.c = correct;
    console.log(this);
    questions.push(this);
}
// var questions = [
//     { q: "what is r in rgb", a: ["blue", "green", "yellow"], c: "red" },
//     { q: "what is g in vibgyor", a: ["violet", "indigo", "blue"], c: "green" },
//     { q: "Color you get by mixing yellow and red", a: ["purple", "maroon", "black"], c: "orange" }
// ];

function loading() {
    $(".qBox").html("<h1>Loading...</h1>");
}

function fetchQuestions() {
    $.ajax({
        url: "https://opentdb.com/api.php?amount=10&category=19&difficulty=medium",
        method: "GET"
    }).then(function (response) {
        console.log(response);
        totalQuestions = response.results.length;
        for (let i = 0; i < response.results.length; i++) {
            let ques = response.results[i].question;
            ansCh = response.results[i].incorrect_answers;
            correct = response.results[i].correct_answer
            questions[i] = new frameQuestions(ques, ansCh, correct);
            console.log(questions[i]);
        }
        nextQuestion();
    });
}

function nextQuestion() {
    questionTracker++;
    ansOptions = [];
    timeLeft = 16;
    $(".choice").empty();
    $("#question").html("<p>" + questions[questionTracker].q + "</p>");
    ansOptions.push(questions[questionTracker].c);
    for (let i = 0; i < questions[questionTracker].a.length; i++) {
        ansOptions.push(questions[questionTracker].a[i]);
    }
    console.log("array: " + ansOptions);
    ansOptions.sort(function () {
        return 0.5 - Math.random();
    });
    console.log("array: " + ansOptions);
    for (let i = 0; i < ansOptions.length; i++) {
        var newBtn = $("<button>");
        newBtn.attr("class", "btn btn-lg btn-warning");
        newBtn.attr("id", "opt" + i);
        $(newBtn).html(ansOptions[i]);
        $(".choice").append(newBtn);
    }
    timer = setInterval(startTimer, 1000);
}

function startTimer() {
    if (timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(timer);
        console.log("timer works!");
        if (totalQuestions - (questionTracker + 1)) {
            nextQuestion();
        } else {
            endGame();
        }
    }
    $(".timer").text("Time Left: " + timeLeft);
}

function endGame() {
    console.log("Game Over!!");
}

$(document).ready(function () {
    $("#start").click(function () {
        $("#start").hide();
        fetchQuestions();
        // setTimeout(nextQuestion, 1000);
    });
    $(".choice").on('click', '.btn', function () {
        if ($(this).text() == questions[questionTracker].c) {
            console.log("correct!");
            if (totalQuestions - (questionTracker + 1)) {
                clearInterval(timer);
                nextQuestion();
            } else {
                clearInterval(timer);
                endGame();
            }
        } else {
            console.log("wrong:(");
            if (totalQuestions - (questionTracker + 1)) {
                clearInterval(timer);
                nextQuestion();
            } else {
                clearInterval(timer);
                endGame();
            }
        }
    });
});