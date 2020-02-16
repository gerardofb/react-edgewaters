import App from './App';
import { Redirect, Link } from 'react-router-dom';
import React from 'react';
import { Container, Row, Col,Form, FormGroup, FormLabel, FormControl, Button} from 'react-bootstrap';
let encripta = require('./cryptoutils').hashPassword;
let desencripta = require('./cryptoutils').verifyPassword;

class Login extends React.Component{
    constructor(){
        super();
        this.state={
            nickname:'',
            password:'',
            validated:false,
            claseValidacion:'',
            logueado:false,
            registro:false,
        }
        this.iniciarLogin = this.iniciarLogin.bind(this);
    }
    componentDidMount(){
        let cookies = document.cookie;
        let cookiebuscada = "registroedgewaters";
        var separadas = cookies.split(";");
        let usuario = "";
        for(var i = 0; i < separadas.length; i++){
            var llaves = separadas[i].split("=");
            if(llaves[0] == cookiebuscada){
                usuario=llaves[1];
                break;
            }
        }
        console.log('usuario buscado '+usuario);
        this.setState({logueado:false, nickname:usuario});
    }
    handleBotonRegistro(){
        this.setState({registro:true});
    }
    iniciarLogin= (event)=>{
        console.log('intentando iniciar sesión');
        if((event.currentTarget.checkValidity() === false)) {
                event.preventDefault();
                event.stopPropagation();
                console.log('validación de inicio de sesión fallida');
                this.setState({claseValidacion:'was-validated'});
        }
        else{
        event.preventDefault();
        event.stopPropagation();
        //let history = useHistory();
        this.setState({validated:true});
        let self = this;
        var claro = this.state.password;
        var procesosesion = {login:this.state.nickname, claro:claro};
            console.log('iniciando sesion');    
            var body = JSON.stringify(procesosesion);
            fetch('http://backend:4000/loginprocess?usuario='+procesosesion.login+"&claro="+procesosesion.claro,{
                method:'GET',
            }).then(function(response){
                return response.json();
            }).then(function(elJson){
                console.log('respuesta de login');
                console.log(elJson);
                var edadcookie = 60*60;
                document.cookie = "usuarioedgewaters="+self.state.nickname+";max-age="+edadcookie;
                self.setState({logueado:elJson.exito});
            });   
        }        
    }
    handlePassword(event){
        this.setState({password:event.target.value});
    }
    handleNickName(event){
        this.setState({nickname:event.target.value});
    }
    render(){
        
    let formulario = this.state.logueado ?
    <Redirect to="/App"></Redirect>
    :
    <div className="panel">
    <Row>
        <menu>
            <Link to="/Register">Registro</Link>
        </menu>
    </Row>
    <Row>
    <Col md={4}></Col>
    <Col md={4}>
    <Form className={this.state.claseValidacion} noValidate validated={this.state.validated} onSubmit={this.iniciarLogin.bind(this)}>
    <FormGroup>
    <FormLabel>Requerimos su correo electrónico para comenzar:</FormLabel>
    <FormControl required type="email" placeholder="Escriba su correo electrónico"
    value={this.state.nickname} onChange={this.handleNickName.bind(this)}></FormControl>
    <Form.Control.Feedback type="invalid">
    Por favor proporcione un correo electrónico válido
    </Form.Control.Feedback>
    </FormGroup>
    <FormGroup>
        <FormLabel>Ingrese su contraseña:</FormLabel>
        <FormControl required type="password" placeholder="Escriba su contraseña"
        value={this.state.password} onChange={this.handlePassword.bind(this)}></FormControl>
        <Form.Control.Feedback type="invalid">
            Por favor proporcione una contraseña válida
        </Form.Control.Feedback>
    </FormGroup>
    <Button type="submit" variant="primary">Iniciar sesión</Button>
    </Form>
    </Col>
    </Row>
    </div>;
    return formulario;
    }
}
export default Login;