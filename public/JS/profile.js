// check ว่ามีการ set cookies หรือยังถ้ามีจะไปยัง feed.html แต่ถ้าไม่มีจะกลับไปที่ login.html
function checkCookie(){
	var username = "";
	if(getCookie("username")==false){
		window.location = "login.html";
	}
}

checkCookie();
window.onload = pageLoad;

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
	//document.getElementById('postbutton').onclick = getData;

	document.getElementById('displayPic').onclick = fileUpload;
	document.getElementById('fileField').onchange = fileSubmit;
	document.getElementById('changeNameButton').onclick = selectName;
	var username = getCookie('username');

	document.getElementById("username").innerHTML = username;
	console.log(getCookie('img'));
	showImg('pic/'+getCookie('img'),"profile");
	//readPost();
}

function getData(){
	var msg = document.getElementById("textmsg").value;
	document.getElementById("textmsg").value = "";
	writePost(msg);
}

function fileUpload(){
	document.getElementById('fileField').click();
}

function fileSubmit(){
	document.getElementById('formId').submit();
}
function selectName(){
	var newNameBox = document.getElementById('username');
	var tempName = document.createElement("input");
	tempName.type = "text";
	tempName.value = newNameBox.innerHTML;
	tempName.id = "newusername";
	tempName.name = "newusername"
	var tempSubmit = document.createElement("input");
	tempSubmit.type = "submit";
	tempSubmit.value = "Change Name";
	newNameBox.innerHTML = "";
	newNameBox.appendChild(tempName);
	newNameBox.appendChild(tempSubmit);

}
// แสดงรูปในพื้นที่ที่กำหนด
function showImg(filename,id){
	if (filename !==""){
		var showpic = document.getElementById('displayPic');
		showpic.innerHTML = "";
		var temp = document.createElement("img");
		temp.src = filename;
		temp.id = id;
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
	const response = await fetch("/writePost", {
		method: "POST",
		headers: {
			'Accept': 'application/json',
			'Content-type': 'application/json'
		},
		body: JSON.stringify({
			user: username,
			message: msg
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

		var temp = document.createElement("div");
		temp.className = "newsfeed";
		divTag.appendChild(temp);
		var temp1 = document.createElement("div");
		temp1.className = "postmsg";
		temp1.innerHTML = data[keys[i]]["message"];
		temp.appendChild(temp1);
		var temp1 = document.createElement("div");
		temp1.className = "postuser";
		
		temp1.innerHTML = "Posted by: "+data[keys[i]]["user"];
		temp.appendChild(temp1);
		
	}
}