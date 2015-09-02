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

        var width = 348;
        var height = 348;

        var bagW = 45;
        var bagH = 45;
        var bagX = 10;
        var bagY = 150;

        var iconW = 15;
        var iconH = 15;
        var iconX = 10;
        var iconY = 5;

        var rotationX = 174;
        var rotationY = 197;
        var rotationDeg = 0;

        var hundred = 0;
        var ten = 0;
        var one = 0;
        var todoVal = params.number;

        var mousedrag1x;
        var mousedrag1y;
        var mousedrag10x;
        var mousedrag10y;
        var mousedrag100x;
        var mousedrag100y;
        var mousedragremove1x;
        var mousedragremove1y;
        var mousedragremove10x;
        var mousedragremove10y;
        var mousedragremove100x;
        var mousedragremove100y;

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