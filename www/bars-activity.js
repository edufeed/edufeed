RegisterActivity({
    is: 'bars-activity',
    properties: {
        inputs: {
            type: Array,
            value: [
                [1, 2, 3, 4, 5],
                [2, 4, 6, 8, 10],
                [10, 20, 30, 40, 50],
            ],
        },
        level: {
            type: Number,
            value: 0,
        },
        unitPx: {
            type: Number,
            value: 50,
        },
        input: {
            type: Array,
            computed: 'getInput(inputs, level)',
            observer: 'inputChanged',
        },
    },
    S: function(pattern) {
        return $(this.$$(pattern));
    },
    getInput: function(inputs, level) {
        return this.inputs[this.level];
    },
    ready: function() {
        var self = this;
        $(function () {
            self.S('#sortable').sortable( {
                update: function (event, ui) {
                    self.checkIfDoneAsc();
                }
            });
            self.S('#sortable').disableSelection();
        });
        this.isready = true;
        this.inputChanged()
    },
    inputChanged: function() {
        if (!this.isready)
            return;
        var input = this.input;
        var unitPx = this.unitPx;
        var minVal = Math.min.apply(null, input);
        this.shuffle(input);

        // set bar values
        var count = 0;
        this.S('#sortable').find('li').each(function () {
            var bar = $(this);
            bar.prop("data-value", input[count]);
            count++;
        });

        // set bar lengths
        var count = 0;
        this.S('#sortable').find('li').each(function () {
            var bar = $(this);
            var barVal = bar.prop("data-value");
            var divDef = "";
            for (var x = 0; x < barVal-1; x++) {
                divDef += "<div></div>";
            }
            var bardom = Polymer.dom(bar[0]);
            bardom.innerHTML =  "<div><div>" + barVal + "</div>" + divDef + "</div>";
            bardom.node.style.width = (barVal / minVal * unitPx).toString() + "px";
        });
    },
    shuffle: function(array) {
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
    },
    checkIfDoneAsc: function() {
        var done = true;
        var prevVal = -1;
        this.S('#sortable').find('li').each(function () {
            var bar = $(this);
            var curVal = bar.prop('data-value');
            if (curVal > prevVal)
                prevVal = curVal;
            else
                done = false;
        });
        if (done)
            this.DoDone();
    },
    checkIfDoneDesc: function() {
        var done = true;
        var prevVal = 1000000;
        this.S('#sortable').find('li').each(function () {
            var bar = $(this);
            var curVal = bar.prop('data-value');
            if (curVal < prevVal)
                prevVal = curVal;
            else
                done = false;
        });
        if (done)
            this.DoDone();
    },
    DoDone: function() {
        var self = this;
        this.S('#sortable').find('li').each(function () {
            var bar = $(this);
            bar.prop("class", "bar-green");
        });

        document.getElementById('tada').play();

        // wait 1 second, then return to the feed
        setTimeout(function() {
            self.fire('task-finished', self);
        }, 1000);
    },
});
