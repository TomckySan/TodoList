jQuery(function($) {

  // todoの値保持用変数
  var todoText = '';

  // 初期表示
  renderTodoList();

  /**
   * Todo削除ボタン押下時イベント
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  $(document).on('click', 'button.remove', function(event) {
    var param = $(this).attr('class').split(' ')[0].replace('todo-', '');
    $.ajax({
      url: '/deleteTodo',
      type: 'DELETE',
      data: param
    })
    .done(function() {
      console.log("success");
      renderTodoList();
    })
    .fail(function() {
      console.log("error");
    });
  });

  /**
   * 新規Todo追加 - ボタンにより追加を行う
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  $(document).on('click', 'button.insert', function(event) {
    var currentText = $(this).parent().prev().children('.todo-txt').val();
    $.ajax({
      url: '/addTodo',
      type: 'POST',
      data: currentText
    })
    .done(function() {
      console.log('success');
      renderTodoList();
    })
    .fail(function() {
      console.log('error');
    });
  });

  /**
   * Todo押下時にテキストエリアに変更
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  $(document).on('click', 'span.todo-content', function(event) {
    // テキストエリアに変換(input.todo-txt)
    // テキストの内容を保持
    todoText = $(this).text();
    var $li = $(this).parent();
    $li.empty();
    $li.append('<input type="text" class="todo-edit">');
    $li.children('.todo-edit').val(todoText);
    // フォーカスをあてる
    $li.children('.todo-edit').focus();
  });

  /**
   * Todoからフォーカスが外れたときに入力値を保存 - 編集のみ
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  $(document).on('blur', 'input.todo-edit', function(event) {
    // 事前に保持しておいたテキストの内容と比較して、
    // 差異がなければサーバ通信しない
    var currentText = $(this).val();
    if(typeof currentText === 'undefined' || currentText === '') {
      return false;
    }
    var param = {};
    param.id = $(this).parent('td').attr('class').split(' ')[0].replace('todo-', '');
    param.todo = currentText;
    $.ajax({
      url: '/updateTodo',
      type: 'POST',
      data: JSON.stringify(param)
    })
    .done(function() {
      console.log('success');
      renderTodoList();
    })
    .fail(function() {
      console.log('error');
    });
  });

  /**
   * 完了・未完了切替時イベント
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  $(document).on('click', 'input[type=checkbox].todo-check', function(event) {
    var param = {};
    param.id = $(this).val();
    param.doneTodo = $(this).prop('checked');
    $.ajax({
      url: '/changeStateTodo',
      type: 'POST',
      data: JSON.stringify(param)
    })
    .done(function() {
      console.log('success');
    })
    .fail(function() {
      console.log('error');
    });
  });

  /**
   * Todoリスト表示処理
   * @return {[type]} [description]
   */
  function renderTodoList() {
    /**
     * 初期表示時にデータ取得リクエストを飛ばす(取得なのでgetリクエスト)
     * [url description]
     * @type {String}
     */
    $.ajax({
      // node側のrequestHandlersに以下のurlをハンドリングしておく
      url: '/getTodo',
      dataType: 'json', // dataTypeはレスポンスデータに対する指定
    })
    .done(function(res) {
      console.log("success");
      $('#todo-list').empty();
      res.forEach(function(data) {
        // todo消化済みの場合はチェックを付ける
        var checkboxDomString = '';
        if(data.done_todo) {
          checkboxDomString = '<input type="checkbox" value="'+ data.id +'" class="todo-check" checked="checked">';
        }
        else {
          checkboxDomString = '<input type="checkbox" value="'+ data.id +'" class="todo-check">';
        }
        $('#todo-list').append('<tr>' +
                                '<td class="todo-' + data.id + '">' +
                                  checkboxDomString +
                                  '<span class="todo-content">' + data.todo + '</span>' +
                                '</td>' +
                                '<td>' +
                                  '<button class="todo-' + data.id + ' remove">削除</button>' +
                                  '</td>' +
                                '</tr>');
      });
      $('#todo-list').append('<tr><td><input type="text" class="todo-txt"></td><td><button class="insert">追加</button></td></tr>');
    })
    .fail(function() {
      console.log("error");
    });
  }
});