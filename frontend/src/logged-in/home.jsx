import Navbarloggedin from "../../components/nav_user";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import './home_logged-in.css'
import Contact from "../../components/contact";

function Homeloggedin(){
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
            </div>

            <Contact />
        </>
    )
}

export default Homeloggedin;