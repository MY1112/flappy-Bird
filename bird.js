function init() {
    document.onclick = move;
    bird_fly();
}

var point = 0;
var all_height = 560;
var v = 26   ;
var g = 9.8;
var prev_time = 0;
var prev_speed = 0;
var prev_height = 0;
var height;
var bird_interval;
var upInterval;
var downInterval;
var overInterval;
var j = 0;


function bird_fly() {
    var birds = ["./images/0.gif","./images/1.gif","./images/2.gif"];
    bird_interval = setInterval(function() {
        if(j == 3){j = 0;}
        for(var i = 0;i<birds.length;i++){
            if(i == j) {
                $('#bird').attr('src',birds[i]);
                j = j + 1;
                break;
            } else {continue}
        }
    },100);
}

var getHeight = function(obj) {
    return obj.offset().top;
}
var getSpeed = function(time,a) {
    return time*a;
}
var getCurrentHeight = function(time) {
    return v * time;
}
var getCurrentHeight2 = function (speed, time) {
    return speed * time - 1 / 2 * g * time * time;
}
function move() {
    up();
    function game_over() {
        var ux = $('#up_pipe').offset().left;
        var dx = $('#down_pipe').offset().left;
        var dy = $('#down_pipe').offset().top;
        var bx = $('#bird').offset().left;
        var by = $('#bird').offset().top;

        if((bx > ux && bx < ux+100 && by < dy-200)||(bx+40 > ux && bx+40 < ux+100 && by < dy-200)||
            (bx > dx && bx < dx+100 && by > dy)||(bx+40 >dx && bx+40 < dx+100 && by+31 >dy)){
            clearInterval(downInterval);
            clearInterval(upInterval);
            clearInterval(pipe_interval);
            clearInterval(bird_interval);
            clearInterval(overInterval);
            stop_move();
            $('#point').html('GAME OVER!!');
        }
    }
    overInterval = setInterval(function() {
        game_over();
    },1)

    var pipe_interval = setInterval(function() {
        var num = 1+Math.random()*300;
        var pipe_height = JSON.stringify(num);
        if ($('#up_pipe').css('left') == '400px' && $('#down_pipe').css('left') == '400px') {
            $('#up_pipe').animate({left: '-100px'}, 4000,'linear',function() {
                point = point + 1;
                $('#point').html(point);
                $('#up_pipe').css('left','400px');
                $('#up_pipe').css('height',pipe_height+'px');
            });
            $('#down_pipe').animate({left: '-100px'}, 4000,'linear',function() {
                $('#down_pipe').css('left','400px');
                var down_pipe_height = 400-num;
                $('#down_pipe').css('height',JSON.stringify(down_pipe_height)+'px');
            });
        }
    },100);

}

function down() {
    prev_time = 0;
    downInterval = setInterval(function() {
        if(getHeight($('#bird')) < all_height) {
            prev_time = prev_time + 0.1;
            var height = getCurrentHeight(prev_time) + prev_height;
            $('#bird').css('top',height + 'px');
        }
        else {
            clearInterval(downInterval);
                clearInterval(pipe_interval);
            clearInterval(bird_interval);
            stop_move();
        }
    },20);
    document.addEventListener("click", function (event) {
        clearInterval(downInterval);
    }, false);
}

function up() {
    prev_time = 0;
    prev_speed = 40;
    clearInterval(upInterval);
    upInterval = setInterval(function () {
        if (prev_speed > 0) {
            prev_speed = prev_speed - getSpeed(prev_time,g);
            prev_time = prev_time + 0.0025;
            height = getHeight($('#bird')) - getCurrentHeight2(prev_speed, prev_time);
            $("#bird").css("top", height + "px");
        } else {
            clearInterval(upInterval);
            prev_height = $("#bird").offset().top;
            if (all_height > prev_height) {
                down();
            }
        }
    });
}

function stop_move() {
    $('#up_pipe').stop(true);
    $('#down_pipe').stop(true);
}
