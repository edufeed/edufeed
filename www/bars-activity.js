function init() {
    // init values for bars
    var input = inputs[0];
    var minVal = Math.min.apply(null, input);
    shuffle(input);

    // set bar values
    var count = 0;
    $("#sortable li").each(function () {
        var bar = $(this);
        bar.attr("data-value", input[count]);
        count++;
    });

    // set bar lengths
    var count = 0;
    $("#sortable li").each(function () {
        var bar = $(this);
        var barVal = bar.attr("data-value");
        var divDef = "";
        for (var x = 0; x < barVal-1; x++) {
            divDef += "<div></div>";
        }
        bar[0].innerHTML = "<div><div>" + barVal + "</div>" + divDef + "</div>";
        bar[0].style.width = (barVal / minVal * unitPx).toString() + "px";
    });
}

function shuffle(array) {
    var arraySize = array.length;
    while (arraySize > 0) {
        // get a random index
        var randIdx = Math.floor(Math.random() * arraySize);

        // swap element with last element
        var temp = array[arraySize - 1];
        array[arraySize - 1] = array[randIdx];
        array[randIdx] = temp;

        // reduce size of array for next iteration
        arraySize--;
    }
    return;
}

function checkIfDoneAsc() {
    var done = true;
    var prevVal = -1;
    $("#sortable li").each(function () {
        var bar = $(this);
        var curVal = bar.attr('data-value');
        if (curVal > prevVal)
            prevVal = curVal;
        else
            done = false;
    });
    if (done)
        DoDone();
}
function checkIfDoneDesc() {
    var done = true;
    var prevVal = 1000000;
    $("#sortable li").each(function () {
        var bar = $(this);
        var curVal = bar.attr('data-value');
        if (curVal < prevVal)
            prevVal = curVal;
        else
            done = false;
    });
    if (done)
        DoDone();
}

function DoDone() {
    $("#sortable li").each(function () {
        var bar = $(this);
        bar.attr("class", "bar-green");
    });

    document.getElementById('tada').play();
}