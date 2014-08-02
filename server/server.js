var http = require('http');
var url = require('url');

/**
 * Nodeサーバのスタート実処理
 * @param  {[type]} route  [description]
 * @param  {[type]} handle [description]
 * @return {[type]}        [description]
 */
function start(route, handle) {
	// アクセス(リクエスト発生)時のコールバック関数定義
	function onRequest(request, response) {
		var requestParam = '';
		var pathname = url.parse(request.url).pathname;
		console.log('Request for ' + pathname + ' received.');

		// リクエストパラメータを処理
		request.setEncoding('UTF-8');
		request.addListener('data', function(requestParamChunk) {
			requestParam += requestParamChunk;
			console.log('requestParamChunk=' + requestParamChunk);
		});
		request.addListener('end', function(){
			// リクエストパラメータ(URL)に応じてルーティングする
			route(handle, pathname, response, requestParam);
		});
	}
	http.createServer(onRequest).listen(8888);
	console.log('Server has started.');
}

exports.start = start;