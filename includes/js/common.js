"use strict";

var iMasks = {};

$(document).ready(function(){

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

  $(window).on("load", function(){
    pinsInit();
    animTextInit();
    objectTabsInit();
    hoverCircleInit();
    $(".pin-footer, .object-qa .a").css("display", "none");
  });

  function pinsInit () {
    var pin1Shift = [];

    if (window.matchMedia("(max-width: 580px), (max-height: 512px)").matches) {
      $("body:not(.forced-header-no)").addClass("forced-header");
      var t2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".trigger-opacity",
          start: "top top",
          end: "bottom top",
          onEnterBack: function(){ $("body").addClass("forced-header"); },
          onLeave: function(){ $("body").removeClass("forced-header"); }
        }
      });
    }

    $.each($(".pin-type-1"), function(i){
      let el = $(this)[0];

      let top = $(this).offset().top;
      let duration = $(this).outerHeight()+top+40;
      let start = "top";

      if (duration > $(window).height()) {
        start = duration - $(window).height();
        pin1Shift[i] = start/duration;
      } else { pin1Shift[i] = 0; }

      if (window.matchMedia("(max-width: 628px)").matches) {
        var block = $(this).closest(".block");
        var blockHeight = block.outerHeight();
        var blockTop = block.offset().top;
        var windowHeight = document.documentElement.clientHeight;
        var diff = windowHeight-blockTop - blockHeight;
        if (diff > 0) { diff = 0; }
        var shift = blockHeight*0.025 - diff;
        var offsetTop = ($("+ .block", block).offset().top - shift - top);
        pin1Shift[i] = -shift;
        $("+ .block", block).css("margin-top", -shift+"px");
        var dur = (offsetTop - $(this).outerHeight() - 32);
        offsetTop -= $(this).outerHeight()*0.82;
        var t = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top "+(top-1)+"px",
            end: "+="+(offsetTop),
            scrub: true,
            pin: true,
            pinSpacing: false
          }
        });
        
        t.to(el, {
          duration: (dur)/(offsetTop)
        });
        t.to(el, {
          duration: 1-(dur)/(offsetTop),
          ease: "none",
          transformOrigin: "top",
          scale: 0.7,
          opacity: 0
        });
      } else {
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
      }
    });

    $.each($(".pin-type-2"), function(i){
      let el = $(this)[0];

      let offset = $(this).offset();
      let pin1 = $(".pin-type-1", $(this).closest(".block"));

      let duration = pin1.height();

      if (window.matchMedia("(max-width: 628px)").matches) {
        duration = $(this).outerHeight()+pin1Shift[i] + 40;
        var t = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top "+(offset.top-1)+"px",
            end: (duration+pin1.outerHeight()*0.22)+"px "+(offset.top)+"px",
            duration: 1,
            scrub: true,
            pin: true,
            pinSpacing: false
          }
        });
        t.to(el, {
          ease: "none",
          duration: duration/(duration+pin1.outerHeight()*0.22),
          y: -30*(duration/(duration+pin1.outerHeight()*0.22))
        });
        t.to(el, {
          ease: "none",
          y: -30,
          opacity: 0
        });
      } else {
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
      }
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

    $.each($(".pin-type-4"), function(i){
      let el = $(this)[0];

      let offset = $(this).offset();
      let duration = $(this).height();
      let start = "bottom";
      let end = (duration/2 + 100);

      if ($(window).height() >= offset.top + duration) {
        start = (offset.top + duration - 1)
      }

      if ($(window).height()*0.4 < end) {
        end = $(window).height()*0.4;
      }

      var st = {
          trigger: el,
          start: "bottom "+start,
          end: "bottom "+end,
          duration: 1,
          scrub: true
        };

      var t = gsap.timeline({
        scrollTrigger: st
      })

      if ($(".mpp-scaler").length > 0) {
        $.each($(".mpp-scaler"), function(){
          gsap.to(this, {
            scrollTrigger: st,
            scale: 1
          });
        });

        var t2 = gsap.timeline({
          scrollTrigger: {
            trigger: ".mpp-object-pin",
            start: "top "+end,
            end: "bottom bottom",
            scrub: 0.35,
            duration: 1,
            onEnter: function() { mppEnter(); },
            onLeave: function() { mppLeave(); },
            onEnterBack: function() { mppEnter(); },
            onLeaveBack: function() { mppLeave(); }
          }
        });
      }

      t.to(el, {
        opacity: 0
      });
    });

    function mppLeave () {
      if ($(window).width()/$(window).height() <= 2760/1553) {
        gsap.to(".mpp-object", {scrollLeft: (($(window).outerHeight() + $(window).outerHeight()*0.25)*(1.6626506)-($(window).width()+90))*0.2, duration: 0.35, ease: Power1.easeInOut});
      } else if (window.matchMedia("(max-width: 1024px)").matches) {
        gsap.to(".mpp-object", {scrollTop: 0, duration: 0.35});
      }
      closeMpp();
    }

    function mppEnter () {
      if ($(window).width()/$(window).height() <= 2760/1553) {
        // gsap.to(".mpp-object", {scrollLeft: 0, duration: 0.35, ease: Power1.easeInOut});
      }
      $(".mpp-object").addClass("active");
      $("header").addClass("on-back");
    }


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
  }

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

  $.each($(".slider-2"), function(){
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

  $.each($(".slider-3"), function(){
    new Swiper($(this)[0], {
      speed: 500,
      navigation: {
        nextEl: ".slider-next",
        prevEl: ".slider-prev",
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
      ScrollTrigger.refresh();
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

    if ($("footer .part-center .container .block").length > 0) {
      setTimeout(function(){
        ScrollTrigger.refresh();
      }, 350);
    }

    /* Yandex map adaptive height*/
    var c = 0;
    if (window.yMaps != undefined) {
      var a = setInterval(function(){
        for (var i=0; i<window.yMaps.length; i++) {
          window.yMaps[i].container.fitToViewport();
        }
        c += 1;
        if (c > 19) { clearInterval(a); }
      }, 19);
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

  $(".popup").css({
    "margin-right": -settings.scrollbar.width+"px"
  });
  calcAll();

  // $(window).resize(function(){
  //   calcAll();
  // });

  function animTextInit () {
    $.each($(".anim-text"), function(){
      $(".text", $(this)).css("margin-left", -($(".text", $(this)).outerWidth()+10)+"px");
    });
  }

  function objectTabsInit () {
    $.each($(".object-tabs"), function(){
      var pointer = document.createElement("div");
      $(pointer).addClass("pointer");
      $(".el-tabs", this).prepend(pointer);
      tabClicked($(".el-tabs ul li:first-child", this));
    });
  }

  function hoverCircleInit () {
    $.each($(".hover-circle"), function(i){
      $(this).attr("data-key", i);
      var size = $(this).outerWidth();
      let inside = $(this).html()
      $(this).html("<div class=\"c\">"+inside+"</div><div class=\"h\" style=\"width: "+(size*2)+"px;height: "+(size*2)+"px;margin-left: "+(-size)+"px;margin-top: "+(-size)+"px;\"></div>");
    });
  }

  var click = false;

  function removeScrollbar (el) {
    el.css({
      "overflow-y": "hidden",
      "padding-right": settings.scrollbar.width+"px"
    });
    if (el.prop("tagName").toLowerCase() == "body") {
      $(".main-bg, .button-burger, .button-comment, body:not(.footer-on) .pin-footer, .fix-scrollbar").css({
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
      $(".main-bg, .button-burger, .button-comment, body:not(.footer-on) .pin-footer, .fix-scrollbar").css({
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

    let scrollVis = false;
    $.each($(".popup"), function(){
      if ($(this).hasClass("active")) {
        scrollVis = true;
        return false;
      }
    });
    if (scrollVis) { removeScrollbar($("body")); }
  }

  function closePopup (popup) {
    let p = popup;
    p.removeClass("active");
    setTimeout(function(){
      $("form.ok *[data-return-btn]", p).click();
    }, 150);
    let scrollVis = true;
    $.each($(".popup"), function(){
      if ($(this).hasClass("active")) {
        scrollVis = false;
        return false;
      }
    });
    if (scrollVis) { addScrollbar($("body")); }
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
    closePopup($(this).closest(".popup"));
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

  $(".bg-opacity").each(function(){
    var start = "bottom";

    var offset = $(".trigger-opacity").offset().top;

    if (document.documentElement.clientHeight > offset) {
      start = offset-1;
    } 

    var el = $(this);
    var reverse = $(this).hasClass("reverse");
    var isHidden = false;

    gsap.to(this, {
      scrollTrigger: {
        trigger: ".trigger-opacity",
        start: "top "+start,
        end: "top top",
        scrub: 0.35,
        onEnter: function() { if (el.hasClass("mpp-object")) { el.removeClass("active"); } },
        onLeaveBack: function() { if (el.hasClass("mpp-object")) { el.addClass("active"); } },
        onScrubComplete: function(){ if (isHidden) { el.css("display", "none"); } },
        onLeave: function(){ if (reverse) { isHidden = true; } },
        onEnterBack: function(){ if (reverse) { isHidden = false; el.css("display", "block"); } }
      },
      opacity: (reverse?0:1)
    });
  });

  $(".mpp-object .bg").css("height", $(window).width()*1660/2760);
  $("body.body-light .main-bg, body.body-light .main-bg-opacity, .main-bg-overlay").css("height", ($(window).outerHeight() + $(window).outerHeight()*0.25));
  if ($(window).width()/$(window).height() <= 2760/1553) {
    $(".mpp-object .bg").css("height", ($(window).outerHeight() + $(window).outerHeight()*0.25));
    $("body.body-light .bg, body.body-light .main-bg, body.body-light .main-bg-opacity, .mpp-object .bg").css({"background-size": "auto "+($(window).outerHeight() + $(window).outerHeight()*0.25)+"px"});
    if (window.matchMedia("(max-width: 1024px)").matches) {
      $("header .bg, body.body-light .main-bg, body.body-light .main-bg-opacity").css({"background-position-x": "20%"});
    } else {
      $("header .bg, body.body-light .main-bg, body.body-light .main-bg-opacity").css({"background-position-x": "50%"});
    }
    $(".mpp-object").css("overflow-x", "auto");
    var mppBg = $(".mpp-object .bg");
    if (mppBg.length > 0) {
      var width = (($(window).outerHeight() + $(window).outerHeight()*0.25)*(1.6626506));
      mppBg.css({
        "width": width+"px"
      });
      if (window.matchMedia("(max-width: 1024px)").matches) {
        $(".mpp-object").scrollLeft((width-($(window).width()+90))*0.2);
      } else {
        $(".mpp-object").scrollLeft((width-($(window).width()))*0.5);
      }
    }
  } else if (window.matchMedia("(max-width: 1024px)").matches) {
    $(".mpp-object").css("overflow-y", "auto");
    $(".mpp-object .wrap").css({"height": $(window).width()*1553/2760, "overflow": "hidden"});
  }

  function closeMpp() {
    setTimeout(function(){
      $("header").removeClass("on-back");
    }, 350);
    $(".mpp-object").removeClass("active");
    $(".blocks-info").removeClass("active");
    $(".mpp-object .dot").removeClass("active");
    if (!window.matchMedia("(max-width: 481px)").matches) {
      gsap.to(".mpp-object .wrap", {x: 0, duration: 0.35});
    } else {
      addScrollbar($("body"));
    }
  }

  $.each($(".mpp-object .dot"), function(){
    $(this).attr("data-x", $(this).offset().left);
  });

  var blocksInfoWidth = 510;
  if (window.matchMedia("(max-width: 580px), (max-height: 512px)").matches) {
    blocksInfoWidth = 280;
  } else if (window.matchMedia("(max-width: 852px)").matches) {
    blocksInfoWidth = 340;
  } else if (window.matchMedia("(max-width: 1024px)").matches) {
    blocksInfoWidth = 440;
  }

  $(".mpp-object .dot").click(function(e){
    e.preventDefault();
    if ($(this).hasClass("active")) {
      $(this).removeClass("active");
      $(".blocks-info").removeClass("active");
      if (!window.matchMedia("(max-width: 481px)").matches) {
        gsap.to(".mpp-object .wrap", {x: 0, duration: 0.35});
        if ($(window).width()/$(window).height() <= 2760/1553) {
          gsap.to(".mpp-object", {scrollLeft: $(".mpp-object").scrollLeft()-blocksInfoWidth, duration: 0.35});
        }
      } else {
        addScrollbar($("body"));
      }
    } else {
      $(".mpp-object .dot").removeClass("active");
      $(this).addClass("active");
      $(".block-info").removeClass("active");
      $(".block-info[data-id=\""+$(this).attr("data-id")+"\"]").addClass("active");
      if (!$(".blocks-info").hasClass("active")) { $(".blocks-info").addClass("active"); }
      if (!window.matchMedia("(max-width: 481px)").matches) {
        if ($(window).width()/$(window).height() <= 2760/1553) {
          gsap.to(".mpp-object .wrap", {x: blocksInfoWidth, duration: 0.35});
          gsap.to(".mpp-object", {scrollLeft: $(this).position().left-30-(($(window).outerWidth()-blocksInfoWidth)-$(this).outerWidth())/2, duration: 0.35});
        } else {
          // if (parseFloat($(this).attr("data-x")) < (blocksInfoWidth+60)) {
          //   var x = (blocksInfoWidth+60)-parseFloat($(this).attr("data-x"));
          //   gsap.to(".mpp-object .wrap", {x: x, duration: 0.35});
          // } else {
          //   gsap.to(".mpp-object .wrap", {x: 0, duration: 0.35});
          // }
          gsap.to(".mpp-object .wrap", {x: (blocksInfoWidth-60-$(window).width()*0.06), duration: 0.35});
        }
      } else {
        removeScrollbar($("body"));
      }
    }
  });

  $(".block-info:last-child").addClass("active");

  $(".blocks-info .close").click(function(e){
    e.preventDefault();
    $(".blocks-info").removeClass("active");
    $(".mpp-object .dot").removeClass("active");
    if (!window.matchMedia("(max-width: 481px)").matches) {
      gsap.to(".mpp-object .wrap", {x: 0, duration: 0.35});
      if ($(window).width()/$(window).height() <= 2760/1553) {
        gsap.to(".mpp-object", {scrollLeft: $(".mpp-object").scrollLeft()-blocksInfoWidth, duration: 0.35});
      } else if (window.matchMedia("(max-width: 1024px)").matches) {
        gsap.to(".mpp-object", {scrollTop: 0, duration: 0.35});
      }
    } else {
      addScrollbar($("body"));
    }
  });
});