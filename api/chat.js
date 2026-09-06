export default async function handler(req, res) {
  // รับเฉพาะคำสั่งแบบ POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { question } = req.body;
  
  try {
    // ยิงคำขอไปหา API ของมหาวิทยาลัยจากฝั่งเซิร์ฟเวอร์ (จะไม่ติด CORS)
    const response = await fetch('https://gen.ai.kku.ac.th/iccsacth/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer sk_lC6DpEEqWK8BEbbJfMY4fhnw3IcwN4hrlR7M31g1xiPP6kdcLfrJv4hveT6hYHmu'
      },
      body: JSON.stringify({
        model: "gemini-3.1-pro-preview",
        messages: [
            { 
                role: "system", 
                content: "คุณคือผู้เชี่ยวชาญด้านระบบเครือข่ายคอมพิวเตอร์ หน้าที่ของคุณคือการวิเคราะห์อุปกรณ์ที่ผู้ใช้พิมพ์มา ว่ามีการสื่อสารข้อมูลแบบใดระหว่าง Simplex (ทิศทางเดียว), Half-duplex (กึ่งสองทิศทาง) หรือ Full-duplex (สองทิศทาง) พร้อมทั้งอธิบายเหตุผลสั้นๆ เข้าใจง่าย หากผู้ใช้พิมพ์สิ่งที่ไม่ใช่อุปกรณ์สื่อสาร หรือเป็นคำถามทั่วไป ให้แจ้งว่าไม่พบข้อมูล" 
            },
            { role: "user", content: question }
        ],
        stream: false
      })
    });

    const data = await response.json();
    
    // ส่งคำตอบกลับไปให้หน้าเว็บ
    res.status(200).json({ answer: data.choices[0].message.content });
    
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
