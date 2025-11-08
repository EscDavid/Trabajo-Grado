
export const errorHandler = (err, req, res, next) => {
    console.error(`[ERROR] ${err.message}`);
  
    
    if (err.statusCode) {
      return res.status(err.statusCode).json({ error: err.message });
    }
  
    
    res.status(500).json({ error: "Error interno del servidor" });
  };
  