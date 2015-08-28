(function(){
  var getSampleFeedItems, out$ = typeof exports != 'undefined' && exports || this;
  out$.getSampleFeedItems = getSampleFeedItems = function(){
    var wordlist, bars, res$, i$, ref$, len$, levelnum, dots, data, typeletter, word, typeword, balance, number, admin, example, iframe, lettervideos, videoid, defaults;
    wordlist = ['cat', 'dog', 'white', 'black', 'blue', 'red', 'bee', 'bird', 'lion', 'tiger', 'fish', 'city', 'house', 'roof', 'tree', 'river', 'apple', 'banana', 'cherry', 'orange', 'pear'];
    res$ = [];
    for (i$ = 0, len$ = (ref$ = [0, 1, 2]).length; i$ < len$; ++i$) {
      levelnum = ref$[i$];
      res$.push({
        itemtype: 'bars',
        data: {
          level: levelnum
        },
        social: {
          poster: 'dog'
        }
      });
    }
    bars = res$;
    res$ = [];
    for (i$ = 0, len$ = (ref$ = [
      {
        numdots: 7,
        targetformula: '_x_=_'
      }, {
        numdots: 4,
        targetformula: '3x4=_'
      }, {
        numdots: 6,
        targetformula: '_x6=18'
      }, {
        numdots: 5,
        targetformula: '3x_=15'
      }, {
        numdots: 8,
        targetformula: '_x_=24'
      }
    ]).length; i$ < len$; ++i$) {
      data = ref$[i$];
      res$.push({
        itemtype: 'dots',
        data: data,
        social: {
          poster: 'mouse'
        }
      });
    }
    dots = res$;
    res$ = [];
    for (i$ = 0, len$ = wordlist.length; i$ < len$; ++i$) {
      word = wordlist[i$];
      res$.push({
        itemtype: 'typeletter',
        data: {
          word: word
        },
        social: {
          poster: 'dog',
          finishedby: ['zebra']
        }
      });
    }
    typeletter = res$;
    res$ = [];
    for (i$ = 0, len$ = wordlist.length; i$ < len$; ++i$) {
      word = wordlist[i$];
      res$.push({
        itemtype: 'typeword',
        data: {
          word: word
        },
        social: {
          poster: 'dog',
          finishedby: ['zebra']
        }
      });
    }
    typeword = res$;
    res$ = [];
    for (i$ = 0, len$ = (ref$ = [1, 3, 50, 300]).length; i$ < len$; ++i$) {
      number = ref$[i$];
      res$.push({
        itemtype: 'iframe',
        data: {
          activitypage: 'balance.html',
          thumbnailpage: 'balance.html',
          params: {
            number: number
          }
        },
        social: {
          poster: 'mouse'
        }
      });
    }
    balance = res$;
    admin = [{
      itemtype: 'admin',
      social: {
        poster: 'horse'
      }
    }];
    example = [{
      itemtype: 'example',
      data: {
        foo: 'somefooval',
        bar: 'somebarval'
      },
      social: {
        poster: 'mouse',
        finishedby: ['elephant']
      }
    }];
    iframe = [{
      itemtype: 'iframe',
      data: {
        activitypage: 'iframe-activity-example.html',
        thumbnailpage: 'iframe-thumbnail-example.html',
        params: {
          foo: 'somefooval',
          bar: 'somebarval'
        }
      },
      social: {
        poster: 'mouse',
        finishedby: ['elephant']
      }
    }];
    res$ = [];
    for (i$ = 0, len$ = (ref$ = ['y8pZ3F8KB_Y', 'F7WyPqms5x0', 'LnDxp5QNxmA', 'qdJwtaaTfb4', 'PMDpfPky054', 'CaywS_FK4wE', 'O96r1dZ4Nqg', 'ndf_-FJsPVk', 'yZbNMjwgEN8', 'GkcqRmdwKlE', 'DHRQXGTSvw0', 'YASqLUId4n8', 'xUOc-UwTVBA', 'LYyK7KurvMs', 'rpvtKnqu7-4', '3724uXedg0A', '-k4oiVaekT0', 'zQ7vvPa4pAk', 'McACiO5dwGM', '4PhbUhrI4KE', 'qmWTMNhtY9Q', 'NkniyCUWeF4', '8ovG9ptOjBw', 'RhA10WVTmHw', 'RJH2oMKPeaw', 'f-iL7k5jhCI']).length; i$ < len$; ++i$) {
      videoid = ref$[i$];
      res$.push({
        itemtype: 'video',
        data: {
          videoid: videoid
        },
        social: {
          poster: 'mouse'
        }
      });
    }
    lettervideos = res$;
    defaults = dots.concat(typeletter, typeword);
    return {
      defaults: defaults,
      admin: admin,
      example: example,
      iframe: iframe,
      bars: bars,
      dots: dots,
      typeletter: typeletter,
      lettervideos: lettervideos,
      typeword: typeword,
      balance: balance
    };
  };
}).call(this);
