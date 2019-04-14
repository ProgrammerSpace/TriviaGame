// Global variables
var questionTracker = -1, totalQuestions = 0, timeLeft = 16;
var ansOptions = [], questions = [];
var unanswered = 0, correctAnswers = 0, wrongAnswers = 0;

// Constructor to build questions retrieved from API
function frameQuestions(ques, ansCh, correct) {
    this.q = ques;
    this.a = ansCh;
    this.c = correct;
    questions.push(this);
}

// Fetch questions from API
function fetchQuestions() {
    $.ajax({
        url: "https://opentdb.com/api.php?amount=10&category=19&difficulty=medium",
        method: "GET"
    }).then(function (response) {
        totalQuestions = response.results.length;
        for (let i = 0; i < response.results.length; i++) {
            let ques = response.results[i].question;
            ansCh = response.results[i].incorrect_answers;
            correct = response.results[i].correct_answer
            questions[i] = new frameQuestions(ques, ansCh, correct);
        }
        nextQuestion();
    });
}

// Display next question
function nextQuestion() {
    questionTracker++;
    ansOptions = [];
    timeLeft = 16;
    $(".forgif").empty();
    $(".choice").empty();
    $(".timer").show();
    $("#question").html("<p>" + questions[questionTracker].q + "</p>");
    ansOptions.push(questions[questionTracker].c);
    for (let i = 0; i < questions[questionTracker].a.length; i++) {
        ansOptions.push(questions[questionTracker].a[i]);
    }

    // Shuffle options list
    ansOptions.sort(function () {
        return 0.5 - Math.random();
    });
    for (let i = 0; i < ansOptions.length; i++) {
        var newBtn = $("<button>");
        newBtn.attr("class", "btn btn-lg m-2");
        newBtn.attr("id", "opt" + i);
        $(newBtn).html(ansOptions[i]);
        $(".choice").append(newBtn);
    }
    timer = setInterval(startTimer, 1000);
}

// Timer
function startTimer() {
    if (timeLeft > 0) {
        timeLeft--;
    } else {
        clearInterval(timer);
        evaluateAnswer("missed");
        if (totalQuestions - (questionTracker + 1)) {
            setTimeout(nextQuestion, 3000);
        } else {
            setTimeout(endGame, 3000);
        }
    }
    $(".timer").text("Time Left: " + timeLeft);
}

// Answer evaluation
function evaluateAnswer(status) {

    var gif = $("<img>");

    // If user answer is correct
    if (status == "correct") {
        $(gif).attr("src", "assets/images/yougotit.gif");
        $(".choice").empty();
        $("#question").html("<p>You got it!!!</p>");
        correctAnswers++;
        $(".correctAns").text(correctAnswers + "/" + totalQuestions);

        // If user answer is wrong
    } else if (status == "wrong") {
        $(gif).attr("src", "assets/images/notthat.gif");
        $(".choice").html("<p> Correct answer is " + questions[questionTracker].c);
        wrongAnswers++;
        $(".wrongAns").text(wrongAnswers + "/" + totalQuestions);

        // If user missed to answer on right time
    } else if (status == "missed") {
        $(gif).attr("src", "assets/images/ohnoo.gif");
        $(".choice").html("<p>Time's up!!</p><p>Correct answer is " + questions[questionTracker].c + "</p>");
        unanswered++;
        $(".unAns").text(unanswered + "/" + totalQuestions);
    }

    $(gif).attr("width", "200");
    $(gif).attr("height", "200");
    $(".timer").hide();
    $(".forgif").append(gif);
}

// Game over, Report, Ask for new game
function endGame() {
    $("#question").hide();
    $(".choice").hide();
    $(".timer").hide();
    $(".forgif").empty();

    $(".initHead").html("Thanks for taking the quiz!! You got " + correctAnswers + " correct, " + wrongAnswers + " wrong and you missed " + unanswered);

    var thanks = $("<img>");
    $(thanks).attr("src", "assets/images/thankyou.gif");
    $(thanks).attr("width", "250");
    $(thanks).attr("height", "250");

    totalQuestions = 0
    correctAnswers = 0;
    wrongAnswers = 0;
    unanswered = 0;
    questionTracker = -1;
    ansOptions = [];
    questions = [];

    var reset = $("<button>")
    $(reset).text("Try Again!");
    $(reset).addClass("btn btn-lg");
    $(reset).attr("id", "reset");
    $(".forgif").append(thanks).append(reset);
    $(".initHead").show();

}

// Reset
function reset() {

    $("#reset").remove();
    $(".initHead").html("Ready to check your Math skills???");
    $("#start").show();

    $(".correctAns").text("0");
    $(".wrongAns").text("0");
    $(".unAns").text("0");

    $(".forgif").empty();
    $("#question").empty().show();
    $(".choice").empty().show();
    $(".timer").empty().show();
}

$(document).ready(function () {
    // Click to start game
    $(".qBox").on('click', '#start', function () {
        $(".initHead").hide();
        $("#start").hide();
        fetchQuestions();
    });

    // Click reset
    $(".qBox").on('click', '#reset', function () {
        reset();
    });

    // Answer click
    $(".choice").on('click', '.btn', function () {
        if ($(this).text() == questions[questionTracker].c) {
            evaluateAnswer("correct");
            if (totalQuestions - (questionTracker + 1)) {
                clearInterval(timer);
                setTimeout(nextQuestion, 3000);
            } else {
                clearInterval(timer);
                setTimeout(endGame, 3000);
            }
        } else {
            evaluateAnswer("wrong");
            if (totalQuestions - (questionTracker + 1)) {
                clearInterval(timer);
                setTimeout(nextQuestion, 3000);
            } else {
                setTimeout(endGame, 3000);
                endGame();
            }
        }
    });
});