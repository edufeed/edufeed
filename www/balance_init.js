        params = getUrlParameters();
        var scale = 1;
        if (!params.isthumbnail) {
            scale = 0.5;
            $('html').css({
                'transform': 'scale(2,2)',
                'transform-origin': 'top left'
            });
            //$('html').css('zoom', '2');
        }

        var svg_dummy = d3.select("body").append("svg");
        var defs = svg_dummy.append("defs");
        var pane_g = d3.select("#pane > g");
        var balacebeam_g = d3.select("#balacebeam");

        var width = 600;
        var height = 350;

        var bagW = 60;
        var bagH = 60;
        var bagX = 10;
        var bagY = 90;

        var iconW = 20;
        var iconH = 20;
        var iconX = 10;
        var iconY = 5;

        var rotationX = 235;
        var rotationY = 150;
        var rotationDeg = 0;

        var hundred = 0;
        var ten = 0;
        var one = 0;
        var todoVal = params.number;

        var mousedrag1x = 0;
        var mousedrag1y = 0;
        var mousedrag10x = 0;
        var mousedrag10y = 0;
        var mousedrag100x = 0;
        var mousedrag100y = 0;
        var mousedragremove1x;
        var mousedragremove1y;
        var mousedragremove10x;
        var mousedragremove10y;
        var mousedragremove100x;
        var mousedragremove100y;
        var dragstep = 10;

        var nodrag;
        var dragcoin1;
        var dragcoin10;
        var dragcoin100;
        var dragremovecoin1;
        var dragremovecoin10;
        var dragremovecoin100;

        DefineCoinDragEvents();
        SetDefaultPosition();
        RotateBeam();

        todoVal = params.number;


        //AnimateOnes();