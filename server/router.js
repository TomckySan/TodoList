var fs = require('fs'),
		path = require('path');

/**
 * ルーティング実処理
 * @param  {[type]} handle   [description]
 * @param  {[type]} pathname [description]
 * @param  {[type]} response [description]
 * @param  {[type]} request  [description]
 * @return {[type]}          [description]
 */
function route(handle, pathname, response, request) {
	console.log('About to route a request for ' + pathname);
	// パスの拡張子を確認
	if('.js' === path.extname(pathname)) {
		// ディレクトリの構成に応じてパスを設定
		var body = fs.readFileSync('..' + pathname, 'utf-8');
		// HTTPレスポンスヘッダ
		response.writeHead(200, {'Content-Type': 'text/javascript'});
		// レスポンス完了
		response.end(body, 'utf-8');
	}
	else if(typeof handle[pathname] === 'function') {
		// index.jsで設定されたリクエストハンドラを呼び出す
		handle[pathname](response, request);
	}
	else {
		console.log('No request handler found for ' + pathname);
		// HTTPレスポンスヘッダ
		response.writeHead(404, {'Content-Type': 'text/plain'});
		// HTTPレスポンスボディ
		response.write('404 Not found');
		// レスポンス完了
		response.end();
	}
}

exports.route = route;