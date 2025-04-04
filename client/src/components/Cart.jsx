import React, { useState } from 'react';
import { 
  Button, 
  Typography, 
  Box, 
  List, 
  ListItem, 
  ListItemText,
  Stack 
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../features/cartSlice';
import OrderDialog from './OrderDialog';

const Cart = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const [openOrderDialog, setOpenOrderDialog] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Корзина
      </Typography>
      {cartItems.length === 0 ? (
        <Typography>Корзина пуста</Typography>
      ) : (
        <>
          <List>
            {cartItems.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={item.title}
                  secondary={`${item.quantity} × ${item.price} ₽`}
                />
                <Typography>{item.price * item.quantity} ₽</Typography>
              </ListItem>
            ))}
          </List>
          <Typography variant="h6" sx={{ mt: 2 }}>
            Итого: {total} ₽
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
              Очистить корзину
            </Button>
          </Stack>
          <OrderDialog 
            open={openOrderDialog}
            onClose={() => setOpenOrderDialog(false)}
            cartItems={cartItems}
          />
        </>
      )}
    </Box>
  );
};

export default Cart;
