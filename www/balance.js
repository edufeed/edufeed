function SetDefaultPosition() {
    // coin icons
    pane_g.append("rect")
                .attr("x", iconX + 120)
                .attr("y", iconY + 10)
                .attr("width", iconW)
                .attr("height", iconH)
                .attr("class", "coin1icon")
                .call(dragcoin1);
    pane_g.append("rect")
                .attr("x", iconX + 60)
                .attr("y", iconY + 5)
                .attr("width", iconW + 10)
                .attr("height", iconH + 10)
                .attr("class", "coin10icon")
                .call(dragcoin10);
    pane_g.append("rect")
                .attr("x", iconX)
                .attr("y", iconY)
                .attr("width", iconW + 20)
                .attr("height", iconH + 20)
                .attr("class", "coin100icon")
                .call(dragcoin100);

    // line
    balacebeam_g.append("line")
                .attr("stroke-width", "1")
                .attr("stroke", "black")
                .attr("x1", 5)
                .attr("x2", 405)
                .attr("y1", 151)
                .attr("y2", 151)
                .call(nodrag);

    // bags
    balacebeam_g.append("rect")
                .attr("id", "bag100")
                .attr("class", "collector")
                .attr("x", bagX)
                .attr("y", bagY)
                .attr("width", bagW)
                .attr("height", bagH)
                .call(nodrag);
    balacebeam_g.append("rect")
                .attr("id", "bag10")
                .attr("class", "collector")
                .attr("x", bagX + bagW + 10)
                .attr("y", bagY)
                .attr("width", bagW)
                .attr("height", bagH)
                .call(nodrag);
    balacebeam_g.append("rect")
                .attr("id", "bag1")
                .attr("class", "collector")
                .attr("x", bagX + 2 * (bagW + 10))
                .attr("y", bagY)
                .attr("width", bagW)
                .attr("height", bagH)
                .call(nodrag);

    // sum side
    balacebeam_g.append("rect")
                .attr("id", "sumbag")
                .attr("class", "sum")
                .attr("x", rotationX + 25)
                .attr("y", bagY)
                .attr("width", bagW * 2)
                .attr("height", bagH)
                .call(nodrag);
    var x_offset = 60;
    if (todoVal < 100)
        x_offset = 70;
    if (todoVal < 10)
        x_offset = 80;
    balacebeam_g.append("text")
                .text(todoVal)
                .attr("id", "todoVal")
                .attr("class", "number")
                .attr("x", rotationX + x_offset)
                .attr("y", bagY + 40)
                .call(nodrag);
}

