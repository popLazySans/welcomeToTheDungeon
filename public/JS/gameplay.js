window.onload = pageLoad;

var timeController = true;
var win =true;
function pageLoad(){
document.getElementById("testbutton").onclick = youWin;
document.getElementById("startbutton").onclick = clicker;
for(i=1;i<=102;i++){
    var wall = document.getElementById("w"+i);
    wall.onmouseover = wall.onmousedown = lose;
}
record();
hiddenGame();
setbutton();
}
function lose(){
    timeController = false;
    win = false;
    console.log("lose");

} 
function hiddenGame() {
    document.getElementById("easygame").hidden = true;
    document.getElementById("normalgame").hidden = true;
    document.getElementById("hardgame").hidden = true;
}
function setbutton(){
    var gameplay = document.getElementById("gamePlay");
    var divset = document.createElement("div");
    var startbutton = document.getElementById("startbutton");
    var lev = getCookie('level');
    divset.id = "div"+lev;
    gameplay.appendChild(divset);
    divset.appendChild(startbutton);
}
function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}
function clicker(){
    console.log("Game start");
    document.getElementById("startbutton").hidden = true;
    timeStart();
}
function timeStart(){
    var TIMER_TICK = 10;
	var timer = null;
	var second = 0; 
    var timer = null; 
    timer = setInterval(timeCount,TIMER_TICK);
    var lev = getCookie('level');
    createlink(lev);
    document.getElementById(lev+"game").hidden = false;
    insertWinButton();
    //console.log(lev+"game");
    function timeCount(){
        // x.innerHTML = second;
        if(timeController == true){
            //console.log(second.toFixed(2));
            second += 0.01;
        }
        else{
            clearInterval(timer);
            timer = null;
            if(win == true){
                getScore(second.toFixed(2));
                createWinBox(second.toFixed(2));
                delay(1);
            }
            else{
                createWinBox(second.toFixed(2));
                delay(1);
            }
            console.log("stopped");
        }
    }
}
function insertWinButton(){
    var winButton = document.getElementById("testbutton");
    winButton.hidden = false;
    var lev = getCookie('level');
    var finish = document.getElementById("finish"+lev);
    finish.appendChild(winButton);
}
function delay(time){
    var TIMER_TICK = 1000;
    var timer = null;
    var second = time;
    timer = setInterval(timeCount,TIMER_TICK);
    function timeCount(){
        if(second > 0){
            second -=1;
        }
        else{
            clearInterval(timer);
            stop();
        }
    }
}
function createlink(level){
    var head = document.getElementById("head");
    var link = document.createElement("link");
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.media = 'screen';
    link.href = 'css/'+level+'Wall.css';
    head.appendChild(link);
}
function youWin(){
    timeController = false;
    win = true;
}
async function getScore(time){
    var username = getCookie('username');
    var lev = getCookie('level');
	const response = await fetch("/getscore", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			user: username,
			score: time,
            level: lev
		})
	});
	const gscore = await response.json();
	console.log(gscore);
}
function createWinBox(time){
    var WinDiv = document.getElementById("winDiv");
    var WinBox = document.createElement("div");
    var WinText = document.createElement("p");
    var WinScore = document.createElement("p");
    var aRankButton = document.createElement("a");
    var RankButton = document.createElement("button");
    var aPostButton = document.createElement("a");
    var PostButton = document.createElement("button");
    var aRefreshButton = document.createElement("a");
    var RefreshButton = document.createElement("button");
    WinBox.id = "winBox";
    if(win == true){
            WinText.innerHTML = "You Win";
            WinScore.innerHTML = "Score :"+time+" second";
    }
    else{
            WinText.innerHTML = "You Lose";
    }
    WinText.id = "TextWin";
    PostButton.innerHTML = "Post";
    aPostButton.href = "feed.html";
    RankButton.innerHTML = "Rank";
    aRankButton.href = "ranking.html";
    RefreshButton.innerHTML = "Retry";
    aRefreshButton.href = "gameplay.html";
    WinDiv.appendChild(WinBox);
    WinBox.appendChild(WinText); 
    WinBox.appendChild(WinScore);
    WinBox.appendChild(aRankButton);
    aRankButton.appendChild(RankButton);
    WinBox.appendChild(aPostButton);
    aPostButton.appendChild(PostButton);
    WinBox.appendChild(aRefreshButton);
    aRefreshButton.appendChild(RefreshButton);
}

async function record(){
    let stream = await recordScreen();
    let mimeType = 'video/webm';
    mediaRecorder = createRecorder(stream, mimeType);
    //alert("Start Recording");
}

function stop(){
    mediaRecorder.stop();
    //alert("Recorded");
}

async function recordScreen() {
    return await navigator.mediaDevices.getDisplayMedia({
        audio: true, 
        video: { mediaSource: "screen"}
    });
}

function createRecorder (stream, mimeType) {
  // the stream data is stored in this array
  let recordedChunks = []; 

  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (e) {
    if (e.data.size > 0) {
      recordedChunks.push(e.data);
    }  
  };
  mediaRecorder.onstop = async function () {
    console.log("stop");
     await fetch("/uploadvideo");
     saveFile(recordedChunks);
     recordedChunks = [];
  };
  mediaRecorder.start(200); // For every 200ms the stream data will be stored in a separate chunk.
  return mediaRecorder;
}

function saveFile(recordedChunks){

   const blob = new Blob(recordedChunks, {
      type: 'video/mp4'
    });
    var username = getCookie('username');
    var userID = getCookie('id');
    let filename = username+userID,
    downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `${filename}.mp4`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    URL.revokeObjectURL(blob); // clear from memory
    document.body.removeChild(downloadLink);
}