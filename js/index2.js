/* let todolist = [
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
]; */
// 重新定义一个数组 用来保存数据
let todolist = [];
//如果浏览器存储有数据 就加载进来
if (localStorage.getItem('todolist')) {
  todolist = JSON.parse(localStorage.getItem('todolist'))
}
// 获取左侧菜单menu的盒子
let menuBox = document.querySelector(".menu");
// 获取添加按钮
let addMenuItemBtn = document.getElementById("addTodo");
// 获取头部的title
let headerTitle = document.getElementById("title");
// 获取头部title的徽标
let headerBadge = document.getElementById("title-badge");
// 获取头部的小锁
let headerLock = document.getElementById("lock");
// 获取todos的容器
let todoItemWrapper = document.querySelector(".todoItemWrapper");
let addTodoInp = document.getElementById("addTodoInp");
// 获取头部的删除按钮
let headerRemoveBtn = document.getElementById("remove");
// 获取右侧头部的容器
let rightHeaderWrapper = document.querySelector(".header");
// 获取右侧头部title的容器
let rightTitleBox = document.querySelector('.titleBox')
// 获取右侧头部title编辑框的容器
let rightTitleEditer = document.querySelector('.title-editer')
// 获取右侧头部title编辑框的input
let rightTitleInput = document.querySelector('#title-input')
// 获取右侧头部title编辑框的取消按钮
let cancel = document.querySelector('#cancel')
// 定义currentIndex变量，来保存当前被选中的menuItem，默认选中第一个menuItem，所以我们这个值为0
let currentIndex = localStorage.getItem('currentIndex') || 0;

renderMenuItem();// 根据todolist的数据来生成menuItem
renderTodos();// 根据todolist的数据来生成右侧的todo

// 实现头部的删除功能
headerRemoveBtn.onclick = function () {
  // 从todolist中删除指定的todoItem
  todolist.splice(currentIndex, 1);
  // 来修改 currentIndex 
  if (currentIndex > 0) {
    currentIndex--;
    localStorage.setItem('currentIndex', currentIndex)
  }
  // 重新渲染左侧菜单
  renderMenuItem();
  // 重新渲染右侧的内容区
  renderTodos();
  localStorage.setItem('todolist', JSON.stringify(todolist))
};

// 实现新增功能
addMenuItemBtn.onclick = function () {
  // 1、创建一个描述menuItem的对象，添加到 todolist 数组中
  let newTodoObj = {
    title: "newList",
    isLocked: false,
    todos: [],
  };
  todolist.push(newTodoObj);
  // 2、修改 currentIndex 当前被选中的是todolist的最后一项
  currentIndex = todolist.length - 1;
  localStorage.setItem('currentIndex', currentIndex)
  // 3、创建一个新的menuItem，并且添加到新增按钮的前面
  //  重新渲染左侧菜单 右侧菜单
  renderMenuItem();
  renderTodos();
  localStorage.setItem('todolist', JSON.stringify(todolist))
};

// 给头部的小锁绑定点击事件，来切换锁定状态
headerLock.onclick = function () {
  // 1、修改todolist里面当前被激活的menuItem的 isLocked属性
  todolist[currentIndex].isLocked = !todolist[currentIndex].isLocked;
  // 2、重新渲染右侧的内容区
  renderTodos();
  // 3、修改menuItem左侧的图标
  renderMenuItem();
  localStorage.setItem('todolist', JSON.stringify(todolist))
};

// 右侧菜单输入框输入功能
addTodoInp.onkeyup = function (e) {
  // 1、创建一个新的todos对象保存用户输入，添加进todolist数组里边
  if (e.keyCode == 13 && this.value) {
    let todosObj = {
      desc: this.value,
      isDone: false,
    }
    todolist[currentIndex].todos.push(todosObj)
    // 2、遍历重新生成右侧的todo
    renderMenuItem()
    renderTodos()
    // 重新将输入框变成空
    this.value = ''
    localStorage.setItem('todolist', JSON.stringify(todolist))
  }
}

