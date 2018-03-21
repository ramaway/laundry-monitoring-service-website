function onSignIn(googleUser) {
	var id_token = googleUser.getAuthResponse().id_token;
	localStorage.setItem('id_token', id_token);
	console.log('ID TOKEN: ', id_token);

	var profile = googleUser.getBasicProfile();
	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	console.log('Name: ' + profile.getName());
	console.log('Image URL: ' + profile.getImageUrl());
	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
	document.getElementById('signinButton').setAttribute('style', 'display: none');
	document.getElementById('signoutButton').setAttribute('style', 'display: block');
};

function signOut() {
	var auth2 = gapi.auth2.getAuthInstance();
	auth2.signOut().then(function () {
		console.log('User signed out.');
		document.getElementById('signinButton').setAttribute('style', 'display: block');
		document.getElementById('signoutButton').setAttribute('style', 'display: none');
		localStorage.removeItem('id_token');
	});
}


// 1桁の数字を0埋めで2桁にする
var toDoubleDigits = function(num) {
	num += "";
	if (num.length === 1) {
		num = "0" + num;
	}
	return num;
};
function toDisplyaString(date){
	console.log('date: ', date);
	var yyyy = date.getFullYear();
	var mm = toDoubleDigits(date.getMonth() + 1);
	var dd = toDoubleDigits(date.getDate());
	var hh = toDoubleDigits(date.getHours());
	var mi = toDoubleDigits(date.getMinutes());
	var sc = toDoubleDigits(date.getSeconds());
	console.log('date_now: ', yyyy + '-' + mm + '-' + dd + '_' + hh  + ':' + mi + ':' + sc);
	return yyyy + '-' + mm + '-' + dd + '_' + hh  + ':' + mi + ':' + sc;
}
function changePhoto(d, h){
	var v = document.getElementById('now_time').textContent;
	console.log('v: ', v);
	document.getElementById('now_time').textContent = toDisplyaString(new Date(parseInt(v.split('_')[0].split('-')[0]), parseInt(v.split('_')[0].split('-')[1])-1, parseInt(v.split('_')[0].split('-')[2])+d, parseInt(v.split('_')[1].split(':')[0])+h))
}
// function changeToPrePhoto(d, h){
// 	var v = document.getElementById('now_time').textContent;
// 	document.getElementById('now_time').textContent = toDisplyaString(new Date(v.split('_')[0].split('-')[0], v.split('_')[0].split('-')[1]-1, v.split('_')[0].split('-')[2]+d, v.split('_')[1].split(':')[0]+h))
// }
// function changeToNextPhoto(d, h){
// 	var v = document.getElementById('now_time').textContent;
// 	document.getElementById('now_time').textContent = toDisplyaString(new Date(v.split('_')[0].split('-')[0], v.split('_')[0].split('-')[1]-1, v.split('_')[0].split('-')[2]+d, v.split('_')[1].split(':')[0]+h))
// }
function getPhotosURL(url, token){
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.open('GET', url);
		request.setRequestHeader('authorization', 'Bearer '+ token)
		request.onload = function () {
			if (this.status === 200) {
				resolve (this.response);
			}
			else if (this.status === 403) {
				reject (this.response);
			}
			else {
				reject (this.response);
			}
		};
		request.send(null);
	});
}

var timer;
function runSlideShow(res, i){
	console.log(res.keys[i]);
	document.getElementById('now_time').textContent = res.keys[i].split('/')[2] + '_' + res.keys[i].split('/')[3] + ':' + res.keys[i].split('/')[4].split('-')[0] + ':' + res.keys[i].split('/')[4].split('-')[1].split('.')[0]
	document.getElementById('slideshow').src = 'https://s3-ap-northeast-1.amazonaws.com/' + res.keys[i]
	if(i < res.keys.length-1) {
		timer = setTimeout(function(){
			runSlideShow(res, i+1)
		}, 100);
	}
}

function toggleStartStop(){
	const token = localStorage.getItem('id_token') || '';
	if(token){
		var url = 'https://gcg42ovcg8.execute-api.ap-northeast-1.amazonaws.com/prod/photos';
		var prefix= document.getElementById('now_time').textContent.split(':')[0].replace('_', '/');
		var query = '?prefix=' + prefix
		getPhotosURL(url + query, token).then((res) => {
			res = JSON.parse(res);
			console.log('res: ', res);
			if(res.keys.length > 0) runSlideShow(res, 0);
		}).catch((res) => {
			console.log('res: ', res);
			alert(JSON.parse(res).Message)
		});
	} else {
		alert('You must log in.')
	}
}
//date_now
document.getElementById('now_time').textContent = toDisplyaString(new Date());
// ▼ボタンクリックに関数を割り当てる
document.getElementById('start').onclick = toggleStartStop;
//document.getElementById('stop').onclick = toggleStartStop;
$('#stop').click(function() {
	console.log('click stop button');
	clearTimeout(timer);
});
document.getElementById('backH').onclick = function(){changePhoto(0, -1)};
document.getElementById('backD').onclick = function(){changePhoto(-1, 0)};
document.getElementById('backW').onclick = function(){changePhoto(-7, 0)};
document.getElementById('nextH').onclick = function(){changePhoto(0, 1)};
document.getElementById('nextD').onclick = function(){changePhoto(1, 0)};
document.getElementById('nextW').onclick = function(){changePhoto(7, 0)};

// added for tmp
function Base64ToImage(base64img, callback) {
	console.log('hoge1');
	var img = new Image();
	img.onload = function() {
		console.log('hoge2');
		callback(img);
	};
	console.log('hoge3');
	img.src = base64img;
	console.log('hoge4');
}
