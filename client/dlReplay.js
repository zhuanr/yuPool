const Downloader = require('./Downloader');
const fs = require('fs');

// playlist.m3u8

var sRawUrl = "http://videows1.douyucdn.cn/live/high_643129820171029200352-upload-2fcd/playlist.m3u8?k=afa224edc45f292a441bdf80f528ac5b&t=5a75cc7e&u=70806189&ct=web&vid=1793798&d=9C9B29EE0C9EA895F06C92FDADC800ED";
var sBaseUrl = "";
var sPlayList = "";
var sBasePath = "E:\\temp\\dyReplay\\";
var sFileName = "playlist.m3u8";
var output = sBasePath + "output.ts";

function parseUrl() {
	var nPos = sRawUrl.indexOf("playlist.m3u8");
	sBaseUrl = sRawUrl.slice(0, nPos);
	sPlayList = sRawUrl.slice(nPos);
	console.log(sBaseUrl);
	console.log(sPlayList);
}

function getPlaylist(sUrl, sFileName, fOnComplete) {
	Downloader.run(sUrl, sFileName, fOnComplete);
}


function onPlaylistComplete() {
	var sPayload = fs.readFileSync(sBasePath + sFileName, 'utf8');
	var aLine = sPayload.split('\n');
	var lineIdx = 0;
	var videoIdx = 0;


	verifyPlayList(aLine);
	aLine = aLine.filter(function(line){
		return line.length > 0 && line[0] != '#';
	});

	function getVideo() {

		if (lineIdx < aLine.length) {
			var line = aLine[lineIdx];
			lineIdx++;
			console.log(line);

			//if (line.length > 0 && line[0] != '#') {
				var sUrl = sBaseUrl + line;
				var sFileName = sBasePath + videoIdx.toString() + ".ts";
				console.log(sFileName);
				console.log('-----------');
				//Downloader.run(sUrl, sFileName, onVideoComplete);
				Downloader.runWriteStream(sUrl, writeStream, onVideoComplete);
				
				videoIdx++;
	
			//} else {
			//	setTimeout(getVideo, 0);
			//}
			

		} else {
			// finished
			writeStream.end();
		}
	} 

	function onVideoComplete(){
		getVideo();
	}


	
	var writeStream = fs.createWriteStream(output, { highWaterMark: 1024 * 1024 });
	getVideo();
}

function verifyPlayList(aList) {
	if (aList[0] != "#EXTM3U") {
		throw "PlayList unexpected";
	}
}

if (sRawUrl && sRawUrl.length > 0) {
	parseUrl();
}
getPlaylist(sBaseUrl + sPlayList, sBasePath + sFileName, onPlaylistComplete);

