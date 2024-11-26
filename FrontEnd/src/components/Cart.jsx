import React, { useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editProduct } from '../Redux/productSlice'; // Import the correct slice for product updates
import { CartContext } from './CartManager'; // Import CartContext
import '../styles/Cart.css';

const Cart = ({ isOpen, toggleCart }) => {
  const dispatch = useDispatch(); // Use dispatch to dispatch actions
  const { cartItems, removeFromCart, clearCart, addToCart } = useContext(CartContext); // Access context values
  const [quantitiesToUpdate, setQuantitiesToUpdate] = useState({});
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);

  const validCoupons = {
    'OFERTA10': 10,
    'OFERTA20': 20
  };

  // Access loading and error states from Redux product slice
  const { loading, error } = useSelector((state) => state.products || {}); // Use products from your existing slice

  useEffect(() => {
    const initialQuantities = {};
    cartItems.forEach(item => {
      initialQuantities[item.id] = item.quantity;
    });
    setQuantitiesToUpdate(initialQuantities);
  }, [cartItems]);

  const handleQuantityChange = (productId, value) => {
    const newQuantity = parseInt(value, 10) || 1;
    setQuantitiesToUpdate({ ...quantitiesToUpdate, [productId]: newQuantity });
  };

  const handleUpdateQuantity = (product) => {
    const newQuantity = quantitiesToUpdate[product.id] || product.quantity;

    if (newQuantity > product.stock) {
      alert(`No hay suficiente stock para ${product.name}.`);
    } else if (newQuantity < 1) {
      alert('La cantidad debe ser al menos 1.');
    } else {
      addToCart(product, newQuantity - product.quantity);

      // Update product stock here using the editProduct action
      const updatedProduct = {
        id: product.id,
        description: product.description,  // Ensure full product details are passed
        price: product.price,
        stock: product.stock - (newQuantity - product.quantity),  // Adjust the stock based on the quantity change
        categoryId: product.categoryId,
        imageId: product.imageId,
      };

      dispatch(editProduct(updatedProduct)); // Dispatch editProduct to update product stock
    }
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = ((totalPrice * discount) / 100).toFixed(2);
  const discountedPrice = (totalPrice - discountAmount).toFixed(2);

  const applyCoupon = () => {
    if (validCoupons[coupon]) {
      setDiscount(validCoupons[coupon]);
      alert(`Cupón aplicado: ${validCoupons[coupon]}% de descuento`);
    } else {
      alert('Cupón no válido');
      setDiscount(0);
    }
  };

  const handlePurchase = async () => {
    try {
      const token = localStorage.getItem("access_token");

      // Loop through each cart item and update stock
      for (const item of cartItems) {
        const updatedProduct = {
          id: item.id,
          description: item.description,
          price: item.price,
          stock: item.stock - item.quantity,  // Reduce stock
          categoryId: item.categoryId,
          imageId: item.imageId,
        };

        // Dispatch the editProduct action for each item
        await dispatch(editProduct(updatedProduct));
      }

      alert("¡Compra realizada con éxito!");
      clearCart(); // Empty the cart after the purchase is successful
    } catch (error) {
      alert(`Error durante la compra: ${error.message}`);
    }
  };

  return (
    <div className={`cart-container ${isOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h2>Carrito de Compras</h2>
        <button onClick={toggleCart} className="close-button">X</button>
      </div>
      <div className="cart-content">
        {cartItems.length === 0 ? (
          <p>Tu carrito está vacío</p>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="cart-item">
                <p>{item.name} - ${item.price} x {item.quantity}</p>
                <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                <label>Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={quantitiesToUpdate[item.id] !== undefined ? quantitiesToUpdate[item.id] : item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                />
                <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
              </div>
            ))}
 
            {/* Coupon section */}
            <div className="coupon-section">
              <label htmlFor="coupon">Cupón de descuento:</label>
              <input
                type="text"
                id="coupon"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                placeholder="Ingresa tu cupón"
              />
              <button onClick={applyCoupon}>Aplicar Cupón</button>
            </div>
 
            {/* Show discount if applied */}
            {discount > 0 && (
              <>
                <p>Descuento aplicado: {discount}%</p>
                <p>Total descuento: -${discountAmount}</p>
              </>
            )}
 
            <div className="total">
              Total con descuento: ${discountedPrice}
            </div>
 
            {/* Checkout button */}
            <button className="checkout-button" onClick={handlePurchase} disabled={loading}>
              {loading ? 'Procesando...' : 'Comprar'}
            </button>
            {error && <p className="error-message">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
