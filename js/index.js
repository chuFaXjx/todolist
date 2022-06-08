let todolist = [
  {
    title: "Jessica",
    isLocked: true,
    todos: [
      {
        desc: "吃饭",
        isDone: false,
      },
      {
        desc: "睡觉",
        isDone: false,
      },
      {
        desc: "打豆豆",
        isDone: true,
      },
    ],
  },
  {
    title: "Mark",
    isLocked: false,
    todos: [
      {
        desc: "吃饭",
        isDone: true,
      },
      {
        desc: "睡觉",
        isDone: false,
      },
      {
        desc: "打豆豆",
        isDone: false,
      },
    ],
  },
]; 
let currentIndex = 0;
renderMenuItem()
// 根据todolist的数据来生成menuItem
function renderMenuItem() {
    todolist.forEach(function (menuItemObj, idx) {
        let menuItemDiv = (`<div class="menu-item  data-index= ${idx} ></div>`)
        if (idx == currentIndex) {
            $(menuItemDiv).addClass('menuItem-active')
        }

        let menuLeftIcon = (`<span class="glyphicon menu-left-icon"></span>`)
        if (menuItemObj.isLocked) {
            $(menuLeftIcon).addClass("glyphicon-lock");
        } else {
            $(menuLeftIcon).addClass("glyphicon-pencil");
        }

        let noDoneArr = menuItemObj.todos.filter(function (todoObj) {
            return todoObj.isDone == false;
        });

        let menuItemTitle = (`<span class="menuTitle">${menuItemObj.title}</span>`)

        let menuItemBadge = (`<span class="badge menu-right-badge">${noDoneArr.length}</span>`)
        if (idx == currentIndex) {
            $(menuItemBadge).addClass("active-badge");
        }
        $('.menu').on('click', 'div', function (i, v) {
          currentIndex = i
          
            $('.menu-item').removeClass('menuItem-active')
            $(this).addClass('menuItem-active')
            $('.menu-right-badge').removeClass('active-badge')
            //$('.menu-right-badge')[i].addClass("active-badge")
        })
        $(menuItemDiv).append($(menuLeftIcon));
        $(menuItemDiv).append($(menuItemTitle));
        $(menuItemDiv).append($(menuItemBadge));
        $(menuItemDiv).insertBefore($('#addTodo'))
    })
}

    
 