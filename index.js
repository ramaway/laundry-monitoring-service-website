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
	console.log(res[i]);
	document.getElementById('now_time').textContent = res[i].split('/')[2] + '_' + res[i].split('/')[3] + ':' + res[i].split('/')[4].split('-')[0] + ':' + res[i].split('/')[4].split('-')[1].split('.')[0]
	document.getElementById('slideshow').src = 'https://s3-ap-northeast-1.amazonaws.com/' + res[i]
	if(i < res.length-1) {
		timer = setTimeout(function(){
			runSlideShow(res, i+1)
		}, 100);
	}
}

function filterPhotos(threshold, res){
	return new Promise((resolve, reject) => {
		console.log('threshold: ', threshold);
		var filteredRes = res.keys.filter((key) => {
			var min_sec = key.split('/')[4].split('.')[0].split('-');
			console.log('min_sec: ', min_sec);
			if(parseInt(min_sec[0]) > threshold[0]) {
				return true;
			} else if (parseInt(min_sec[0]) == threshold[0] && parseInt(min_sec[1]) >= threshold[1]) {
				return true;
			} else {
				return false;
			}
		})
		resolve(filteredRes);
	});
}

function toggleStartStop(threshold, token){
	var url = 'https://gcg42ovcg8.execute-api.ap-northeast-1.amazonaws.com/prod/photos';
	var prefix= document.getElementById('now_time').textContent.split(':')[0].replace('_', '/');
	var query = '?prefix=' + prefix
	return getPhotosURL(url + query, token).then((res) => {
		return filterPhotos(threshold, JSON.parse(res)).then((filteredRes) => {
			console.log('filteredRes: ', filteredRes);
			if(filteredRes.length > 0) runSlideShow(filteredRes, 0);
		});
	}).catch((res) => {
		console.log('res: ', res);
		alert(JSON.parse(res).Message)
	});
}

function fetchToken(){
	let token = localStorage.getItem('id_token') || '';
	if(token){
		return token;
	} else {
		alert('You must log in.')
		return null;
	}
}
//date_now
document.getElementById('now_time').textContent = toDisplyaString(new Date());
// ▼ボタンクリックに関数を割り当てる
$('#startstop').on("click", function() {
	let token = fetchToken();
	if(token){
		console.log('clicked button: ', $(this).val());
		if($(this).val() === 'START'){
			var now_time = $('#now_time').text();
			var m_now_time = parseInt(now_time.split('_')[1].split(':')[1]);
			var s_now_time = parseInt(now_time.split('_')[1].split(':')[2]);
			toggleStartStop([m_now_time, s_now_time], token);
			$(this).attr('value', 'STOP');
		} else {
			clearTimeout(timer);
			$(this).attr('value', 'START');
		}
	}
});

document.getElementById('backH').onclick = function(){
	var now_time = $('#now_time').text();
	var m_now_time = parseInt(now_time.split('_')[1].split(':')[1]);
	var s_now_time = parseInt(now_time.split('_')[1].split(':')[2]);
	console.log('now_time: ', now_time);
	console.log('m_now_time: ', m_now_time);
	console.log('s_now_time: ', s_now_time);
	if(m_now_time == 0 && s_now_time == 0){
		return changePhoto(0, -1);
	} else {
		return changePhoto(0, 0)
	}
};
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
