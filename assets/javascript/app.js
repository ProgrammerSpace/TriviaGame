var questionTracker = -1, totalQuestions = 3, timeLeft = 15;
var ansOptions = [];

var questions = [
    { q: "what is r in rgb", a: ["blue", "green", "yellow"], c: "red" },
    { q: "what is g in vibgyor", a: ["violet", "indigo", "blue"], c: "green" },
    { q: "Color you get by mixing yellow and red", a: ["purple", "maroon", "black"], c: "orange" }
];

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

function fetQuestions() {
    $.ajax({
        url: "https://opentdb.com/api.php?amount=10&category=19",
        method: "GET"
    }).then(function (response) {
        console.log(response);
    });
}

function nextQuestion() {
    questionTracker++;
    ansOptions = [];
    timeLeft = 15;
    $(".choice").empty();
    $("#question").text(questions[questionTracker].q);
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
        $(newBtn).text(ansOptions[i]);
        $(".choice").append(newBtn);
    }
    timer = setInterval(startTimer, 1000);
}
$(document).ready(function () {
    $("#start").click(function () {
        $("#start").hide();
        nextQuestion();
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