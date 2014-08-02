/**
 * サーバ起動とリクエストハンドリング設定を記述する
 */
var server = require('./server');
var router = require('./router');
var requestHandlers = require('./requestHandlers');

var handle = {};
// URLパラメータと関数をマッピングする
handle['/'] = requestHandlers.start;
handle['/getTodo'] = requestHandlers.getTodo;
handle['/addTodo'] = requestHandlers.addTodo;
handle['/deleteTodo'] = requestHandlers.deleteTodo;
handle['/updateTodo'] = requestHandlers.updateTodo;
handle['/changeStateTodo'] = requestHandlers.changeStateTodo;

// サーバ起動
server.start(router.route, handle);
