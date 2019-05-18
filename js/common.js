(function() {
  "use strict";

  // ページの最低縦幅を指定
  var setMinHeight = function(){
    var footer = document.getElementsByTagName('footer');
    var footerHeight = footer[0].clientHeight;
    var header = document.getElementsByTagName('header');
    var headerHeight = header[0].clientHeight;
    var winHeight = window.innerHeight;
    var main = document.getElementsByTagName('main');
    main[0].style.minHeight = (winHeight - footerHeight - headerHeight) + 'px';
  }
  setMinHeight();
  window.addEventListener('resize', function(){
    setMinHeight();
  });

  // vue
  var app = new Vue({
    el: '#app',
    data: {
      placeholder: 'やることを追加',
      newItem: '',
      hasError: false,
      confirmAllDelete: false,
      noTodoError: false,
      noDoneError: false,
      todos: [],
    },
    watch: {
      todos: {
        handler: function() {
          localStorage.setItem('todos', JSON.stringify(this.todos));
        },
        deep: true
      }
    },
    mounted: function() {
      var jsonTodos = localStorage.getItem('todos');
      if (!jsonTodos) {
        return
      }
      this.todos = JSON.parse(jsonTodos);
    },
    methods: {
      addItem: function(event) {
        this.hasError = false;
        this.placeholder = 'やることを追加';

        if(this.newItem == '') {
          this.hasError = true;
          this.placeholder = 'やることを入力してください';
          return;
        }
        var todo = {
          item: this.newItem,
          isDone: false,
          confirmDelete: false
        };

        this.todos.push(todo);
        this.newItem = '';
        this.noTodoError = false;
        this.noDoneError = false;
      },
      confirmDelete: function(index){
        this.todos[index].confirmDelete =! this.todos[index].confirmDelete;
      },
      deleteItem: function(index){
        this.todos.splice(index, 1);
        this.noDoneError = false;
      },
      cnfrmAllDltModal: function() {
        if (!this.todos.length) {
          this.noTodoError = true;
          return
        }

        var todoDone = this.todos.filter(function(todo) {
          return todo.isDone;
        });

        if (!todoDone.length) {
          this.noDoneError = true;
          return
        }

        this.confirmAllDelete =! this.confirmAllDelete;
        this.noTodoError = false;
        this.noDoneError = false;
      },
      removeError: function(){
        this.noTodoError = false;
        this.noDoneError = false;
      },
      purge: function() {
        this.todos = this.todos.filter(function(todo) {
          return !todo.isDone;
        });
        this.confirmAllDelete =! this.confirmAllDelete;
      }
    }
  })

})();
