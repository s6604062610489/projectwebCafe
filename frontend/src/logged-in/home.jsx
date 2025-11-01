import Navbarloggedin from "../../components/nav_user";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './home_logged-in.css'
import Contact from "../../components/contact";
import { useEffect, useState } from "react";

function Homeloggedin(){
    const [bestSellers, setBestSellers] = useState([]);
    
        useEffect(() => {
            const fetchData = async () => {
                try {
                    // 1. ดึงข้อมูลสินค้าขายดี
                    const resReport = await fetch("http://localhost:5000/api/receipt/report");
                    const dataReport = await resReport.json();
    
                    // 2. ดึงข้อมูลสินค้าทั้งหมด (เพื่อเอารูป)
                    const resProduct = await fetch("http://localhost:5000/api/products");
                    const dataProduct = await resProduct.json();
    
                    // 3. รวมข้อมูล โดย match p_code
                    const merged = dataReport.report
                        .map((item) => {
                            const product = dataProduct.find(p => p.p_code === item.p_code);
                            return {
                                ...item,
                                p_img: product ? product.p_img : "no-image.jpg"
                            };
                        })
                        .slice(0, 3);
    
                    setBestSellers(merged);
                } catch (err) {
                    console.error(err);
                }
            };
    
            fetchData();
        }, []);

    return(
        <>
            <Navbarloggedin></Navbarloggedin>

            <div className="container-home">
                <div className="slide-log">
                    <Carousel
                        interval={3250}
                        showStatus={false}
                        autoPlay={true}
                        infiniteLoop={true}
                        animationHandler={'fade'}
                        showArrows={false}
                        showThumbs={false}>
                                <div className='pro-log'>
                                    <img src="../../images/promotion-1.jpg" />
                                </div>
                                <div className='pro-log'>
                                    <img src="../../images/pro2.jpg" />
                                </div>
                    </Carousel>
                </div>

                <div className="best-seller-section">
                    <h2 className="best-seller-title">🔥 Best Selling 🔥</h2>
                    <div className="product-list-best">
                        {bestSellers.map((item, index) => (
                            <div className="product-card" key={index}>
                                <img
                                    src={`http://localhost:5000/uploads/${item.p_img}`}
                                    alt={item.product_name}
                                />
                                <h4>{item.product_name}</h4>
                                <p>ยอดขายรวม: {item.total_sales.toLocaleString()} บาท</p>
                                <p>จำนวนขาย: {item.total_qty}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Contact />
        </>
    )
}

export default Homeloggedin;