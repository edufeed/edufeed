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

            if (Math.abs(mousedragX - d3.event.x * scale) > dragstep ||
                Math.abs(mousedragY - d3.event.y * scale) > dragstep) {

                mousedragX = d3.event.x * scale;
                mousedragY = d3.event.y * scale;

                d3.select(this)
                    .attr("x", Math.max(0, mousedragX))
                    .attr("y", Math.max(0, mousedragY));
            }
        })
        .on("dragend", function () {

            // reset the number being dragged once you pick up your finger
            draggedNum = 0;

            var thisVal = parseInt(d3.select(this).attr("data-value"), 10);
            if (thisVal == addend2) {

                var addend1endX = parseInt(additionbar_g.select("#addend1bar").attr("x"), 0) + parseInt(additionbar_g.select("#addend1bar").attr("width"), 0);
                var addend1endY1 = parseInt(additionbar_g.select("#addend1bar").attr("y"), 0);
                var addend1endY2 = addend1endY1 + parseInt(additionbar_g.select("#addend1bar").attr("height"), 0);

                var proximityDelta = 100;
                if (mousedragX > addend1endX - proximityDelta && mousedragX < addend1endX + proximityDelta &&
                    mousedragY > addend1endY1 - proximityDelta && mousedragY < addend1endY2 + proximityDelta) {

                    additionbar_g.select("#addend1bar").attr("width", sum * 14);
                    additionbar_g.select("#blankbar").attr("width", 0);
                    problem_g.select("#addend2number").text(addend2);

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
                .attr("x", 30)
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

    numberals_g.select("#addend1bar").call(nodrag);
    numberals_g.select("#sumbar").call(nodrag);
}

function SpokenEquation(thisVal, correct) {
    var equation = [];
    
    var addend1_int = parseInt(addend1)

    equation.push(addend1.toString());
    equation.push('plus');
    equation.push(thisVal.toString());
    equation.push('equals');
    equation.push((addend1_int + thisVal).toString());
    
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

    additionbar_g.select("#addend1bar").attr("width", (parseInt(addend1, 10) + parseInt(thisVal, 10)) * 14);
    additionbar_g.select("#blankbar").attr("width", 0);

    if (thisVal == addend2) {

        problem_g.select("#addend2number").text(addend2);

        var equation = SpokenEquation(thisVal, true);
        play_multiple_sounds(equation, function () {
            setTimeout(finishActivity, 3000); // wait 3 seconds before going to the finished screen
        });
    }
    else {
        var equation = SpokenEquation(thisVal, false);
        play_multiple_sounds(equation);
        setTimeout(function () {
            additionbar_g.select("#addend1bar").attr("width", parseInt(addend1, 10) * 14);
            additionbar_g.select("#blankbar").attr("width", parseInt(addend2, 10) * 14);
        }, 7000); // wait 7 seconds to finish spoken equation
    }
}

function InitProblem() {
    addend2 = sum - addend1;

    // if addend1 is two digits, shift its x position
    var addend1_xPos = 450;
    if (addend1 >= 10) {
        addend1_xPos = 430;
    }

    problem_g.append("text")
        .attr("id", "addend1number")
        .attr("x", addend1_xPos)
        .attr("y", 100)
        .attr("font-family", 'Arial Rounded MT')
        .attr("font-size", "40px")
        .text(addend1);

    problem_g.append("text")
        .attr("font-size", "40px")
        .attr("font-family", "Arial Rounded MT")
        .attr("id", "plussign")
        .attr("x", 400)
        .attr("y", 140)
        .text("+");

    // if addend2 is two digits, shift its x position
    var addend2_text = "⬜";
    var addend2_xPos = 450;
    if (addend2 >= 10) {
        addend2_text = "⬜⬜";
        addend2_xPos = 430;
    }

    problem_g.append("text")
        .attr("font-size", "40px")
        .attr("font-family", "Arial Rounded MT")
        .attr("id", "addend2number")
        .attr("x", addend2_xPos)
        .attr("y", 140)
        .text(addend2_text);

    problem_g.append("line")
        .attr("x1", 390)
        .attr("x2", 490)
        .attr("y1", 150)
        .attr("y2", 150)
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    // if the sum is two digits, shift its x position
    var sum_xPos = 450;
    if (sum >= 10){
        sum_xPos = 430;
    }

    problem_g.append("text")
        .attr("font-size", "40px")
        .attr("font-family", "Arial Rounded MT")
        .attr("id", "sumnumber")
        .attr("x", sum_xPos)
        .attr("y", 190)
        .text(sum);

    additionbar_g.append("rect")
        .attr("id", "addend1bar")
        .attr("class", "addend1bar")
        .attr("height", 20)
        .attr("x", 200)
        .attr("y", 110)
        .attr("data-value", addend1)
        .attr("width", addend1 * 14);

    // x, y got from addend1 rect
    var addend1endX = 200 + (addend1 * 14);
    var addend1endY = 110;
    additionbar_g.append("rect")
        .attr("id", "blankbar")
        .attr("class", "blankbar")
        .attr("height", 20)
        .attr("x", addend1endX)
        .attr("y", addend1endY)
        .attr("data-value", addend2)
        .attr("width", addend2 * 14);

    additionbar_g.append("rect")
        .attr("id", "sumbar")
        .attr("class", "sumbar")
        .attr("height", 20)
        .attr("x", 200)
        .attr("y", 150)
        .attr("data-value", sum)
        .attr("width", sum * 14);
}