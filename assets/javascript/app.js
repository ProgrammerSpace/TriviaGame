var questionTracker = -1, totalQuestions, timeLeft = 16;
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
        if (totalQuestions - (questionTracker + 1)) {
            console.log("Missed:(");
            unanswered++;
            $(".unAns").text(unanswered + "/10");
            nextQuestion();
        } else {
            endGame();
        }
    }
    $(".timer").text("Time Left: " + timeLeft);
}

function endGame() {
    console.log("Game Over!!");
    $("#question").hide();
    $(".choice").hide();
    $(".timer").hide();

    $(".initHead").html("Thanks for taking the quiz!!");

    var thanks = $("<img>");
    $(thanks).attr("src", "assets/images/thankyou.gif");
    $(thanks).attr("width", "250");
    $(thanks).attr("height", "250");
    // $(".initHead").html("<h1>Thanks for taking the quiz!!</h1><img src=\"assets/images/thankyou.gif\" width=\"250\" height=\"250\">");
    var reset = $("<button>")
    $(reset).text("Try Again!");
    $(reset).addClass("btn btn-warning btn-lg");
    $(reset).attr("id", "reset");
    $(".initHead").append(thanks).append(reset);
    $(".initHead").show();

}

function reset() {

    $("#reset").remove();
    $(".initHead").html("Ready to check your Math skills???");
    $("#start").show();

    $(".correctAns").text("0");
    $(".wrongAns").text("0");
    $(".unAns").text("0");

    $("#question").empty().show();
    $(".choice").empty().show();
    $(".timer").empty().show();
}

$(document).ready(function () {
    // $("#start").click(function () {
    $(".qBox").on('click', '#start', function () {
        $(".initHead").hide();
        $("#start").hide();
        fetchQuestions();


        /* Wait time varies with different APIs and different number of questions in set
        Adding function call into .then
 
        setTimeout(nextQuestion, 1000); */

    });

    $(".qBox").on('click', '#reset', function () {
        reset();
    });

    $(".choice").on('click', '.btn', function () {
        if ($(this).text() == questions[questionTracker].c) {
            console.log("correct!");
            correctAnswers++;
            $(".correctAns").text(correctAnswers + "/10");
            if (totalQuestions - (questionTracker + 1)) {
                clearInterval(timer);
                nextQuestion();
            } else {
                clearInterval(timer);
                endGame();
            }
        } else {
            console.log("wrong:(");
            wrongAnswers++;
            $(".wrongAns").text(wrongAnswers + "/10");
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