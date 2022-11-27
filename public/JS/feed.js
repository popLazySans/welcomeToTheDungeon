// check ว่ามีการ set cookies หรือยังถ้ามีจะไปยัง feed.html แต่ถ้าไม่มีจะกลับไปที่ login.html
function checkCookie(){
	var username = "";
	if(getCookie("username")==false){
		window.location = "login.html";
	}
}

checkCookie();
window.onload = pageLoad;
var likeID;
function getCookie(name){
	var value = "";
	try{
		value = document.cookie.split("; ").find(row => row.startsWith(name)).split('=')[1]
		return value
	}catch(err){
		return false
	} 
}

function pageLoad(){
	document.getElementById('postButton').onclick = getData;
	//document.getElementById('postButton2').onclick = getComment;
	document.getElementById('postPic').onclick = fileUpload;
	document.getElementById('fileField').onchange = fileSubmit;
	
	var username = getCookie('username');
	var score = getCookie('score');
	var img = getCookie('img');
	var level = getCookie('level');
	var video = getCookie('video');
	document.getElementById("username").innerHTML = username;
	document.getElementById("score").innerHTML = "Score : " + score;
	document.getElementById("level").innerHTML = "Level : " +level;
	var pic = document.createElement("img");
	pic.src = 'pic/' + img;
	pic.id = "displayPic";
	var vid = document.createElement("video");
	vid.controls = true;
	vid.width = "495";
	vid.height = "270";
	var soure1 = document.createElement("source");
	soure1.src = 'pic/' +video;
	soure1.type = "video/mp4";
	document.getElementById('postPic').appendChild(vid);
	vid.appendChild(soure1);
	document.getElementById("displayPic2").appendChild(pic);
	console.log(getCookie('img'));
	readPost();
	// var likeButton = document.getElementById("likeButton");
	// likeID = likeButton.name;
	// likeButton.onclick = IlikeIt;
	// console.log(likeID);
}

function getData(){
	var msg = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	writePost(msg);
}
// function getComment(){
// 	var msg = document.getElementById("postMsgID").value;
// 	document.getElementById("postMsgID").value = "";
// 	writeComment(msg);
// }

function fileUpload(){
	document.getElementById('fileField').click();
}

function fileSubmit(){
	document.getElementById('formId').submit();
}

// แสดงรูปในพื้นที่ที่กำหนด
function showImg(filename){
	if (filename !==""){
		var showpic = document.getElementById('displayPic');
		showpic.innerHTML = "";
		var temp = document.createElement("img");
		temp.src = filename;
		showpic.appendChild(temp);
	}
}

// complete it
async function readPost(){
	const readMsg = await fetch("/readPost");
	const showreadMsg = await readMsg.json();
	console.log(showreadMsg);
	showPost(showreadMsg);
}

// complete it
async function writePost(msg){
	var username = getCookie('username');
	var score = getCookie('score');
	var img = getCookie('img');
	var lev = getCookie('level');
	var video = getCookie('video');
	const response = await fetch("/writePost", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			user: username,
			message: msg,
			score : score,
			img : img,
			level : lev,
			video : video
		})
	});
	const writeMsg = await response.json();
	console.log(writeMsg);
	readPost();
	//showPost(writeMsg);
}

