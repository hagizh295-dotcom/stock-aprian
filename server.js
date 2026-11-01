const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database('./database.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS stok (id INTEGER PRIMARY KEY, nama TEXT, harga TEXT, stok INTEGER, deskripsi TEXT, gambar TEXT, vip INTEGER)`);
  db.run(`CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY, nama TEXT, nomorWA TEXT, tanggal DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.get("SELECT COUNT(*) as c FROM stok", (e,r)=>{
    if(r.c===0){
      const data=[
        ["AM Premium 2Ribu 1 Tahun","Rp 2.000",99,"Alight Motion Premium 1 tahun","https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500",0],
        ["Nokos Murah OTP Cepet Harga 4Ribu","Rp 4.000",50,"Nomor kosong murah OTP cepat","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500",0],
        ["Bluestack Premium Harga 2Ribu","Rp 2.000",99,"Bluestack Premium root","https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500",0],
        ["GGMP Premium Harga 2Ribu","Rp 2.000",99,"GG Mod Player Premium","https://images.unsplash.com/photo-1604586376807-f73185cf5867?w=500",0],
        ["MSI Premium Harga 2Ribu","Rp 2.000",99,"MSI App Player Premium","https://images.unsplash.com/photo-1591488320449-011701bb6704?w=500",0],
        ["Request All Game Harga 2Ribu","Rp 2.000",99,"Request all game cheat","https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500",0],
        ["VIP Getkey Bypass Roblox Harga 3Ribu 2 Hari","Rp 3.000",30,"VIP Getkey Bypass Roblox 2 hari","https://images.unsplash.com/photo-1604586376807-f73185cf5867?w=500",1]
      ];
      const stmt=db.prepare("INSERT INTO stok VALUES (NULL,?,?,?,?,?,?)");
      data.forEach(d=>stmt.run(d));stmt.finalize();
    }
  });
});

app.get('/api/stok',(req,res)=>{db.all("SELECT * FROM stok",(e,rows)=>res.json(rows||[]))});
app.post('/api/beli',(req,res)=>{const{nama,nomorWA}=req.body;db.run("INSERT INTO orders (nama,nomorWA) VALUES (?,?)",[nama,nomorWA]);console.log(`ORDER: ${nama} - ${nomorWA}`);res.json({success:true})});
app.get('/api/orders',(req,res)=>{db.all("SELECT * FROM orders ORDER BY id DESC",(e,rows)=>res.json(rows||[]))});
app.get('/',(req,res)=>res.sendFile(path.join(__dirname,'index.html')));
app.listen(PORT,()=>console.log(`aprian stok jalan di ${PORT}`));
