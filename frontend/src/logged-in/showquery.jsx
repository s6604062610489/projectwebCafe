import { useEffect, useState } from "react";
import Navbaradmin from "../../components/nav_admin";
import "./report.css";

function Showquery() {
    const [report, setReport] = useState([]);
    const [grandTotal, setGrandTotal] = useState(0);
    const [selectedMonth, setSelectedMonth] = useState("");

    const months = [
        { value: 1, label: "มกราคม" },
        { value: 2, label: "กุมภาพันธ์" },
        { value: 3, label: "มีนาคม" },
        { value: 4, label: "เมษายน" },
        { value: 5, label: "พฤษภาคม" },
        { value: 6, label: "มิถุนายน" },
        { value: 7, label: "กรกฎาคม" },
        { value: 8, label: "สิงหาคม" },
        { value: 9, label: "กันยายน" },
        { value: 10, label: "ตุลาคม" },
        { value: 11, label: "พฤศจิกายน" },
        { value: 12, label: "ธันวาคม" }
    ];

    const fetchReport = (month = "") => {
        const url = month
            ? `http://localhost:5000/api/receipt/report?month=${month}`
            : `http://localhost:5000/api/receipt/report`;
        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setReport(data.report);
                setGrandTotal(data.grandTotal);
            })
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetchReport();
    }, []);

    const handleMonthChange = (e) => {
        const month = e.target.value;
        setSelectedMonth(month);
        fetchReport(month);
    };

    return (
        <>
            <Navbaradmin />
            <div className="container-report">
                <div className="report-card">
                    <h2>📊 รายงานสินค้าขายดี</h2>

                    <div className="filter">
                        <label>เลือกเดือน: </label>
                        <select value={selectedMonth} onChange={handleMonthChange}>
                            <option value="">ทั้งหมด</option>
                            {months.map((m) => (
                                <option key={m.value} value={m.value}>
                                    {m.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <table className="styled-table">
                        <thead>
                            <tr>
                                <th>รหัสสินค้า</th>
                                <th>สินค้า</th>
                                <th>จำนวนขาย</th>
                                <th>ยอดขายรวม (บาท)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.p_code}</td>
                                    <td>{item.product_name}</td>
                                    <td>{item.total_qty}</td>
                                    <td>{item.total_sales.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h3 className="total">
                        💰 ยอดขายรวมทั้งหมด: {grandTotal.toLocaleString()} บาท
                    </h3>
                </div>
            </div>
        </>
    );
}

export default Showquery;
