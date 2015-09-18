
        params = getUrlParameters();

        var numberals_g = d3.select("#numberals");
        var subtractionbar_g = d3.select("#subtractionbar");
        var problem_g = d3.select("#problem");

        var diff = params.diff;
        var minuend = params.sub;
        var subtrahend;

        var mousedragX = 0;
        var mousedragY = 0;
        var dragstep = 10;

        InitProblem();
        //DefineDragEvents();
        DefineTapEvent();