import React from 'react';
import ModalInicio from './ModalInicio';
import io from "socket.io-client";
import logo from './logo.svg';
import {Alert,Badge,ListGroup, ListGroupItem, Container, Row, Col,Form, FormGroup, FormLabel, FormControl, Button} from 'react-bootstrap';
import './App.css';
var _copia = require('lodash');
const socket = io("http://127.0.0.1:4000");
class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      sesion:false,
      privado:'',
      mensajes:[],
      nickname:'',
      salas:[],
      nombreSesion:'',
      apodo:'',
      chatActual:''
      }
  }
  sendPrivate(){
    let texto = this.state.privado;
    if(texto.indexOf("/") == 0 && texto.indexOf("ck=")== 4){
      texto = texto.trim();
    }
    socket.send({type:"privateMessage",message:texto, roomName:this.state.nombreSesion, apodo:this.state.apodo});
  }
  handleMensaje(event){
      this.setState({privado:event.target.value});
  }
  sesionIniciada(parametro, parametroApodo){
    this.setState({sesion:true, nombreSesion:parametro, apodo:parametroApodo});
    socket.emit("list_rooms");
  }
  cambiarSala(salaNueva){
  var salaAntigua = this.state.nombreSesion;
  console.log('verificación de cambio de sala');
  console.log(salaAntigua);
  console.log(salaNueva);
  this.setState({nombreSesion:salaNueva},function(){
    socket.emit("cambiarSala",{old:salaAntigua, nuevo:salaNueva}); 
  });
     
  }
  componentDidMount(){
    socket.emit("list_rooms");
    socket.on("message", data=>{
       var escucha = JSON.parse(data);
       if(escucha.type=="userMessage"){
         this.setState({mensajes:this.state.mensajes.concat(escucha)},function(){
           console.log(this.state.mensajes);
         });
        }
         else if(escucha.type=="loginMessage"){
            console.log("Inicio de sala");
            console.log(escucha);
            this.setState({sesion:true, mensajes:this.state.mensajes.concat(escucha)});
       }
      else if(escucha.type=="privateMessage"){
        this.setState({mensajes:this.state.mensajes.concat(escucha)},function(){
          console.log(this.state.mensajes);
        });
       }
     });
     socket.on("salasSocket", (data)=>{
        var salas = JSON.parse(data);
        console.log('actualización de sala');
        console.log(salas);
        this.setState({salas:_copia.cloneDeep(salas)});
     });
  }
  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: "smooth" });
  }
  componentDidUpdate(){
    if(this.state.sesion)
    this.scrollToBottom();
  }
  render(){
  let indice = 1;
  let indiceSalas = 1;
  let salas = this.state.salas.map((k)=>{
    indiceSalas++;
    return <ListGroupItem key={indiceSalas}>
      <Button variant="dark" className="switchSala" onClick={this.cambiarSala.bind(this,k.salaChat)}>{k.salaChat}&nbsp;<Badge variant="primary">&nbsp;{k.usuarios} usuarios</Badge></Button>
    </ListGroupItem>
  })
  let mensajes = this.state.mensajes.map((k)=>{
    indice++;
    let usuarios = k.message.split(':')[0];
    let css = usuarios == this.state.apodo ? "secondary" : "info";
    if(k.type != "loginMessage"){
    return <Alert variant={css} key={indice}>
      {k.message}
    </Alert>
    }
    else{
      return <Alert variant='warning' key={indice}>
      {k.message}
    </Alert>
    }
  });
  let modal = !this.state.sesion ? 
  <Col md={7}><ModalInicio sesionIniciada={this.sesionIniciada.bind(this)} conexion={socket} sesion={this.state.sesion} nickname={this.state.nickname}></ModalInicio></Col>
  : <Col md={7}>
    <div style={{height:550, overflowY:'auto', padding:1+"em"}}>
    {mensajes}
    <div style={{ float:"left", clear: "both" }}
             ref={(el) => { this.messagesEnd = el; }}>
        </div>
    </div>
    <Form>
      <FormGroup>
        <FormLabel>Escriba un mensaje en esta sala:</FormLabel>
        <FormControl placeholder="..."
         variant="text" value={this.state.privado} onChange={this.handleMensaje.bind(this)}></FormControl>
      </FormGroup>
      <Button variant="warning" onClick={this.sendPrivate.bind(this)}>Enviar mensaje</Button>
    </Form>
  </Col>
  return (
    <div className="panel panel-default">
      <div className="panel-heading">
        <h3>Bienvenido al chat de usuarios de EdgeWaters</h3>
      </div>
      <div className="panel-body">
      <Container>
            <Row>
                <Col md={5}>
                  <ListGroup>
                    {salas}
                  </ListGroup>
                </Col>
                {modal}
            </Row>
        </Container>
</div>
    </div>
  );
  }
}

export default App;
