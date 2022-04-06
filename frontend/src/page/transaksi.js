import React from "react"
import Navbar from "../component/navbar"
import axios from "axios"
import TransactionsList from "../component/TransactionsList"
 
export default class Transaction extends React.Component{
    constructor(){
        super()
        this.state = {
            transaction: [],
            selectedItem: null
        }
 
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }

    }

    // headerConfig = () => {
    //     let header = {
    //         headers: { Authorization: `Bearer ${this.state.token}` }
    //     }
    //     return header
    // }

    getTransaction = () => {
        let url = "http://localhost:8080/transaksi"
 
        axios.get(url)
        .then(res => {
            this.setState({transaction: res.data.transaksi})
        })
        .catch(error => {
                console.log(error);
        })
    }

    componentDidMount(){
        this.getTransaction()
    }




    render(){
        return (
            <div>
                <Navbar />
                {/* {console.log(this.state.transaction)} */}
                <div className="container">
                    <h3 className="text-bold text-dark mt-2">Transactions List</h3>
                    { this.state.transaction.map(item => (
                        <TransactionsList
                        key = {item.transaksi_id}
                        transaction_id = {item.transaksi_id}
                        customer_name = {item.customer.name}
                        customer_address = {item.customer.address}
                        time = {item.waktu}
                        products = {item.detail_transaksi}
                         />
                    )) }
                </div>
            </div>
        )
    }
}
