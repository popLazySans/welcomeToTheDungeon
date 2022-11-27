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
    var level = document.getElementById("levelID");
    level.value = getCookie('rankLevel');
	readData();
}
async function readData(){
	const readData = await fetch("/readranking");
	const showreadData = await readData.json();
	console.log(showreadData);
	showRank(showreadData);
}
function showRank(data){
    var keys = Object.keys(data);
    var contain = document.getElementById("feed-container");
    var level = document.getElementById("levelID");
    let data2 = [];
        for(i=0;i<keys.length;i++){
            if(level.value == data[keys[i]]["level"]){
                data2.push([data[keys[i]]["user"],data[keys[i]]["score"]])
            }
        }
        data2.sort(function(a,b){
            return a[1] - b[1];
        });
        console.log(data2);
        for(i = 0;i<data2.length;i++){
            var text = document.createElement("p");
            text.innerHTML = data2[i][0] + "     "+ data2[i][1];
            contain.appendChild(text);
        }
     

}