var uAnims = {};
var settings = {
  scrollbar: {
    width: window.innerWidth - document.documentElement.clientWidth
  },
  header: {
    paddingRight: parseInt($("header").css("padding-right"))
  }
};

$.each($(".anim-underline"), function(i){
  $(this).attr("data-key", i);
});

$(".anim-underline").hover(function(e){
  let x = e.offsetX;
  let w = $(this).width();

  if (x < w/2) { $(this).removeClass("right"); }
  else { $(this).addClass("right"); }

  let el = $(this);
  var key = el.attr("data-key");
  if (uAnims[key] != undefined) { clearTimeout(uAnims[key]); }
  setTimeout(function(){ el.addClass("animate"); }, 10);
}, function(e){
  let x = e.offsetX;
  let w = $(this).width();
  
  if (x < w/2) { $(this).removeClass("right"); }
  else { $(this).addClass("right"); }

  let el = $(this);
  uAnims[el.attr("data-key")] = setTimeout(function(){
    el.removeClass("animate");
    el.removeClass("right");
  }, 350);
});

var cAnim = {};

$(".hover-circle").hover(function(e){
  let x = e.offsetX;
  let y = e.offsetY;

  let el = $(this);

  el.find(".h").css({top: y+"px", left: x+"px"})

  var key = el.attr("data-key");
  if (cAnim[key] != undefined) { clearTimeout(cAnim[key]); }
  setTimeout(function(){ el.addClass("animate"); }, 10);
}, function(e){
  let x = e.offsetX;
  let y = e.offsetY;

  let el = $(this);

  el.find(".h").css({top: y+"px", left: x+"px"})

  cAnim[el.attr("data-key")] = setTimeout(function(){ el.removeClass("animate"); }, 350);
});

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
    pin1Shift[i] = start/duration;
  } else { pin1Shift[i] = 0; }

  var t = gsap.timeline({
    scrollTrigger: {
      trigger: el,
      start: start+" "+top+"px",
      end: "bottom "+top+"px",
      scrub: true,
      pin: true,
      pinSpacing: false
    }
  });

  t.to(el, {
    y: 50,
    opacity: 0
  });
});

