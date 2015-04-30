// vim: set et sw=2 ts=2 sts=2 ff=unix fenc=utf8:
// Author: Binux<i@binux.me>
//         http://binux.me
// Created on 2014-02-23 01:35:35
// from: https://github.com/jsbin/jsbin

$.fn.splitter = function (_type) {
  var $document = $(document),
  $blocker = $('<div class="block"></div>'),
  $body = $('body');
  // blockiframe = $blocker.find('iframe')[0];

  var splitterSettings = JSON.parse(localStorage.getItem('splitterSettings') || '[]');
  return this.each(function () {
    var $el = $(this),
    $originalContainer = $(this),
    guid = $.fn.splitter.guid++,
    $parent = $el.parent(),
    type = _type || 'x',
    $prev = type === 'x' ? $el.prevAll(':visible:first') : $el.nextAll(':visible:first'),
    $handle = $('<div class="resize"></div>'),
    dragging = false,
	autoHide = false,
    autoHideRight = false,
	autoHideLeft = false,
    width = $parent.width(),
    parentOffset = $parent.offset(),
    left = parentOffset.left,
    top = parentOffset.top, // usually zero :(
    props = {
      x: {
        display: 'block',
        currentPos: $parent.offset().left,
        multiplier: 1,
        cssProp: 'left',
        otherCssProp: 'right',
        size: $parent.width(),
        sizeProp: 'width',
        moveProp: 'pageX',
        init: {
          top: 0,
          bottom: 0,
          width: 8,
          'margin-left': '-4px',
          height: '100%',
          left: 'auto',
          right: 'auto',
          opacity: 0,
          position: 'absolute',
          cursor: 'ew-resize',
          // 'border-top': '0',
          'border-left': '1px solid rgba(218, 218, 218, 0.5)',
          'z-index': 99999
        }
      },
      y: {
        display: 'block',
        currentPos: $parent.offset().top,
        multiplier: -1,
        size: $parent.height(),
        cssProp: 'bottom',
        otherCssProp: 'top',
        sizeProp: 'height',
        moveProp: 'pageY',
        init: {
          top: 'auto',
          cursor: 'ns-resize',
          bottom: 'auto',
          height: 8,
          width: '100%',
          left: 0,
          right: 0,
          opacity: 0,
          position: 'absolute',
          border: 0,
          // 'border-top': '1px solid rgba(218, 218, 218, 0.5)',
          'z-index': 99999
        }
      }
    },
    refreshTimer = null,
    settings = splitterSettings[guid] || {};

    var tracker = {
      down: { x: null, y: null },
      delta: { x: null, y: null },
      track: false,
      timer: null
    };
    $handle.bind('mousedown', function (event) {
      tracker.down.x = event.pageX;
      tracker.down.y = event.pageY;
      tracker.delta = { x: null, y: null };
      tracker.target = $handle[type == 'x' ? 'height' : 'width']() * 0.25;
    });

    $document.bind('mousemove', function (event) {
      if (dragging) {
        tracker.delta.x = tracker.down.x - event.pageX;
        tracker.delta.y = tracker.down.y - event.pageY;
        clearTimeout(tracker.timer);
        tracker.timer = setTimeout(function () {
          tracker.down.x = event.pageX;
          tracker.down.y = event.pageY;
        }, 250);
        //disable change to y
        //var targetType = type == 'x' ? 'y' : 'x';
        //if (Math.abs(tracker.delta[targetType]) > tracker.target) {
          //$handle.trigger('change', targetType, event[props[targetType].moveProp]);
          //tracker.down.x = event.pageX;
          //tracker.down.y = event.pageY;
        //}
      }
    });

    function moveSplitter(pos) {
      if (type === 'y') {
        pos -= top;
      }
      var v = pos - props[type].currentPos,
      split = 100 / props[type].size * v,
      delta = (pos - settings[type]) * props[type].multiplier,
      prevSize = $prev[props[type].sizeProp](),
      elSize = $el[props[type].sizeProp]();

      if (type === 'y') {
        split = 100 - split;
      }

        // allow sizing to happen
        $el.css(props[type].cssProp, split + '%');
        $prev.css(props[type].otherCssProp, (100 - split) + '%');
        var css = {};
        css[props[type].cssProp] = split + '%';
        $handle.css(css);
        settings[type] = pos;
        splitterSettings[guid] = settings;
        localStorage.setItem('splitterSettings', JSON.stringify(splitterSettings));

        // wait until animations have completed!
        if (moveSplitter.timer) clearTimeout(moveSplitter.timer);
        moveSplitter.timer = setTimeout(function () {
          $document.trigger('sizeeditors');
        }, 120);
      }
    

    function resetPrev() {
      $prev = type === 'x' ? $handle.prevAll(':visible:first') : $handle.nextAll(':visible:first');
    }
	
    $("#left-area, #right-area").bind('dblclick', function(e) {
		var screenSize= {width: window.innerWidth || document.documentElement.clientWidth|| document.body.offsetWidth,heigh:window.						innerHeight||document.documentElement.clientHeight|| document.body.offsetHeight};	
		var info = e;
		
		var selectedArea = info.currentTarget.attributes[0].nodeValue;
		//console.log(selectedArea);
		if (selectedArea == 'right-area'){
			//console.log("we are in the right-area");
				if (autoHideRight == false){
				$("#control").css( "height", "43px");
				$("#screen-setting").text("You are in Full Screen Mode - Right Area");
				moveSplitter(1);
				autoHideRight = true;}
				else{ moveSplitter((screenSize.width)/2); autoHideRight = false;
				$("#control").css( "height", "35px");
				$("#screen-setting").text("");
				}
			}
			else if(selectedArea =='left-area'){
				if (autoHideLeft == false){
					$("#control").css( "height", "43px");
					$("#screen-setting").text("You are in Full Screen Mode - Left Area");
					$("#save-task-btn").hide("slow");
					moveSplitter((screenSize.width)-1);
					autoHideLeft = true;}
					else{ 
					moveSplitter((screenSize.width)/2); autoHideLeft = false;
					$("#control").css( "height", "35px");
					$("#save-task-btn").show("slow");
					$("#screen-setting").text("");
					}
						
				//console.log("we are in the left-area");
				}
				else{
					//console.log("ignore");
					}
	})
  $document.bind('mouseup touchend', function () {
      if (dragging) {
        dragging = false;
        $handle.trigger('resize-end');
        $blocker.remove();
        // $handle.css( 'opacity', '0');
        $body.removeClass('dragging');
      }
    }).bind('mousemove touchmove', function (event) {
      if (dragging) {
        moveSplitter(event[props[type].moveProp] || event.originalEvent.touches[0][props[type].moveProp]);
      }
    });

    $blocker.bind('mousemove touchmove', function (event) {
      if (dragging) {
        moveSplitter(event[props[type].moveProp] || event.originalEvent.touches[0][props[type].moveProp]);
      }
    });

    $handle.bind('mousedown touchstart', function (e) {
      dragging = true;
		
      $handle.trigger('resize-start');
      $body.append($blocker).addClass('dragging');
      props[type].size = $parent[props[type].sizeProp]();
      props[type].currentPos = 0; // is this really required then?

      resetPrev();
      e.preventDefault();
    });

    /*
       .hover(function () {
       $handle.css('opacity', '1');
       }, function () {
       if (!dragging) {
       $handle.css('opacity', '0');
       }
       })
       */

    $handle.bind('fullsize', function(event, panel) {
      if (panel === undefined) {
        panel = 'prev';
      }
      var split = 0;
      if (panel === 'prev') {
        split = 100;
      }
      $el.css(props[type].cssProp, split + '%');
      $prev.css(props[type].otherCssProp, (100 - split) + '%');
      $handle.hide();
    });

    $handle.bind('init', function (event, x) {
      $handle.css(props[type].init);
      props[type].size = $parent[props[type].sizeProp]();
      resetPrev();

      // can only be read at init
      top = $parent.offset().top;

      $blocker.css('cursor', type == 'x' ? 'ew-resize' : 'ns-resize');

      if (type == 'y') {
        $el.css('border-right', 0);
        $prev.css('border-left', 0);
        $prev.css('border-top', '2px solid #ccc');
      } else {
        // $el.css('border-right', '1px solid #ccc');
        $el.css('border-top', 0);
        // $prev.css('border-right', '2px solid #ccc');
      }

      if ($el.is(':hidden')) {
        $handle.autoHide();
      } else {
        if ($prev.length) {
          $el.css('border-' + props[type].cssProp, '1px solid #ccc');
        } else {
          $el.css('border-' + props[type].cssProp, '0');
        }
        moveSplitter(x !== undefined ? x : settings[type] || $el.offset()[props[type].cssProp]);
      }
    }); //.trigger('init', settings.x || $el.offset().left);

    $handle.bind('change', function (event, toType, value) {
      $el.css(props[type].cssProp, '0');
      $prev.css(props[type].otherCssProp, '0');
      $el.css('border-' + props[type].cssProp, '0');

      if (toType === 'y') {
        // 1. drop inside of a new div that encompases the elements
        $el = $el.find('> *');
        $handle.appendTo($prev);
        $el.appendTo($prev);
        $prev.css('height', '100%');
        $originalContainer.autoHide();
        $handle.css('margin-left', 0);
        $handle.css('margin-top', 5);

        $handle.addClass('vertical');

        delete settings.x;

        $originalContainer.nextAll(':visible:first').trigger('init');
        // 2. change splitter to the right to point to new block div
      } else {
        $el = $prev;
        $prev = $tmp;

        $el.appendTo($originalContainer);
        $handle.insertBefore($originalContainer);
        $handle.removeClass('vertical');
        $el.css('border-top', 0);
        $el = $originalContainer;
        $originalContainer.show();
        $handle.css('margin-top', 0);
        $handle.css('margin-left', -4);
        delete settings.y;

        setTimeout(function() {
          $originalContainer.nextAll(':visible:first').trigger('init');
        }, 0);
      }

      resetPrev();

      type = toType;

      // if (type == 'y') {
      // FIXME $prev should check visible
      var $tmp = $el;
      $el = $prev;
      $prev = $tmp;
      // } else {

      // }

      $el.css(props[type].otherCssProp, '0');
      $prev.css(props[type].cssProp, '0');
      // TODO
      // reset top/bottom positions
      // reset left/right positions

      if ($el.is(':visible')) {
        // find all other handles and recalc their height
        if (type === 'y') {
          var otherhandles = $el.find('.resize');

          otherhandles.each(function (i) {
            // find the top of the
            var $h = $(this);
            if (this === $handle[0]) {
              // ignore
            } else {
              // TODO change to real px :(
              $h.trigger('init', 100 / (otherhandles - i - 1));
            }
          });
        }
        $handle.trigger('init', value || $el.offset()[props[type].cssProp] || props[type].size / 2);
      }
    });


    $prev.css('width', 'auto');
    $prev.css('height', 'auto');
    $el.data('splitter', $handle);
    $el.before($handle);

    // if (settings.y) {
    //   $handle.trigger('change', 'y');
    // }
  });
};

$.fn.splitter.guid = 0;
