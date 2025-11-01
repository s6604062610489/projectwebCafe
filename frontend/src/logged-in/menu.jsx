import Navbaruser from "../../components/nav_user";
import "../unlogged-in/menu.css";
import { useState, useEffect } from "react";
import { CiSearch } from "react-icons/ci";
import { RxCross2 } from "react-icons/rx";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaShoppingCart } from "react-icons/fa";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Contact from "../../components/contact";

function Menu_loggedin() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [showDrinksDropdown, setShowDrinksDropdown] = useState(false);
    const [drinkCategories, setDrinkCategories] = useState([]);
    const [cart, setCart] = useState([]);
    const [showCart, setShowCart] = useState(false);

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data)

                const allCats = [...new Set(data.map(p => p.category))];
                const drinks = allCats.filter(cat =>
                    ["Coffee", "Tea", "Italian Soda", "Smoothie", "Milk"].includes(cat)
                );
                setDrinkCategories(drinks);
            });
    }, []);

    const filteredProducts = products.filter((p) => {
        const matchSearch = p.p_name.toLowerCase().includes(query.toLowerCase());
        if (selectedCategory === "All") return matchSearch;

        if (selectedCategory === "Drinks") {
            return matchSearch && drinkCategories.includes(p.category);
        }

        return matchSearch && p.category === selectedCategory;
    });

    const groupedFiltered = filteredProducts.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    const filteredSearch = products.filter(p =>
        p.p_name.toLowerCase().includes(query.toLowerCase())
    );

    const handleAddToCart = (product) => {
        const exist = cart.find((item) => item._id === product._id);
        if (exist) {
            setCart(
                cart.map((item) =>
                    item._id === product._id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                )
            );
        } else {
            setCart([...cart, { ...product, quantity: 1 }]);
        }
    };

    const handleRemove = (id) => {
        setCart(cart.filter((item) => item._id !== id));
    };

    useEffect(() => {
        if (cart.length === 0 && showCart) {
            setShowCart(false);
        }
    }, [cart]);

    const handleConfirm = async () => {
        try {
            // 1. ตรวจสอบ session login
            const sessionRes = await fetch("http://localhost:5000/api/logincheck/session", {
                credentials: "include",
            });
            const sessionData = await sessionRes.json();
            const member_id = sessionData.loggedIn ? sessionData.user.member_id : "guess";

            // 2. เตรียมข้อมูลสินค้าให้ตรงกับ schema
            const orderItems = cart.map(item => ({
                p_code: item.p_code,      // ต้องแน่ใจว่า product มี field นี้จาก backend
                p_name: item.p_name,
                p_price: item.p_price,
                p_quantity: item.quantity
            }));

            // 3. คำนวณราคารวม
            const totalPrice = orderItems.reduce(
                (sum, i) => sum + i.p_price * i.p_quantity,
                0
            );

            // 4. ส่งไป backend
            const res = await fetch("http://localhost:5000/api/receipt/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    member_id,
                    order_item: orderItems,
                    total_price: totalPrice
                })
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to create receipt");

            alert(`✅ Order Confirmed!\nOrder No: ${data.receipt.order_num}\nTotal: ${data.receipt.total_price}฿`);
            setCart([]);
            setShowCart(false);
        } catch (err) {
            console.error(err);
            alert("❌ Error: " + err.message);
        }
    };

    const totalPrice = cart.reduce(
        (sum, item) => sum + item.p_price * item.quantity,
        0
    );

    return (
        <>
            <Navbaruser />

            <div className="slide-menu">
                <Carousel
                    interval={3250}
                    showStatus={false}
                    autoPlay={true}
                    infiniteLoop={true}
                    animationHandler={'fade'}
                    showArrows={false}
                    showThumbs={false}>
                    <div className='pro-menu'>
                        <img src="../../images/promotion-1.jpg" />
                    </div>
                    <div className='pro-menu'>
                        <img src="../../images/pro2.jpg" />
                    </div>
                </Carousel>
            </div>

            <div className="container-menu">

                <div className="search-bar">
                    <CiSearch size={20} />
                    <input type="text" placeholder="ค้นหาสินค้า"
                        value={query} onChange={(e) => setQuery(e.target.value)} />
                    {query && <RxCross2 className="icon clear" onClick={() => setQuery("")} />}
                </div>

                {query && (
                    <ul className="search-result">
                        {filteredSearch.length > 0 ? (
                            filteredSearch.map((item) => (
                                <li key={item._id} onClick={() => {
                                    setQuery("");
                                    const el = document.getElementById(item.category);
                                    if (el) el.scrollIntoView({ behavior: "smooth" });
                                }}
                                > {item.p_name} </li>
                            ))
                        ) : (
                            <li>ไม่พบสินค้า</li>
                        )}
                    </ul>
                )}


                <div className="show-product">
                    <div className="filter-side">
                        <ul>
                            <li onClick={() => {
                                setSelectedCategory("All");
                                setShowDrinksDropdown(false);
                            }}>All Menu</li>

                            <li onClick={() => setShowDrinksDropdown(!showDrinksDropdown)}>
                                Drinks{" "}
                                {showDrinksDropdown ? <IoIosArrowUp /> : <IoIosArrowDown />}</li>

                            {showDrinksDropdown && (
                                <ul style={{ marginLeft: "15px" }}>
                                    {drinkCategories.map((cat) => (
                                        <li
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                        >
                                            {cat}
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <li onClick={() => {
                                setSelectedCategory("Bakery");
                                setShowDrinksDropdown(false);
                            }}>Bakery</li>

                            <li onClick={() => {
                                setSelectedCategory("Others");
                                setShowDrinksDropdown(false);
                            }}>Others</li>
                        </ul>
                    </div>

                    <div className="class-product">
                        {Object.entries(groupedFiltered).map(([category, items]) => (
                            <div key={category} id={category} className="category-section">

                                <p className="cat-bar">{category}</p>

                                <div className="product-list">
                                    {items.map((p) => (
                                        <div className="product-card" key={p._id}>
                                            <img src={`http://localhost:5000/uploads/${p.p_img}`} alt={p.p_name} />
                                            <h4>{p.p_name}</h4>
                                            <p>{p.p_price} Bath</p>
                                            <button
                                                className="add-btn"
                                                onClick={() => handleAddToCart(p)}
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}

                        {cart.length > 0 && (
                            <div className="floating-cart" onClick={() => setShowCart(!showCart)}>
                                <FaShoppingCart size={22} />
                                <span className="cart-count">{cart.length}</span>
                            </div>
                        )}

                        <div className={`cart-box ${showCart ? "active" : ""}`}>
                            <div className="cart-box-header">
                                <h4>Your Cart</h4>
                                <button className="close-btn" onClick={() => setShowCart(false)}>✖</button>
                            </div>

                            {cart.length === 0 ? (
                                <p className="empty-text">No items in cart.</p>
                            ) : (
                                <div className="cart-box-items">
                                    {cart.map((item) => (
                                        <div className="cart-box-item" key={item._id}>
                                            <img
                                                src={`http://localhost:5000/uploads/${item.p_img}`}
                                                alt={item.p_name}
                                            />
                                            <div className="cart-item-info">
                                                <p>{item.p_name}</p>
                                                <p>{item.p_price} Bath × {item.quantity}</p>
                                            </div>
                                            <button onClick={() => handleRemove(item._id)}>✖</button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {cart.length > 0 && (
                                <div className="cart-box-footer">
                                    <p>Total: {totalPrice}฿</p>
                                    <button onClick={handleConfirm}>Confirm Order</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>

            <Contact />
        </>
    );
}

export default Menu_loggedin;
