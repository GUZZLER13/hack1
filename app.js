const $ = require('jquery');
const SUPER_API = "https://akabab.github.io/superhero-api/api";
const SUPER_API_CACHED = "https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api";
const GET_SUPERHERO_INFOS = (id) => `${SUPER_API_CACHED}/id/${id}.json`;

$(document).ready(function() {

  /*
  * SELECTION DU PERSONNAGE
  */
  var charactersIdxList = [1, 2, 3, 4, 5, 6, 7, 8, 10];
  var charactersList = [];
  var player1 = null;
  var player1Selected = false;
  var player2 = null;

  //init des characters
  charactersIdxList.forEach(function (charId, i) {
      $.get(`${SUPER_API_CACHED}/id/${charId}.json`, function (character) {
          charactersList[i] = character;
          // console.log("data", character.images.xs);
          // $(".result").html(JSON.stringify(data));
          if (i == 0)
              selectCharacter(i);

          $("#" + i, '.characters-list').css("background-image", "url(" + character.images.sm + ")");
      });
  })


  const selectCharacter = function (i) {
      if (!player1Selected) {
          player1 = charactersList[i];
          $(".avatar").removeClass("player1");
          $("#" + i, '.characters-list').addClass(" player1");
          $(".avatar-bg").css("background-image", "url(" + player1.images.sm + ")");
          $(".hero-details").html(player1.name);
      } else {
          player2 = charactersList[i];
          $(".avatar").removeClass(" player2");
          $("#" + i, '.characters-list').addClass(" player2");
          $(".avatar-bg").css("background-image", "url(" + player2.images.sm + ")");
          $(".hero-details").html(player2.name);
      }
  }
  $('.avatar', '.characters-list').on("click", function() {
    selectCharacter($(this).attr('id'));
  });

  $('#confirm-button').on("click", function() {
    if (!player1Selected) {
        player1Selected = true;
        $("#player-header").text("Player 2");
        selectCharacter(0);
    } else {
        $("#fight-button").attr("href", "/versus.html?player1=" + player1.id + "&player2=" + player2.id);
        $("#confirm-button").hide();
        $("#fight-button").show();
    }
  });

  const $btnFight = $('.button-fight');

  const initFighter = (_fighter, _zone) => {
    const $zone = $(`.${_zone}`);
    const $fighter = $('.superhero', $zone);
    const $stats = $('.stats', $fighter);
    const $avatar = $('.hero-avatar', $fighter);

    $fighter.data("life", 100);
    $fighter.data("id", _fighter.id);
    $fighter.data("power", _fighter.powerstats.power);
    $fighter.data("defense", _fighter.powerstats.strength);
    $fighter.data("speed", _fighter.powerstats.speed);
    // Fill Stats
    $('.strength .fill-level', $stats).css("width", `${_fighter.powerstats.strength}%`);
    $('.power .fill-level', $stats).css("width", `${_fighter.powerstats.power}%`);
    $('.speed .fill-level', $stats).css("width", `${_fighter.powerstats.speed}%`);

    $('.name-avatar', $avatar).text(_fighter.name);
    $('.img-avatar', $avatar).css('background-image', `url(${_fighter.images.sm})`);

    $('.fill-life', $zone).css("width", `100%`);
  }

  const initFightzone = () => {
    // Get the opponent informations
    
    $.get(GET_SUPERHERO_INFOS($.urlParam( "player1" )), (data) => {
      initFighter(data, 'opponent');

      // Get the player informations
      $.get(GET_SUPERHERO_INFOS($.urlParam( "player2" )), (data) => {
        initFighter(data, 'player');
        $btnFight.show();
      });
    });
  }

  const fight = (_src, _dest) => {
    const $zoneSrc = $(`.${_src}`);
    const $fighterSrc = $('.superhero', $zoneSrc);
    const $zoneDest = $(`.${_dest}`);
    const $fighterDest = $('.superhero', $zoneDest);

    const srcPower = $fighterSrc.data("power");

    const destDef = $fighterDest.data("defense");
    const destLife = $fighterDest.data("life");
    const destSpeed = $fighterDest.data("speed");

    // How to - do damages on dest
    // destSpeed chances to avoid attack
    if (Math.round(Math.random() * 100) >= destSpeed) {
      const life = destLife - 5;

      $fighterDest.data("life", life);
      $('.fill-life', $zoneDest).css("width", `${life}%`);

      if (life <= 0) {
        $btnFight.hide();
        $('.defeat', $zoneDest).fadeIn();
        setTimeout(function(){
          window.location.href = "/win.html?player="+$fighterSrc.data("id");
        },2000)
      }
    }
  }

  initFightzone();

  $btnFight.on("click", function() {
    // The player attack the opponent
    fight('player', 'opponent');
    fight('opponent', 'player');
  });


  if($('body').hasClass('versus')){
    initVersusPage();
  }

  function initVersusPage(){
    window.setTimeout(function(){
      $('.versus').find('img').css('transform', 'translateX(0)');
    }, 3000);
  }

  $("img")
  .on('load', function() { console.log("image loaded correctly"); })
    // setTimeout(function(){
    //   window.location.href = "/fight.html"+window.location.search
    // },2000)

  
});
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return results[1] || 0;
}