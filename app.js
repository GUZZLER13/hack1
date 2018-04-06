const $ = require('jquery');
const GET_SUPERHERO_INFOS = (id) => `https://cdn.rawgit.com/akabab/superhero-api/0.2.0/api/id/${id}.json`;

$(document).ready(function() {
  const $btnFight = $('.button-fight');

  const initFighter = (_fighter, _zone) => {
    const $zone = $(`.${_zone}`);
    const $fighter = $('.superhero', $zone);
    const $stats = $('.stats', $fighter);
    const $avatar = $('.avatar', $fighter);

    $fighter.data("life", 100);
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
    $.get(GET_SUPERHERO_INFOS(1), (data) => {
      initFighter(data, 'opponent');

      // Get the player informations
      $.get(GET_SUPERHERO_INFOS(2), (data) => {
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

});
