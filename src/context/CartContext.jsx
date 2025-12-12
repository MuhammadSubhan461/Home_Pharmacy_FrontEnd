import { createContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product === product._id);

      if (existingItem) {
        // Check stock limit
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`, {
            id: `stock-error-${product._id}`
          });
          return prevCart;
        }

        toast.success(`Updated ${product.name} quantity`, {
          id: `cart-update-${product._id}`
        });
        return prevCart.map(item =>
          item.product === product._id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Check stock limit for new item
        if (quantity > product.stock) {
          toast.error(`Only ${product.stock} items available in stock`, {
            id: `stock-error-${product._id}`
          });
          return prevCart;
        }

        toast.success(`Added ${product.name} to cart`, {
          id: `cart-add-${product._id}`
        });
        return [...prevCart, {
          product: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0]?.url || '/placeholder.png',
          unit: product.unit,
          quantity: quantity,
          stock: product.stock,
          requiresPrescription: product.requiresPrescription
        }];
      }
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => {
        if (item.product === productId) {
          // Check stock limit
          if (quantity > item.stock) {
            toast.error(`Only ${item.stock} items available in stock`, {
              id: `stock-error-${productId}`
            });
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId) => {
    const item = cart.find(item => item.product === productId);
    setCart(prevCart => prevCart.filter(item => item.product !== productId));

    if (item) {
      toast.success(`Removed ${item.name} from cart`, {
        id: `cart-remove-${productId}`
      });
    }
  };

  const clearCart = () => {
    setCart([]);
    toast.success('Cart cleared', {
      id: 'cart-clear'
    });
  };

  // Calculate cart totals
  const getCartTotals = () => {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const deliveryCharges = subtotal >= 500 ? 0 : 50; // Free delivery over Rs. 500
    const total = subtotal + deliveryCharges;

    return {
      subtotal,
      deliveryCharges,
      total,
      itemCount: cart.reduce((total, item) => total + item.quantity, 0)
    };
  };

  // Check if cart has items requiring prescription
  const hasPrescriptionRequired = () => {
    return cart.some(item => item.requiresPrescription);
  };

  // Validate cart for checkout
  const validateCart = () => {
    const errors = [];

    if (cart.length === 0) {
      errors.push('Cart is empty');
    }

    cart.forEach(item => {
      if (item.quantity > item.stock) {
        errors.push(`${item.name}: Only ${item.stock} items available`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  const value = {
    cart,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotals,
    hasPrescriptionRequired,
    validateCart,
    itemCount: cart.reduce((total, item) => total + item.quantity, 0)
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
