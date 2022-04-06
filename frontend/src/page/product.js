import React from "react"
import Navbar from "../component/navbar"
import ProductList from "../component/ProductList"
import axios from "axios"
import { Modal, Button, Form } from 'react-bootstrap'
 
 
export default class Product extends React.Component{
    constructor(){
        super()
        this.state = {
            products: [],
            token: "",
            isModalOpen: false,
            action: "",
            name: "",
            price: 0,
            stock: 0,
            image: "",
            uploadFile: true,
            product_id: "",
        }
        if (localStorage.getItem("token")) {
            this.state.token = localStorage.getItem("token")
        } else {
            window.location = "/login"
        }
        this.headerConfig.bind(this)
    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getProduct = () => {
        let url = "http://localhost:8080/product"
        axios.get(url, this.headerConfig())
        .then(response=> {
            this.setState({products: response.data.product})
        })
        .catch(error => {
            if (error.response) {
                if(error.response.status) {
                    window.alert(error.response.data.message)
                    this.props.history.push("/login")
                }
            }else{
                console.log(error);
            }
        })
    }

    Add = () => {
        this.setState({
            action: "insert",
            isModalOpen: true,
            product_id: 0,
            name: "",
            price: 0,
            stock: 0,
            image: null,
            uploadFile: true
        })
    }
 
    Edit = selectedItem => {
        this.setState({
            action: "update",
            isModalOpen: true,
            product_id: selectedItem.product_id,
            name: selectedItem.name,
            price: selectedItem.price,
            stock: selectedItem.stock,
            image: null,
            uploadFile: false
        })
    }

    saveProduct = (e) => {
        e.preventDefault()
        let form = new FormData()
        form.append("product_id", this.state.product_id)
        form.append("name", this.state.name)
        form.append("price", this.state.price)
        form.append("stock", this.state.stock)
        if (this.state.uploadFile) {
            form.append("image", this.state.image)
        }
 
        let url = ""
        if (this.state.action === "insert") {
            url = "http://localhost:8080/product"
            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
                this.handleClose()
            })
            .catch(error => console.log(error))
        } else if(this.state.action === "update") {
            url = "http://localhost:8080/product/" + this.state.product_id
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
                this.handleClose()
            })
            .catch(error => console.log(error))
        }
    }

    dropProduct = (selectedItem) => {
        if (window.confirm("are you sure will delete this item?")) {
            let url =  "http://localhost:8080/product/" + selectedItem.product_id
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getProduct()
            })
            .catch(error => console.log(error))
        }
    }

    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }


    componentDidMount(){
        this.getProduct()
    }


    render(){
        return (
            <div>
               <Navbar />
               {/* {console.log(this.state.products)} */}
               <div className="container">
                    <div className='mb-4 mt-4'>
                        <h6>Product List</h6>
                        <button className='btn btn-dark mb-3'onClick={() => this.Add()}>Tambah Product</button>
                    </div>
                   <div className="row">
                       { this.state.products.map( item => (
                           <ProductList
                           key = {item.product_id}
                           name = {item.name}
                           price = {item.price}
                           stock = {item.stock}
                           image = { "http://localhost:8080/image/product/" + item.image}
                           onEdit = {() => this.Edit(item)}
                           onDrop = {() => this.dropProduct(item)}
                            />
                       )) }
                   </div>
                </div>
 
                 {/* modal product  */}
                 <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                 <Modal.Header closeButton>
                            <Modal.Title>Form Product</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={e => this.saveProduct(e)}>
                            <Modal.Body>
                                 <Form.Group className="mb-3" controlId="productname">
                                    <Form.Label>Product Name</Form.Label>
                                    <Form.Control type="text" name="productname" placeholder="Masukkan Nama Produk"
                                           value={this.state.name}
                                           onChange={ev => this.setState({name: ev.target.value})}
                                           required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="productstock">
                                    <Form.Label>Product Stock</Form.Label>
                                    <Form.Control type="number" name="productstock" placeholder="Masukkan Stock Produk"
                                           value={this.state.stock}
                                           onChange={ev => this.setState({stock: ev.target.value})}
                                           required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="productprice">
                                    <Form.Label>Product Stock</Form.Label>
                                    <Form.Control type="number" name="productprice" placeholder="Masukkan Harga Produk"
                                           value={this.state.price}
                                           onChange={ev => this.setState({price: ev.target.value})}
                                           required/>
                                </Form.Group>
                                <Form.Group>
                                { this.state.action === "update" && this.state.uploadFile === false ? (
                                        <button className="btn btn-sm btn-dark mb-1 btn-block"
                                        onClick={() => this.setState({uploadFile: true})}>
                                            Change Product Image
                                        </button>
                                    ) : (
                                        <div>
                                            Product Image
                                            <input type="file" className="form-control mb-1"
                                            onChange={ev => this.setState({image: ev.target.files[0]})}
                                            
                                            required
                                            />
                                        </div>
                                    ) }
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

