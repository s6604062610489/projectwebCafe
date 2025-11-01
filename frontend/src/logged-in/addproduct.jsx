import './addpd.css';
import { useState } from 'react';
import Navbaradmin from '../../components/nav_admin';

function Addproduct() {
    const [form, setForm] = useState({
        p_name: "",
        p_price: "",
        p_details: "",
        p_quantity: "",
        p_img: null,
        category: ""
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "p_img") {
            setForm({ ...form, [name]: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleSubmit = async (e) =>{
        e.preventDefault();
        
        const data = new FormData();
        data.append("p_name", form.p_name);
        data.append("p_price", form.p_price);
        data.append("p_details", form.p_details);
        data.append("p_quantity", form.p_quantity || 1);
        data.append("p_img", form.p_img);
        data.append("category", form.category);

        try {
            const res = await fetch("http://localhost:5000/api/products/addproduct", {
                method: "POST",
                body: data,
            });

            const result = await res.json();
            alert(result.message);

            setForm({
                p_name: "",
                p_price: "",
                p_details: "",
                p_quantity: "",
                p_img: null,
                category: ""
            });
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <>
            <Navbaradmin></Navbaradmin>

            <div className="container-product">
                <form onSubmit={handleSubmit}>
                        <div className="title-add">
                            <h1>Add Products</h1>
                        </div>

                        <div className="input-group-add">
                            <input type="text" id="p_name"  name="p_name"
                            required onChange={handleChange} value={form.p_name}/>
                            <label htmlFor="p_name">Product Name</label>
                        </div>

                        <div className="input-datail">
                            <textarea name="p_details" placeholder="Details" onChange={handleChange} value={form.p_details}></textarea>
                        </div>

                        <div className="input-group-add price-group">
                            <input type="number" id="p_price" name="p_price"
                            required onChange={handleChange} value={form.p_price}/>{" "}<span className='current'>Bath</span>
                            <label htmlFor="p_price">Product Price</label>
                        </div>

                        <div className="input-group-add">
                            <input type="number" id="p_quantity" min="1" placeholder=""  name="p_quantity"
                            onChange={handleChange} value={form.p_quantity}/>
                            <label htmlFor="p_quantity">Product Quantity</label>
                        </div>

                        <div className="add-category">
                            <select name="category" className="category" required onChange={handleChange} value={form.category}>
                                <option value="">-- Choose Category --</option>
                                <option value="Coffee">Coffee</option>
                                <option value="Tea">Tea</option>
                                <option value="Italian Soda">Italian Soda</option>
                                <option value="Smoothie">Smoothie</option>
                                <option value="Milk">Milk</option>
                                <option value="Other">Other</option>
                                <option value="Bakery">Bakery</option>
                            </select>
                        </div>

                        <div className="add-img">
                            <input type="file" name="p_img" className="p-img" accept=".jpeg,.jpg,.png," onChange={handleChange}/>
                            <span className='t-red'>*Only JPEG, JPG, PNG allowed</span>
                            {form.p_img && typeof form.p_img === "string" && (
                            <div className="preview">
                                <img src={`http://localhost:5000/uploads/${form.p_img}`} alt="Product" width="120"/>
                            </div>)}
                        </div>

                        <button type="submit" className='add-b'>Add Product</button> 
                </form>
            </div> 
        </>
    )
}

export default Addproduct