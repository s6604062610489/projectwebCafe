const express = require('express');
const router = express.Router();
const Product = require('../models/Products.js');
const multer = require('multer');
const path = require('path');

const uploadPath = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

router.post('/addproduct', upload.single("p_img"), async (req, res) => {
  try {
    const { p_name, p_price, p_details, p_quantity, category } = req.body;
    const p_img = req.file ? req.file.filename : null;

    if (!p_name || !p_price || !category) {
      return res.status(400).json({ message: 'กรอกข้อมูลให้ครบถ้วน' });
    }

    let existingProduct = await Product.findOne({ p_name });
    if (existingProduct) {
      existingProduct.p_quantity += Number(p_quantity) || 1;
      await existingProduct.save();
      return res.status(200).json({ message: 'Update quantity success', product: existingProduct });
    }

    const lastProduct = await Product.findOne().sort({ p_code: -1 }).exec();
    let newCode;
    if (!lastProduct || !lastProduct.p_code) {
      newCode = "P001";
    } else {
      const lastNum = parseInt(lastProduct.p_code.replace("P", ""), 10) || 0;
      const nextNum = lastNum + 1;
      newCode = `P${nextNum.toString().padStart(3, "0")}`;
    }

    const newProduct = new Product({
      p_code: newCode,
      p_name,
      p_price,
      p_details,
      p_img,
      p_quantity: p_quantity || 1,
      category
    });

    await newProduct.save();
    res.status(201).json({ message: 'Add menu Success', product: newProduct });
  } catch (err) {
    res.status(500).json({ message: 'Can not add menu', error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let products;
    if (category && category !== "all") {
      products = await Product.find({ category });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการลบ" });
    }
    res.status(200).json({ message: "ลบสินค้าสำเร็จ", deleted });
  } catch (err) {
    res.status(500).json({ message: "ลบสินค้าไม่สำเร็จ", error: err.message });
  }
});

router.put("/:id", upload.single("p_img"), async (req, res) => {
  try {
    console.log("🟢 req.body:", req.body);
    console.log("🟢 req.file:", req.file);

    const updateFields = {
      p_name: req.body.p_name,
      p_details: req.body.p_details,
      p_price: req.body.p_price,
      p_quantity: req.body.p_quantity,
    };

    if (req.file) {
      updateFields.p_img = req.file.filename;
    }
    else if (req.body.old_img) {
      updateFields.p_img = req.body.old_img;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "ไม่พบสินค้าที่ต้องการแก้ไข" });
    }

    res.status(200).json({ message: "แก้ไขสินค้าสำเร็จ", updated });
  } catch (err) {
    console.error("❌ Error updating product:", err);
    res.status(500).json({ message: "แก้ไขสินค้าไม่สำเร็จ", error: err.message });
  }
});

module.exports = router;
