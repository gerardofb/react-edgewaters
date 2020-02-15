import React from 'react';
import {Container, Row, Col, Form, FormGroup, FormLabel, FormControl, Button}from 'react-bootstrap';

class ModalInicio extends React.Component{
    
    constructor(props){
        super(props);
        this.state={
            nickname:props.nickname,
            validated:false,
            claseValidacion:'',
            apodo:''            
        }
    }
    
    iniciarSesion(event){
        if((event.currentTarget.checkValidity() === false)|| this.state.apodo.length != 12) {
                event.preventDefault();
                event.stopPropagation();
                console.log('validación de inicio de sesión fallida');
                this.setState({claseValidacion:'was-validated'});
        }
        else{
        event.preventDefault();
        event.stopPropagation();
        this.setState({validated:true});
        this.props.conexion.emit("login_user",{name:this.state.nickname, nickname:this.state.apodo});
        this.props.sesionIniciada(this.state.nickname, this.state.apodo);
        }
        
    }
    handleNickName(event){
        this.setState({nickname:event.target.value});
    }
    handleApodo(event){
        this.setState({apodo:event.target.value});
    }
    render(){
        let btnSala = <Button type="submit" variant="primary">Iniciar</Button>
        let inicio = <Form className={this.state.claseValidacion} noValidate validated={this.state.validated} onSubmit={this.iniciarSesion.bind(this)}>
            <FormGroup>
                <FormLabel>Requerimos su correo electrónico para comenzar:</FormLabel>
                <FormControl required type="email" placeholder="Escriba su correo electrónico"
                value={this.state.nickname} onChange={this.handleNickName.bind(this)}></FormControl>
            <Form.Control.Feedback type="invalid">
            Por favor proporcione un correo electrónico válido
          </Form.Control.Feedback>
            </FormGroup>
            <FormGroup>
                <FormLabel>Requerimos que se identifique con un nombre o apodo de 12 caracteres en el chat:</FormLabel>
                <FormControl required pattern=".{12,12}"type="text" placeholder="Escriba su nombre o apodo"
                value={this.state.apodo} onChange={this.handleApodo.bind(this)}></FormControl>
            <Form.Control.Feedback type="invalid">
            Por favor proporcione un nombre o apodo
          </Form.Control.Feedback>
            </FormGroup>

            {btnSala}
        </Form>
        return inicio;
    }
}
export default ModalInicio;