function DefineCoinDragEvents() {

    nodrag = d3.behavior.drag()
        .on("drag", function () {
            ;
        })
        .on("dragend", function () {
            ;
        });

    dragcoin1 = d3.behavior.drag()
        .on("drag", function () {

            if (Math.abs(mousedrag1x - d3.event.x * scale) > dragstep ||
                Math.abs(mousedrag1y - d3.event.y * scale) > dragstep) {
                mousedrag1x = d3.event.x * scale;
                mousedrag1y = d3.event.y * scale;

                d3.select(this)
                    .attr("x", Math.max(0, Math.min(width - 20, d3.event.x * scale)))
                    .attr("y", Math.max(0, Math.min(height - 20, d3.event.y * scale)));
            }
        })
        .on("dragend", function () {

            d3.select(this)
                .attr("x", iconX + 120)
                .attr("y", iconY + 10);

            var newPoint = ComputeRotatedCoordinates(rotationX, rotationY, mousedrag1x, mousedrag1y, -1 * rotationDeg);
            var newMouseX = newPoint[0];
            var newMouseY = newPoint[1];

            var bag1 = document.getElementById("bag1");
            var left = parseInt(bag1.attributes["x"].value, 10);
            var right = parseInt(bag1.attributes["x"].value, 10) + parseInt(bag1.attributes["width"].value, 10);
            var top = parseInt(bag1.attributes["y"].value, 10);
            var bottom = parseInt(bag1.attributes["y"].value, 10) + parseInt(bag1.attributes["height"].value, 10);

            if (newMouseX > left - (iconW / 2) && newMouseX < right && newMouseY > top - (iconH / 2) && newMouseY < bottom) {
                AddToOne();
            }
            mousedrag1x = 0;
            mousedrag1y = 0;
        });

    dragremovecoin1 = d3.behavior.drag()
        .on("drag", function () {

            mousedragremove1x = d3.event.x * scale;
            mousedragremove1y = d3.event.y * scale;

            d3.select(this)
                .attr("x", Math.max(0, Math.min(width - 20, d3.event.x * scale)))
                .attr("y", Math.max(0, Math.min(height - 20, d3.event.y * scale)));
        })
        .on("dragend", function () {

            var newPoint = ComputeRotatedCoordinates(rotationX, rotationY, mousedragremove1x, mousedragremove1y, -1 * rotationDeg);
            var newMouseX = newPoint[0];
            var newMouseY = newPoint[1];

            var bag1 = document.getElementById("bag1");
            var left = parseInt(bag1.attributes["x"].value, 10);
            var right = parseInt(bag1.attributes["x"].value, 10) + parseInt(bag1.attributes["width"].value, 10);
            var top = parseInt(bag1.attributes["y"].value, 10);
            var bottom = parseInt(bag1.attributes["y"].value, 10) + parseInt(bag1.attributes["height"].value, 10);

            if (!(newMouseX > left && newMouseX < right && newMouseY > top && newMouseY < bottom))
                RemoveFromOne();
            else
                RearrangeOne();
        });

    dragcoin10 = d3.behavior.drag()
        .on("drag", function () {

            if (Math.abs(mousedrag10x - d3.event.x * scale) > dragstep ||
                Math.abs(mousedrag10y - d3.event.y * scale) > dragstep) {
                mousedrag10x = d3.event.x * scale;
                mousedrag10y = d3.event.y * scale;

                d3.select(this)
                    .attr("x", Math.max(0, Math.min(width - 20, d3.event.x * scale)))
                    .attr("y", Math.max(0, Math.min(height - 20, d3.event.y * scale)));
            }
        })
        .on("dragend", function () {

            d3.select(this)
                .attr("x", iconX + 60)
                .attr("y", iconY + 5);

            var newPoint = ComputeRotatedCoordinates(rotationX, rotationY, mousedrag10x, mousedrag10y, -1 * rotationDeg);
            var newMouseX = newPoint[0];
            var newMouseY = newPoint[1];

            var bag10 = document.getElementById("bag10");
            var left = parseInt(bag10.attributes["x"].value, 10);
            var right = parseInt(bag10.attributes["x"].value, 10) + parseInt(bag10.attributes["width"].value, 10);
            var top = parseInt(bag10.attributes["y"].value, 10);
            var bottom = parseInt(bag10.attributes["y"].value, 10) + parseInt(bag10.attributes["height"].value, 10);

            if (newMouseX > left - (iconW / 2) && newMouseX < right && newMouseY > top - (iconH / 2) && newMouseY < bottom) {
                AddToTen();
            }
            mousedrag10x = 0;
            mousedrag10y = 0;
        });

    dragremovecoin10 = d3.behavior.drag()
        .on("drag", function () {

            mousedragremove10x = d3.event.x * scale;
            mousedragremove10y = d3.event.y * scale;

            d3.select(this)
                .attr("x", Math.max(0, Math.min(width - 20, d3.event.x * scale)))
                .attr("y", Math.max(0, Math.min(height - 20, d3.event.y * scale)));
        })
        .on("dragend", function () {

            var newPoint = ComputeRotatedCoordinates(rotationX, rotationY, mousedragremove10x, mousedragremove10y, -1 * rotationDeg);
            var newMouseX = newPoint[0];
            var newMouseY = newPoint[1];

            var bag10 = document.getElementById("bag10");
            var left = parseInt(bag10.attributes["x"].value, 10);
            var right = parseInt(bag10.attributes["x"].value, 10) + parseInt(bag10.attributes["width"].value, 10);
            var top = parseInt(bag10.attributes["y"].value, 10);
            var bottom = parseInt(bag10.attributes["y"].value, 10) + parseInt(bag10.attributes["height"].value, 10);

            if (!(newMouseX > left && newMouseX < right && newMouseY > top && newMouseY < bottom))
                RemoveFromTen();
            else
                RearrangeTen();
        });

    dragcoin100 = d3.behavior.drag()
        .on("drag", function () {

            if (Math.abs(mousedrag100x - d3.event.x * scale) > dragstep ||
                Math.abs(mousedrag100y - d3.event.y * scale) > dragstep) {
                mousedrag100x = d3.event.x * scale;
                mousedrag100y = d3.event.y * scale;

                d3.select(this)
                    .attr("x", Math.max(0, Math.min(width - 20, mousedrag100x)))
                    .attr("y", Math.max(0, Math.min(height - 20, mousedrag100y)));
            }
        })
        .on("dragend", function () {

            d3.select(this)
                .attr("x", iconX)
                .attr("y", iconY);

            var newPoint = ComputeRotatedCoordinates(rotationX, rotationY, mousedrag100x, mousedrag100y, -1 * rotationDeg);
            var newMouseX = newPoint[0];
            var newMouseY = newPoint[1];

            var bag100 = document.getElementById("bag100");
            var left = parseInt(bag100.attributes["x"].value, 10);
            var right = parseInt(bag100.attributes["x"].value, 10) + parseInt(bag100.attributes["width"].value, 10);
            var top = parseInt(bag100.attributes["y"].value, 10);
            var bottom = parseInt(bag100.attributes["y"].value, 10) + parseInt(bag100.attributes["height"].value, 10);

            if (newMouseX > left - (iconW/2) && newMouseX < right && newMouseY > top - (iconH / 2) && newMouseY < bottom) {
                    AddToHundred();
            }
            mousedrag100x = 0;
            mousedrag100y = 0;
        });

    dragremovecoin100 = d3.behavior.drag()
        .on("drag", function () {

            mousedragremove100x = d3.event.x * scale;
            mousedragremove100y = d3.event.y * scale;

            d3.select(this)
                .attr("x", Math.max(0, Math.min(width - 20, d3.event.x * scale)))
                .attr("y", Math.max(0, Math.min(height - 20, d3.event.y * scale)));
        })
        .on("dragend", function () {

            var newPoint = ComputeRotatedCoordinates(rotationX, rotationY, mousedragremove100x, mousedragremove100y, -1 * rotationDeg);
            var newMouseX = newPoint[0];
            var newMouseY = newPoint[1];

            var bag100 = document.getElementById("bag100");
            var left = parseInt(bag100.attributes["x"].value, 10);
            var right = parseInt(bag100.attributes["x"].value, 10) + parseInt(bag100.attributes["width"].value, 10);
            var top = parseInt(bag100.attributes["y"].value, 10);
            var bottom = parseInt(bag100.attributes["y"].value, 10) + parseInt(bag100.attributes["height"].value, 10);

            if (!(newMouseX > left && newMouseX < right && newMouseY > top && newMouseY < bottom))
                RemoveFromHundred(); 
            else
                RearrangeHundred();
        });

}

