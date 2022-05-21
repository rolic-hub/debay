
import './App.css';
import {Routes, Route} from 'react-router-dom';
import Home from './components/Home';
import Categories from './components/Categories';
import Product from './components/Product';
import Cart from './components/Cart';



const App = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/category/product/:id" element={<Product />} />
    <Route path="/category/:product" element={<Categories />} />
    <Route path="/category/product/cart" element={<Cart />} />
  </Routes>
);
export default App;
