        params = getUrlParameters();
        var scale = 1;
        if (!params.isthumbnail) {
            scale = 1.0/1.5;
            $('html').css({
                'transform': 'scale(1.5,1.5)',
                'transform-origin': 'top left'
            });
            //$('html').css('zoom', '2');
        }

        //var svg_dummy = d3.select("body").append("svg");
        //var defs = svg_dummy.append("defs");
        //var pane_g = d3.select("#pane > g");

        var numberals_g = d3.select("#numberals");
        var additionbar_g = d3.select("#additionbar");
        var problem_g = d3.select("#problem");

        var width = 350;
        var height = 350;

        var sum = params.sum;
        var addend1 = params.add;
        var addend2;

        var mousedragX;
        var mousedragY;

        DefineDragEvents();
        InitProblem();