// 根据todolist的数据来生成menuItem
function renderMenuItem() {
  // 先清空menuItem
  let menuItemList = document.querySelectorAll(".menu-item");
  for (let i = 0; i < menuItemList.length - 1; i++) {
    menuItemList[i].remove();
  }

  // 再遍历创建menuItem
  todolist.forEach(function (menuItemObj, idx) {
    let menuItemDiv = document.createElement("div");
    menuItemDiv.classList.add("menu-item");
    // 如果idx等于currentIndex，就说明我们这个 menuItemDiv 被选中了
    if (idx == currentIndex) {
      menuItemDiv.classList.add("menuItem-active");
    }
    // 给menuItemDiv设置自定义属性
    menuItemDiv.setAttribute("data-index", idx);

    // 创建menuItem左侧小图标
    let menuLeftIcon = document.createElement("span");
    menuLeftIcon.classList.add("glyphicon", "menu-left-icon");
    // 根据当前menuItem是否锁定状态，来动态添加Icon图标
    if (menuItemObj.isLocked) {
      menuLeftIcon.classList.add("glyphicon-lock");
    } else {
      menuLeftIcon.classList.add("glyphicon-pencil");
    }
    
    // 创建menuItem 的标题标签
    let menuItemTitle = document.createElement("span");
    menuItemTitle.classList.add("menuTitle");
    // 设置标题
    menuItemTitle.innerText = menuItemObj.title;

    // 创建徽标标签
    let menuItemBadge = document.createElement("span");
    menuItemBadge.classList.add("badge", "menu-right-badge");
    if (idx == currentIndex) {
      menuItemBadge.classList.add("active-badge");
    }
    // 统计徽标的数字
    let noDoneArr = menuItemObj.todos.filter(function (todoObj) {
      return todoObj.isDone == false;
    });
    menuItemBadge.innerText = noDoneArr.length;
    
    // 给每一个 menuItemDiv 绑定点击事件，点击的时候来切换右侧的内容
    menuItemDiv.onclick = function () {
      // 动态修改当前被激活的menuItem的索引
      currentIndex = this.getAttribute("data-index");
      localStorage.setItem('currentIndex', currentIndex)
      // 1、切换menuItem被激活的样式
      let menuItemList = document.querySelectorAll(".menu-item");
      for (let i = 0; i < menuItemList.length - 1; i++) {
        menuItemList[i].classList.remove("menuItem-active");
      }

      // 2、切换menuItem的徽标的被激活的样式
      let menuItemBadgeList = document.querySelectorAll(".menu-right-badge");
      menuItemBadgeList.forEach(function (badge) {
        badge.classList.remove("active-badge");
      });
      menuItemBadgeList[currentIndex].classList.add("active-badge");

      this.classList.add("menuItem-active");

      // 2、切换右侧展示的内容
      renderTodos();
    };

    // 拼装menuItem
    menuItemDiv.appendChild(menuLeftIcon);
    menuItemDiv.appendChild(menuItemTitle);
    menuItemDiv.appendChild(menuItemBadge);
    // 将menuItemDiv插入到新增按钮的前面
    menuBox.insertBefore(menuItemDiv, addMenuItemBtn);
  });
}

// 根据todolist的数据来生成右侧的todo
function renderTodos() {
  // 没有数据的时候
  if (todolist.length <= 0) {
    rightHeaderWrapper.style.display = "none";
    todoItemWrapper.style.display = "none";
    return;
  } else {
    // 有数据的情况
    rightHeaderWrapper.style.display = "block";
    todoItemWrapper.style.display = "block";
  }

  // 获取左侧菜单被激活的徽标
  let menuItemActiveBadge = document.getElementsByClassName("active-badge")[0];

  // 修改右侧头部的标题
  headerTitle.innerText = todolist[currentIndex].title;
  // 修改右侧头部的徽标数值
  headerBadge.innerText = menuItemActiveBadge.innerText;

  // 动态渲染头部小锁的图标
  if (todolist[currentIndex].isLocked) {
    headerLock.classList.remove("glyphicon-pencil");
    headerLock.classList.add("glyphicon-lock");
    addTodoInp.disabled = true;
  } else {
    headerLock.classList.remove("glyphicon-lock");
    headerLock.classList.add("glyphicon-pencil");
    addTodoInp.disabled = false;
  }

  // 先将 todoItemWrapper 里面的todoItem全部移除掉
  todoItemWrapper.innerHTML = "";
  localStorage.setItem('todolist', JSON.stringify(todolist))
  // 循环生成todos
  creatTodos();
}

