import "../../styles/button.css"

const Btn = (props) => {
    var classes = props.iconBtn ? 'icon-btn' : "button"; 

    if (props.properties){
        classes = classes + ' ' + props.properties;
    }
    if (props.loading)
        classes = classes + ' ' + 'btn-loading'

    const renderBtn = () => {
        if (props.id)
            return <button id={props.id} className={classes} onClick={props.onClick} disabled={props.isDisabled || props.loading}>{props.displayContent}</button>
        
        return <button className={classes} onClick={props.onClick} disabled={props.isDisabled || props.loading}>{props.displayContent}</button>
    }
    
    if (props.center){
        
        return (
            <div className="btn-holder">
                {renderBtn()}
            </div>
        )
    }
    
    return renderBtn()
}

export {Btn}
