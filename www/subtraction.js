function DefineDragEvents() {

    var draggedNum = 0;

    nodrag = d3.behavior.drag()
        .on("drag", function () {
            ;
        })
        .on("dragend", function () {
            ;
        });

    drag = d3.behavior.drag()
        .on("drag", function () {

            // check to see if you are still dragging the same number
            // if not, then speak the number
            var newDraggedNum = parseInt(d3.select(this).attr("data-value"), 10);
            if (newDraggedNum != draggedNum) {
                synthesize_word(newDraggedNum.toString());

                // set the current number being dragged so that it is not repeated
                draggedNum = newDraggedNum;
            }

            if (Math.abs(mousedragX - d3.event.x) > dragstep ||
               Math.abs(mousedragY - d3.event.y) > dragstep) {

                mousedragX = d3.event.x;
                mousedragY = d3.event.y;

                d3.select(this)
                    .attr("x", Math.max(0, mousedragX))
                    .attr("y", Math.max(0, mousedragY));
            }
        })
        .on("dragend", function () {

            // reset the number being dragged once you pick up your finger
            draggedNum = 0;

            var thisVal = parseInt(d3.select(this).attr("data-value"), 10);
            if (thisVal == subtrahend) {

                var minuendendX = parseInt(subtractionbar_g.select("#minuendbar").attr("x"), 0) + parseInt(subtractionbar_g.select("#minuendbar").attr("width"), 0);
                var minuendendY1 = parseInt(subtractionbar_g.select("#minuendbar").attr("y"), 0);
                var minuendendY2 = minuendendY1 + parseInt(subtractionbar_g.select("#minuendbar").attr("height"), 0);

                var proximityDelta = 100;
                if (mousedragX > minuendendX - proximityDelta && mousedragX < minuendendX + proximityDelta &&
                    mousedragY > minuendendY1 - proximityDelta && mousedragY < minuendendY2 + proximityDelta) {

                    subtractionbar_g.select("#minuendbar").attr("width", diff * 20);
                    //subtractionbar_g.select("#blankbar").attr("width", 0);
                    problem_g.select("#subtrahendnumber").text(subtrahend);

                    var equation = SpokenEquation(thisVal, true);
                    play_multiple_sounds(equation, function(){
                        finishActivity();
                    });
                }
            }
            else {
                var equation = SpokenEquation(thisVal, false);
                play_multiple_sounds(equation);
            }
            d3.select(this)
                .attr("x", 50)
                .attr("y", parseInt(d3.select(this).attr("data-y"), 10));

            mousedragX = 0;
            mousedragY = 0;
        });

    numberals_g.select("#numeral1").call(drag);
    numberals_g.select("#numeral2").call(drag);
    numberals_g.select("#numeral3").call(drag);
    numberals_g.select("#numeral4").call(drag);
    numberals_g.select("#numeral5").call(drag);
    numberals_g.select("#numeral6").call(drag);
    numberals_g.select("#numeral7").call(drag);
    numberals_g.select("#numeral8").call(drag);
    numberals_g.select("#numeral9").call(drag);
    numberals_g.select("#numeral10").call(drag);

    numberals_g.select("#minuendbar").call(nodrag);
    numberals_g.select("#diffbar").call(nodrag);
}

function SpokenEquation(thisVal, correct) {
    var equation = [];
    
    var minuend_int = parseInt(minuend)

    equation.push(minuend.toString());
    equation.push('minus');
    equation.push(thisVal.toString());
    equation.push('equals');
    var difference = minuend_int - thisVal;
    if (difference < 0)
    {
        equation.push('negative');
        equation.push((-1 * difference).toString());
    }
    else {
        equation.push(difference.toString());
    }
    
    if (correct)
    {
        equation.push('task_completed');
    }
    else
    {
        equation.push('try again');
    }

    return equation;
}


function DefineTapEvent() {

    numberals_g.select("#numeral1").on("click", Tap);
    numberals_g.select("#numeral2").on("click", Tap);
    numberals_g.select("#numeral3").on("click", Tap);
    numberals_g.select("#numeral4").on("click", Tap);
    numberals_g.select("#numeral5").on("click", Tap);
    numberals_g.select("#numeral6").on("click", Tap);
    numberals_g.select("#numeral7").on("click", Tap);
    numberals_g.select("#numeral8").on("click", Tap);
    numberals_g.select("#numeral9").on("click", Tap);
    numberals_g.select("#numeral10").on("click", Tap);
}

