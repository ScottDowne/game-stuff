var images = [
  'img/ow_sand.png',
  'img/ow_path.png',
  'img/forest_rock_bl.png',
  'img/forest_rock_br.png',
  'img/forest_rock_t.png',
  'img/forest_rock.png',
  'img/forest_rock_tl.png',
  'img/forest_rock_tr.png',
  'img/ow_rock_bl.png',
  'img/ow_rock_br.png',
  'img/ow_rock_t.png',
  'img/ow_rock.png',
  'img/ow_rock_tl.png',
  'img/ow_rock_tr.png',
  'img/player.png',

  'img/chars/char-.png',
  'img/chars/char,.png',
  'img/chars/char!.png',
  'img/chars/charquestion.png',
  'img/chars/char..png',
  'img/chars/char&.png',
  'img/chars/char0.png',
  'img/chars/char1.png',
  'img/chars/char2.png',
  'img/chars/char3.png',
  'img/chars/char4.png',
  'img/chars/char5.png',
  'img/chars/char6.png',
  'img/chars/char7.png',
  'img/chars/char8.png',
  'img/chars/char9.png',
  'img/chars/charA.png',
  'img/chars/charB.png',
  'img/chars/charC.png',
  'img/chars/charD.png',
  'img/chars/charE.png',
  'img/chars/charF.png',
  'img/chars/charG.png',
  'img/chars/charH.png',
  'img/chars/charI.png',
  'img/chars/charJ.png',
  'img/chars/charK.png',
  'img/chars/charL.png',
  'img/chars/charM.png',
  'img/chars/charN.png',
  'img/chars/charO.png',
  'img/chars/charP.png',
  'img/chars/charQ.png',
  'img/chars/charR.png',
  'img/chars/charS.png',
  'img/chars/charT.png',
  'img/chars/chartick.png',
  'img/chars/charU.png',
  'img/chars/charV.png',
  'img/chars/charW.png',
  'img/chars/charX.png',
  'img/chars/charY.png',
  'img/chars/charZ.png'
];

var notLoadedBySrc = {};
var totalToLoad = images.length;
var totalLoaded = 0;
var progressDiv = document.getElementById('progress');

function onPreload(e) {
  totalLoaded++;
  var percent = Math.floor(100 * totalLoaded / totalToLoad);
  progressDiv.innerHTML = percent + '%';
  $('progress').style.opacity = 1.2 - (percent / 100);
  next();
}
function onPreloadError(e) {
  // Huh. Must be a network error. Just carry on.
  console.log('PRELOAD ERROR', e);
  totalToLoad--;
  next();
}

function next() {
  if (images.length) {
    var img = document.createElement('img');
    img.onload = onPreload;
    img.onerror = onPreloadError;
    var src = images.shift();
    notLoadedBySrc[src] = true;
    img.src = src;
  } else if (totalLoaded == totalToLoad) {
    if (!game) {
      if (!window.WebGLRenderingContext) {
        $('progress').innerHTML = 'SORRY, YOU NEED WEBGL...<p>TRY A DIFFERENT BROWSER.';
        return;
      }
      game = new ace.Game('game-container');
      $('progress').innerHTML = '99%<p>GENERATING WORLD...';
    }
  }
}


// Called by the engine when all of the graphics are ready.
function onGraphicsLoaded() {
  $('game-container').className = 'visible';
  $('progress').style.display = 'none';
}

next();
next();
next();
next();
next();
next();
next();
next();
