
        params = getUrlParameters();

        //var svg_dummy = d3.select("body").append("svg");
        //var defs = svg_dummy.append("defs");
        //var pane_g = d3.select("#pane > g");

        var numberals_g = d3.select("#numberals");
        var additionbar_g = d3.select("#additionbar");
        var problem_g = d3.select("#problem");

        var sum = params.sum;
        var addend1 = params.add;
        var addend2;

        var mousedragX = 0;
        var mousedragY = 0;
        var dragstep = 10;

        InitProblem();
        //DefineDragEvents();
        DefineTapEvent();