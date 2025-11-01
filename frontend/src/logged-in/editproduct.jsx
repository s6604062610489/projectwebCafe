import "./editproduct.css";
import Navbaradmin from "../../components/nav_admin";
import { useEffect, useState } from "react";

function Editproduct() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    p_name: "",
    p_details: "",
    p_price: "",
    p_quantity: "",
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("ต้องการลบสินค้านี้หรือไม่?")) {
      try {
        await fetch(`http://localhost:5000/api/products/${id}`, {
          method: "DELETE",
        });
        setProducts(products.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      p_name: product.p_name,
      p_details: product.p_details,
      p_price: product.p_price,
      p_quantity: product.p_quantity,
      p_img: product.p_img,
    });
    setPreview(`http://localhost:5000/uploads/${product.p_img}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData({ ...formData, p_img: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSaveEdit = async () => {
    try {
      const form = new FormData();
      form.append("p_name", formData.p_name);
      form.append("p_details", formData.p_details);
      form.append("p_price", formData.p_price);
      form.append("p_quantity", formData.p_quantity);

      if (formData.p_img && typeof formData.p_img === "string") {
        form.append("old_img", formData.p_img);
      } else if (formData.p_img && typeof formData.p_img !== "string") {
        form.append("p_img", formData.p_img);
      }

      const res = await fetch(
        `http://localhost:5000/api/products/${editingProduct._id}`,
        {
          method: "PUT",
          body: form,
        }
      );

      if (res.ok) {
        const result = await res.json();
        setProducts((prev) =>
          prev.map((p) =>
            p.p_code === editingProduct.p_code ? result.updated : p
          )
        );
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <>
      <Navbaradmin />

      <div className="container-edit">
        <div className="title-edit">
          <h1>Edit Product</h1>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>รหัสสินค้า</th>
              <th>รูป</th>
              <th>ชื่อสินค้า</th>
              <th>รายละเอียด</th>
              <th>ราคา</th>
              <th>จำนวน</th>
              <th>แก้ไข/ลบ</th>
            </tr>
          </thead>
          <tbody>
            {products.map((item) => (
              <tr key={item._id}>
                <td>{item.p_code}</td>
                <td>
                  <img
                    src={`http://localhost:5000/uploads/${item.p_img}`}
                    alt={item.name}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                    }}
                  />
                </td>
                <td>{item.p_name}</td>
                <td>{item.p_details}</td>
                <td>{item.p_price} Bath</td>
                <td>{item.p_quantity}</td>
                <td>
                  <button
                    className="btn-edit"
                    onClick={() => handleEdit(item)}
                  >
                    แก้ไข
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(item._id)}
                  >
                    ลบ
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingProduct && (
        <div className="edit-modal">
          <div className="edit-modal-content">
            <div className="title-edit">
              <h1>แก้ไขสินค้า: {editingProduct.p_code}</h1>
            </div>

            <label>ชื่อสินค้า</label>
            <input
              type="text"
              name="p_name"
              value={formData.p_name}
              onChange={handleChange}
            />

            <label>รายละเอียด</label>
            <textarea
              name="p_details"
              value={formData.p_details}
              onChange={handleChange}
            />

            <label>ราคา</label>
            <input
              type="number"
              name="p_price"
              value={formData.p_price}
              onChange={handleChange}
            />

            <label>จำนวน</label>
            <input
              type="number"
              name="p_quantity"
              value={formData.p_quantity}
              onChange={handleChange}
            />

            <label>เปลี่ยนรูปสินค้า</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />

            {preview && (
              <img src={preview} alt="preview" className="preview-img" />
            )}

            <div className="edit-modal-buttons">
              <button onClick={handleSaveEdit} className="btn-save">
                บันทึก
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="btn-cancel"
              >
                ยกเลิก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Editproduct;
