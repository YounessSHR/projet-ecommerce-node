const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const path = require('path');
const multer = require('multer');
const app = express();

// Database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ecommerce'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false
}));

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/profiles')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed!'));
    }
});

// Authentication middleware
const authenticateUser = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.status(401).json({ message: 'Please login first' });
    }
};

// User Routes
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, hashedPassword], (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ error: 'Username or email already exists' });
            }
            return res.status(500).json({ error: 'Error registering user' });
        }
        res.json({ message: 'User registered successfully' });
    });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    
    db.query(query, [email], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }
        
        const user = results[0];
        const validPassword = await bcrypt.compare(password, user.password);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        req.session.userId = user.id;
        res.json({ message: 'Logged in successfully' });
    });
});

app.get('/api/profile', authenticateUser, (req, res) => {
    const query = 'SELECT id, username, email, first_name, last_name, phone, address, city, country, profile_image FROM users WHERE id = ?';
    db.query(query, [req.session.userId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(results[0]);
    });
});

app.put('/api/profile', authenticateUser, upload.single('profile_image'), (req, res) => {
    const updates = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        country: req.body.country
    };

    if (req.file) {
        updates.profile_image = '/uploads/profiles/' + req.file.filename;
    }

    const query = 'UPDATE users SET ? WHERE id = ?';
    db.query(query, [updates, req.session.userId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Profile updated successfully' });
    });
});

app.get('/api/products', (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching products' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/categories', (req, res) => {
    const query = 'SELECT * FROM categories';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching categories' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/products/search', (req, res) => {
    const { q } = req.query;
    const query = 'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?';
    const searchTerm = `%${q}%`;
    
    db.query(query, [searchTerm, searchTerm], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error searching products' });
            return;
        }
        res.json(results);
    });
});

app.get('/api/products/category/:categoryId', (req, res) => {
    const categoryId = req.params.categoryId;
    const query = 'SELECT * FROM products WHERE category_id = ?';
    
    db.query(query, [categoryId], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error fetching products' });
            return;
        }
        res.json(results);
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
