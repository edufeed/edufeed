function DefineDragEvents() {

    nodrag = d3.behavior.drag()
        .on("drag", function () {
            ;
        })
        .on("dragend", function () {
            ;
        });

    drag = d3.behavior.drag()
        .on("drag", function () {

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

            var thisVal = parseInt(d3.select(this).attr("data-value"), 10);
            if (thisVal == addend2) {

                var addend1endX = parseInt(additionbar_g.select("#addend1bar").attr("x"), 0) + parseInt(additionbar_g.select("#addend1bar").attr("width"), 0);
                var addend1endY1 = parseInt(additionbar_g.select("#addend1bar").attr("y"), 0);
                var addend1endY2 = addend1endY1 + parseInt(additionbar_g.select("#addend1bar").attr("height"), 0);

                var proximityDelta = 100;
                if (mousedragX > addend1endX - proximityDelta && mousedragX < addend1endX + proximityDelta &&
                    mousedragY > addend1endY1 - proximityDelta && mousedragY < addend1endY2 + proximityDelta) {

                    additionbar_g.select("#addend1bar").attr("width", sum * 14);
                    problem_g.select("#addend2number").text(addend2);

                    //document.getElementById("tada").play();
                    play_sound('audio/tada.mp3', function () {
                        finishActivity();
                    });
                }
            }
            else {
                //document.getElementById("boink").play();
                /*play_sound('audio/boink.mp3', function () {
                    //finishActivity();
                });*/
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
    if (thisVal == addend2) {

        additionbar_g.select("#addend1bar").attr("width", sum * 14);
        problem_g.select("#addend2number").text(addend2);

        play_sound('audio/tada.mp3', function () {
            finishActivity();
        });
    }
}


function InitProblem() {
    addend2 = sum - addend1;

    problem_g.append("text")
        .attr("id", "addend1number")
        .attr("x", 390)
        .attr("y", 100)
        .attr("font-family", 'Arial Rounded MT')
        .attr("font-size", "30px")
        .text(addend1);

    problem_g.append("text")
        .attr("font-size", "30px")
        .attr("font-family", "Arial Rounded MT")
        .attr("id", "plussign")
        .attr("x", 365)
        .attr("y", 130)
        .text("+");

    problem_g.append("text")
        .attr("font-size", "30px")
        .attr("font-family", "Arial Rounded MT")
        .attr("id", "addend2number")
        .attr("x", 390)
        .attr("y", 130)
        .text("⬜");

    problem_g.append("line")
        .attr("x1", 360)
        .attr("x2", 430)
        .attr("y1", 140)
        .attr("y2", 140)
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    problem_g.append("text")
        .attr("font-size", "30px")
        .attr("font-family", "Arial Rounded MT")
        .attr("id", "sumnumber")
        .attr("x", 390)
        .attr("y", 170)
        .text(sum);

    additionbar_g.append("rect")
        .attr("id", "addend1bar")
        .attr("class", "addend1bar")
        .attr("height", 20)
        .attr("x", 200)
        .attr("y", 110)
        .attr("data-value", addend1)
        .attr("width", addend1 * 14);

    additionbar_g.append("rect")
        .attr("id", "sumbar")
        .attr("class", "sumbar")
        .attr("height", 20)
        .attr("x", 200)
        .attr("y", 150)
        .attr("data-value", sum)
        .attr("width", sum * 14);
}