import React from 'react'
// import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol, MDBBtn } from 'mdb-react-ui-kit';
// import { Button} from 'react-bootstrap'
import axios from 'axios'
import CustomerList from "../component/customerList"
import { Modal, Button, Form } from 'react-bootstrap'
import Navbar from "../component/navbar"


export default class Home extends React.Component{
    constructor(){
        super()
        this.state = {
            customers : [], 
            isModalOpen: false,
            name : "",
            phone: "",
            address: "",
            image: null,
            username : "",
            password : "",
            action : "insert"
        }
        if(localStorage.getItem('token')){
            this.state.token = localStorage.getItem('token')
        }
        else{
            window.location = '/login'
        }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    handleFile = (e) => {
        this.setState({
            image : e.target.files[0]
        })
    }

    handleSave = (e) => {
        e.preventDefault()
        // setting data
        let form = new FormData()
            form.append("name",this.state.name)
            form.append("phone",this.state.phone)
            form.append("address",this.state.address)
            form.append("image",this.state.image)
            form.append("username",this.state.username)
            form.append("password",this.state.password)
        
            let url = ""
   
            if (this.state.action === "insert") {
                url = "http://localhost:8080/customer"
    
                axios.post(url, form)
                .then(res => {
                    this.getCustomer()
                   this.handleClose()
                })
                .catch(err => {
                   console.log(err.message)
                })
            }
            else if (this.state.action === "update"){
                url = "http://localhost:8080/customer/" + this.state.customer_id
    
                axios.put(url, form)
                .then(res => {
                    this.getCustomer()
                   this.handleClose()
                })
                .catch(err => {
                   console.log(err.message)
                })
            }
     
     }

    getCustomer = () => {
        let url = "http://localhost:8080/customer"

        axios.get(url)
        .then(res => {
            this.setState ({
                customers : res.data.customer
            })
        })
        .catch(err => {
            console.log(err.message)
        })
    }

    handleAdd = () => {
        // console.log('add')
        this.setState({
            isModalOpen: true,
            name : "",
            phone: "",
            address: "",
            image: null,
            username : "",
            password : "",
             action : "insert"
        })
    }

    handleDrop = (customer_id) => {
        let url = "http://localhost:8080/customer/" + customer_id

        if(window.confirm("Apakah Anda yakin ingni menghapus data tersebut?")) {
            axios.delete(url)
            .then(res => {
                console.log(res.message)
                this.getPegawai()
            })
            .catch(err => {
                console.log(err.message)
            })
        }
    }


    handleEdit = (selectedItem) =>{
        this.setState({
            isModalOpen: true,
            customer_id: selectedItem.customer_id,
            name: selectedItem.name,
            phone: selectedItem.phone,
            address: selectedItem.address,
            image: null,
            username: selectedItem.username,
            password: "",
            action: "update"
        })
        // console.log(selectedItem)
    }





    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }



    componentDidMount = () => {
        this.getCustomer()
    }

    render() {
        return (
          
            <div>
                <Navbar />
                <div className="container">
                    <div className='mb-4 mt-4'>
                        <h6>Data Customer</h6>
                        <button className='btn btn-dark mb-3' onClick={() => this.handleAdd()}>Tambah Data</button>
                    </div>
                    <div className="row">
                        {this.state.customers.map((item, index) => {
                            return(
                            <CustomerList key={index}
                                nameImage={item.image}
                                image={"http://localhost:8080/image/customer/" + item.image}
                                name={item.name}
                                phone={item.phone}
                                address={item.address}
                                onEdit={() => this.handleEdit(item)}
                                onDrop={() => this.handleDrop(item.customer_id)}
                            />
                            )
                        })}
                    </div>
                </div>
                 {/* ini modal */}
                 <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Customer</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={e => this.handleSave(e)}>
                        <Modal.Body>
                            <Form.Group className="mb-3" controlId="name">
                                <Form.Label>Name</Form.Label>
                                <Form.Control type="text" name="name" placeholder="Masukkan Nama"
                                    value={this.state.name} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="phome">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="number" name="phone" placeholder="Masukkan nomer Telepon"
                                    value={this.state.phone} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="address">
                                <Form.Label>Address</Form.Label>
                                <Form.Control type="text" name="address" placeholder="Masukkan Alamat"
                                    value={this.state.address} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="image">
                                <Form.Label>Image</Form.Label>
                                <Form.Control type="file" name="image" placeholder="Masukkan Foto"
                                   onChange={this.handleFile} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" name="username" placeholder="Masukkan Username"
                                    value={this.state.username} onChange={this.handleChange} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" placeholder="Masukkan Password"
                                    onChange={this.handleChange} />
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="danger" onClick={this.handleClose}>
                                Close
                            </Button>
                            <Button variant="success" type="submit">
                                Save
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal>
                </div>
        )
    }
}