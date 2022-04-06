import React from 'react'
import axios from 'axios'
import CustomerList from '../component/customerList'
import {Modal, Button, Form} from 'react-bootstrap'

export default class Customer extends React.Component {
    constructor() {
        super()
        this.state = {
            customers: [],
            isModalOpen : false,
            action : "insert",
            name : "",
            phone : "",
            address : "",
            username : "",
            image : null,
            password : "",
        }
        if (localStorage.getItem('token')) {
            this.state.token = localStorage.getItem('token')
        }
        // jika belum login 
        else {
            window.location = '/login'
        }
    }
    getCustomer = () => {
        let url = "http://localhost:8080/customer/"

        axios.get(url)
            .then(res => {
                this.setState({
                    customers: res.data.customer
                })
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    handleAdd = () => {
        this.setState({
            isModalOpen : true,
            name : "",
            phone: "",
            address: "",
            username:"",
            image : null,
            password : "",
            action : "insert"
        })
    }
    handleClose = () => {
        this.setState({
            isModalOpen : false
        })
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name] : e.target.value
        })
    }
    handleFile = (e) => {
        this.setState({
            image : e.target.file[0]
        })
    }
    componentDidMount = () => {
        this.getCustomer()
    }
    render() {
        return (
            <div className="bg">
                <div className="container">
                    <div className='mb-4 mt-4'>
                        <h6>Data Customer</h6>
                    </div>
                    <div>
                        <button className="btn btn-dark" onClick={() => this.handleAdd()}>Add Data                   </button>
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

                 {/* Iki Modal */}
                <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Form Customer</Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={(e) => this.handleSave(e)}>
                        <Modal.Body>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" placeholder="Insert Name" value={this.state.name} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="phone">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control type="number" name="phone" placeholder="Insert Phone" value={this.state.phone} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="address">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="address" placeholder="Insert Address" value={this.state.address} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="email" name="username" placeholder="Insert Username" value={this.state.username} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" placeholder="Insert Password" value={this.state.password} onChange={this.handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Image</Form.Label>
                            <Form.Control type="file" name="image" placeholder="Insert Image" value={this.state.image} onChange={this.handleFile} />
                        </Form.Group>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleClose}>
                            Close
                        </Button>
                        <Button variant="dark" type="submit">
                            Save
                        </Button>
                        </Modal.Footer>
                    </Form>
            </Modal>
            </div>
        )
    }
}