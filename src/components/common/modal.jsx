import '../../styles/modal.css'

const CustomModal = (props) => {

    var classNames = props.show ? "modal-sketch modal-show" : "modal-hide"

    return (
        <div id={props.id} className={classNames}>
            <div className='modal-background'>
                <div className={props.customClass ? 'modal ' + props.customClass : 'modal'}>    
                    <div className={props.customModalElementClass ? 'modal-component ' + props.customModalElementClass : 'modal-component'}>
                        {props.children}
                    </div>
                    <svg className="modal-svg" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" preserveAspectRatio="none">
                        <rect x="0" y="0" fill="none" width="100%" height="100%" strokeDasharray='100%' strokeDashoffset='100%' rx="3" ry="3"></rect>
                    </svg>
                </div>
            </div>
        </div>
    )
}

export default CustomModal;