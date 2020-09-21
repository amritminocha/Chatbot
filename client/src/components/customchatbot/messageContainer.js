import React,{useState} from 'react'
import classes from "./style.module.css";

function MessageContainer() {
    const [value,onValueChange] = useState("");
    return (
        <div className={classes.messageContainerTopParent}>
            <div className={classes.messageContainer}>
                <LogoComponent></LogoComponent>
                <InputField onChange={(value)=>onValueChange(value)} value={value}></InputField>
            </div>
        </div>
    )
}
function LogoComponent() {
    return (
        <div style={{position:"absolute",top:0,display:"flex",width:"100%",backgroundColor:"red",padding:10}}>
                    <div style={{color:"white",marginRight:"2%"}}>
                     Logo
                    </div>
                    <div style={{color:"white"}}>
                     ChatBot
                    </div>
        </div>
    )
}



function InputField({onChange,value,onSend}) {
    return (
        <div style={{position:"absolute",bottom:0,left:0,width:"100%",padding:"1%",display:"flex",flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
        <input  onChange={(e)=>onChange(e.target.value)} value={value} placeholder="Message"></input>
        <button style={{marginLeft:"1%",height:"90%"}} onClick={()=>onSend()}>Send</button>
        </div>
    )
}






export default MessageContainer
