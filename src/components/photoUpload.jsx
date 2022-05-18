import React, { useState } from "react"
import { useEffect } from "react";
import '../styles/photo-upload.css'
import { useAxios } from "../utils/request-utils";
import { Btn } from "./common/button";
import CustomModal from "./common/modal";

const UploadPhoto = (props) => {
    
    const [photoUrl, setModalPhotoUrl] = useState(props.photoUrl)
    const [file, setFile] = useState(null);
    const {getData, processing, processUrl} = useAxios();


    useEffect(() => {

        const response = getData();
        console.log(response);
        if (response && response.status === 200){
            console.log('good like');
            console.log(photoUrl);
            props.updatePic(photoUrl)
            console.log(props.photoUrl);
        }
    }, [processing])


    const previewImage = (event) => {
        if (event.target.files.length > 0){
            setFile(event.target.files[0]);
            setModalPhotoUrl(URL.createObjectURL(event.target.files[0]));
        }
    }

    const uploadImage = () => {

        if (processing || props.photoUrl === photoUrl)
            return

        let body = new FormData();
        body.append('file', file, file.name);
        body.append('Content-Type', file.type);

        processUrl({ 
            
            method: 'POST',
            url: 'http://localhost:8080/updateProfilePicture',
            headers:{
                "Content-Type": "multipart/form-data",
            }, 
            data :body,
            withCredentials: true,

        })
    }

    const renderCloseBtn = () => {
        return (
            <Btn 
            displayContent={'\u2715'}
            iconBtn={true}
            properties="right btn-larger"
            onClick={() => {
                props.closeModal(photoUrl)}}
            />
        )
    }

    const renderProfilePicHolder = () => {
        return (
            <div className='profile-pic-holder'>
                <img className='profile-pic' width="100%" height="100%" src={photoUrl} alt='Not Found'/>
            </div>
        )
    }

    const renderChooseBtn = () => {
        return (
            <React.Fragment>
                <input type="file" id="photo-preview-btn" onChange={previewImage} accept="image/png,image/jpeg" multiple={false} hidden/>
                <label htmlFor="photo-preview-btn" className="preview">Choose</label>
            </React.Fragment>
        )
    }

    const renderUploadBtn = () => {
        let classes = processing ? "upload loading" : "upload"
        classes = classes + (props.photoUrl === photoUrl ? ' disabled' : '' );
        return (
            <label 
                className={classes} 
                onClick={uploadImage}
            >
                    Upload
            </label>
        )
    }

    return (
        <CustomModal id="photo-uploader" show={props.show} customClass='photo-upload-modal'>
            {renderCloseBtn()}
            {renderProfilePicHolder()}
            
            <br></br>
            <div className="vertical-space"></div>

            {renderChooseBtn()}           
            
            <span className="horizontal-space"></span>
            {renderUploadBtn()}
                            
        </CustomModal>
    )
}

export default UploadPhoto