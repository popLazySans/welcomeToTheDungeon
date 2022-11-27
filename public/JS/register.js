window.onload = pageLoad;

function pageLoad(){
	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	if (urlParams.get("error")==1){
		if (window.location.href.split('/').pop()== "register.html"){
			document.getElementById('errorMsg').innerHTML = "Registration Error!"
		}else{
			document.getElementById('errorMsg').innerHTML = "Confirm incorrect.";
		}
	}
	else if(urlParams.get("error")==2){
		if (window.location.href.split('/').pop()== "register.html"){
			document.getElementById('errorMsg').innerHTML = "Registration Error!"
		}else{
			document.getElementById('errorMsg').innerHTML = "This email already used.";
		}	
	}
}