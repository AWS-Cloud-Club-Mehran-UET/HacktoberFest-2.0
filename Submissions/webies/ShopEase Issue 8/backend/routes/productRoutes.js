const express = require('express')
const{
    addProducts,
     showProducts,
    deleteProduct,
     editProduct,
     showOneProduct
    } = require('../controllers/handleProducts')
const restrictUserLogin = require('../middlewares/auth.middlewares')

const router = express.Router()

router.route("/")
  .all(restrictUserLogin) 
  .get(showProducts)
  .post(addProducts);
  
router.route('/:id').all(restrictUserLogin).delete(deleteProduct).put(editProduct).get(showOneProduct)

module.exports=router