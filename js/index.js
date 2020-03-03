~function () {
    /* 第一步: 从服务器获取需要展示的数据,然后绑定在页面中*/
    // 1.基于AJAX获取服务器端数据,把数据存储到DATA中
    // 创建AJAX的实例
    let DATA = null;
    let xhr = new XMLHttpRequest;
    // 打开一个请求的链接,基于GET请求和同步编程完成
    xhr.open('GET', 'json/product.json', false);
    // 监听服务器返回的状态信息（在HTTP状态码为200,请求状态为4的时候能拿到数据）
    xhr.onreadystatechange = function () {
        if (xhr.status === 200 && xhr.readyState === 4) {
            // 基于responseText获取响应回来的信息(JSON字符串)
            DATA = xhr.responseText;
        }
    };
    // 发送A]AX请求
    xhr.send(null);
    //把获取的JSON字符串转换为对象
    DATA = JSON.parse(DATA);

    //2.把获取的数据展示在页面中
    // 根据获取的DATA：DATA当中有多少项，我就动态创建出多少个CARD盒子(项目中都是基于字符串拼接的方法，把需要创建的CARD拼出来)
    let htmlStr = ``;
    DATA.array.forEach(item => {
        // ITEM是每一项（对象），包含需要展示的每一个产品的详细信息:我们需要拿出每一项信息来展示到页面中(拼到模板字符串中)
        // 基于解构赋值获取信息
        let { id, title, price, time, hot, img } = item
        //把需要的数据绑定在元素CARD的自定义属性DATA-XXX上（后期需要这些数据，直接基于自定义属性获取即可）
        htmlStr += `<div class="card" 
                         date-price="${price}"
                         date-hot="${hot}"
                         date-time="${time}">
        <img src="${img}" class="card-img-top" alt="...">
        <div class="card-body">
          <h6 class="card-title">${title}</h6>
          <p class="card-text">价格：${price}</p>
          <p class="card-text">好评：${hot}</p>
          <p class="card-text"><small class="text-muted">${time}</small></p></div></div>`;
    });
    // 把拼接好的CARD字符串，放到页面指定容器中(card-deck)
    let cardDeck = document.querySelector('.card-deck');
    cardDeck.innerHTML = htmlStr;

/* 第二步：点击价格/热度/上架时间，可以把内容按照升降序来排列 */
   // 1. 想要操作谁先获取谁(三个排序按钮)和所有的CARD产品内容
    let navList = document.querySelectorAll('.navbar-nav li'),      
    cardList = cardDeck.querySelectorAll('.card');
    // 循环给所有的按钮绑定点击事件，点击的时候按照指定的
    for (let i = 0; navList.length; i++){
        let item = navList[i];
        item['data-type'] = -1; //=>控制升降序
        item.onclick = function () {
            //=>点击当前的某个按钮，让其按照升降序切换，而其余的都应该回归原始-1
            [].forEach.call(navList, item => {
                if (item === this) {
                    //当前按钮继续按照升降序切换  
                    this['data-type'] *= -1;
                } else {
                    //其余的都变为-1
                    item['data-type'] = -1;
                }
            });

            cardList = [].slice.call(cardList, 0);
            cardList.sort((next, cur) => {
                //获取当前按钮记录的排序方式 data-time/data-price/data-hot 
                let pai = this.getAttribute('date-pai');
                cur = cur.getAttribute(pai);
                next = next.getAttribute('pai');
                if (pai === "data-time") {
                    //获取的是日期数据：我们要把字符串中的“-”给去掉  
                    cur = cur.replace(/-/g, '');
                    next = next.replace(/-/g, '');
                }
                return (next - cur) * this['data-type'];
            });
            cardList.forEach(item => {cardDeck.appendChild(item);});
        }
    }
    
    
    /* // 给价格按钮绑定点击事件
    // 给按钮设置一个自定义属性DATA-TYPE存储排序方式：-1降序1升序
    navList[1]['data-type', -1];
    navList[1].onclick = function () {
        //控制升降序切换
        this['data-type'] *= -1;
        //把元素集合(carList)转化为数组，目的是为了使用SORT进行排序
        cardList = Array.prototype.slice.call(cardList, 0);
        // 进行排序(按照每个产品中的价格进行升序)
        cardList.sort((next, cur) => {
            //=>NEXT/CUR存储的是每个元素对象（此时我们需要使用每个元素的价格：在数据绑定的时候，我们就把价格等信息绑定给当前元素的某个自定义属性，此时需要用的时候，直接基于自定义属性的方法获取到即可），绑定数据的时候，把产品价格信息设置为元素的自定义属性，需要的时候获取
            cur = cur.getAttribute('date-price');
            next = next.getAttribute('date-price');
            return (next - cur)*this['data-type'];
        });
        // 以上只是让数据排好序，但是页面中的结构还没有改，我们需要按照当前的顺序，把每个CARD重新增加到容器中才可以
        cardList.forEach(item => {
            cardDeck.appendChild(item);
        });
    }  */
    
   
}();