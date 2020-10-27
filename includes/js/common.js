var uAnims = {};

$(".anim-underline").hover(function(e){  
  let x = e.offsetX;
  let w = $(this).width();

  if (x < w/2) { $(this).removeClass("right"); }
  else { $(this).addClass("right"); }

  let el = $(this);
  if (uAnims[el] != undefined) { clearTimeout(uAnims[el]); }
  setTimeout(function(){ el.addClass("animate"); }, 10);
}, function(e){
  let x = e.offsetX;
  let w = $(this).width();
  
  if (x < w/2) { $(this).removeClass("right"); }
  else { $(this).addClass("right"); }

  let el = $(this);
  uAnims[el] = setTimeout(function(){
    el.removeClass("animate");
    el.removeClass("right");
  }, 350);
});

var hoverCircleAnim;

$(".hover-circle").hover(function(e){  
  let x = e.offsetX;
  let y = e.offsetY;

  let el = $(this);

  el.find(".h").css({top: y+"px", left: x+"px"})

  setTimeout(function(){ el.addClass("animate"); }, 10);
  clearTimeout(hoverCircleAnim);
}, function(e){
  let x = e.offsetX;
  let y = e.offsetY;

  let el = $(this);

  el.find(".h").css({top: y+"px", left: x+"px"})

  hoverCircleAnim = setTimeout(function(){ el.removeClass("animate"); }, 350);
});

$.each($(".hover-circle"), function(){
  let inside = $(this).html()
  $(this).html("<div class=\"c\">"+inside+"</div><div class=\"h\"></div>");
})

$(".header-search-wrap:not(.active) .header-search a").click(function(e){
  e.preventDefault();
  let parent = $(this).closest(".header-search-wrap");
  parent.addClass("active");
  setTimeout(function(){
    $("input", parent).focus();
  }, 250);
})

$(".header-search .close").click(function(e){
  e.preventDefault();
  let parent = $(this).closest(".header-search-wrap");
  parent.removeClass("active");
});

var pin1Shift = [];

$.each($(".pin-type-1"), function(i){
  let el = $(this)[0];

  let top = $(this).offset().top;
  let duration = $(this).outerHeight()+top+40;
  let start = "top";

  if (duration > $(window).height()) {
    start = duration - $(window).height();
    pin1Shift[i] = [start, start/duration];
  } else { pin1Shift[i] = [0, 0]; }

  gsap.to(el, {
    scrollTrigger: {
      trigger: el,
      start: start+" "+top+"px",
      end: "bottom "+top+"px",
      scrub: true,
      pin: true,
      pinSpacing: false
    },
    y: 50,
    opacity: 0
  });
});

$.each($(".pin-type-2"), function(i){
  let el = $(this)[0];

  let offset = $(this).offset();
  let pin1 = $(".pin-type-1", $(this).closest(".block"));
  let duration = pin1.height();


  var t = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top "+offset.top+"px",
      end: duration+"px "+offset.top+"px",
      duration: 1,
      scrub: true,
      pin: true,
      pinSpacing: false
    }
  })

  t.to(el, {
    duration: pin1Shift[i][1]
  })
  t.to(el, {
    y: 50,
    opacity: 0
  });
});

$.each($(".pin-type-3"), function(i){
  let el = $(this)[0];

  let offset = $(this).offset();
  let duration = $(this).height();


  var t = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: "top "+offset.top+"px",
      end: duration+"px "+offset.top+"px",
      duration: 1,
      scrub: true,
      pin: true,
      pinSpacing: false
    }
  })

  t.to(el, {
    y: 20,
    opacity: 0
  });
});

$(window).on("load", function(){
  let shift = $("footer").outerHeight();
  if (shift > $(window).height()-180) {
    shift = $(window).height()-180;
  }
  gsap.to(".pin-footer", {
    scrollTrigger: {
      trigger: ".pin-footer",
      start: (shift) + " bottom",
      end: (shift) + " top",
      scrub: true,
      pin: true
    },
    opacity: 1,
    ease: "power3.inOut"
  });
});

$.each($(".slider-1"), function(){
  var parent = $(this).closest(".block-slider");
  let el = $(this);
  new Swiper($(this)[0], {
    speed: 500,
    slidesPerView: 3,
    spaceBetween: 18,
    navigation: {
      nextEl: $(".slider-next", parent)[0],
      prevEl: $(".slider-prev", parent)[0],
    },
    on: {
      touchStart: function(){
        el.addClass("dragging");
      },
      touchEnd: function(){
        el.removeClass("dragging");
      }
    }
  });
});