// แสดง post ที่อ่านมาได้ ลงในพื้นที่ที่กำหนด
function showPost(data){
	var keys = Object.keys(data);
	var divTag = document.getElementById("feed-container");
	divTag.innerHTML = "";
	for (var i = keys.length-1; i >=0 ; i--) {
		var postTemp = document.createElement("div");
		postTemp.className = "postID";
		divTag.appendChild(postTemp);
		var headerPost = document.createElement("div");
		headerPost.className = "headerPost";
		postTemp.appendChild(headerPost);
		var displayPic = document.createElement("div");
		//displayPic.id = "displayPic";
		headerPost.appendChild(displayPic);
		var img = document.createElement("img");
		img.src = 'pic/'+data[keys[i]]["img"];
		img.id = "displayPic";
		displayPic.appendChild(img);
		var h3 = document.createElement("h3");
		headerPost.appendChild(h3);
		var username = document.createElement("div");
		var score = document.createElement("div");
		var description = document.createElement("div");
		var level = document.createElement("div");
		username.id = "username";
		score.id = "score";
		description.id = "description";
		level.id = "level";
		username.innerHTML = data[keys[i]]["user"];
		score.innerHTML = "Score : "+ data[keys[i]]["score"];
		level.innerHTML = "Level : "+data[keys[i]]["level"];
		description.innerHTML = data[keys[i]]["message"];
		h3.appendChild(username);
		h3.appendChild(score);
		h3.appendChild(level);
		h3.appendChild(description);
		var postPic = document.createElement("div");
		postPic.id = "postPic";
		headerPost.appendChild(postPic);
		var video = document.createElement("video");
		var source = document.createElement("source");
		video.controls = true;
		video.width = "495";
		video.height = "270";
		source.src = "pic/"+data[keys[i]]["video"];
		postPic.appendChild(video);
		video.appendChild(source);
		var button_container = document.createElement("div");
		var form = document.createElement("form");
		form.action = "/like";
		form.method = "post";
		form.id = "post"+data[keys[i]]["id"];
		form.acceptCharset = "utf-8";
		button_container.appendChild(form);
		var inputText =document.createElement("input");
		inputText.type = "text";
		inputText.name = "Boxid";
		inputText.id = "Boxid";
		inputText.value = data[keys[i]]["id"];
		inputText.hidden = true;
		form.appendChild(inputText);
		var form2 = document.createElement("form");
		form2.action = "/comment";
		form2.method = "post";
		form2.id = "commend"+data[keys[i]]["id"];
		form2.acceptCharset = "utf-8";
		button_container.appendChild(form2);
		var inputText2 =document.createElement("input");
		inputText2.type = "text";
		inputText2.name = "Boxid2";
		inputText2.id = "Boxid2";
		inputText2.value = data[keys[i]]["id"];
		inputText2.hidden = true;
		form2.appendChild(inputText2);
		var likeCount = document.createElement("h3");
		var likebutton = document.createElement("input");
		var commentbutton = document.createElement("button");
		button_container.className = "commentButton-container";
		likeCount.className = "likeButton";
		likeCount.innerHTML = data[keys[i]]["likes"] + " Likes";
		likebutton.type = "submit";
		likebutton.className = "likeButton";
		likebutton.id = "likeButton";
		likebutton.name = data[keys[i]]["id"];
		likebutton.value = "Like";
		commentbutton.id = "commentButton";
		commentbutton.innerHTML = "Comment";
		postTemp.appendChild(button_container);
		form.appendChild(likeCount);
		form.appendChild(likebutton);
		form2.appendChild(commentbutton);
		if(data[keys[i]]["commentactive"] == 1){
			showChatbox(data,keys,i,postTemp);
		}

		// temp.appendChild(temp1);
		// var temp1 = document.createElement("div");
		// temp1.className = "postuser";
		
		// temp1.innerHTML = "Posted by: "+data[keys[i]]["user"];
		// temp.appendChild(temp1);
		
	}
	
}
function showChatbox(data,keys,i,postTemp){
	var commendContainer = document.createElement("div");
	commendContainer.className = "comment-container";
	var form3 = document.createElement("form");
	form3.action = '/writecomment';
	form3.method = "post";
	form3.id = "postcomment"+data[keys[i]]["id"];
	form3.acceptCharset = "utf-8";
	postTemp.appendChild(commendContainer);
	commendContainer.appendChild(form3);
	var inputText3 =document.createElement("input");
		inputText3.type = "text";
		inputText3.name = "Boxid3";
		inputText3.id = "Boxid3";
		inputText3.value = data[keys[i]]["id"];
		inputText3.hidden = true;
		form3.appendChild(inputText3);
	var inputText4 =document.createElement("input");
		inputText4.type = "text";
		inputText4.name = "Boxname";
		inputText4.id = "Boxname";
		inputText4.value = getCookie('username');
		inputText4.hidden = true;
		form3.appendChild(inputText4);
	var inputText5 =document.createElement("input");
		inputText5.type = "text";
		inputText5.name = "Boximg";
		inputText5.id = "Boximg";
		inputText5.value = getCookie('img');
		inputText5.hidden = true;
		form3.appendChild(inputText5);
	
	var chatBox = document.createElement("div"); 
	var inputMsg = document.createElement("input");
	var postButton = document.createElement("input");

	chatBox.id = "chatbox"+data[keys[i]]["id"];
	inputMsg.name = "postMsg";
	inputMsg.type = "text";
	inputMsg.id = "postMsg";
	inputMsg.size = "63";
	postButton.type = "submit";
	postButton.id = "postButton2";
	postButton.value = "Post";
	//postButton.type = "button";
	//postButton.innerHTML = "Post";
	
	form3.appendChild(chatBox);
	form3.appendChild(inputMsg);
	form3.appendChild(postButton);
	readComment(data[keys[i]]["id"]);
}
function showComment(keyData,showreadMsg){
	var keys = Object.keys(showreadMsg);
	for(i=0;i<keys.length;i++){
		if(showreadMsg[keys[i]]["post"]==keyData){
		var chatBox = document.getElementById("chatbox"+keyData);
		var pic = document.createElement("img");
		pic.src = "pic/"+showreadMsg[keys[i]]["img"];
		pic.id = "displayPic";
		var name = document.createElement("h3");
		name.innerHTML = showreadMsg[keys[i]]["user"]+" : "+showreadMsg[keys[i]]["message"];
		chatBox.appendChild(pic);
		chatBox.appendChild(name);
		}
	}
	
}
async function readComment(keyData){
	const readMsg = await fetch("/readComment");
	const showreadMsg = await readMsg.json();
	console.log(showreadMsg);
	showComment(keyData,showreadMsg);
}
// async function writeComment(msg){
// 	var username = getCookie('username');
// 	var img = getCookie('img');
// 	const response = await fetch("/writeComment", {
// 		method: "POST",
// 		headers: {
// 			'Accept': 'application/json',
// 			'Content-type': 'application/json'
// 		},
// 		body: JSON.stringify({
// 			user: username,
// 			message: msg,
// 			img : img
		
// 		})
// 	});
// 	const writeMsg = await response.json();
// 	console.log(writeMsg);
// 	readComment();
// 	//showPost(writeMsg);
// }
