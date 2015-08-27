function DefinePatterns() {

    coin1pattern = defs.append("pattern")
		.attr("id", "coin1pattern")
		.attr("height", iconH)
		.attr("width", iconW);
    coin1pattern.append("image")
		.attr("height", iconH)
		.attr("width", iconW)
		.attr("xlink:href", "../icons/coin1pattern.png");
    coin10pattern = defs.append("pattern")
		.attr("id", "coin10pattern")
		.attr("height", iconH)
		.attr("width", iconW);
    coin10pattern.append("image")
        .attr("height", iconH)
        .attr("width", iconW)
        .attr("xlink:href", "../icons/coin10pattern.png");
    coin100pattern = defs.append("pattern")
		.attr("id", "coin100pattern")
		.attr("height", iconH)
		.attr("width", iconW);
    coin100pattern.append("image")
        .attr("height", iconH)
        .attr("width", iconW)
        .attr("xlink:href", "../icons/coin100pattern.png");
}

function SetDefaultPosition() {

    // coin icons
    pane_g.append("rect")
                .attr("x", iconX + 2 * 25)
                .attr("y", iconY)
                .attr("width", iconW)
                .attr("height", iconH)
                .attr("class", "coin1")
                .call(dragcoin1);
    pane_g.append("rect")
                .attr("x", iconX + 25)
                .attr("y", iconY)
                .attr("width", iconW)
                .attr("height", iconH)
                .attr("class", "coin10")
                .call(dragcoin10);
    pane_g.append("rect")
                .attr("x", iconX)
                .attr("y", iconY)
                .attr("width", iconW)
                .attr("height", iconH)
                .attr("class", "coin100")
                .call(dragcoin100);

    // line
    balacebeam_g.append("line")
                .attr("stroke-width", "1")
                .attr("stroke", "black")
                .attr("x1", 5)
                .attr("x2", width-35)
                .attr("y1", bagY + bagH + 1)
                .attr("y2", bagY + bagH + 1)
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
                .attr("x", rotationX + bagW)
                .attr("y", bagY)
                .attr("width", bagW * 2)
                .attr("height", bagH)
                .call(nodrag);
    var x_offset = 17;
    if (todoVal < 100)
        x_offset = 24;
    if (todoVal < 10)
        x_offset = 33;
    balacebeam_g.append("text")
                .text(todoVal)
                .attr("id", "todoVal")
                .attr("class", "number")
                .attr("x", rotationX + bagW + x_offset)
                .attr("y", bagY + 35)
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

            mousedrag1x = d3.event.x;
            mousedrag1y = d3.event.y;

            d3.select(this)
                .attr("x", Math.max(0, Math.min(width - 20, d3.event.x)))
                .attr("y", Math.max(0, Math.min(height - 20, d3.event.y)));
        })
        .on("dragend", function () {

            d3.select(this)
                .attr("x", iconX + 2 * 25)
                .attr("y", iconY);

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
        });

    dragremovecoin1 = d3.behavior.drag()
        .on("drag", function () {

            mousedragremove1x = d3.event.x;
            mousedragremove1y = d3.event.y;

            d3.select(this)
                .attr("x", Math.max(0, Math.min(width - 20, d3.event.x)))
                .attr("y", Math.max(0, Math.min(height - 20, d3.event.y)));
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

            mousedrag10x = d3.event.x;
            mousedrag10y = d3.event.y;

            d3.select(this)
                .attr("x", Math.max(0, Math.min(width - 20, d3.event.x)))
                .attr("y", Math.max(0, Math.min(height - 20, d3.event.y)));
        })
        .on("dragend", function () {

            d3.select(this)
                .attr("x", iconX + 25)
                .attr("y", iconY);

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
        });

    dragremovecoin10 = d3.behavior.drag()
        .on("drag", function () {

            mousedragremove10x = d3.event.x;
            mousedragremove10y = d3.event.y;

            d3.select(this)
                .attr("x", Math.max(0, Math.min(width - 20, d3.event.x)))
                .attr("y", Math.max(0, Math.min(height - 20, d3.event.y)));
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

            mousedrag100x = d3.event.x;
            mousedrag100y = d3.event.y;

            d3.select(this)
                .attr("x", Math.max(0, Math.min(width - 20, mousedrag100x)))
                .attr("y", Math.max(0, Math.min(height - 20, mousedrag100y)));
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
        });

    dragremovecoin100 = d3.behavior.drag()
        .on("drag", function () {

            mousedragremove100x = d3.event.x;
            mousedragremove100y = d3.event.y;

            d3.select(this)
                .attr("x", Math.max(0, Math.min(width - 20, d3.event.x)))
                .attr("y", Math.max(0, Math.min(height - 20, d3.event.y)));
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
            xx = x + 0;
            break;
        case 2:
        case 5:
        case 8:
            xx = x + 15;
            break;
        case 3:
        case 6:
        case 9:
            xx = x + 30;
            break;
        default:
            ;
    } 
    switch (c) {
        case 1:
        case 2:
        case 3:
            yy = y + 30;
            break;
        case 4:
        case 5:
        case 6:
            yy = y + 15;
            break;
        case 7:
        case 8:
        case 9:
            yy = y + 0;
            break;
        default:
            ;
    }

    return [xx, yy];
}

