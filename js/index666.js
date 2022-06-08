let todolist = [];
//如果浏览器存储有数据
if (localStorage.getItem('todolist')) {
  todolist=JSON.parse(localStorage.getItem('todolist'))
}
// 获取左侧菜单menu的盒子
let menuBox = document.querySelector(".menu");
// 获取添加按钮
let addMenuItemBtn = document.getElementById("addTodo");
// 获取头部的title
let headerTitle = document.getElementById("title");
//获取头部的title的父级
let titleBox=document.querySelector('.titleBox')
//获取头部隐藏title-input框
let titleInput=document.querySelector('#title-input')
//获取头部隐藏title-input框的父级
let titleEditer=document.querySelector('.header .title-editer')
//头部隐藏取消
let cancel=document.querySelector('#cancel')
// 获取头部title的徽标
let headerBadge = document.getElementById("title-badge");
// 获取右侧头部的小锁
let headerLock = document.getElementById("lock");
//左侧新增按钮
let addTodo=document.querySelector('#addTodo');
//左侧头部部分
let header = document.querySelector('.header')
// 获取todos的容器
let todoItemWrapper = document.querySelector(".todoItemWrapper");
//右侧input新增右侧内容
let addTodoInp = document.getElementById("addTodoInp");
//右侧头部删除
let remove = document.querySelector('#remove');
// 定义currentIndex变量，来保存当前被选中的menuItem，默认选中第一个menuItem，所以我们这个值为0
let currentIndex = 0;

renderMenuItem();//调用左侧菜单
renderTodos();//生成右侧的todo(头部(内部有函数包含内容))

