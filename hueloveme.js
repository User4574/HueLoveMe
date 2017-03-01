var rows = 5;
var cols = 5;

var grid = [];

for(var r = 0; r < rows; r++)
  grid[r] = [];

var tl = (Math.random()*360*1000000)%360;
var tr = (Math.random()*360*1000000)%360;
var bl = (Math.random()*360*1000000)%360;

var cd = (tr-tl)/(cols-1);
var rd = (bl-tl)/(rows-1);

var rand = [];
for(var i = 0; i < rows*cols; i++)
  if(!isCorner(i))
    rand.splice(Math.floor(Math.random() * (i+1)), 0, i);

rand.splice(0, 0, 0);
rand.splice(cols - 1, 0, cols - 1);
rand.splice((rows - 1) * cols, 0, (rows - 1) * cols);
rand.splice((rows * cols) - 1, 0, (rows * cols) - 1);


eachSquare(function(r, c) {
  var rs = tl + r * rd;
  grid[r][c] = Math.floor(rs + c * cd);
});

$(function() {
  for(var i = 0 ; i < rand.length ; i++) {
    $('#container').append('<div class="square" id="'+rand[i]+'"></div>');
    $('#'+rand[i]).css('background-color', 'hsl(' + gridByIndex(rand[i]) + ', 100%, 50%)');
    if(isCorner(rand[i])) $('#'+rand[i]).addClass('locked');
  }

  makeDraggable();
});

function isCorner(i) {
  if(i === 0) return true;
  if(i === cols - 1) return true;
  if(i === (rows - 1) * cols) return true;
  if(i === (rows * cols) - 1) return true;
  return false;
}

function eachSquare(fun) {
  for(var r = 0; r < rows; r++) {
    for(var c = 0; c < cols; c++) {
      fun(r, c);
    }
  }
}

function makeDraggable() {
  $('.square:not(.locked)').draggable({
    helper: 'clone'
  })
  $('.square:not(.locked)').droppable({
    drop: function (ev, ui) {
      $(ui.draggable).clone().replaceAll(this);
      $(this).replaceAll(ui.draggable);
      makeDraggable();
      checkWin();
    }
  })
}

function gridByIndex(i) {
  var s = Math.floor(i / cols);
  var t = i - s * cols;
  return grid[s][t];
}

function checkWin() {
  var a = $.map($('.square'), function(i) {
    return i.id;
  });

  var win = true;

  for(var i = 0; i < rows*cols ; i++)
    if(a[i] != ("" + i)) win = false;

  if(win) {
    $('.square:not(.locked)').draggable('destroy');
    $('#win').html('Winner! <a href="">New?</a>');
  }
}
