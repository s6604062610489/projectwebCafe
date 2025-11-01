const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const Product = require('../models/Products');
const Member = require('../models/Member');

router.post('/create', async (req, res) => {
    try {
        const { member_id, order_item, total_price } = req.body;

        if (!order_item || !Array.isArray(order_item) || order_item.length === 0) {
            return res.status(400).json({ message: "No order items provided" });
        }

        if (!total_price || total_price <= 0) {
            return res.status(400).json({ message: "Invalid total price" });
        }

        // ตรวจสอบ member ถ้าไม่ใช่ guess
        let member = null;
        if (member_id !== "guess") {
            member = await Member.findOne({ member_id });
            if (!member) {
                return res.status(404).json({ message: "Member not found" });
            }
        }

        const orderCount = await Receipt.countDocuments();

        // สร้างใบเสร็จใหม่
        const receipt = new Receipt({
            order_num: orderCount + 1,
            member_id,
            order_item,
            total_price
        });

        await receipt.save();

        // ถ้าเป็นสมาชิก ให้บวก point
        let addPoint = 0;
        if (member) {
            addPoint = Math.floor(total_price * 0.3);
            member.point += addPoint;
            await member.save();
        }

        res.json({
            message: "✅ Receipt created successfully",
            receipt,
            earned_point: addPoint,
            updatedPoint: member ? member.point : null
        });
    } catch (err) {
        console.error("❌ Error creating receipt:", err);
        res.status(500).json({ message: "Server Error" });
    }
});

router.get('/report', async (req, res) => {
  try {
    const month = parseInt(req.query.month);

    const matchStage = [];

    if (!isNaN(month)) {
      matchStage.push({
        $addFields: {
          localOrderTime: {
            $add: ["$order_time", 7 * 60 * 60000] // ชดเชยเวลาไทย (UTC+7)
          }
        }
      });
      matchStage.push({
        $match: {
          $expr: { $eq: [{ $month: "$localOrderTime" }, month] }
        }
      });
    }

    const report = await Receipt.aggregate([
      ...matchStage,
      { $unwind: "$order_item" },
      {
        $group: {
          _id: {
            p_code: "$order_item.p_code",
            p_name: "$order_item.p_name"
          },
          total_qty: { $sum: "$order_item.p_quantity" },
          total_sales: {
            $sum: { $multiply: ["$order_item.p_price", "$order_item.p_quantity"] }
          }
        }
      },
      { $sort: { total_sales: -1 } }
    ]);

    const grandTotal = report.reduce((sum, item) => sum + item.total_sales, 0);

    res.json({
      report: report.map(item => ({
        p_code: item._id.p_code,
        product_name: item._id.p_name,
        total_qty: item.total_qty,
        total_sales: item.total_sales
      })),
      grandTotal
    });
  } catch (err) {
    console.error("❌ Error generating report:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