$.each($(".pin-type-2"), function(i){
  let el = $(this)[0];

  let offset = $(this).offset();
  let pin1 = $(".pin-type-1", $(this).closest(".block"));

  if (window.matchMedia("(max-width: 628px)").matches) {
    var windowHeight = document.documentElement.clientHeight;
    if (windowHeight < pin1.outerHeight() + 125 + $(this).outerHeight()*0.25) { windowHeight = pin1.outerHeight() + 125 + $(this).outerHeight()*0.25; }

    var shift = windowHeight - offset.top - $(this).outerHeight();
    if (shift > 0) { shift = 0; }
    $(this).closest(".block").css({"margin-bottom": (shift - $(this).outerHeight()*0.25)+"px"});
  }

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
  });

  t.to(el, {
    duration: pin1Shift[i]
  });
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
  var shift = 110;

  var diff = document.documentElement.clientHeight - $(".pin-footer").outerHeight();

  if (window.matchMedia("(max-width: 580px), (max-height: 512px)").matches) { shift = 0; }
  else if (window.matchMedia("(max-width: 1024px)").matches) { shift = 80; }
  else if (window.matchMedia("(max-width: 1500px)").matches) { shift = 80; }

  if (diff > shift) { shift = diff; }

  shift += 15;

  $(".footer-shifter").css("height", $(".pin-footer").outerHeight());
  $(".pin-footer").css("top", shift);

  gsap.to(".pin-footer", {
    scrollTrigger: {
      trigger: ".main",
      start: "bottom bottom",
      end: "bottom "+shift,
      scrub: true,
      onLeave: function(){ $("body").addClass("footer-on"); },
      onEnter: function(){ $("body").addClass("footer-vis"); },
      onLeaveBack: function(){ $("body").removeClass("footer-vis"); },
      onEnterBack: function(){ $("body").removeClass("footer-on"); }
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
    slidesPerView: 1,
    spaceBetween: 18,
    navigation: {
      nextEl: $(".slider-next", parent)[0],
      prevEl: $(".slider-prev", parent)[0],
    },
    breakpoints: {
      768: {
        slidesPerView: 3
      },
      580: {
        slidesPerView: 2
      }
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

$.each($("input[type=\"phone\"]"), function(i){
  $(this).attr("data-key", i);
  iMasks[i] = IMask($(this)[0], { mask: '+{7}(000)000-00-00' });
});

$("form").submit(function(e){
  var error = false;

  $.each($("input[data-req]", this), function(){
    if ($(this).attr("type") == "text") {
      if ($.trim($(this).val()).length < 3) {
        $(this).addClass("error");
        error = true;
      }
    } else if ($(this).attr("type") == "phone") {
      if (iMasks[$(this).attr("data-key")].unmaskedValue.length != 11) {
        $(this).addClass("error");
        error = true;
      }
    } else if ($(this).attr("type") == "checkbox") {
      if (!$(this).is(':checked')) { 
        $(this).addClass("error");
        error = true; 
      }
    }
  });

  if (!error) {
    $(this).addClass("ok");
  }

  e.preventDefault();
});

$("form *[data-return-btn]").click(function(e){
  var popup = $(this).closest(".popup");
  e.preventDefault();
  var form = $(this).closest("form");
  form.trigger("reset");
  form.removeClass("ok");
  $(".input input", form).blur();
  $("*[data-disabled]", form).prop("disabled", true);
  if (popup.length > 0) {
    var history = popup.attr("data-history").split(",");
    $.each($(".group-inputs", popup), function(i){
      var n = popup[1+i];
      if (n == undefined || $("label", this).length < n) { n = 1; }
      $("label:nth-child("+n+") input", this).prop("checked", true);
    });
  }
});

$("input").focus(function(){ $(this).removeClass("error"); });
$("input[type=\"checkbox\"]").change(function(){ $(this).removeClass("error"); });

$("input[type=\"checkbox\"]").change(function(){
  if (this.checked) {
    $("button[type=\"submit\"]", $(this).closest("form")).prop("disabled", false);
  } else {
    $("button[type=\"submit\"]", $(this).closest("form")).prop("disabled", true);
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
  var height = 0;
  $.each($(".wrap-windows .window", object), function(){
    let t = $(this).attr("data-tab");
    if (next) {
      $(this).addClass("next");
    } if (t == tab) {
      next = true;
      height = $(this).outerHeight();
      $(this).addClass("active");
    }
  });
  $(".wrap-windows:not(.space-all)", object).height(height);
  setTimeout(function(){
    ScrollTrigger.refresh()
  }, 350);
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

$(document).ready(function(){
  $(".popup").css({
    "margin-right": -settings.scrollbar.width+"px"
  });
  calcAll();
});

$(window).on("load", function(){
  $.each($(".object-tabs"), function(){
    var pointer = document.createElement("div");
    $(pointer).addClass("pointer");
    $(".el-tabs", this).prepend(pointer);
    tabClicked($(".el-tabs ul li:first-child", this));
  });
  $.each($(".hover-circle"), function(i){
    $(this).attr("data-key", i);
    var size = $(this).outerWidth();
    let inside = $(this).html()
    $(this).html("<div class=\"c\">"+inside+"</div><div class=\"h\" style=\"width: "+(size*2)+"px;height: "+(size*2)+"px;margin-left: "+(-size)+"px;margin-top: "+(-size)+"px;\"></div>");
  });
  $(".pin-footer").css("display", "none");
});
// $(window).resize(function(){
//   calcAll();
// });

var click = false;

function removeScrollbar (el) {
  el.css({
    "overflow-y": "hidden",
    "padding-right": settings.scrollbar.width+"px"
  });
  if (el.prop("tagName").toLowerCase() == "body") {
    $(".main-bg, .button-burger").css({
      "margin-right": settings.scrollbar.width+"px"
    });
    if (window.matchMedia("(max-width: 580px), (max-height: 512px)").matches) {
      $(".popup .layout-close").css({
        "padding-right": (settings.header.paddingRight+settings.scrollbar.width)+"px"
      });
    } else {
      $("header, .popup .layout-close").css({
        "padding-right": (settings.header.paddingRight+settings.scrollbar.width)+"px"
      });
    }
    $(".popup, .main-menu .wrap-menu").css({
      "margin-right": 0+"px"
    });
  }
}

function addScrollbar (el) {
  el.css({
    "overflow-y": "scroll",
    "padding-right": 0+"px"
  });
  if (el.prop("tagName").toLowerCase() == "body") {
    $(".main-bg, .button-burger").css({
      "margin-right": 0+"px"
    });
    if (window.matchMedia("(max-width: 580px), (max-height: 512px)").matches) {
      $(".popup .layout-close").css({
        "padding-right": (settings.header.paddingRight)+"px"
      });
    } else {
      $("header, .popup .layout-close").css({
        "padding-right": (settings.header.paddingRight)+"px"
      });
    }
    $(".popup, .main-menu .wrap-menu").css({
      "margin-right": -settings.scrollbar.width+"px"
    });
  }
}

function openPopup (popup) {
  $(".popup[data-popup=\""+popup[0]+"\"]").attr("data-history", popup);
  var popup = popup.split(",");
  $(".popup[data-popup=\""+popup[0]+"\"] .group-inputs label input").prop("checked", false);
  $.each($(".popup[data-popup=\""+popup[0]+"\"] .group-inputs"), function(i){
    var n = popup[1+i];
    if (n == undefined || $("label", this).length < n) { n = 1; }
    $("label:nth-child("+n+") input", this).prop("checked", true);
  });
  $(".popup[data-popup=\""+popup[0]+"\"]").addClass("active");
  removeScrollbar($("body"));
}

function closePopup () {
  $(".popup").removeClass("active");
  setTimeout(function(){
    $(".popup form.ok *[data-return-btn]").click();
  }, 150);
  addScrollbar($("body"));
}

$("*[data-popup-btn]").click(function(e){
  e.preventDefault();
  openPopup($(this).attr("data-popup-btn"));
});

$(".popup .close, .popup .bg").click(function(e){
  e.preventDefault();
  $.each($("iframe", $(this).closest(".popup")), function(){
    let el = $(this);
    var src = el.attr("src");
    setTimeout(function(){
      el.attr("src", "");
      setTimeout(function(){
        el.attr("src", src);
      }, 50);
    }, 150)
  })
  closePopup();
  addScrollbar($("body"));
});

$(".button-burger").click(function(e){
  e.preventDefault();
  if ($(".main-menu").hasClass("active")) {
    $(".main-menu").removeClass("active");
    addScrollbar($("body"));
  } else {
    $(".main-menu").addClass("active");
    removeScrollbar($("body"));
  }
});

$(".main-menu .bg").click(function(e){
  e.preventDefault();
  $(".main-menu").removeClass("active");
  addScrollbar($("body"));
});