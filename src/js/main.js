$(function () {

    //メインビジュアル
$('.p-hero__gallery__image:nth-child(n+2)').hide();
setInterval(function() {
  $(".p-hero__gallery__image:first-child").fadeOut(4000);
  $(".p-hero__gallery__image:nth-child(2)").fadeIn(4000);
  $(".p-hero__gallery__image:first-child").appendTo(".p-hero__gallery ");
}, 8000);
});