// 创建右侧todos，并添加到页面
function creatTodos() {
  todolist[currentIndex].todos.forEach(function (todoObj,idx) {
    // 创建todoItem这个最外层的div
    let todoItemDiv = document.createElement("div");
    todoItemDiv.classList.add("todoItem");

    // 创建label标签
    let olabel = document.createElement("label");
    olabel.classList.add("label");

    // 创建 checkbox 多选框
    let oCheckbox = document.createElement("input");
    oCheckbox.type = "checkbox";
    if (todoObj.isDone) {
      oCheckbox.checked = true;
    }

    // 创建输入框
    let oInput = document.createElement("input");
    oInput.type = "text";
    oInput.classList.add("input", "todoItem-input");
    if (todoObj.isDone) {
      oInput.classList.add("todo-done");
      oInput.disabled = true;
    }
    oInput.value = todoObj.desc;

    // 创建删除按钮
    let deleteBtn = document.createElement("span");
    deleteBtn.classList.add("glyphicon", "glyphicon-trash", "todoItem-delete");
    if (todoObj.isDone) {
      deleteBtn.style.display = "block";
    } else {
      deleteBtn.style.display = "none";
    }

    // 给右侧todos的每个input绑定点击事件  点击后修改todoobj的desc属性
    oInput.onkeyup = function (e) {
      if (e.key == 'Enter') {
        todoObj.desc = this.value
        localStorage.setItem('todolist', JSON.stringify(todolist))
      }
    }

    // 给每一个删除按钮绑定点击事件
    deleteBtn.onclick = function () {
      // 查找 当前项的索引
      /* let del = todolist[currentIndex].todos.findIndex(function (item) {
        return item == todoObj
      }) */
      this.parentElement.remove()
      todolist[currentIndex].todos.splice(idx, 1)
      localStorage.setItem('todolist', JSON.stringify(todolist))
    }

    //给每一个多选框绑定点击事件 修改对象的isDone 从新渲染左侧和右侧
    oCheckbox.onclick = function () {
      if (oCheckbox.checked) {
        todoObj.isDone = true
        oInput.classList.add("todo-done");
        oInput.disabled = true;
        deleteBtn.style.display = "block"; // 小垃圾桶出现
      } else {
        todoObj.isDone = false
        oInput.classList.remove("todo-done");
        oInput.disabled = false;
        deleteBtn.style.display = "none";// 小垃圾桶隐藏
      }
      renderMenuItem()
      renderTodos()
      localStorage.setItem('todolist', JSON.stringify(todolist))
    }

    // 判断锁定状态
    if (todolist[currentIndex].isLocked) {
      oCheckbox.disabled = true;
      oInput.disabled = true;
      deleteBtn.style.display = "none";
    }

    // 拼接todoItem
    olabel.appendChild(oCheckbox);
    todoItemDiv.appendChild(olabel);
    todoItemDiv.appendChild(oInput);
    todoItemDiv.appendChild(deleteBtn);

    // 将 todoItemDiv 添加到 todoItemWrapper
    todoItemWrapper.appendChild(todoItemDiv);
  });
}

// 实现双击右侧菜单标题可以更改title功能
headerTitle.ondblclick = function () {
  // 1 判断是否islock  是的话 不可以更改 否则反之 将右侧头部title的容器display更改
  if (!todolist[currentIndex].isLocked) {
    rightTitleBox.style.display = 'none'
    rightTitleEditer.style.display = 'block'
    rightTitleInput.value = todolist[currentIndex].title
    // 取消按钮实现功能
    cancel.onclick = function () {
      rightTitleBox.style.display = 'flex'
      //rightTitleBox.style.display = 'block'
      rightTitleEditer.style.display = 'none'
    }
    //将input的value赋值span的value
    rightTitleInput.onkeyup = function (e) {
      if (e.keyCode == 13) {
        headerTitle.innerText = this.value
        //rightTitleBox.style.display = 'block'
        rightTitleBox.style.display = 'flex'
        rightTitleEditer.style.display = 'none'
        todolist[currentIndex].title = headerTitle.innerText
        renderMenuItem();
        renderTodos();
        localStorage.setItem('todolist', JSON.stringify(todolist))
      }
    }
  } 
}