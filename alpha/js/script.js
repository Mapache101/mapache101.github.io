(function ($) {

  "use strict";


  var initSearch = function () {
    $(".user-items .search-item").click(function () {
      $(".search-box").toggleClass('active');
      $(".search-box .search-input").focus();
    });
    $(".close-button").click(function () {
      $(".search-box").toggleClass('active');
    });

  };


  // init Chocolat light box
  var initChocolat = function () {
    Chocolat(document.querySelectorAll('.image-link'), {
      imageSize: 'contain',
      loop: true,
    })
  }

  var initProductQty = function () {

    $('.product-qty').each(function () {

      var $el_product = $(this);
      var quantity = 0;

      $el_product.find('.quantity-right-plus').click(function (e) {
        e.preventDefault();
        var quantity = parseInt($el_product.find('#quantity').val());
        $el_product.find('#quantity').val(quantity + 1);
      });

      $el_product.find('.quantity-left-minus').click(function (e) {
        e.preventDefault();
        var quantity = parseInt($el_product.find('#quantity').val());
        if (quantity > 0) {
          $el_product.find('#quantity').val(quantity - 1);
        }
      });

    });

  }

  var initSlider = function () {

    // product single page
    var thumb_slider = new Swiper(".product-thumbnail-slider", {
      slidesPerView: 3,
      autoplay: true,
      direction: "vertical",
      spaceBetween: 10,
    });

    var large_slider = new Swiper(".product-large-slider", {
      loop: true,
      slidesPerView: 1,
      autoplay: true,
      effect: 'fade',
      thumbs: {
        swiper: thumb_slider,
      },
    });

    var review_swiper = new Swiper(".review-swiper", {
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });


    var swiper_carousel = new Swiper(".swiper-carousel", {
      slidesPerView: 5,
      spaceBetween: 30,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        300: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1200: {
          slidesPerView: 5,
          spaceBetween: 30,
        },
      },
    });

    var swiper_slideshow = new Swiper(".swiper-slideshow", {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 700,
      loop: true,
      navigation: {
        nextEl: '.swiper-slideshow .swiper-right',
        prevEl: '.swiper-slideshow .swiper-left',
      },
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

  };

  // document ready
  $(document).ready(function () {
    initSearch();
    initSlider();
    initChocolat();
    initProductQty();

  }); // document ready

})(jQuery);