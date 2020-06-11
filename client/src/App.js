import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';


import Header from './components/Header';
import Landing from './components/Landing';
import About from './components/About';
import Shop from './components/Shop';
import Chatbot from './components/Chatbot';

const App = () => (
    <div>
       <BrowserRouter>
           <div className="container">
               <Header />
               <Route exact path="/" component={Landing} />
               <Route exact path="/about" component={About} />
               <Route exact path="/shop" component={Shop} />
               <Chatbot />
           </div>
       </BrowserRouter>
    </div>
);

export default App;
