
jQuery(function ($) {
    'use strict';

    /* ---------------------------------------------- /*
     * Preloader
    /* ---------------------------------------------- */
    $(window).ready(function() {
        $('#pre-status').fadeOut();
        $('#tt-preloader').delay(350).fadeOut('slow');
    });




    // -------------------------------------------------------------
    // Animated scrolling / Scroll Up
    // -------------------------------------------------------------
    (function () {
        $('a[href*=#]').bind("click", function(e){
            var anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $(anchor.attr('href')).offset().top
            }, 1000);
            e.preventDefault();
        });
    }());



    // -------------------------------------------------------------
    // Full Screen Slider
    // -------------------------------------------------------------
    (function () {
        $(".tt-fullHeight").height($(window).height());

        $(window).resize(function(){
            $(".tt-fullHeight").height($(window).height());
        });

    }());


    // -------------------------------------------------------------
    // Sticky Menu
    //-------------------------------------------------------------
    (function () {
        $('.header').sticky({
            topSpacing: 0
        });

        $('body').scrollspy({
            target: '.navbar-custom',
            offset: 70
        })
    }());




    // -------------------------------------------------------------
    // Back To Top
    // -------------------------------------------------------------
    (function () {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('.scroll-up').fadeIn();
            } else {
                $('.scroll-up').fadeOut();
            }
        });
    }());
    
    
    // -------------------------------------------------------------
    // Recaptcha
    // -------------------------------------------------------------
    (function () {
        $(window).scroll(function() {
            if ($(this).scrollTop() > $('#contact').offset().top){
                $('.grecaptcha-badge').fadeIn();
            } else {
                $('.grecaptcha-badge').fadeOut();
            }
        });
    }());

    // -------------------------------------------------------------
    // Countup
    // -------------------------------------------------------------
    $('.count-wrap').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
        if (visible) {
            $(this).find('.timer').each(function () {
                var $this = $(this);
                $({ Counter: 0 }).animate({ Counter: $this.text() }, {
                    duration: 2000,
                    easing: 'swing',
                    step: function () {
                        $this.text(Math.ceil(this.Counter));
                    }
                });
            });
            $(this).unbind('inview');
        }
    });


    // -------------------------------------------------------------
    // Progress Bar
    // -------------------------------------------------------------
    $('.skill-progress').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
        if (visible) {
            $.each($('div.progress-bar'),function(){
                $(this).css('width', $(this).attr('aria-valuenow')+'%');
            });
            $(this).unbind('inview');
        }
    });
    
    // -------------------------------------------------------------
    // More skill
    // -------------------------------------------------------------
    $('.more-skill').bind('inview', function(event, visible, visiblePartX, visiblePartY) {
        if (visible) {
            $('.chart').easyPieChart({
                //your configuration goes here
                easing: 'easeOut',
                delay: 3000,
                barColor:'#E5DDCB',
                trackColor:'rgba(255,255,255,0.2)',
                scaleColor: false,
                lineWidth: 8,
                size: 140,
                animate: 2000,
                onStep: function(from, to, percent) {
                    this.el.children[0].innerHTML = Math.round(percent);
                }

            });
            $(this).unbind('inview');
        }
    });


    // -------------------------------------------------------------
    // Shuffle
    // -------------------------------------------------------------
    (function () {
        var $grid = $('#grid');
        $grid.shuffle({
            itemSelector: '.portfolio-item'
        });
        /* reshuffle when user clicks a filter item */
        $('#filter a').click(function (e) {
            e.preventDefault();

            // set active class
            $('#filter a').removeClass('active');
            $(this).addClass('active');

            // get group name from clicked item
            var groupName = $(this).attr('data-group');

            // reshuffle grid
            $grid.shuffle('shuffle', groupName );
        });
    }());


    // -------------------------------------------------------------
    // Magnific Popup
    // -------------------------------------------------------------
    (function () {
      $('.image-link').magnificPopup({
        gallery: {
          enabled: true
        },
        removalDelay: 300, // Delay in milliseconds before popup is removed
        mainClass: 'mfp-with-zoom', // this class is for CSS animation below
        type:'image'
      });

    }());

    // -------------------------------------------------------------
    // WOW JS
    // -------------------------------------------------------------
    (function () {
        new WOW({
            mobile:  false
        }).init();
    }());

    // -------------------------------------------------------------
    // Print CV
    // -------------------------------------------------------------
    $('#printCv').on('click',function(e){
        (function () {
            new WOW({
                mobile:  true
            }).init();
        }());
        $.each($('div.progress-bar'),function(){
            $(this).css('width', $(this).attr('aria-valuenow')+'%');
        });
        $('.chart').easyPieChart({
            //your configuration goes here
            easing: 'easeOut',
            delay: 0,
            barColor:'#E5DDCB',
            trackColor:'rgba(255,255,255,0.2)',
            scaleColor: false,
            lineWidth: 8,
            size: 140,
            animate: 2000,
            onStep: function(from, to, percent) {
                this.el.children[0].innerHTML = Math.round(percent);
            }

        });
        window.print();
    });
});


// -------------------------------------------------------------
// Contact Form
// -------------------------------------------------------------
var ready = false;
var onSubmit = function(){
    ready = true;
};

$('#contactForm').on('submit',function(e){
    event.preventDefault();
    grecaptcha.execute();
    e.preventDefault();
    
    var $this = $(this);
    var $action = $(this).prop('action');
    var $data = $(this).serialize();
    
    var poll = setInterval(function(){
        if(ready){
            clearInterval(poll);

            $this.prevAll('.alert').remove();

            $.post( $action, $data, function( data ) {
                if( data.response=='error' ){
                    $this.before( '<div class="alert alert-danger">'+data.message+'</div>' );
                }
                if( data.response=='success' ){
                    $this.before( '<div class="alert alert-success">'+data.message+'</div>' );
                    $this.find('input, textarea').val('');
                }
            }, "json");
        }
    },500);
});