function Tap() {

    var thisVal = parseInt(d3.select(this).attr("data-value"), 10);

    var width = (parseInt(minuend, 10) - parseInt(thisVal, 10)) * 20;
    if (width == 8 * 20) {
        width += 6; // hack
    }
    if (width == 9 * 20) {
        width += 10; // hack
    }

    // if diff less than 1, show partial bar instead of nothing
    if (width < 20)
        width = 5;

    subtractionbar_g.select("#minuendbar").attr("width", width);
    //subtractionbar_g.select("#blankbar").attr("width", 0);

    if (thisVal == subtrahend) {

        problem_g.select("#subtrahendnumber").text(subtrahend);

        var equation = SpokenEquation(thisVal, true);
        play_multiple_sounds(equation, function () {
            setTimeout(finishActivity, 3000); // wait 3 seconds before going to the finished screen
        });
    }
    else {
        var equation = SpokenEquation(thisVal, false);
        play_multiple_sounds(equation);
        setTimeout(function () {
            subtractionbar_g.select("#minuendbar").attr("width", parseInt(minuend, 10) * 20);
            //subtractionbar_g.select("#blankbar").attr("width", parseInt(subtrahend, 10) * 20);
        }, 7000); // wait 7 seconds to finish spoken equation
    }
}

function InitProblem() {
    subtrahend = minuend - diff;

    // if minuend is two digits, shift its x position
    var minuend_xPos = 680;
    if (minuend >= 10) {
        minuend_xPos = 650;
    }

    problem_g.append("text")
        .attr("id", "minuendnumber")
        .attr("x", minuend_xPos)
        .attr("y", 120)
        .attr("font-family", 'Arial Rounded MT')
        .attr("font-size", "60px")
        .text(minuend);

    problem_g.append("text")
        .attr("font-size", "60px")
        .attr("font-family", "Arial Rounded MT")
        .attr("id", "plussign")
        .attr("x", 600)
        .attr("y", 190)
        .text("-");

    // if subtrahend is two digits, shift its x position
    var subtrahend_text = "⬜";
    var subtrahend_xPos = 680;
    if (subtrahend >= 10) {
        subtrahend_text = "⬜⬜";
        subtrahend_xPos = 650;
    }

    problem_g.append("text")
        .attr("font-size", "60px")
        .attr("font-family", "Arial Rounded MT")
        .attr("id", "subtrahendnumber")
        .attr("x", subtrahend_xPos)
        .attr("y", 190)
        .text(subtrahend_text);

    problem_g.append("line")
        .attr("x1", 600)
        .attr("x2", 740)
        .attr("y1", 220)
        .attr("y2", 220)
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    // if the diff is two digits, shift its x position
    var diff_xPos = 680;
    if (diff >= 10) {
        diff_xPos = 650;
    }

    problem_g.append("text")
        .attr("font-size", "60px")
        .attr("font-family", "Arial Rounded MT")
        .attr("id", "diffnumber")
        .attr("x", diff_xPos)
        .attr("y", 280)
        .text(diff);

    subtractionbar_g.append("rect")
        .attr("id", "minuendbar")
        .attr("class", "minuendbar")
        .attr("height", 20)
        .attr("x", 300)
        .attr("y", 150)
        .attr("data-value", minuend)
        .attr("width", minuend * 20);

    //// x, y got from minuend rect
    //var minuendendX = 300 + (minuend * 20);
    //var minuendendY = 150;
    //subtractionbar_g.append("rect")
    //    .attr("id", "blankbar")
    //    .attr("class", "blankbar")
    //    .attr("height", 20)
    //    .attr("x", minuendendX)
    //    .attr("y", minuendendY)
    //    .attr("data-value", subtrahend)
    //    .attr("width", subtrahend * 20);


    var diff_width = diff * 20;
    if (diff_width == 8 * 20) {
        diff_width += 6; // hack
    }
    if (diff_width == 9 * 20) {
        diff_width += 10; // hack
    }
    subtractionbar_g.append("rect")
        .attr("id", "diffbar")
        .attr("class", "diffbar")
        .attr("height", 20)
        .attr("x", 300)
        .attr("y", 250)
        .attr("data-value", diff)
        .attr("width", diff_width);
}