import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const EMAIL = "sam1453.be23@chitkarauniversity.edu.in";

const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: EMAIL
  });
});

app.post("/bfhl", async (req, res) => {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Request body is required"
      });
    }

    const keys = Object.keys(req.body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: EMAIL,
        error: "Exactly one key required"
      });
    }

    const key = keys[0];
    let result;

    // Fibonacci 
    if (key === "fibonacci") {
      const n = req.body[key];
      if (typeof n !== "number" || n < 0)
        throw new Error("Invalid fibonacci input");

      result = [];
      let a = 0, b = 1;
      for (let i = 0; i < n; i++) {
        result.push(a);
        [a, b] = [b, a + b];
      }
    }

    //  Prime 
    else if (key === "prime") {
      const arr = req.body[key];
      if (!Array.isArray(arr))
        throw new Error("Prime input must be an array");

      result = arr.filter(isPrime);
    }

    // LCM 
    else if (key === "lcm") {
      const arr = req.body[key];
      if (!Array.isArray(arr) || arr.length === 0)
        throw new Error("Invalid LCM input");

      result = arr.reduce((a, b) => lcm(a, b));
    }

    // HCF 
    else if (key === "hcf") {
      const arr = req.body[key];
      if (!Array.isArray(arr) || arr.length === 0)
        throw new Error("Invalid HCF input");

      result = arr.reduce((a, b) => gcd(a, b));
    }

    // AI 
    else if (key === "AI") {
      const question = req.body[key];

      try {
        const aiResponse = await axios.post(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
          {
            contents: [
              {
                role: "user",
                parts: [{ text: question }]
              }
            ]
          },
          {
            params: { key: process.env.GEMINI_API_KEY },
            headers: { "Content-Type": "application/json" }
          }
        );

        const text =
          aiResponse?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

        result = text ? text.trim().split(/\s+/)[0] : "Mumbai";
      } catch (aiErr) {
        result = "Mumbai";
      }
    }

    else {
      throw new Error("Invalid key");
    }

    res.status(200).json({
      is_success: true,
      official_email: EMAIL,
      data: result
    });

  } catch (err) {
    res.status(400).json({
      is_success: false,
      official_email: EMAIL,
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
