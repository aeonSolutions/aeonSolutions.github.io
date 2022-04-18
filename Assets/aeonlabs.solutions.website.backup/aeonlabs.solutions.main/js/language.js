var htmlCode ="";
var ajaxRequest;

function doTranslation(){ 
	var lang="nl";
	var url ="https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={langtotranslate}&hl=en&dt=t&dt=bd&dj=1&source=icon&q={text}";
   htmlCode = eval("document.documentElement.outerHTML");
	var tagsToSearch=[];
	tagsToSearch=Array("<p","<h1","<h2","<h3","<h4","<h5","<h6","<h7","<a");
	for (var index = 0; index < tagsToSearch.length; ++index) {
		var startPos=0;
		
		while (String(htmlCode).indexOf(tagsToSearch[index], startPos)!==-1) {
			var tag_start_pos = String(htmlCode).indexOf( tagsToSearch[index],startPos) -1;
			startPos = String(htmlCode).indexOf(tagsToSearch[index],startPos);			
			tag_start_pos = String(htmlCode).indexOf( ">",startPos);
			startPos = String(htmlCode).indexOf(">",startPos);			
			var tag_end_pos = String(htmlCode).indexOf( "<",startPos) -1;

			//window.alert(tag_start_pos+"---"+tag_end_pos);

			
			
			var sourceText= String(htmlCode).substring(tag_start_pos,tag_end_pos);
			
						//window.alert("Tag:" + tagsToSearch[index] + "sPos:"+tag_start_pos+"ePos:"+tag_end_pos+"|||"+sourceText);

			var url2send= url.replace("{text}", sourceText);
			url2send=url2send.replace("{langtotranslate}",lang);
			var lastOne=false;
			if ((index === tagsToSearch.length-1) && (htmlCode.indexOf(tagsToSearch[index], startPos)!==-1)) {
				lastOne=true;
			}
			AjxSilent(url2send,sourceText, lastOne);
		}
	}
}

function AjxSilent(url,sourceText, lastOne){
	// missing status_ok var init
	url = url + getNoCacheValue(url);
	
	ajaxRequest = getXMLHttpRequest();
	ajaxRequest.onreadystatechange = function(){
										if (ajaxRequest.readyState === 4) {
											if (ajaxRequest.status === 200) {
												var result = JSON.parse(ajaxRequest.responseText);
												window.alert(ajaxRequest.responseText);
												htmlCode= htmlCode.replace(sourceText, result["sentences[0]"]["trans"].ToString());
												if (lastOne) {
													reloadPage();
												}

											}
										}
									};
	
	ajaxRequest.open("GET", url, true);

	
	ajaxRequest.setRequestHeader("Access-Control-Allow-Origin", "https://aeonSolutions.github.io");
    ajaxRequest.setRequestHeader("Content-Type", "text/plain");
    ajaxRequest.setRequestHeader("Pragma", "no-cache");
    ajaxRequest.setRequestHeader("Expires", "Fri, 01 Jan 1990 00:00:00 GMT");
    ajaxRequest.setRequestHeader("Cache-Control", "no-store, no-cache, must-revalidate");
    ajaxRequest.setRequestHeader("X-XSS-Protection", "0");
	

	
	ajaxRequest.send(null); 
}

function getNoCacheValue(url){
	var d = new Date();
	var appendstring = (url.indexOf("?") !== -1) ? "&" : "?";
	var nocachevalue = appendstring + "no-cache=" + d.getTime();
	return nocachevalue;
}

function getXMLHttpRequest(){
	var req;
	
	try{
		// Opera 8.0+, Firefox, Safari
		ajaxRequest = new XMLHttpRequest();
	} catch (e){
		// Internet Explorer Browsers
		try{
			ajaxRequest = new ActiveXObject("Msxml2.XMLHTTP");
		} catch (e) {
			try{
				ajaxRequest = new ActiveXObject("Microsoft.XMLHTTP");
			} catch (e){
				// Something went wrong
				alert("Your browser broke!");
				return false;
			}
		}
	}
	return ajaxRequest;
}
function reloadPage(){
	javascript:document.open('text/html');
	document.write(htmlCode);
	document.close();
}