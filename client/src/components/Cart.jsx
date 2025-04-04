import React, { useState } from 'react';
import { 
  Button, 
  Typography, 
  List, 
  ListItem, 
  ListItemText,
  Stack, 
  Paper 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeFromCart } from '../features/cartSlice';
import OrderDialog from './OrderDialog'; 

const formatPrice = (price) => {
  return price.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' ₽';
};

const Cart = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const [openOrderDialog, setOpenOrderDialog] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Paper elevation={3} sx={{ p: 4, borderRadius: 2, backgroundColor: '#f9f9f9', maxWidth: '900px', margin: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        Корзина
      </Typography>
      {cartItems.length === 0 ? (
        <Typography>Корзина пуста</Typography>
      ) : (
        <>
          <List sx={{ padding: 0 }}>
            {cartItems.map((item) => (
              <ListItem key={item.id} sx={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>
                <ListItemText
                  primary={item.title}
                  secondary={`${item.quantity} × ${formatPrice(item.price)}`}
                />
                <Button 
                  variant="outlined" 
                  color="error"
                  onClick={() => dispatch(removeFromCart(item))}
                >
                  Удалить
                </Button>
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Итого: {formatPrice(total)}
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => setOpenOrderDialog(true)}
            >
              Оформить заказ
            </Button>
            <Button 
              variant="outlined" 
              color="error"
              onClick={() => dispatch(clearCart())}
            >
              Очистить всю корзину
            </Button>
          </Stack>
          <OrderDialog 
            open={openOrderDialog}
            onClose={() => setOpenOrderDialog(false)}
            cartItems={cartItems}
          />
        </>
      )}
    </Paper>
  );
};

export default Cart;