function ComputeRotatedCoordinates(cx, cy, x, y, angle) {
    var radians = (Math.PI / 180) * angle,
        cos = Math.cos(radians),
        sin = Math.sin(radians),
        nx = (cos * (x - cx)) - (sin * (y - cy)) + cx,
        ny = (sin * (x - cx)) + (cos * (y - cy)) + cy;
    return [nx, ny];
}

function SnapCoinToPosition(x, y, c) {

    var xx = x;
    var yy = y;

    switch(c) {
        case 1:
        case 4:
        case 7:
            xx = x + 2;
            break;
        case 2:
        case 5:
        case 8:
            xx = x + 22;
            break;
        case 3:
        case 6:
        case 9:
            xx = x + 42;
            break;
        default:
            ;
    } 
    switch (c) {
        case 1:
        case 2:
        case 3:
            yy = y + 42;
            break;
        case 4:
        case 5:
        case 6:
            yy = y + 22;
            break;
        case 7:
        case 8:
        case 9:
            yy = y + 2;
            break;
        default:
            ;
    }

    return [xx, yy];
}

function RotateBeam()
{
    var curVal = hundred * 100 + ten * 10 + one;

    var diff = Math.abs(curVal - todoVal);
    var percentDiff = 0;
    if (todoVal > 0) {
        percentDiff = diff / todoVal;
    }

    //var h = Math.floor(diff / 100);
    //var t = Math.floor((diff % 100) / 10);
    //var o = Math.floor(diff % 10);
    //rotationDeg = h * 1.0 + t * 0.5 + o * 0.25 ;

    //rotationDeg = diff * 0.012;

    if (percentDiff == 0)
        rotationDeg = 0;
    if (percentDiff > 0)
        rotationDeg = 3;
    if (percentDiff >= 0.30)
        rotationDeg = 7;
    if (percentDiff >= 0.75)
        rotationDeg = 12;

    /*if (diff == 0)
        rotationDeg = 0;
    if (diff >= 1)
        rotationDeg = 3;
    if (diff >= 10)
        rotationDeg = 7;
    if (diff >= 100)
        rotationDeg = 12;*/

    if (curVal > todoVal)
        rotationDeg *= -1;

    d3.select("#balacebeam")
        .transition()
        .attr("transform", "rotate(" + rotationDeg + " " + rotationX + " " + rotationY + ")");

    if (diff == 0) {
        var number = SpokenNum()

        play_multiple_sounds(number, function() {
                finishActivity();
            });
    }
}