function sendmessage(messagetype, data) {
  parent.postMessage({
    messagetype: messagetype,
    data: data
  }, '*');
}

function RotateBeam()
{
    var curVal = hundred * 100 + ten * 10 + one;
    var diff = Math.abs(curVal - todoVal);

    //var h = Math.floor(diff / 100);
    //var t = Math.floor((diff % 100) / 10);
    //var o = Math.floor(diff % 10);
    //rotationDeg = h * 1.0 + t * 0.5 + o * 0.25 ;

    //rotationDeg = diff * 0.012;

    if (diff == 0)
        rotationDeg = 0;
    if (diff >= 1)
        rotationDeg = 3;
    if (diff >= 10)
        rotationDeg = 7;
    if (diff >= 100)
        rotationDeg = 12;

    if (curVal > todoVal)
        rotationDeg *= -1;

    d3.select("#balacebeam")
        .transition()
        .attr("transform", "rotate(" + rotationDeg + " " + rotationX + " " + rotationY + ")");

    var correct = document.getElementById("correct");
    if (diff == 0) {
        correct.attributes["visibility"].value = "visible";
        //document.getElementById("tada").play();
        synthesize_word_cached('audio/tada.mp3', function() {
            sendmessage('task-finished');
        });
    }
    else
        correct.attributes["visibility"].value = "hidden";
}

function AddToOne() {
    one++;
    if (one >= 10) {
        d3.selectAll("#c1").remove();
        one = 0;
        AddToTen();
    }
    else {
        //document.getElementById("ones").textContent = one;
        var p = SnapCoinToPosition(bagX + 2 * (bagW + 10), bagY, one);
        // add to bag
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

function AddToTen() {
    ten++;
    if (ten >= 10) {
        d3.selectAll("#c10").remove();
        ten = 0;
        AddToHundred();
    }
    else {
        //document.getElementById("tens").textContent = ten;
        var p = SnapCoinToPosition(bagX + bagW + 10, bagY, ten);
        // add to bag
        balacebeam_g.append("rect")
            .attr("x", p[0])
            .attr("y", p[1])
            .attr("width", iconW)
            .attr("height", iconH)
            .attr("class", "coin10")
            .attr("id", "c10")
            .call(dragremovecoin10);

        RotateBeam();
    }
}

function AddToHundred() {
    if (hundred >= 9) {
        //document.getElementById("boink").play();
        synthesize_word_cached('audio/tada.mp3', function() {
            sendmessage('task-finished');
        });
        //ClearAll();
    }
    else {
        hundred++;
        var p = SnapCoinToPosition(bagX, bagY, hundred);

        // add to bag
        balacebeam_g.append("rect")
            .attr("x", p[0])
            .attr("y", p[1])
            .attr("width", iconW)
            .attr("height", iconH)
            .attr("class", "coin100")
            .attr("id", "c100")
            .call(dragremovecoin100);

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


function AnimateToOne()
{
    one = 0;

    one++;
    var p = SnapCoinToPosition(bagX + 2 * (bagW + 10), bagY, one);
    var o = balacebeam_g.append("rect")
        .attr("x", iconX + 2 * 45)
        .attr("y", iconY)
        .attr("width", iconW)
        .attr("height", iconH)
        .attr("class", "coin1")
        .attr("id", "c1");

    o.transition()
            .attr("x", p[0])
            .attr("y", p[1])
            .duration(2000);

}