// 主体结构*根据todolist的数据来生成menuItem
function renderMenuItem() {
  //重新渲染左侧菜单
  let menuItemDivLis = document.querySelectorAll('.menu-item');
  for (let i = 0; i < menuItemDivLis.length - 1; i++) {
    menuItemDivLis[i].remove()
  }
  //遍历数据数组
  todolist.forEach(function (menuItemObj, idx) {

    // 创建div
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
    //让当前微标标签高亮active-badge
    menuItemBadge.classList.add("badge", "menu-right-badge");

    if (idx == currentIndex) {
      menuItemBadge.classList.add("active-badge");
    }
    // 统计徽标的数字，通过方法进行过滤，返回新数组，将新数组长度给到微标
    let noDoneArr = menuItemObj.todos.filter(function (todoObj) {
      return todoObj.isDone == false;
    });
    menuItemBadge.innerText = noDoneArr.length;


  // 给每一个左侧菜单项 menuItemDiv 绑定点击事件，点击的时候来切换右侧的内容
    menuItemDiv.onclick = function () {
      currentIndex = this.getAttribute("data-index");
      //获取左侧菜单div，点击先全部删除再进行渲染使当前的高亮
      let menuItemDivLis = document.querySelectorAll('.menu-item');
      for (let i = 0; i < menuItemDivLis.length - 1; i++) {
          menuItemDivLis[i].classList.remove('menuItem-active')
      }
      //获取左侧菜单div的徽标，点击先全部删除再进行渲染使当前的高亮
      let menuItemDivLisBadge = document.querySelectorAll('.menu-item .badge');
      menuItemDivLisBadge.forEach(function (item) {
        item.classList.remove('active-badge')
      })
      //添加menuItem-active让当前文字高亮，添加active-badge让徽标高亮
      menuItemDivLisBadge[currentIndex].classList.add("active-badge");
      this.classList.add('menuItem-active')
      // //调用生成右侧的容器的函数，重新渲染
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

// 主体结构*根据todolist的数据来生成右侧的todo(头部)
function renderTodos() {
  //判断数组中数据存在的时候显示，不存在的时候让右侧隐藏
  if (todolist<=0) {
    todoItemWrapper.style.display='none'
    header.style.display='none'
    return;
  }else{
    todoItemWrapper.style.display='block'
    header.style.display='block'
  }
  // 获取左侧菜单被激活的徽标
  let menuItemActiveBadge = document.getElementsByClassName("active-badge")[0];
  // console.log(menuItemActiveBadge);

  // 修改右侧头部的标题
  headerTitle.innerHTML = todolist[currentIndex].title;

  // 修改右侧头部的徽标数值
  headerBadge.innerHTML = menuItemActiveBadge.innerHTML;

  // 动态渲染头部小锁的图标
  if (todolist[currentIndex].isLocked) {
    //当todolist[currentIndex].isLocked为true删除🖊的图标
    headerLock.classList.remove("glyphicon-pencil");
    //当todolist[currentIndex].isLocked为true添加🔒图标
    headerLock.classList.add("glyphicon-lock");
    //当🔒锁定的时候右侧添加框和右侧内容区域禁用
    addTodoInp.disabled = true;
    titleInput.disabled = true;
  } else {
    headerLock.classList.remove("glyphicon-lock");
    headerLock.classList.add("glyphicon-pencil");
    addTodoInp.disabled = false;
    titleInput.disabled = false;
  }
  localStorage.setItem('todolist',JSON.stringify(todolist))
  
  // 循环生成todos
  creatTodos();
}

// 主体结构*创建todos(右侧容器部分)，并添加到页面
function creatTodos() {
  //重新渲染右侧内容
  let todoItem = document.querySelectorAll('.todoItem');
  todoItem.forEach(function (item) {
    item.remove()
  })
  //遍历
  todolist[currentIndex].todos.forEach(function (todoObj, index) {
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
    // oInput.placeholder='写点什么...'
    oInput.classList.add("input", "todoItem-input");
    if (todoObj.isDone) {
      oInput.classList.add("todo-done");
      oInput.disabled = true;
    }
    oInput.value = todoObj.desc;
    //修改右侧内容的input，数据同时修改并保存
    oInput.onkeyup=function(en){
      en=en||window.event;
      if (en.keyCode==13) {
        todoObj.desc=oInput.value;
        localStorage.setItem('todolist',JSON.stringify(todolist))
      }
    }
    // 创建删除按钮
    let deleteBtn = document.createElement("span");
    deleteBtn.classList.add("glyphicon", "glyphicon-trash", "todoItem-delete");
    if (todoObj.isDone) {
      deleteBtn.style.display = "block";
    } else {
      deleteBtn.style.display = "none";
    }

    // 判断锁定状态
    if (todolist[currentIndex].isLocked) {
      oCheckbox.disabled = true;
      oInput.disabled = true;
      deleteBtn.style.display = "none";
    }

    //点击右侧小项删除当前小项
    deleteBtn.onclick = function () {
      deleteBtn.parentElement.remove()
      todolist[currentIndex].todos.splice(index, 1)
      localStorage.setItem('todolist',JSON.stringify(todolist))
    }

    //点击每一个input的checkbox，当前所有input禁用，文字input添加类名done，出现垃圾桶
    oCheckbox.onchange = function () {
      if (oCheckbox.checked == true) {//禁用变可编辑
        oInput.disabled = true;
        oInput.classList.add("todo-done");
        deleteBtn.style.display = "block";//小项垃圾桶出现
        todoObj.isDone = true;
      } else if (oCheckbox.checked == false) {//可编辑变禁用
        oInput.disabled = false;
        oInput.classList.remove("todo-done");
        deleteBtn.style.display = "none";//小项垃圾桶出现
        todoObj.isDone = false;
      }
      renderMenuItem();//调用左侧菜单
      renderTodos();//数据来生成右侧的todo(头部)
      localStorage.setItem('todolist',JSON.stringify(todolist))
    }

    // 拼接todoItem
    olabel.appendChild(oCheckbox);
    todoItemDiv.appendChild(olabel);
    todoItemDiv.appendChild(oInput);
    todoItemDiv.appendChild(deleteBtn);
    // 将 todoItemDiv 添加到 todoItemWrapper
    todoItemWrapper.appendChild(todoItemDiv);
    localStorage.setItem('todolist',JSON.stringify(todolist))
  });
}

//点击右侧头部🔒，变成可编辑
//获取左侧头部小锁
let menuLeftIconBadge = document.querySelector('.menu-left-icon')
headerLock.onclick = function () {
  if (!todolist[currentIndex].isLocked) {//解锁变锁定
    headerLock.classList.remove("glyphicon-pencil");
    headerLock.classList.add("glyphicon-lock");
    todolist[currentIndex].isLocked = true;
  } else {//锁定变解锁
    headerLock.classList.remove("glyphicon-lock");
    headerLock.classList.add("glyphicon-pencil");
    todolist[currentIndex].isLocked = false
  }
  renderMenuItem();//调用左侧菜单
  renderTodos();//数据来生成右侧的todo(头部)
  localStorage.setItem('todolist',JSON.stringify(todolist))
}

//键盘事件，确定将右侧添加的内容同步到右侧容器内todoItem的input里
 addTodoInp.addEventListener('keyup',function(e){
  if (e.keyCode==13 && this.value) {
    todolist[currentIndex].todos.push({
     desc:this.value,
     isDone:false
    })
    renderMenuItem();//调用左侧菜单
    renderTodos();//数据来生成右侧的todo(头部)
    this.value='';
    localStorage.setItem('todolist',JSON.stringify(todolist))
  }
 })

//点击新增，生成左侧菜单及右侧容器部分
 addTodo.onclick=function(){
  //创建对象，并放入todolis数组中
  let todoObj={
    title: "new",
    isLocked: false,
    todos: []
  }
  todolist.push(todoObj);
  currentIndex=todolist.length-1;
  renderMenuItem();//调用左侧菜单
  renderTodos();//数据来生成右侧的todo(头部)
  localStorage.setItem('todolist',JSON.stringify(todolist))
}

// 点击右侧盒子删除整个当前右边内容，左侧当前菜单项一并删除
remove.onclick = function () {
  todolist.splice(currentIndex, 1)
  currentIndex--
  renderMenuItem();//调用左侧菜单
  renderTodos();//数据来生成右侧的todo(头部)
  localStorage.setItem('todolist',JSON.stringify(todolist))
}

//点击右侧头部，变成可编辑状态，点击回车更改头部值title-input
 headerTitle.onclick=function(){
  //每一个当前右侧头部文本值给到右侧文本隐藏的input;
  titleInput.value=headerTitle.innerHTML
  //头部显示部分
  titleBox.style.display='none';
  //头部隐藏编辑部分的input
  titleEditer.style.display='block';
  //右侧头部隐藏点击取消x
  cancel.onclick=function(){
    titleBox.style.display='block';
    titleEditer.style.display='none';
    titleBox.style.display='flex'
  }
  //右侧头部隐藏input绑定键盘事件
  titleInput.addEventListener('keyup',function(ev){
    ev=ev||window.event;
    if (!todolist[currentIndex].isLocked==true) {
      if (ev.keyCode==13) {
        headerTitle.innerHTML=this.value;
        titleBox.style.display='block';
        titleEditer.style.display='none';
        todolist[currentIndex].title=headerTitle.innerHTML;
        titleBox.style.display='flex';
        
        renderMenuItem();//调用左侧菜单
        renderTodos();//数据来生成右侧的todo(头部)
        localStorage.setItem('todolist',JSON.stringify(todolist))
      }
    }
  })
}
