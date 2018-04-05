const $ = require('jquery');

$(document).ready(function() {
  // Test avatar
  $('.avatar').css('background-image', 'url(https://raw.githubusercontent.com/akabab/superhero-api/0.2.0/api/images/sm/1-a-bomb.jpg)');

  //Test levels
  $('.fill-level', '.fighter').each(function() {
    $(this).css("width", `${$(this).parent('.level').data("level")}%`);
  });

  //Test levels
  $('.fill-life', '.fightzone').each(function() {
    $(this).css("width", `${$(this).parent('.lifepoints').data("life")}%`);
  });
});
