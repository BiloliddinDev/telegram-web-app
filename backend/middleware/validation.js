const validateProduct = (req, res, next) => {
  const { name, price, stock } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: "Mahsulot nomi majburiy" });
  }

  if (!price || isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "To'g'ri narx kiriting" });
  }

  if (stock !== undefined && (isNaN(stock) || stock < 0)) {
    return res.status(400).json({ error: "To'g'ri miqdor kiriting" });
  }

  next();
};

const validateSale = (req, res, next) => {
  const { productId, quantity, price } = req.body;

  if (!productId) {
    return res.status(400).json({ error: "Mahsulot ID majburiy" });
  }

  if (!quantity || isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({ error: "To'g'ri miqdor kiriting" });
  }

  if (!price || isNaN(price) || price <= 0) {
    return res.status(400).json({ error: "To'g'ri narx kiriting" });
  }

  next();
};

const validateSeller = (req, res, next) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber || phoneNumber.trim().length === 0) {
    return res.status(400).json({ error: "Telefon raqami majburiy" });
  }

  next();
};

module.exports = { validateProduct, validateSale, validateSeller };

