import express from 'express';
import client from '../app.js'; // Import the PostgreSQL client
const router = express.Router();

// ดึงข้อมูลผู้ใช้ทั้งหมด
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM std'); // ดึงข้อมูลจากฐานข้อมูล
        res.json(result.rows); // ส่งผลลัพธ์กลับเป็น JSON
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// เพิ่มผู้ใช้ใหม่
router.post('/add', async (req, res) => {
    const { name, email, age } = req.body; // ดึงข้อมูลจาก request body

    try {
        // ตรวจสอบว่าข้อมูลที่จำเป็นมีอยู่หรือไม่
        if (!name || !email || !age) {
            return res.status(400).json({ error: 'Name, email, and age are required' });
        }

        // เพิ่มข้อมูลผู้ใช้ลงในฐานข้อมูล
        const result = await pool.query(
            'INSERT INTO std (name, email, age) VALUES ($1, $2, $3) RETURNING *',
            [name, email, age]
        );

        res.status(201).json(result.rows[0]); // ส่งข้อมูลผู้ใช้ที่ถูกสร้างกลับ
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// UPDATE a user
router.put('/update/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const result = await client.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send('User not found');
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// DELETE a user
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await client.query('DELETE FROM std WHERE id = $1 RETURNING *', [id]);
        
        if (result.rowCount === 0) {
            return res.status(404).send('User not found');
        }
        
        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

export default router; 