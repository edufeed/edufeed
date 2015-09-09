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

            mousedragX = d3.event.x * scale;
            mousedragY = d3.event.y * scale;

            d3.select(this)
                .attr("x", Math.max(0, Math.min(width - 20, d3.event.x * scale)))
                .attr("y", Math.max(0, Math.min(height - 20, d3.event.y * scale)));
        })
        .on("dragend", function () {

            var thisVal = parseInt(d3.select(this).attr("data-value"), 10);
            if (thisVal == addend2) {

                var addend1endX = parseInt(additionbar_g.select("#addend1bar").attr("x"), 0) + parseInt(additionbar_g.select("#addend1bar").attr("width"), 0);
                var addend1endY1 = parseInt(additionbar_g.select("#addend1bar").attr("y"), 0);
                var addend1endY2 = addend1endY1 + parseInt(additionbar_g.select("#addend1bar").attr("height"), 0);

                var proximityDelta = 20;
                if (mousedragX > addend1endX - proximityDelta && mousedragX < addend1endX + proximityDelta &&
                    mousedragY > addend1endY1 - proximityDelta && mousedragY < addend1endY2 + proximityDelta) {

                    additionbar_g.select("#addend1bar").attr("width", sum * 10);
                    //document.getElementById("tada").play();
                    play_sound('audio/tada.mp3', function () {
                        finishActivity();
                    });
                }
            }
            else {
                //document.getElementById("boink").play();
                play_sound('audio/boink.mp3', function () {
                    //finishActivity();
                });
            }
            d3.select(this)
                .attr("x", 0)
                .attr("y", parseInt(d3.select(this).attr("data-y"), 10));

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


function InitProblem() {
    addend2 = sum - addend1;

    problem_g.append("text")
        .attr("id", "addend1number")
        .attr("x", 335)
        .attr("y", 100)
        .text(addend1);

    problem_g.append("text")
        .attr("id", "plussign")
        .attr("x", 320)
        .attr("y", 130)
        .text("+");

    problem_g.append("text")
        .attr("id", "addend2number")
        .attr("x", 335)
        .attr("y", 130)
        .text("?");

    problem_g.append("line")
        .attr("x1", 310)
        .attr("x2", 350)
        .attr("y1", 150)
        .attr("y2", 150)
        .attr("stroke-width", 1)
        .attr("stroke", "black");

    problem_g.append("text")
        .attr("id", "equalsign")
        .attr("x", 320)
        .attr("y", 180)
        .text("=");

    problem_g.append("text")
        .attr("id", "sumnumber")
        .attr("x", 335)
        .attr("y", 180)
        .text(sum);

    additionbar_g.append("rect")
        .attr("id", "addend1bar")
        .attr("class", "addend1bar")
        .attr("height", 10)
        .attr("x", 100)
        .attr("y", 110)
        .attr("data-value", addend1)
        .attr("width", addend1 * 10);

    additionbar_g.append("rect")
        .attr("id", "sumbar")
        .attr("class", "sumbar")
        .attr("height", 10)
        .attr("x", 100)
        .attr("y", 170)
        .attr("data-value", sum)
        .attr("width", sum * 10);
}