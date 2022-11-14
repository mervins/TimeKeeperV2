import { Fragment } from "react";
import ReactDOM from "react-dom";
import classes from "./Modal.module.css"; 

const Backdrop = (props)=>{
    const divStyle = {
        zIndex: props.zIndex, 
    };
    return <div className={classes.backdrop} style={divStyle}></div>;
};

const ModalOverlay = (props) =>{
    const sizeWidth = !props.withSize ? classes.modalSm : classes.modalLg; // if null the value use the default size
    //const showIcon = !props.withSize ? "" : classes.closeIcon; // if not null the value show the x icon else use the override in other components
    return <div className={` ${classes.modal}  ${sizeWidth}`}>
        {/* <div className={showIcon} onClick={()=>{props.onClose(false);}}>{showIcon && <div>close</div>}</div> */}
        <div>{props.children}</div>
    </div>;
 
};
const portalElement = document.getElementById("backdrop");

const Modal = (props)=>{
    return (
        <Fragment>   
            {ReactDOM.createPortal(<Backdrop zIndex={props.zIndex}></Backdrop>,portalElement)}
            {ReactDOM.createPortal(<ModalOverlay withSize={props.withSize} onClose={props.onClose}>{props.children}</ModalOverlay>,portalElement)} 
        </Fragment>
    );
};

export default Modal;