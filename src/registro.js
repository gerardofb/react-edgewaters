import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Modal, Row, Col,Form, FormGroup, FormLabel, FormControl, Button, Jumbotron} from 'react-bootstrap';

class Registro extends React.Component{
    constructor(){
    super();
    this.state={
        usuario:'',
        contrasena:'',
        confirmacion:'',
        validated:false,
        claseValidacion:'',
        registrado:false,
        showModal:false, 
        mensaje:''
    }
    this.iniciarRegistro = this.iniciarRegistro.bind(this);

    }
    iniciarRegistro= (event)=>{
        console.log('intentando registrar usuario');
        if((event.currentTarget.checkValidity() === false)) {
                event.preventDefault();
                event.stopPropagation();
                console.log('validación de registro fallida');
                this.setState({claseValidacion:'was-validated'});
        }
        else if(this.state.contrasena !== this.state.confirmacion){
            event.preventDefault();
            event.stopPropagation();
            this.setState({showModal :true, mensaje:'La contraseña y su confirmación no coinciden.'});
        }

        else{
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated:true});
        let self = this;
        var claro = this.state.contrasena;
        var procesoregistro = {usuario:this.state.usuario, claro:claro};
            var body = JSON.stringify(procesoregistro);
            fetch('http://backend:4000/registerprocess?usuario='+procesoregistro.usuario+"&claro="+procesoregistro.claro,{
                method:'GET',
            }).then(function(response){
                return response.json();
            }).then(function(elJson){
                console.log("resultado de fetch a registro");
                console.log(elJson.exito);
                if(!elJson.exito){
                    self.setState({showModal:true, mensaje:"El usuario existe!"})
                }
                else{
                    var edadcookie = 60 * 60;
                    document.cookie = "registroedgewaters="+self.state.usuario+";max-age="+edadcookie;
                self.setState({registrado:elJson.exito}, function(){                    
                });
            }
            });   
        }        
    }
    handleConfirmacion(event){
        this.setState({confirmacion:event.target.value});
    }
    handlePassword(event){
        this.setState({contrasena:event.target.value});
    }
    handleNickName(event){
        this.setState({usuario:event.target.value});
    }
    handleClose(){
        this.setState({showModal:false});
    }
    render(){
    let registro = this.state.registrado ? 
    <Redirect to="/"></Redirect>
    :<div><Row>
        <Col md={12}>
    <Jumbotron>
        <h4>Regístrese para iniciar el chat</h4>
        <p>Requerimos un correo electrónico válido y una contraseña de al menos 10 caracteres</p>
    </Jumbotron>
    <Col md={4}></Col>
    <Col md={4}>
    <Form className={this.state.claseValidacion} noValidate validated={this.state.validated} onSubmit={this.iniciarRegistro.bind(this)}>
    <FormGroup>
    <FormLabel>Correo electrónico:</FormLabel>
    <FormControl required type="email" placeholder="Escriba su correo electrónico"
    value={this.state.usuario} onChange={this.handleNickName.bind(this)}></FormControl>
    <Form.Control.Feedback type="invalid">
    Por favor proporcione un correo electrónico válido
    </Form.Control.Feedback>
    </FormGroup>
    <FormGroup>
        <FormLabel>Contraseña:</FormLabel>
        <FormControl required type="password"  pattern=".{10,10}"placeholder="Escriba su contraseña"
        value={this.state.password} onChange={this.handlePassword.bind(this)}></FormControl>
        <Form.Control.Feedback type="invalid">
            Por favor proporcione una contraseña válida
        </Form.Control.Feedback>
    </FormGroup>
    <FormGroup>
        <FormLabel>Confirmar Contraseña:</FormLabel>
        <FormControl required  pattern=".{10,10}"type="password" placeholder="Confirme su contraseña"
        value={this.state.confirmacion} onChange={this.handleConfirmacion.bind(this)}></FormControl>
        <Form.Control.Feedback type="invalid">
            La confirmación no coincide con la contraseña
        </Form.Control.Feedback>
    </FormGroup>

    <Button type="submit" variant="primary">Guardar cambios</Button>
    </Form>
    </Col>
    </Col>
    </Row>
    <Modal show={this.state.showModal} onHide={this.handleClose.bind(this)}>
    <Modal.Header closeButton>
      <Modal.Title>Validación de registro</Modal.Title>
    </Modal.Header>
    <Modal.Body>{this.state.mensaje}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={this.handleClose.bind(this)}>
        Aceptar
      </Button>
    </Modal.Footer>
  </Modal></div>;
    return registro;
    }

}
export default Registro;