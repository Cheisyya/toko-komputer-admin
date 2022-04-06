import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Home from './page/home'
import Login from './page/login'
import Customer from './page/customer'
import Transaksi from  './page/transaksi'
import Admin from './page/admin'
import Product from  './page/product'

export default class Main extends React.Component{
    render() {
        return(
            <Switch>
                <Route exact path='/' component={Home}/>
                <Route exact path='/login' component={Login}/>
                <Route exact path='/customer' component={Customer}/>
                <Route exact path='/transaksi' component={Transaksi}/>
                <Route exact path='/admin' component={Admin}/>
                <Route exact path='/product' component={Product}/>
            </Switch>
        )
    }
}