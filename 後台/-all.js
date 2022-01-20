let key = "t9dWaXQuH7SJrhCNOQeqHY080Yq1";
let url = "https://livejs-api.hexschool.io/api/livejs/v1/admin/scott/orders";
let orderData;
setTimeout(()=>{console.log('order 資料', orderData)},2000)

function init() {
    // renderOrderList();
    getOrderData();
    setTimeout(renderOrderList(),2000);
    setTimeout(sortOfCategory(),2000);
    
}
init();

// axios get order data
function getOrderData() {
    axios.get(url, {
        headers: {
            'Authorization': key
        }
    })
        .then(function (resp) {
            
            orderData = resp.data.orders
            console.log('成功取得資料',resp.status)
            
        })
        
}

// 後台取得訂單資訊 & 渲染

function renderOrderList() {
    const orderList = document.querySelector('.orderPage-table');
    axios.get("https://livejs-api.hexschool.io/api/livejs/v1/admin/scott/orders", {
        headers: {
            'Authorization': "t9dWaXQuH7SJrhCNOQeqHY080Yq1"
        }
    })
        .then(function (resp) {
            orderData = resp.data.orders;
            let str = "";
            orderData.forEach(item => {
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
                        <p>${item.products["0"].title}</p>
                    </td>
                    <td>2021/03/08</td>
                    <td class="orderStatus">
                        <a href="#">未處理</a>
                    </td>
                    <td>
                        <input type="button" class="delSingleOrder-Btn" value="刪除" data-order_id=${item.id}>
                    </td>
                </tr>
                `
            })
            orderList.innerHTML = `
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
        })
        .catch(function (err) {
            console.log(err)
        })
}

// 清除全部訂單
const clearAll = document.querySelector('.discardAllBtn');
clearAll.addEventListener('click', function (e) {
    clearOrder();
    init();
})
function clearOrder() {
    axios.delete('https://livejs-api.hexschool.io/api/livejs/v1/admin/scott/orders', {
        headers: {
            'Authorization': "t9dWaXQuH7SJrhCNOQeqHY080Yq1"
        }
    })
        .then(function (resp) {
            alert("已清除全部訂單")
        })
        .catch(function (err) {
            console.log(err)
        })
}

// 刪除訂單
const delBtn = document.querySelector('.orderPage-list');
delBtn.addEventListener('click', function (e) {
    if (e.target.getAttribute('class') !== "delSingleOrder-Btn") {
        return
    }
    let id = e.target.getAttribute('data-order_id');
    axios.delete(`https://livejs-api.hexschool.io/api/livejs/v1/admin/scott/orders/${id}`, {
        headers: {
            'Authorization': "t9dWaXQuH7SJrhCNOQeqHY080Yq1"
        }
    })
        .then(function (resp) {
            alert("已刪除訂單");
            init();
        })
        .catch(function (err) {
            console.log(err)
        })
})


// C3.js
// LV1：做圓餅圖，做全產品類別營收比重，類別含三項，共有：床架、收納、窗簾
// LV2：做圓餅圖，做全品項營收比重，類別含四項，篩選出前三名營收品項，其他 4~8 名都統整為「其它」

// LV1
function sortOfCategory(){
    axios.get(url, {
        headers: {
            'Authorization': key
        }
    })
        .then(function (resp) {
            let new_AllProductArr = [];
            orderData = resp.data.orders
            orderData.forEach((item,index)=>{
                item.products.forEach(item=>{
                    new_AllProductArr.push(item);
                })
            })
            console.log(new_AllProductArr)
            let category_price = [];
            let tempObj = {}
            new_AllProductArr.forEach(item=>{
                
                if(tempObj[item.category] == undefined){
                    tempObj[item.category] = item.price
                }else{
                    tempObj[item.category] += item.price
                }
                
            })
            // console.log(tempObj);
            let tempArr = Object.keys(tempObj);
            // console.log(tempArr)
            tempArr.forEach(item=>{
                let innerArr = [];
                innerArr.push(item);
                innerArr.push(tempObj[item]);
                category_price.push(innerArr);
            })
            console.log(category_price)

            let chart = c3.generate({
                bindto: '#chart', // HTML 元素綁定
                data: {
                    type: "pie",
                    columns: category_price,
                    colors: {
                        "Louvre 雙人床架": "#DACBFF",
                        "Antony 雙人床架": "#9D7FEA",
                        "Andy 雙人床架": "#5434A7",
                        "其他": "#301E5F",
                    }
                },
            });
        })
        
    
}

// let chart = c3.generate({
//     bindto: '#chart', // HTML 元素綁定
//     data: {
//         type: "pie",
//         columns: [
//             ['Louvre 雙人床架', 1],
//             ['Antony 雙人床架', 2],
//             ['Andy 雙人床架', 3],
//             ['其他', 4],
//         ],
//         colors: {
//             "Louvre 雙人床架": "#DACBFF",
//             "Antony 雙人床架": "#9D7FEA",
//             "Andy 雙人床架": "#5434A7",
//             "其他": "#301E5F",
//         }
//     },
// });
