$(".anim-underline").hover(function(e){  
  let x = e.offsetX;
  let w = $(this).width();

  if (x < w/2) { $(this).removeClass("right"); }
  else { $(this).addClass("right"); }

  let el = $(this);
  setTimeout(function(){ el.addClass("animate"); }, 10);
}, function(e){
  let x = e.offsetX;
  let w = $(this).width();
  
  if (x < w/2) { $(this).removeClass("right"); }
  else { $(this).addClass("right"); }

  let el = $(this);
  setTimeout(function(){
    el.removeClass("animate");
    el.removeClass("right");
  }, 250);
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
  new Swiper($(this)[0], {
    slidesPerView: 3,
    spaceBetween: 18,
    navigation: {
      nextEl: $(".slider-next", parent)[0],
      prevEl: $(".slider-prev", parent)[0],
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