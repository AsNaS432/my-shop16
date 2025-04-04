import React from 'react';
import { Button, ButtonGroup } from '@mui/material';

const FilterPanel = ({ onFilterChange }) => {
 const categories = [
   { label: 'Все', value: 'Все' },
   { label: 'Электроника', value: 'electronics' },
   { label: 'Одежда', value: 'clothing' },
   { label: 'Книги', value: 'books' },
 ];


 return (
   <ButtonGroup variant="contained" sx={{ my: 2 }}>
     {categories.map((category) => (
       <Button key={category.value} onClick={() => {

         console.log('Selected Category:', category.value);
         onFilterChange(category.value);

       }}>
         {category.label}

       </Button>
     ))}
   </ButtonGroup>
 );
};

export default FilterPanel;