// Set up the number to be spoken
function SpokenNum()
{
    var number = [];
    // Add hundreds place
    if (hundred > 0) {
        number.push(hundred.toString());
        number.push('hundred');
    }

    // If the tens are in the teens, add that full number
    // Otherwise just add the tens place
    if (ten == 1) {
        number.push((ten * 10 + one).toString());
    }
    else if (ten > 1) {
        number.push((ten * 10).toString());
    }

    if (one > 0 && ten != 1) {
        number.push(one.toString());
    }

    number.push('success'); //hack to play the success sound

    return number;
}

function AddToOne() {
    if (one >= 9) {
        d3.selectAll("#c1").remove();
        one = 0;
        AddToTen(true);
    }
    else {
        one++;
        var p = SnapCoinToPosition(bagX + 2 * (bagW + 10), bagY, one);
        balacebeam_g.append("rect")
            .attr("x", p[0])
            .attr("y", p[1])
            .attr("width", iconW)
            .attr("height", iconH)
            .attr("class", "coin1")
            .attr("id", "c1")
            .call(dragremovecoin1);

        RotateBeam();
    }
}

function AddToTen(animate) {
    if (ten >= 9) {
        d3.selectAll("#c10").remove();
        ten = 0;
        AddToHundred(true);
    }
    else {
        ten++;
        if (typeof animate === "undefined" || animate == false) {
            var p = SnapCoinToPosition(bagX + bagW + 10, bagY, ten);
            balacebeam_g.append("rect")
                .attr("x", p[0])
                .attr("y", p[1])
                .attr("width", iconW)
                .attr("height", iconH)
                .attr("class", "coin10")
                .attr("id", "c10")
                .call(dragremovecoin10);
        } else {
            // animate 10 going from 1's to 10's
            var p0 = SnapCoinToPosition(bagX + 2 * (bagW + 10), bagY, 5);
            var o = balacebeam_g.append("rect")
                .attr("x", p0[0])
                .attr("y", p0[1])
                .attr("width", iconW)
                .attr("height", iconH)
                .attr("class", "coin10")
                .attr("id", "c10");

            var p = SnapCoinToPosition(bagX + bagW + 10, bagY, ten);
            o.transition()
                    .attr("x", p[0])
                    .attr("y", p[1])
                    .duration(2000);
        }
        RotateBeam();
    }
}

