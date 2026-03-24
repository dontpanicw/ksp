// Глобальная переменная с массивом товаров
const products = [
    { name: 'Бутылка для воды', price: 350 },
    { name: 'Картхолдер', price: 800 },
    { name: 'Брелок из паракорда', price: 250 }
];

// Массив корзины
let cart = [];

// Функция сохранения корзины в LocalStorage
const saveCartToLocalStorage = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// Функция загрузки корзины из LocalStorage
const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
};

// Функция подсчета общей суммы (стрелочная функция)
const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
};

// Функция обновления счетчика корзины
const updateCartCount = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
};

// Функция перерисовки корзины
const renderCart = () => {
    const cartItemsDiv = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p>Корзина пуста</p>';
        document.getElementById('cart-total').textContent = 'Итого: 0₽';
        return;
    }
    
    cartItemsDiv.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <span>${item.name} - ${item.price}₽ x ${item.quantity}</span>
            <button onclick="removeFromCart(${index})">Удалить</button>
        </div>
    `).join('');
    
    document.getElementById('cart-total').textContent = `Итого: ${calculateTotal()}₽`;
    updateCartCount();
};

// Функция добавления товара в корзину
const addToCart = (name, price) => {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price: Number(price), quantity: 1 });
    }
    
    saveCartToLocalStorage();
    renderCart();
};

// Функция удаления товара из корзины
const removeFromCart = (index) => {
    cart.splice(index, 1);
    saveCartToLocalStorage();
    renderCart();
};

// Функция очистки корзины
const clearCart = () => {
    cart = [];
    saveCartToLocalStorage();
    renderCart();
};

// Функция оплаты
const checkout = () => {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    alert('Покупка прошла успешно!');
    clearCart();
    closeModal();
};

// Функция фильтрации товаров
const filterProducts = (filter) => {
    const productItems = document.querySelectorAll('.product-item');
    
    productItems.forEach(item => {
        const price = Number(item.dataset.price);
        let show = true;
        
        if (filter === 'low') {
            show = price < 500;
        } else if (filter === 'medium') {
            show = price >= 500 && price <= 1000;
        } else if (filter === 'high') {
            show = price > 1000;
        }
        
        item.style.display = show ? 'block' : 'none';
    });
};

// Модальное окно
const modal = document.getElementById('cart-modal');
const cartLink = document.getElementById('cart-link');
const closeBtn = document.querySelector('.close')

const openModal = () => {
    modal.style.display = 'block';
    renderCart();
};

const closeModal = () => {
    modal.style.display = 'none';
};

// Обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    // Загрузить корзину из LocalStorage при загрузке страницы
    loadCartFromLocalStorage();
    
    // Инициализировать счетчик корзины
    updateCartCount();
    
    // Найти все кнопки "Добавить в корзину"
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    // Повесить обработчики на кнопки
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const name = button.dataset.name;
            const price = button.dataset.price;
            addToCart(name, price);
        });
    });
    
    // Обработчик для ссылки корзины
    cartLink.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
    });
    
    // Обработчик для закрытия модального окна
    closeBtn.addEventListener('click', closeModal);
    
    // Закрытие при клике вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Обработчик для кнопки очистки корзины
    document.getElementById('clear-cart').addEventListener('click', clearCart);
    
    // Обработчик для кнопки оплаты
    document.getElementById('checkout').addEventListener('click', checkout);
});
