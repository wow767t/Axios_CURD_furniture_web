$(document).ready(function () {
    let productData = [];
    let baseUrl = "https://livejs-api.hexschool.io/api";
    // 取得產品列表(Get)
    // https://livejs-api.hexschool.io/api/livejs/v1/customer/scott/products
    // 商品列表ul
    function getProductData() {
        axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/scott/products')
            .then(function (resp) {
                console.log(resp.status);
                productData = resp.data.products
                console.log(productData);
                renderProductData(productData);
                getProductCategory();
                renderProductSelect();
            })
    }
    getProductData(); //init

    const productWrap = document.querySelector('.productWrap');
    function renderProductData(productData) {
        let str = "";
        productData.forEach((item, index) => {
            str += `
        <li class="productCard">
        <h4 class="productType">${item.category}</h4>
        <img src=${item.images} alt="" title="${item.description}">
        
        <a href="#" class="addCardBtn" data-product_id=${item.id}>加入購物車</a>
        <h3>${item.title}</h3>
        <del class="originPrice">NT$${toThousand(item.origin_price)}</del>
        
        <p class="nowPrice">NT$${toThousand(item.price)}</p>
        </li>
        
    `
        })
        productWrap.innerHTML = str;
    }
    {/* <div class="qty">
                        <a href="#"><span class="material-icons cartAmount-icon" data-minus_btn=minus data-index=${index}>remove</span></a>
                        <p>數量</p><span id="currentQty" data-qty_index=${index}>1</span>
                        <a href="#"><span class="material-icons cartAmount-icon" data-plus_btn=plus data-index=${index}>add</span></a>
                    </div> */}

    // 商品列表&篩選功能 281
    // select 選單 1.5grs
    const productSelect = document.querySelector('.productSelect');
    let category = [];
    function getProductCategory() {
        category = productData.map(item => {
            return item.category;
        })
        // ['窗簾', '床架', '床架', '床架', '收納', '床架', '床架', '收納']

        category = category.filter((item, index) => {
            // true
            return category.indexOf(item) === index;
        })
        console.log(category)

    }
    // 類別選單
    function renderProductSelect() {
        let str = '';
        category.forEach(item => {
            str += `
        <option value="${item}">${item}</option>
        `
        })
        productSelect.innerHTML = `
    <option value="全部" selected>全部</option>
    ${str}
    `

    }
    // 篩選
    productSelect.addEventListener('click', categorySelector);
    function categorySelector(e) {
        let str = ""
        if (e.target.value == "全部") {
            renderProductData(productData)
        }
        let selectedCategory = [];
        productData.forEach(item => {
            if (e.target.value == item.category) {
                console.log(item)
                selectedCategory.push(item)
                renderProductData(selectedCategory)
                //         str += `
                //     <li class="productCard">
                //     <h4 class="productType">${item.category}</h4>
                //     <img src=${item.images} alt="" title="${item.description}">
                //     <a href="#" class="addCardBtn" data-product_id=${item.id}>加入購物車</a>
                //     <h3>${item.title}</h3>
                //     <del class="originPrice">NT$${item.origin_price}</del>
                //     <p class="nowPrice">NT$${item.price}</p>
                //     </li>
                // `

            }
            // productWrap.innerHTML = str;
        })
    }

    // 關鍵字篩選 280
    const searchKeyword = document.querySelector('.searchKeyword');
    // const sendBtn = document.querySelector('.sendBtn');
    $('.sendBtn').click(keywordSelector);

    // sendBtn.addEventListener('click', keywordSelector);
    function keywordSelector(e) {
        let keyword = searchKeyword.value.trim().toLowerCase();
        let targetProduct = [];
        targetProduct = productData.filter(item => {
            let title = item.title.toLowerCase();
            return title.match(keyword);
        })
        renderProductData(targetProduct);
    }

    // 如果取消搜尋 重新渲染商品列表
    searchKeyword.addEventListener('input', discardSearch);
    function discardSearch(e) {
        if (searchKeyword.value === "") {
            renderProductData(productData)
        }
    }
    // 取得購物車列表(Get)
    // https://livejs-api.hexschool.io/api/livejs/v1/customer/scott/carts

    // 購物車列表 357
    const myCart = document.querySelector('.shoppingCart-table');
    let cartList = [];
    function getCartList() {
        axios.get('https://livejs-api.hexschool.io/api/livejs/v1/customer/scott/carts')
            .then(function (resp) {
                cartList = resp.data.carts;
                console.log("購物車清單", cartList)
                renderCartList(cartList);
            })
    }
    getCartList()

    // 渲染訂單列表 & 處裡金額加總
    function renderCartList(cartList) {
        let str = "";
        let totalPrice = 0;
        let cartPriceSum = 0;
        cartList.forEach(item => {
            totalPrice = item.product.price * item.quantity

            str += `
        <tr>
            <td>
                <div class="cardItem-title">
                    <img src=${item.product.images} alt="">
                    <p>${item.product.title}</p>
                </div>
            </td>
            <td>NT$${toThousand(item.product.price)}</td>
            <td>${item.quantity}</td>
            <td>NT$${toThousand(totalPrice)}</td>
            <td class="discardBtn">
                <a href="#" class="material-icons" data-cart_id=${item.id}>
                    clear
                </a>
            </td>
        </tr>
        `;
            cartPriceSum += totalPrice;
        })

        console.log("訂單總額", cartPriceSum)
        myCart.innerHTML = `
        <tr>
            <th width="40%">品項</th>
            <th width="15%">單價</th>
            <th width="15%">數量</th>
            <th width="15%">金額</th>
            <th width="15%"></th>
        </tr>
        ${str}
        <tr>
            <td>
                <a href="#" class="discardAllBtn" date-Btn="deleteAll" >刪除所有品項</a>
            </td>
            <td></td>
            <td></td>
            <td>
                <p>總金額</p>
            </td>
            <td>NT$${toThousand(cartPriceSum)}</td>
        </tr>
    `
    }

    // 加入購物車(POST)
    {/* <a href="#" class="addCardBtn" data-product_id="f3Z5dhDFEeCudbhE7CrH">加入購物車</a> */ }
    {/* <span class="material-icons cartAmount-icon" data-plusbtn="plus">add</span> */ }
    let defaultQty = 1;
    let currentQtySelector;
    productWrap.addEventListener('click', addToCart);
    function addToCart(e) {
        e.preventDefault();
        // // 商品數量+
        // if (e.target.dataset.plusbtn == "plus") {
        //     e.preventDefault();
        //     let targetIndex = e.target.dataset.index
        //     currentQtySelector = document.querySelector('#currentQty')
        //     currentNum = parseInt(currentQtySelector.textContent)
        //     currentNum = defaultQty += 1;
        //     let targetQty = document.querySelector(`[data-qty_index="${targetIndex}"]`)
        //     targetQty.textContent = `${currentNum}`
        //     console.log(currentNum)
        // };
        // // 商品數量-
        // if (e.target.dataset.minusbtn == "minus") {
        //     e.preventDefault();
        //     if (currentNum == 1) {
        //         return
        //     }
        //     let targetIndex = e.target.dataset.index
        //     currentQtySelector = document.querySelector('#currentQty')
        //     currentNum = parseInt(currentQtySelector.textContent)
        //     currentNum = defaultQty -= 1;
        //     let targetQty = document.querySelector(`[data-qty_index="${targetIndex}"]`)
        //     targetQty.textContent = `${currentNum}`
        //     console.log(currentNum)
        // }
        if (e.target.getAttribute('class') == "addCardBtn") {
            e.preventDefault();
            let id = e.target.dataset.product_id;
            let qty = 1;
            postCart(id, qty)
        };
    }
    // 加入購物車
    function postCart(id, qty) {
        let obj = {
            "data": {
                "productId": id,
                "quantity": qty
            }
        };
        axios.post("https://livejs-api.hexschool.io/api/livejs/v1/customer/scott/carts", obj)
            .then(function (resp) {
                alert("成功加入購物車");
                getCartList();
                renderCartList(cartList);
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    // 
    // setTimeout(getQtyBtn,2000)
    // function getQtyBtn(){
    //     let plusBtn = document.querySelectorAll("[data-plus_btn = 'plus']")
    //     let minusBtn = document.querySelectorAll("[data-minus_btn = 'minus']")
    //     // console.log(plusBtn)
    //     // console.log(minusBtn)

    //     let initQty = 1;
    //     plusBtn.forEach(item=>{
    //         item.addEventListener('click',function (e){
    //             let targetIndex = e.target.dataset.index;
    //             let targetQty = item.previousElementSibling.innerHTML
    //             console.log(targetQty)
    //         })
    //     })
    // }




    // 刪除購物車內特定產品(DELETE)
    {/* <a href="#" class="material-icons" data-cart_id="f38fuSPPVO7wT8xjPR1n"> */ }
    myCart.addEventListener('click', deleteItem);
    function deleteItem(e) {
        if (e.target.getAttribute('class') != "material-icons") {
            return
        }
        e.preventDefault();
        let id = e.target.dataset.cart_id;
        let url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/scott/carts"
        axios.delete(`${url}/${id}`)
            .then(function (resp) {
                alert("刪除成功");
                getCartList();
                renderCartList(cartList);
            })
    }

    // 清空購物車
    // let url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/scott/carts"
    {/* <a href="#" class="discardAllBtn" date-btn="deleteAll">刪除所有品項</a> */ }
    myCart.addEventListener('click', function (e) {
        e.preventDefault();
        if (e.target.getAttribute('class') !== "discardAllBtn") {
            return
        }
        let confrim = confirm("確定要清空購物車嗎?");
        if (confrim != true) {
            return;
        }
        axios.delete('https://livejs-api.hexschool.io/api/livejs/v1/customer/scott/carts')
            .then(function (e) {
                alert("購物車已清空");
                getCartList();
                renderCartList(cartList);
            })
            .catch(function (err) {
                console.log(err)
            })
    })

    // 送出購買訂單(POST) 
    // https://livejs-api.hexschool.io/api/livejs/v1/customer/scott/orders


    const submitOrder = document.querySelector('.orderInfo-btn');
    let orderInfo = document.querySelectorAll('.orderInfo-input');

    submitOrder.addEventListener('click', checkOrderInfo)
    function checkOrderInfo() {
        let obj = {
            "data": {
                "user": {
                    "name": orderInfo[0].value,
                    "tel": orderInfo[1].value,
                    "email": orderInfo[2].value,
                    "address": orderInfo[3].value,
                    "payment": orderInfo[4].value
                }
            }
        }
        let url = "https://livejs-api.hexschool.io/api/livejs/v1/customer/scott/orders"
        axios.post(url, obj)
            .then(function (resp) {
                alert("新增訂單成功");
                getProductData();
                removeOrderInfo();
            })
    }

    // 清空預定資料
    function removeOrderInfo() {
        orderInfo.forEach((item, index) => {
            orderInfo[index].value = ""
        })
    }
    // 小工具
    // 千分位
    function toThousand(x) {
        let parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return parts.join(".")
    }
    var day2 = new Date();
    // day2.setTime(day2.getTime());
    //

    // Validate.js
    const formCheck = {
        姓名: {
            presence: {
                message: "必填"
            }

        },
        電話: {
            presence: {
                message: "必填"
            }

        }
    }

    orderInfo.forEach(item => {
        item.addEventListener('change', function () {
            item.nextElementSibling.textContent = "";
            if (item.value == "") {
                item.nextElementSibling.textContent = "必填";
            }
            // console.log(item.nextElementSibling.textContent = "") // <p class="orderInfo-message" data-message="姓名">必填</p>

            // let error = validate(orderInfo,formCheck) || '';
            // console.log(error)

            // if(error){
            //     Object.keys(error).forEach(item=>{
            //         console.log(item)
            //     })
            // }
        })

    })

    // to top btn
    
})
