$(function () {

    //メインビジュアル
$('.c-hero-image:nth-child(n+2)').hide();
setInterval(function() {
  $(".c-hero-image:first-child").fadeOut(3500);
  $(".c-hero-image:nth-child(2)").fadeIn(3500);
  $(".c-hero-image:first-child").appendTo(".p-hero__gallery ");
}, 7000);
});                                                                          