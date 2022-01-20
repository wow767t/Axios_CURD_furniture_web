$(document).ready(function () {

    // 'Authorization'
    let key = "t9dWaXQuH7SJrhCNOQeqHY080Yq1";
    let url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/scott/orders";
    let orderData = [];

    // 後台取得訂單資訊 & 渲染
    function getOrderData() { //init
        axios.get(url, {
            headers: {
                'Authorization': key
            }
        })
            .then(function (resp) {
                orderData = resp.data.orders
                console.log(orderData);
                renderOrder(orderData);
                pickProducts();
                incomeByCategory();
                generateChart();
                top3Product();
                generateChart_Lv2();
            })
    }
    getOrderData()
    const orderPage = document.querySelector('.orderPage-table')

    function renderOrder(orderData) {
        let str = "";
        orderData.forEach((item, index) => {
            let eachOrderProduct = item.products;
            let productsTitle = "";
            eachOrderProduct.forEach(item => {
                productsTitle += `${item.title}*${item.quantity}<br>`;
            })
            str += `
        <tr>
        <td>${item.createdAt}</td>
        <td>
            <p>${item.user.name}</p>
            <p>${item.user.tel}</p>
        </td>
        <td>${item.user.address}</td>
        <td>${item.user.email}</td>
        <td>
            <p>${productsTitle}</p>
        </td>
        <td>2021/03/08</td>
        <td class="orderStatus">
            <a href="#" data-orderStatus="false">未處理 </a>
        </td>
        <td>
            <input type="button" class="delSingleOrder-Btn" value="刪除" data-order_id=${item.id}>
        </td>
        </tr>
        `
        })
        orderPage.innerHTML = `
    <thead>
    <tr>
        <th>訂單編號</th>
        <th>聯絡人</th>
        <th>聯絡地址</th>
        <th>電子郵件</th>
        <th>訂單品項</th>
        <th>訂單日期</th>
        <th>訂單狀態</th>
        <th>操作</th>
    </tr>
    </thead>
    ${str}
    `
    }

    // 清除全部訂單
    {/* <a href="#" class="discardAllBtn">清除全部訂單</a> */ }
    const deleteAllBtn = document.querySelector('.discardAllBtn');
    deleteAllBtn.addEventListener('click', function (e) {
        // true or false
        let confirmAction = confirm("確定要刪除全部訂單嗎?")
        if (confirmAction == false) {
            return
        } else {
            deleteAll()
        }
    });

    function deleteAll() {
        axios.delete(url, {
            headers: {
                Authorization: key
            }
        })
            .then(function (resp) {
                getOrderData()
            })
            .catch(function (err) {
                console.log(err);
            })
    }

    // 刪除訂單
    {/* <input type="button" class="delSingleOrder-Btn" value="刪除" data-order_id="A4NggJs97CWxudgDiAYr"></input> */ }
    // dataset.***

    orderPage.addEventListener('click', function (e) {
        e.preventDefault;
        let id = e.target.dataset.order_id;
        if (e.target.getAttribute('class') != "delSingleOrder-Btn") {
            e.preventDefault;
            return
        }
        let confirmAction = confirm("確定要刪除此筆訂單嗎?")
        if (confirmAction == false) {
            return
        }

        axios.delete(`${url}/${id}`, {
            headers: {
                Authorization: key
            }
        })
            .then(function (resp) {
                getOrderData();
            })
            .catch(function (err) {
                console.log(err)
            })
    })


    // C3.js
    // LV1：做圓餅圖，做全產品類別營收比重，類別含三項，共有：床架、收納、窗簾 

    // 把訂單中的產品撈出來
    let orderProducts = [];
    function pickProducts() {
        orderData.forEach(item => {
            item.products.forEach(item => {
                orderProducts.push(item)
            })
        })
        console.log("每筆商品", orderProducts) //每筆商品
    }

    let incomeByCategoryArr = [];  // [[床架,xxx],[收納,xxx],[窗簾,xxx]]
    function incomeByCategory() {
        let innerObj = {};
        orderProducts.forEach(item => {
            if (innerObj[item.category] == undefined) {
                innerObj[item.category] = item.price * item.quantity
            } else {
                innerObj[item.category] += item.price * item.quantity
            }
        })
        let objKey = Object.keys(innerObj)
        // console.log(objKey) //['收納', '床架', '窗簾']
        // console.log(innerObj) //{收納: 5340, 床架: 7560, 窗簾: 2400}
        // 組陣列
        objKey.forEach(item => {
            let innerArr = [];
            innerArr.push(item);
            innerArr.push(innerObj[item]);
            incomeByCategoryArr.push(innerArr)
        })
    }

    // 產生圖表 
    function generateChart() {
        let chart = c3.generate({
            bindto: '#chart', // HTML 元素綁定
            data: {
                type: "pie",
                columns: incomeByCategoryArr,
                colors: {
                    "Louvre 雙人床架": "#DACBFF",
                    "Antony 雙人床架": "#9D7FEA",
                    "Andy 雙人床架": "#5434A7",
                    "其他": "#301E5F",
                }
            },
        });

    }

    // LV2：做圓餅圖，做全品項營收比重，類別含四項，篩選出前三名營收品項，
    // 其他 4~8 名都統整為「其它」

    // 篩選每一個商品
    let incomeByProduct = [];
    function top3Product() {
        let innerObj = {}
        orderProducts.forEach(item => {

            if (innerObj[item.title] == undefined) {
                innerObj[item.title] = item.price * item.quantity;
            } else {
                innerObj[item.title] += item.price * item.quantity;
            }

        })
        console.log("每項商品營收", innerObj) //{Antony 遮光窗簾: 7200, Antony 床邊桌: 3780, Louvre 單人床架: 7560, Charles 系列儲物組合: 1560}


        // 轉陣列
        let objKey = Object.keys(innerObj) //['Antony 遮光窗簾', 'Antony 床邊桌', 'Louvre 單人床架', 'Charles 系列儲物組合']
        objKey.forEach(item => {
            let innerArr = [];
            innerArr.push(item);
            innerArr.push(innerObj[item]);
            incomeByProduct.push(innerArr);
        })


        // 排序
        incomeByProduct = incomeByProduct.sort((a, b) => {
            return b[1] - a[1];
        })
        console.log(incomeByProduct)
        // 如果筆數超過四筆 統整成其他
        let otherIncome = 0;

        incomeByProduct.forEach((item, index) => {
            if (index > 2) {
                otherIncome += incomeByProduct[index][1]
            }
        })
        console.log(otherIncome) // 第三筆之後的營收總和

        incomeByProduct.splice(3, (incomeByProduct.length));
        let innerArr = [];
        innerArr.push("其他");
        innerArr.push(otherIncome);
        incomeByProduct.push(innerArr)


    }

    // 產生圖表 
    function generateChart_Lv2() {
        let chart = c3.generate({
            bindto: '#chart_LV2', // HTML 元素綁定
            data: {
                type: "pie",
                columns: incomeByProduct,
                colors: {
                    "Louvre 雙人床架": "#DACBFF",
                    "Antony 雙人床架": "#9D7FEA",
                    "Andy 雙人床架": "#5434A7",
                    "其他": "#301E5F",
                }
            },
        });

    }

    // 切換訂單處理狀態
    // <a href="#" date-orderstatus="false">未處理 </a>
    $('.orderPage-table').click(function (e) {
        e.preventDefault();
        if(e.target.dataset.orderstatus == "false"){
            let orderStatusTxt = e.target
            orderStatusTxt.textContent = "已完成"
            e.target.dataset.orderstatus = "true";
        }else{
            let orderStatusTxt = e.target
            orderStatusTxt.textContent = "未處理"
            e.target.dataset.orderstatus = "false";
        }
    });
    
    // 字體放大縮小
    let fontSize = 14;
    $('.font-s').click(function (e) { 
        e.preventDefault();
        fontSize -=1
        $('.orderPage-table ').css('font-size', `${fontSize}px`);
    });

    // 隱藏顯示圖表
    $('.toggle-chart').click(function (e) { 
        e.preventDefault();
        $('.chart').toggleClass('hideContent')
    });

});