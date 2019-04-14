var questionTracker = -1, totalQuestions = 0, timeLeft = 16;
var ansOptions = [], questions = [];
var unanswered = 0, correctAnswers = 0, wrongAnswers = 0;

function frameQuestions(ques, ansCh, correct) {
    console.log("ques: " + ques + "ans: " + ansCh + "correct: " + correct);
    this.q = ques;
    this.a = ansCh;
    this.c = correct;
    console.log(this);
    questions.push(this);
}

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
    $(".forgif").empty();
    $(".choice").empty();
    $(".timer").show();
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
        newBtn.attr("class", "btn btn-lg m-2");
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
        console.log("Missed:(");
        evaluateAnswer("missed");
        if (totalQuestions - (questionTracker + 1)) {
            setTimeout(nextQuestion, 3000);
        } else {
            endGame();
        }
    }
    $(".timer").text("Time Left: " + timeLeft);
}

function evaluateAnswer(status) {

    var gif = $("<img>");
    if (status == "correct") {
        $(gif).attr("src", "assets/images/yougotit.gif");
        $(".choice").empty();
        $("#question").html("<p>You got it!!!</p>");
        correctAnswers++;
        $(".correctAns").text(correctAnswers + "/10");
    } else if (status == "wrong") {
        $(gif).attr("src", "assets/images/notthat.gif");
        $(".choice").html("<p> Correct answer is " + questions[questionTracker].c);
        wrongAnswers++;
        $(".wrongAns").text(wrongAnswers + "/10");
    } else if (status == "missed") {
        $(gif).attr("src", "assets/images/ohnoo.gif");
        $(".choice").html("<p>Time's up!!</p><p>Correct answer is " + questions[questionTracker].c + "</p>");
        unanswered++;
        $(".unAns").text(unanswered + "/10");
    }
    $(gif).attr("width", "200");
    $(gif).attr("height", "200");
    $(".timer").hide();
    $(".forgif").append(gif);
}

function endGame() {
    console.log("Game Over!!");
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
    $(".qBox").on('click', '#start', function () {
        $(".initHead").hide();
        $("#start").hide();
        fetchQuestions();
    });

    $(".qBox").on('click', '#reset', function () {
        reset();
    });

    $(".choice").on('click', '.btn', function () {
        if ($(this).text() == questions[questionTracker].c) {
            console.log("correct!");
            evaluateAnswer("correct");
            if (totalQuestions - (questionTracker + 1)) {
                clearInterval(timer);
                setTimeout(nextQuestion, 3000);
            } else {
                clearInterval(timer);
                endGame();
            }
        } else {
            console.log("wrong:(");
            evaluateAnswer("wrong");
            if (totalQuestions - (questionTracker + 1)) {
                clearInterval(timer);
                setTimeout(nextQuestion, 3000);
            } else {
                clearInterval(timer);
                endGame();
            }
        }
    });
});