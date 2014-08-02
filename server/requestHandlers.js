/**
 * リクエストパラメータ(URL)に応じて実行されるメソッド群を記述
 * router.jsを介して呼び出される
 */
var fs = require('fs'),
		pg = require('pg');

var property = require('./property');

/** 接続先DB設定 */
var cconnectionStr = property.getProperty().cconnectionStr; // 'tcp://user:password@xxx.xxx.x.x:port/database'
console.log(cconnectionStr);

/**
 * 初期ページ読込
 * @param  {[type]} response [description]
 * @param  {[type]} postData [description]
 * @return {[type]}          [description]
 */
function start(response, postData) {
	console.log('Request handler \'start\' was called.');
		// 同期的にファイルを読み込む(readFileSync)
	var body = fs.readFileSync('../index.html', 'utf-8');
	response.writeHead(200, {'Content-type': 'text/html'});
	// 下の2行はresponse.end(body);の1行にまとめることができる
	response.write(body);
	response.end();
}

/**
 * DBよりToDoを取得後レスポンスとして返す
 * [getTodo description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function getTodo(res) {
	console.log('getTodo START');
	// PostgreSQL接続
	pg.connect(cconnectionStr, function(err, client) {
		if(err) {
			console.log('connect error...');
		}
		// クエリ発行
		var queryStr = 'select id, todo, done_todo from t_todo order by id asc';
		console.log(queryStr);
		client.query(queryStr, function(err, result) {
			if(err) {
				console.log('query error...');
			}
			else {
				// 取得データをレスポンスとして返す
				res.writeHead(200, {'Content-type': 'application/json'});
				res.end(JSON.stringify(result.rows));
			}
			// クライアントを切断する
			client.end();
		});
	});
}

/**
 * Todoの追加処理
 * [addTodo description]
 * @param {[type]} res [description]
 */
function addTodo(res, postData) {
	console.log('addTodo START');
	// PostgreSQL接続
	pg.connect(cconnectionStr, function(err, client) {
		if(err) {
			console.log('connect error...');
		}
		// アップデート日付作成
		var d = new Date();
		var year  = d.getFullYear();
		var month = d.getMonth() + 1;
		var day   = d.getDate();
		var hour  = ( d.getHours()   < 10 ) ? '0' + d.getHours()   : d.getHours();
		var min   = ( d.getMinutes() < 10 ) ? '0' + d.getMinutes() : d.getMinutes();
		var sec   = ( d.getSeconds() < 10 ) ? '0' + d.getSeconds() : d.getSeconds();
		var dayStr = year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;

		// クエリ発行
		var queryStr = 'insert into t_todo (todo, created_at) values (\'' + postData + '\', \'' + dayStr + '\')';
		console.log(queryStr);
		client.query(queryStr, function(err, result) {
			if(err) {
				console.log('query error...');
			}
			else {
				res.writeHead(200);
				res.end();
			}
			// クライアントを切断する
			client.end();
		});
	});
}

/**
 * Todoの削除処理
 * @param  {[type]} res      [description]
 * @param  {[type]} postData [description]
 * @return {[type]}          [description]
 */
function deleteTodo(res, postData) {
	console.log('deleteTodo START');
	// PostgreSQL接続
	pg.connect(cconnectionStr, function(err, client) {
		if(err) {
			console.log('connect error...');
		}
		// クエリ発行
		var queryStr = 'delete from t_todo where id=' + postData;
		console.log(queryStr);
		client.query(queryStr, function(err, result) {
			if(err) {
				console.log('query error...');
			}
			else {
				res.writeHead(200);
				res.end();
			}
			// クライアントを切断する
			client.end();
		});
	});
}

/**
 * TODO内容の修正
 * @param  {[type]} res      [description]
 * @param  {[type]} postData [description]
 * @return {[type]}          [description]
 */
function updateTodo(res, postData) {
	var postObj = JSON.parse(postData);
	// PostgreSQL接続
	pg.connect(cconnectionStr, function(err, client) {
		if(err) {
			console.log('connect error...');
		}
		// クエリ発行
		var queryStr = 'update t_todo set todo=\''+ postObj.todo +'\' where id=' + postObj.id + '';
		console.log(queryStr);
		client.query(queryStr, function(err, result) {
			if(err) {
				console.log('query error...');
			}
			else {
				res.writeHead(200);
				res.end();
			}
			// クライアントを切断する
			client.end();
		});
	});
}

/**
 * Todoチェック反映処理
 * [changeStateTodo description]
 * @param  {[type]} res [description]
 * @return {[type]}     [description]
 */
function changeStateTodo(res, postData) {
	var postObj = JSON.parse(postData);
	// PostgreSQL接続
	pg.connect(cconnectionStr, function(err, client) {
		if(err) {
			console.log('connect error...');
		}
		// クエリ発行
		var queryStr = 'update t_todo set done_todo=\'' + postObj.doneTodo + '\' where id=' + postObj.id + '';
		console.log(queryStr);
		client.query(queryStr, function(err, result) {
			if(err) {
				console.log('query error...');
			}
			else {
				res.writeHead(200);
				res.end();
			}
			// クライアントを切断する
			client.end();
		});
	});
}

exports.start = start;
exports.getTodo = getTodo;
exports.addTodo = addTodo;
exports.deleteTodo = deleteTodo;
exports.updateTodo = updateTodo;
exports.changeStateTodo = changeStateTodo;
