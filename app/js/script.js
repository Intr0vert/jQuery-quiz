$(document).ready(() => {
    startQuiz();
    
    $('.quiz--right').click(() => {
        newActual('right');
    });

    $('.quiz--left').click(() => {
        newActual('left');
    });

    $(".quiz--content-el button").click((el) => {
        changeQuizStep(el.currentTarget);
    });

    $('.activateBtn').click(() => {
        $('.wrapper--quiz').css('display', 'block');
        $('.activateBtn').css('display', 'none');
    });

    $('.quiz--close').click(() => {
        $('.wrapper--quiz').css('display', 'none');
        $('.activateBtn').css('display', 'block');
    });

    $('.ycont--quiz .btn-blue').click((e) => {
        e.preventDefault();

        rewriteResults();
    });

});

// Var for quiz's result
let result = {};
let quizHistory = ["1-1"];
let lastString = '';

// click button handler
function changeQuizStep(el) {
    let goTo = el.getAttribute('data-goTo');
    let message = lastString = $(el).text();

    // adding history
    quizHistory[$(`[data-actual="true"]`).attr('data-index')[2]] = el.getAttribute('data-goTo');
    // adding result
    result[`${$(`[data-actual="true"] h3`).text()}`] = message;

    // if this was last question redirection in last step
    if ($(`[data-actual="true"]`).attr('data-index')[2] >= 4) {
        $(`[data-actual="true"]`).attr('data-actual', 'false');

        $('.quiz--header').css('display', 'none');
        $('.quiz--content').css('display', 'none');

        $('.quiz--form').css('display', 'flex');

        rewriteResults();

        return ;
    }

    // changing question
    $(`[data-actual="true"]`).attr('data-actual', 'false');
    $(`[data-index="${goTo}"]`).attr('data-actual', 'true');
    
    // updating progress line
    $('.quiz--progressLine-el')[getActualQuizEl()[0].getAttribute("data-index")[2] - 1].className += ' quiz--progressLine-elActive';
    
    changeActualQuizEl();
}

// starting function for quiz
function startQuiz() {
    let length = $('.quiz--content').children()[$('.quiz--content').children().length - 1].getAttribute('data-index')[2];

    changeActualQuizEl();
    
    $('.quiz--header .quiz--sum').html(() => {
        return length;
    });

    for (let i = 0; i < length; i++) {
        $("<div class='quiz--progressLine-el'></div>").appendTo(".quiz--progressLine");
    }

    $('.quiz--progressLine-el')[0].className += ' quiz--progressLine-elActive';
}

// changing actual quiz step
function newActual(status) {
    //  if opened last step and slicked right button
    if (quizHistory[quizHistory.length - 1] === "99" && status === "right" &&
        $('.quiz--form').css('display') === 'flex') {
        return;
    }

    //  if opened last step
    if ($('.quiz--form').css('display') === 'flex') {
        let lastIndex = quizHistory[quizHistory.length-2];
        
        delete result[$(`[data-index="${quizHistory[quizHistory.length-2]}"] h3`).text()];
        $(`[data-index="${lastIndex}"`).attr('data-actual', 'true');
        
        $('.quiz--header').css('display', 'block');
        $('.quiz--content').css('display', 'block');
        
        $('.quiz--form').css('display', 'none');

        return;
    }

    let actualEl = getActualQuizEl()[0];
    let actual = getActualQuizEl()[0].getAttribute("data-index")[2];
    let length = $('.quiz--content').children()[$('.quiz--content').children().length - 1].getAttribute('data-index')[2];
    
    if (Number(actual) === 1 && status === "left" ||
    quizHistory[parseInt(actual)] === undefined && status === "right") {
        return;
    }

    // if we was on last step, open it
    if (actual >= length && status === "right" && quizHistory[quizHistory.length - 1] === "99") {
        $(`[data-actual="true"]`).attr('data-actual', 'false');

        $('.quiz--header').css('display', 'none');
        $('.quiz--content').css('display', 'none');

        $('.quiz--form').css('display', 'flex');

        result[$(`[data-index="${quizHistory[parseInt(actual) - 1]}"] h3`).text()] = lastString;
        
        // rewriting results (Just for example)
        rewriteResults();

        return;
    }
    
    if (status === "left") {
        let lastIndex = quizHistory[parseInt(actual) - 2];
        delete result[$(`[data-index="${quizHistory[parseInt(actual) - 2]}"] h3`).text()];

        $(`[data-index="${lastIndex}"`).attr('data-actual', 'true');
        $('.quiz--progressLine-el')[actual - 1].classList.remove('quiz--progressLine-elActive');
    } else if (status === "right") {
        let nextIndex = quizHistory[parseInt(actual)];
        let message = $(`[data-index="${quizHistory[parseInt(actual) - 1]}"] [data-goTo="${quizHistory[parseInt(actual)]}"]`).text();

        $(`[data-index="${nextIndex}"`).attr('data-actual', 'true');
        result[$(`[data-index="${quizHistory[parseInt(actual) - 1]}"] h3`).text()] = message;
        $('.quiz--progressLine-el')[actual].className += ' quiz--progressLine-elActive';
    }

    actualEl.setAttribute("data-actual", false);
    
    changeActualQuizEl();
}

// get actual quiz step
function getActualQuizEl() {
    return $('[data-actual="true"]');
}

// change info about actual el
function changeActualQuizEl() {
    $('.quiz--header .quiz--actual').html(() => {
        return getActualQuizEl()[0].getAttribute("data-index")[2]; 
    });
}

// TODO: make sendMessage function
function sendMessage() {
    let data = {
        // 
    };

    $.ajax({
        type: POST,
        url: "mail.php",
        data: data,
        success: function () {
            console.log("message is sended");
        }
    });
}

// rewriting results (Just for example)
function rewriteResults() {
    $('.quiz--form').html("");

    for (let i in result) {
        $(`<p class="quiz--result">${i} <br />${result[i]}</p>`).appendTo($('.quiz--form'));
    }
}