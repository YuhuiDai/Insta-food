
function addDataToPage(instagramData){
	var htmlString = '';
	for (i=0; i<instagramData.length; i++) {
		var imageURL = instagramData[i].images.low_resolution.url;
		var imageLink = instagramData[i].link;
		console.log(imageLink);
		//create html
		htmlString +='<div class="box"><a href=' +imageLink +' target="_blank"><img src=' + imageURL + ' /></a></div>';
	}
	$('#container').html(htmlString);
}


//create multiple instagram hashtags
function multiHashtags(objList, newhashtag) {
	var newDataList = [];
	for (var i = 0; i < objList.length; i++) {
		for (var j = 0; j < objList[i].tags.length; j++) {
			if (objList[i].tags[j] == newhashtag) {
				console.log(objList[i]);
				newDataList.push(objList[i]);
			}
		}
	}
	console.log(newDataList);
	if (newDataList.length === 0){
		console.log("nothing in the newlist");
		return newDataList;
	} else {
		return newDataList;
	}
	
}

//IF IT DOES NOT WORK
function alternativeDisplay() {
	var htmlString = "<div class='errormessage'><h1>Oops, sorry...Are you extraterrestrial?</h1></div>";
	htmlString += "<div class='errormessage'><h1>We cannot find your city...</h1></div>";
	$("#container").html(htmlString);
}
//food type generator
function foodGenerator(timeOftheDay) {
	if (timeOftheDay<10 && timeOftheDay>5) {
		return "healthybreakfast";
	} else if (timeOftheDay==10) {
		return "healthybrunch";
	} else if (timeOftheDay<=15 && timeOftheDay>10) {
		return "healthylunch";
	} else if (timeOftheDay<18 && timeOftheDay>15) {
		return "healthyafternoontea";
	} else if (timeOftheDay<22 && timeOftheDay>=18) {
		return "gratitude";
	} else {
		return "healthymidnightsnack";
	}
}

var requestCounter = 0;
//instagram pagination retrieval
function getMoreInsta(theData, food){
	
	requestCounter++;
	console.log(requestCounter);
	if (requestCounter === 10){
		console.log("No more!!!!");
		alert("Sorry!");
	}
	else{
		var nextUrl=theData.pagination.next_url;
		console.log('************');
		console.log(nextUrl);
		console.log('************');
		$.ajax({
			url: nextUrl,
			type: "GET",
			dataType: 'jsonp',
			error: function(data){
				console.log('oops');
			},
			success: function(data){
				console.log('great');
				console.log(data);
				
				//return data.data;
				var tempData = data.data;
				console.log(tempData);
				//while (instagramData.length<10) {

				var newlist= multiHashtags(tempData,food);
				console.log('passed multiHashtags again');
				if (newlist.length === 0){
					console.log("Still nothing. Making another request...");
					getMoreInsta(data, food);
				}
				else{
					instagramDataList = instagramDataList.concat(newlist);
					if (instagramDataList.length <  10){
						getMoreInsta(data, food);
					}
					else{
						addDataToPage(instagramDataList);
					}
				}
			}
		});
	}
}

var instagramDataList;

//Instagram API Request
function getInstagramData(searchTerm,food){
	var myAccessToken = '2203178508.ab7fccd.e1871e8c6e374a9d870e9fce603c0de6';
	var instagramURL = 'https://api.instagram.com/v1/tags/'+searchTerm+'/media/recent?access_token=' + myAccessToken+'&count=33';
	
	$.ajax({
		url: instagramURL,
		type: 'GET',
		dataType: 'jsonp',
		error: function(data){
			console.log("Oh no");
		},
		success: function(data){
			console.log("WooHoo Instagram");
			//console.log(data);
			var instagramRawData = data.data;
			var newlist=multiHashtags(instagramRawData,food);
			instagramDataList = newlist;
			console.log(instagramDataList.length);

			if (instagramDataList.length < 10){
				getMoreInsta(data, food);
			}
			else{
				addDataToPage(instagramDataList);
			}
		}
	});
}

function searchLocalTime(city) {
	console.log(city);

	var finalURL = "http://api.worldweatheronline.com/free/v2/tz.ashx?key=83fe310cbd37c04a247f5f1ea1488&q="+city+"&format=json";
	$.ajax({
		url: finalURL,
		type: "GET",
		dataType: "jsonp",
		error: function(data){
			console.log("We got problems.");
			console.log(data);
		},
		success:function(data){
			console.log("WooHoo!");
			console.log(data);
			if (data.data.error){
				alternativeDisplay();
				$("#theInput").val('');
			}
			else {
				var stringLocalTime = data.data.time_zone[0].localtime;
				var listTime = stringLocalTime.split(" ");
				console.log(listTime);
				var exactTime = listTime[1];
				var listTime2 = exactTime.split(":");
				var exactHour = listTime2[0];
				var finalHour = parseInt(exactHour,10);
				console.log(finalHour);
				
				var cityname = city.split(" ").join("");
				console.log(cityname);
				var food = foodGenerator(finalHour);
				var tagTerm= cityname+"food";
				console.log(tagTerm);
				getInstagramData(tagTerm,food);
			}
		}

	});
}

$(document).ready(function(){

	$ ("#theButton").click(function(){
		var theInputValue = $("#theInput").val();
		console.log(theInputValue);
		
		$ (".theSearchResult").html('');
		searchLocalTime(theInputValue);
	} );

} );