$(".input-placeholder input, .input-placeholder textarea, .input-placeholder .textarea").focus(function(){
  $(this).closest(".input-placeholder").removeClass("blank");
});

$(".input-placeholder input, .input-placeholder textarea, .input-placeholder .textarea").blur(function(){
  let value = $.trim($(this).val());
  if ($(this)[0].tagName.toLowerCase() == "div") {
    value = $.trim($(this).text());
  }

  if (value.length < 1) {
    $(this).closest(".input-placeholder").addClass("blank");
  }
});

var iMasks = {};

$.each($("input[type=\"phone\"]"), function(){
  iMasks[$(this)] = IMask($(this)[0], { mask: '+{7}(000)000-00-00' });
});

$("form").submit(function(e){
  var error = false;

  $.each($("input[data-req]"), function(){
    if ($(this).attr("type") == "text") {
      if ($.trim($(this).val()).length < 3) {
        $(this).addClass("error");
        error = true;
      }
    } else if ($(this).attr("type") == "phone") {
      if (iMasks[$(this)].unmaskedValue.length != 11) {
        $(this).addClass("error");
        error = true;
      }
    } else if ($(this).attr("type") == "checkbox") {
      if (!$(this).is(':checked')) { error = true; }
    }
  });

  if (error) {
    e.preventDefault();
  }
});

$("input").focus(function(){ $(this).removeClass("error"); });

$("input[type=\"checkbox\"]").change(function(){
  if (this.checked) {
    $("button[type=\"submit\"]", $(this).closest("form")).removeClass("disabled");
  } else {
    $("button[type=\"submit\"]", $(this).closest("form")).addClass("disabled");
  }
});

function cssPropertyValueSupported(prop, value) {
  var d = document.createElement('div');
  d.style[prop] = value;
  return d.style[prop] === value;
}

if (cssPropertyValueSupported("-webkit-mask-box-image", "url('../img/others/mask.png') 46 repeat") &&
    cssPropertyValueSupported("-webkit-mask-border", "url('../img/others/mask.png') 46 repeat") &&
    cssPropertyValueSupported("mask-border", "url('../img/others/mask.png') 46 repeat")) {
  $("header").addClass("no-mask");
}

$.each($(".object-tabs"), function(){
  var pointer = document.createElement("div");
  $(pointer).addClass("pointer");
  $(".el-tabs", this).prepend(pointer);
  tabClicked($(".el-tabs ul li:first-child", this));
});

$(".object-tabs ul li").click(function(){
  tabClicked($(this))
});

function tabClicked (elTab) {
  var object = elTab.closest(".object-tabs");
  $("li", elTab.closest("ul")).removeClass("active");
  elTab.addClass("active");
  var tab = elTab.attr("data-tab");
  var pointer = $("> .pointer", elTab.closest(".el-tabs"));
  var offset = elTab.position();
  var size = {width: elTab.outerWidth(), height: elTab.outerHeight()};
  pointer.css({
    "left": offset.left+"px",
    "top": offset.top+"px",
    "width": size.width+"px",
    "height": size.height+"px"
  });
  tabWindow(object, tab);
}

function tabWindow(object, tab) {
  let next = false;
  $(".wrap-windows .window", object).removeClass("next").removeClass("active");
  $.each($(".wrap-windows .window", object), function(){
    let t = $(this).attr("data-tab");
    if (next) {
      $(this).addClass("next");
    } if (t == tab) {
      next = true;
      $(this).addClass("active");
    }
  });
}

$(".object-qa .q").click(function(){
  if (!$(this).hasClass("active")) {
    $(".q", $(this).closest(".object-qa")).removeClass("active");
    $(".a", $(this).closest(".object-qa")).slideUp(350);
    $(this).addClass("active");
    $("+ .a", this).slideDown(350);
  } else {
    $(".q", $(this).closest(".object-qa")).removeClass("active");
    $(".a", $(this).closest(".object-qa")).slideUp(350);
  }
})

function calcElGC () {
  $.each($(".design-el-gc"), function(){
    var parent = $(this).closest("a");
    var parentSize = {width: parent.outerWidth(), height: parent.outerHeight()};
    var size = Math.sqrt(parentSize.width*parentSize.width + parentSize.height*parentSize.height);
    var shift = {x: parentSize.width/2-size/2, y: parentSize.height/2-size/2};
    $(this).css({
      width: size+"px", 
      height: size+"px",
      right: shift.x+"px",
      bottom: shift.y+"px"
    });
  });
}

function calcAll () {
  calcElGC();
}

calcAll();
// $(window).resize(function(){
//   calcAll();
// });