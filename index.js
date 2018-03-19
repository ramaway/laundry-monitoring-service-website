(function() {
	var po = document.createElement('script');
	po.type = 'text/javascript';
	po.async = true;
	po.src = 'https://apis.google.com/js/client:plusone.js';
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(po, s);
})();

function signinCallback(authResult) {
	if (authResult['access_token']) {
		document.getElementById('signinButton').setAttribute('style', 'display: none');
		document.getElementById('revoke').setAttribute('style', 'display: block');
		console.log('authResult[access_token]: ' + authResult['access_token']);
	} else if (authResult['error']) {
		console.log('auth error');
	}
	function disconnectUser() {
		var revokeUrl = 'https://accounts.google.com/o/oauth2/revoke?token=' + authResult['access_token'];
		$.ajax({
			type: 'GET',
			url: revokeUrl,
			async: false,
			contentType: "application/json",
			dataType: 'jsonp'
		})
		.done(function(nullResponse) {
			document.getElementById('signinButton').setAttribute('style', 'display: block');
			document.getElementById('revoke').setAttribute('style', 'display: none');
		})
		.fail(function(e) {
		});
	}
	$('#revokeButton').click(disconnectUser);
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
function getPhotosURL(url){
	return new Promise((resolve, reject) => {
		var request = new XMLHttpRequest();
		request.open('GET', url);
		request.onload = function () {
			if (this.status === 200) {
				resolve (this.response);
			}
		};
		request.send(null);
	});
}
function toggleStartStop(){
	var url = 'https://gcg42ovcg8.execute-api.ap-northeast-1.amazonaws.com/prod/photos';
	var prefix= document.getElementById('now_time').textContent.split(':')[0].replace('_', '/');
	var query = '?prefix=' + prefix
	getPhotosURL(url + query).then((res) => {
		res = JSON.parse(res);
		console.log('res: ', res);
		for(i = 0; i < res.keys.length; i++){
			(function(pram) {
				setTimeout(function() {
					console.log(res.keys[pram]);
					document.getElementById('now_time').textContent = res.keys[pram].split('/')[2] + '_' + res.keys[pram].split('/')[3] + ':' + res.keys[pram].split('/')[4].split('-')[0] + ':' + res.keys[pram].split('/')[4].split('-')[1].split('.')[0]
					document.getElementById('slideshow').src = 'https://s3-ap-northeast-1.amazonaws.com/' + res.keys[pram]
				}, pram * 100);
			})(i);
		};
	});
}
//date_now
document.getElementById('now_time').textContent = toDisplyaString(new Date());
// ▼ボタンクリックに関数を割り当てる
document.getElementById('start').onclick = toggleStartStop;
//document.getElementById('stop').onclick = toggleStartStop;
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
