import React from 'react'
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBBtn } from 'mdb-react-ui-kit';
import { Button} from 'react-bootstrap'
import axios from 'axios'
import Navbar from "../component/navbar"



export default class Home extends React.Component{
    constructor(){
        super()
        this.state = {
            token : "",
            adminName : "",
            adminCount  : 0,
            customerCount : 0,
            productCount : 0,
            transaksiCount : 0
        }
        if(localStorage.getItem('token')){
            this.state.token = localStorage.getItem('token')
        }
        else{
            window.location = '/login'
        }
    }
    getAdmin = () => {
        let admin = localStorage.getItem('name')
        let url = "http://localhost:8080/admin"

        axios.get(url)
        .then(res => {
            this.setState ({
                adminName : admin,
                adminCount : res.data.count
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }
    getCustomer = () => {
        let url = "http://localhost:8080/customer"

        axios.get(url)
        .then(res => {
            this.setState ({
                customerCount : res.data.count
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    getProduct = () => {
        let url = "http://localhost:8080/product"

        axios.get(url)
        .then(res => {
            this.setState ({
                productCount : res.data.count
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    headerConfig=() =>{
        let header = {
            headers: {Authorization: `Bearer ${this.state.token}`}
        }
        return header
    }

    getProduct = () => {
            let url = "http://localhost:8080/product"

            axios.get(url, this.headerConfig())
            .then(res => {
                this.setState({
                    productCount: res.data.count
                })
            })
            .catch(err => {
                console.log(err.message)
            })
        }

    getTransaksi = () => {
        let url = "http://localhost:8080/transaksi"

        axios.get(url)
        .then(res => {
            this.setState ({
                transaksiCount : res.data.count
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    componentDidMount = () => {
        this.getAdmin()
        this.getCustomer()
        this.getProduct()
        this.getTransaksi()
    }
    render(){
        return(
            <div>
                <Navbar />
                <Button className="m-3" variant="dark">Selamat Datang {this.state.adminName}</Button> 
                <div className ="m-3">
                <MDBRow>
                <MDBCol sm='2'>
                    <MDBCard className ="bg-light">
                    <MDBCardBody>
                        <MDBCardTitle></MDBCardTitle>
                        <img src="https://img.icons8.com/ios-filled/100/000000/admin-settings-male.png"/>
                        <MDBCardText>Total Admin</MDBCardText>
                        <MDBCardText className="fw-bold">{this.state.adminCount}</MDBCardText>
                    </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol sm='2'>
                    <MDBCard  className ="bg-light">
                    <MDBCardBody>
                        <MDBCardTitle></MDBCardTitle>
                        <img src="https://img.icons8.com/ios-filled/100/000000/groups.png"/>
                        <MDBCardText>Total Customer</MDBCardText>
                        <MDBCardText className="fw-bold"> {this.state.customerCount} </MDBCardText>
                    </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol sm='2'>
                    <MDBCard  className ="bg-light">
                    <MDBCardBody>
                        <MDBCardTitle></MDBCardTitle>
                        <img src="https://img.icons8.com/ios-filled/100/000000/product.png"/>
                        <MDBCardText>Total Product</MDBCardText>
                        <MDBCardText className="fw-bold"> {this.state.productCount} </MDBCardText>
                    </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                <MDBCol sm='2'>
                    <MDBCard  className ="bg-light">
                    <MDBCardBody>
                        <MDBCardTitle></MDBCardTitle>
                        <img src="https://img.icons8.com/ios-filled/100/000000/split-transaction.png"/>
                        <MDBCardText>Total Transaksi</MDBCardText>
                        <MDBCardText className="fw-bold"> {this.state.transaksiCount} </MDBCardText>
                    </MDBCardBody>
                    </MDBCard>
                </MDBCol>
                </MDBRow>
                </div>
            </div>

        )
    }
}