function AddToHundred(animate) {
    if (hundred >= 9) {
        //document.getElementById("boink").play();
        play_sound('audio/boink.mp3', function() {
            //finishActivity();
        });
    }
    else {
        hundred++;
        if (typeof animate === "undefined" || animate == false) {
            var p = SnapCoinToPosition(bagX, bagY, hundred);
            balacebeam_g.append("rect")
                .attr("x", p[0])
                .attr("y", p[1])
                .attr("width", iconW)
                .attr("height", iconH)
                .attr("class", "coin100")
                .attr("id", "c100")
                .call(dragremovecoin100);
        } else {
            // animate 100 going from 10's to 100's
            var p0 = SnapCoinToPosition(bagX + bagW + 10, bagY, 5);
            var o = balacebeam_g.append("rect")
                .attr("x", p0[0])
                .attr("y", p0[1])
                .attr("width", iconW)
                .attr("height", iconH)
                .attr("class", "coin100")
                .attr("id", "c100");

            var p = SnapCoinToPosition(bagX, bagY, hundred);
            o.transition()
                    .attr("x", p[0])
                    .attr("y", p[1])
                    .duration(2000);
        }
        RotateBeam();
    }
}

function RemoveFromOne() {
    one--;
    d3.select("#c1").remove();

    RearrangeOne();
    RotateBeam();
}

function RemoveFromTen() {
    ten--;
    d3.select("#c10").remove();

    RearrangeTen();
    RotateBeam();
}

function RemoveFromHundred() {
    hundred--;
    d3.select("#c100").remove();

    RearrangeHundred();
    RotateBeam();
}

function RearrangeOne() {
    var i = 1;
    balacebeam_g.selectAll("#c1").each(function () {
        var p = SnapCoinToPosition(bagX + 2 * (bagW + 10), bagY, i);
        d3.select(this)
            .attr("x", p[0])
            .attr("y", p[1]);
        i++;
    });
}

function RearrangeTen() {
    var i = 1;
    balacebeam_g.selectAll("#c10").each(function () {

        var p = SnapCoinToPosition(bagX + bagW + 10, bagY, i);
        d3.select(this)
            .attr("x", p[0])
            .attr("y", p[1]);
        i++;
    });
}

function RearrangeHundred() {
    var i = 1;
    balacebeam_g.selectAll("#c100").each(function () {

        var p = SnapCoinToPosition(bagX, bagY, i);
        d3.select(this)
            .attr("x", p[0])
            .attr("y", p[1]);
        i++;
    });
}

function ClearAll()
{
    d3.selectAll("#c100").remove();
    d3.selectAll("#c10").remove();
    d3.selectAll("#c1").remove();
    hundred = 0;
    ten = 0;
    one = 0;
    RotateBeam();
}


function AnimateOnes()
{
    one = 0;
    while (one < 9) {
        one++;
        setTimeout("foo("+one+");", 1000*one);
    }
}
function foo(myone)
{
    var p = SnapCoinToPosition(bagX + 2 * (bagW + 10), bagY, myone);
    var o = balacebeam_g.append("rect")
        .attr("x", iconX + 2 * 25)
        .attr("y", iconY)
        .attr("width", iconW)
        .attr("height", iconH)
        .attr("class", "coin1")
        .attr("id", "c1");

    o.transition()
            .attr("x", p[0])
            .attr("y", p[1])
            .duration(1000);
}