import React from "react"
import Navbar from "../component/navbar"
import axios from "axios"
import { Modal, Button, Form, Table } from 'react-bootstrap'

export default class Admin extends React.Component{
    constructor(){
        super()
        this.state = {
            token: "",
            isModalOpen: false,
            action: "",
            admins: [],
            admin_id: "",
            name: "",
            username: "",
            password: "",
            fillPassword: true
        }
        if(localStorage.getItem("token")){
            this.state.token = localStorage.getItem("token")
        }else{
            window.location = "/login"
        }

    }

    headerConfig = () => {
        let header = {
            headers: { Authorization: `Bearer ${this.state.token}` }
        }
        return header
    }

    getAdmins = () => {
        let url = "http://localhost:8080/admin"
        axios.get(url, this.headerConfig())
        .then(response=> {
            this.setState({admins: response.data.admin})
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
        // console.log('add')
        this.setState({
            isModalOpen: true,
            action: "insert",
            admin_id: 0,
            name: "",
            username: "",
            password: "",
            fillPassword: true,
        })
    }
    Edit = (selectedItem) => {
        this.setState({
            isModalOpen: true,
            action: "update",
            admin_id: selectedItem.admin_id,
            name: selectedItem.name,
            username: selectedItem.username,
            password: "",
            fillPassword: false,
        })
        // console.log(selectedItem)
    }

    saveAdmin = (e) => {
        e.preventDefault()
        let form = {
            admin_id: this.state.admin_id,
            name: this.state.name,
            username: this.state.username
        }
 
        if (this.state.fillPassword) {
            form.password =  this.state.password
        }
 
        let url = ""
        if (this.state.action === "insert") {

            url = "http://localhost:8080/admin"

            axios.post(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getAdmins()
                this.handleClose()
            })
            .catch(error => console.log(error))
        } else if(this.state.action === "update") {
            url = "http://localhost:8080/admin/" + this.state.admin_id
            axios.put(url, form, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getAdmins()
                this.handleClose()
            })
            .catch(error => console.log(error))
        }
    }

    handleClose = () => {
        this.setState({
            isModalOpen: false
        })
    }

    dropAdmin = (selectedItem) => {
        if (window.confirm("are you sure will delete this item?")) {
            let url = "http://localhost:8080/admin/" + selectedItem.admin_id
            axios.delete(url, this.headerConfig())
            .then(response => {
                window.alert(response.data.message)
                this.getAdmins()
            })
            .catch(error => console.log(error))
        }
    }


    componentDidMount(){
        this.getAdmins()
    }



    render(){
        return(
            <div>
            <Navbar />
            <div className="container">
                    <div className='mb-4 mt-4'>
                        <h6>Data Admin</h6>
                        <button className='btn btn-dark mb-3' onClick={() => this.Add()}>Tambah Data</button>
                    </div>
                <Table className="table table-bordered">
                    <thead className = "bg-dark text-white">
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Option</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.admins.map((item, index) => (
                            <tr key={index}>
                                <td>{index+1}</td>
                                <td>{item.name}</td>
                                <td>{item.username}</td>
                                <td>
                                    <button className="btn btn-sm btn-info m-1"
                                    onClick={() => this.Edit(item)}>
                                        Edit
                                    </button>

                                    <button className="btn btn-sm btn-danger m-1"
                                    onClick={() => this.dropAdmin(item)}>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
              
                </div>
                {/* modal admin  */}
                <Modal show={this.state.isModalOpen} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                            <Modal.Title>Form Admin</Modal.Title>
                        </Modal.Header>
                        <Form onSubmit={e => this.saveAdmin(e)}>
                            <Modal.Body>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" name="name" placeholder="Masukkan Nama"
                                           value={this.state.name}
                                           onChange={ev => this.setState({name: ev.target.value})}
                                           required />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="username">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control type="text" name="username" placeholder="Masukkan Username"
                                           value={this.state.username}
                                           onChange={ev => this.setState({username: ev.target.value})}
                                           required/>
                                </Form.Group>
                                <Form.Group>
                                { this.state.action === "update" && this.state.fillPassword === false ? (
                                        <Button className="btn btn-sm btn-dark mb-1 btn-block"
                                        onClick={() => this.setState({fillPassword: true})}>
                                            Change Password
                                        </Button>
                                    ) : (
                                        <div>
                                            Password
                                            <input type="password" className="form-control mb-1"
                                            value={this.state.password}
                                            onChange={ev => this.setState({password: ev.target.value})}
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
