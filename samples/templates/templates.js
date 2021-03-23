
$(document).ready(() => {
    initTemplates();
});

function initTemplates() {

    var sliders = [];
    initSliders();

    resizeSlider('.template_4');
    resizeSlider('.template_21');
    resizeSlider('.template_23');
    $('.image-popup-vertical-fit').magnificPopup({
        type: 'image',

        callbacks: {
            elementParse: function (item) {
                item.src = item.el[0].style.backgroundImage.replace(/^url|[\(\)]/g, '').replace(/['"]+/g, '');
            }
        },
        closeOnContentClick: true,
        mainClass: 'mfp-img-mobile',
        image: {
            verticalFit: true
        }
    });

    formateQuote();
    autoformateLine('.template_45');
    autoformateLine('.template_46');


    window.addEventListener("resize", function (e) {
        resizeSlider('.template_4');
        resizeSlider('.template_21');
        resizeSlider('.template_23');
        autoformateLine('.template_45');
        autoformateLine('.template_46');
    });

}


function formateQuote() {
    $('.longread .quote').addClass('container');



// Sliders: Template4, Template21, Template23

function removeElementIfEmpty(element) {
    if ($(element).html() == '&nbsp;') {
        $(element).remove();
    }
    return;
}

function onNavitemClick(target) {
    var navitemIndex = Number($(target).attr('itemindex'));
    var slider = $(target).parents('.template-slider')[0];
    slider.current_item = navitemIndex;
    handleCureent(slider, slider.current_item, true);
}

function nextSlide(target) {
    var slider = $(target).parents('.template-slider')[0];
    if (slider.current_item >= slider.number_items - 1) {
        return;
    }
    slider.current_item += 1;
    handleCureent(slider, slider.current_item, true);
}
function previousSlide(target) {
    var slider = $(target).parents('.template-slider')[0];
    if (slider.current_item <= 0) {
        return;
    }
    slider.current_item -= 1;
    handleCureent(slider, slider.current_item, true);
}

function initSliders() {
    sliders = [...$('.template-slider')];

    sliders.forEach(function (slider) {
        let sliderNav = $(slider).find('.tslider-nav')[0];
        slider.current_item = 0;
        slider.number_items = $(slider).find('.tslider-item').length;
        handleNavs(0, slider);

        if (sliderNav) {
            let html = '';
            for (var i = 0; i < slider.number_items; i++) {
                if ($(slider).parent().hasClass('template_21')) {
                    html += `<div class="navitem" onclick="onNavitemClick(event.currentTarget);" itemindex=${i}></div>`;
                }
                if ($(slider).parent().hasClass('template_23')) {
                    html += `<div class="navitem" onclick="onNavitemClick(event.currentTarget);" itemindex=${i}
                                style="background-image: url('${$(slider).find('.tslider-item')[i].dataset.img}')"></div>`;
                }
            }
            $(sliderNav).html(html);
        }

        removeElementIfEmpty($(slider).find('.tslider-title')[0]);
        removeElementIfEmpty($(slider).find('.tslider-desc')[0]);
    });
}

function handleCureent(slider, item, onnav) {

    var translate;
    let sliderNav = $(slider).find('.tslider-nav')[0];
    let navitems, color;
    if (sliderNav) {
        navitems = $(sliderNav).find('.navitem');
        if ($(slider).parent().hasClass('template_21')) {
            if ($(slider).find('.tslider-text').css('position') == 'relative') {
                color = 'white';
            }
            if ($(slider).find('.tslider-text').css('position') == 'static') {
                color = 'black';
            }
            $($(navitems)[item]).css({ 'transition': 'background 0 ease-in-out', 'background': color });
        }
        if (sliderNav && $(slider).parent().hasClass('template_23')) {
            $($(navitems)[item]).css({ 'transition': 'border 0 ease-in-out', 'border': '2px solid #ffd600' });
        }
    }

    if ($(slider).parent().hasClass("template_4") && $(window).width() > 500) {
        translate = getpxvalue($(slider).find('.previous').css('width')) - (getpxvalue($(slider).find('.current').css('width'))) * item;
    } else {
        translate = 0 - (getpxvalue($(slider).find('.current').css('width'))) * item;
    }

    if (onnav) {
        $(slider).find('.tslider-item').css({ 'transition': 'transform 0.5s ease-in-out', 'transform': `translate(${translate}px)` });
        if (sliderNav && $(slider).parent().hasClass('template_23')) {
            $(navitems).css({ 'transition': 'border-color 0.5s ease-in-out', 'border-color': 'white' });
            $($(navitems)[item]).css({ 'transition': 'border 0.5s ease-in-out', 'border-color': '#ffd600' });

            let visibleNavitems = Math.floor($(sliderNav).width() / navitems[0].scrollWidth);
            let itemsSet = Math.floor(item / visibleNavitems);
            let scrollPosition = itemsSet * ($(navitems[0]).width() + 5.5) * visibleNavitems;
            //let scrollPosition = itemsSet * (getpxvalue($(navitems[0]).css('width')) +1.5) * visibleNavitems;
            $(sliderNav).animate({ scrollLeft: scrollPosition }, 500);
        }
        if (sliderNav && $(slider).parent().hasClass('template_21')) {
            $(navitems).css({ 'transition': 'background 0.5s ease-in-out', 'background': 'transparent' });
            $($(navitems)[item]).css({ 'transition': 'background 0.5s ease-in-out', 'background': color });
        }
    } else {
        $(slider).find('.tslider-item').css({ 'transition': 'transform 0s ease-in-out', 'transform': `translate(${translate}px)` });
    }


    //handle navs
    handleNavs(item, slider);
}
function handleNavs(item, slider){
    var prev=$(slider).find('.previous')[0];
    var next=$(slider).find('.next')[0];
    $(prev).removeClass('empty');
    $(next).removeClass('empty');
    if (item === 0) {
        $(prev).addClass('empty');
    }
    if (item === slider.number_items - 1) {
        $(next).addClass('empty');
    }
}

function getpxvalue(str) {
    return Number(str ? str.slice(0, (str.length - 2)) : 0);
}
function resizeSlider(template) {

    let skins = $(template).find('.slider_skin');
    let current = $(template).find('.current')[0];
    let currentWidth = getpxvalue($(current).css('width'));

    let currentHeight = 0;
    let tsliders = [...$(`${template} .template-slider`)];


    const resize = (template) => {
        //place skin infront of fotorama
        $(skins).css('margin-bottom', `-${currentHeight + 35}px`);

        //tune size of slide, fotorama and slider item
        $(`${template} .slide`).css('height', `${currentHeight}px`);
        $(`${template} .tfotorama`).css({ 'height': `${currentHeight}px`, 'max-width': $(skins[0]).css('width') });
        $(`${template} .tslider-item`).css({ 'padding-top': `${currentHeight}px`, 'width': `${currentWidth}px` });

        //position current slider-item to current slide
        tsliders.forEach(function (slider) {
            handleCureent(slider, slider.current_item);
        });
    };

    if (template === ".template_4") {
        currentHeight = currentWidth * 2 / 3;
    }
    if (template === ".template_21") {
        currentHeight = currentWidth / 2;
        //  position text block and set colors
        tsliders.forEach(function (slider) {
            let text = $(slider).find('.tslider-text')[0];
            let textHeight = getpxvalue($(text).css('height'));
            let textShift;
            let color;
            if (textHeight < currentHeight * 0.35) {
                color = 'white';
                textShift = - 35 - textHeight;
                $(text).css({
                    'top': `${textShift}px`, 'margin-bottom': `${textShift}px`, 'color': color, 'position': 'relative', 'background': 'linear-gradient(rgba(0, 0, 0, 0),52%,rgba(0, 0, 0, .8))', 'display': 'block'
                });
                $($(text).find('.tslider-nav')[0]).css({ 'padding-top': '10px' });

            } else {
                color = 'black';
                $(text).css({
                    'margin-bottom': '0', 'color': 'black', 'position': 'static', 'background': 'transparent', 'display': 'flex',
                    'flex-direction': 'column'
                });
                $($(text).find('.tslider-nav')[0]).css({ 'order': '-1', 'padding-top': '0' });

            }
            $(text).find('.navitem').css({ 'border-color': color });
        });
    }
    if (template === ".template_23") {
        currentHeight = currentWidth * 3 / 4;
    }

    resize(template);
}



//Template8
document.addEventListener("DOMContentLoaded", function () {
    unselectItems();
});

function hideTags() {
    var tags = document.getElementsByClassName("tag_container");
    for (var i = 0; i < tags.length; i++) {
        tags[i].style.display = 'none';
    }
}

function unselectItems() {
    var btns = document.getElementsByClassName("tag_btn");
    hideTags();
    for (var i = 0; i < btns.length; i++) {
        btns[i].style.background = "white";
        btns[i].style.border = "4px solid grey";
    }
}

function selectItem(btn) {
    unselectItems();
    btn.style.background = "#ffd600";
    btn.style.border = "4px solid #ffd600";
    btn.parentElement.getElementsByClassName('tag_container')[0].style.display = 'block';
}

//Template31
function togglePlus(t) {
    var target, toexpand, tspans, tspansArr;
    var spans = document.getElementById('accordion').getElementsByTagName("span");
    var spansArr = Array.prototype.slice.call(spans);
    if (t.tagName == 'SPAN') {
        target = t.parentElement;
    } else {
        target = t;
    }
    toexpand = target.classList.contains('collapsed');
    tspans = target.getElementsByTagName("span");
    tspansArr = Array.prototype.slice.call(tspans);

    spansArr.forEach(function (span) {
        if (span.classList.contains('plus')) {
            span.classList.remove('hidden');
        }
        if (span.classList.contains('minus')) {
            span.classList.add('hidden');
        }
    });
    if (toexpand) {
        tspansArr.forEach(function (span) {
            if (span.classList.contains('plus')) {
                span.classList.add('hidden');
            }
            if (span.classList.contains('minus')) {
                span.classList.remove('hidden');
            }
        });
    }
}


function autoformateLine(template) {
    var intros = $(template).find('.intro');
    var introsArr = Array.prototype.slice.call(intros);
    var heightArr;
    introsArr.forEach(intro => $(intro).css('height', 'auto'));
    heightArr = introsArr.map(function (intro) {
        return $(intro).height();
    });
    var maxH = Math.max(...heightArr);
    introsArr.forEach(intro => $(intro).css('height', `${maxH}px`));
}

//Template32
$(document).ready(function () {
    var sections = Array.prototype.slice.call(document.getElementsByClassName('template_32'));
    if (sections.length > 0) {
        setTextPosition(sections);
        initStickyElements(sections);
        window.addEventListener("resize", function (e) {
            setTextPosition(sections);
            initStickyElements(sections);
        });
    }
});

function initStickyElements(sections) {
    $(sections).each(function (i, section) {
        var sticky = $(section).find('.sticky');
        var text = $(section).find('.text');
        var stickyTop = $(sticky).offset().top;
        $(window).scroll(function () {
            var windowTop = $(window).scrollTop();
            if (stickyTop < windowTop && $(text).height() + $(text).offset().top - $(sticky).height() > windowTop) {
                $(sticky).css('position', 'fixed');
            } else {
                $(sticky).css('position', 'relative');
            }

        });
    });
}


function setTextPosition(sections) {
    var img = (sections[0]).getElementsByClassName('bgImgEditable')[0];
    var height = window.getComputedStyle(img, null).getPropertyValue("height");
    Array.prototype.slice.call(sections).forEach(function (section) {
        Array.prototype.slice.call(section.getElementsByClassName('textContainer')).forEach(function (tc) {
            tc.style.marginTop = "-" + height;
            tc.style.height = height;
        });
    });
}