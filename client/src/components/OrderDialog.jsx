import React, { useState } from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Tabs, 
  Tab, 
  Box, 
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../features/ordersSlice';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const OrderDialog = ({ open, onClose, cartItems }) => {
  const [tabValue, setTabValue] = useState(0);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = () => {
    const orderData = {
      user_id: user.id,
      user_email: user.email,
      products: cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity
      })),
      phone_number: phone,
      delivery_method: tabValue === 0 ? 'pickup' : 'delivery',
      address: tabValue === 1 ? address : null
    };
    dispatch(createOrder(orderData));
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 3000);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      {showSuccess && (
        <Dialog open={true} onClose={() => setShowSuccess(false)}>
          <DialogTitle>Спасибо за заказ!</DialogTitle>
          <DialogContent>
            <Typography>С Вами свяжутся в ближайшее время для его подтверждения.</Typography>
          </DialogContent>
        </Dialog>
      )}
      <DialogTitle>Оформление заказа</DialogTitle>
      <DialogContent>
        <Typography variant="h6" sx={{ mb: 2 }}>Ваш заказ:</Typography>
        <List>
          {cartItems.map(item => (
            <ListItem key={item.id}>
              <ListItemText 
                primary={item.title} 
                secondary={`${item.quantity} x ${item.price} ₽`}
              />
            </ListItem>
          ))}
        </List>

        <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)}>
          <Tab label="Самовывоз" />
          <Tab label="Доставка" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TextField
            fullWidth
            label="Ваш контактный номер телефона"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          <Typography>Забрать заказ можно по адресу: г. Москва, ул. Примерная, д. 1</Typography>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <TextField
            fullWidth
            label="Ваш контактный номер телефона"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            margin="normal"
            required
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Адрес доставки"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            margin="normal"
            required
          />
        </TabPanel>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!phone || (tabValue === 1 && !address)}
        >
          Подтвердить заказ
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDialog;
