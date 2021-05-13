import React, { useRef } from 'react';
// import S3 from 'react-aws-s3';

function Upload() {
    const fileInput = useRef();

    const presignedUrl = async filename => {

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ filename: filename})
        }
    
        const response = await fetch(process.env.REACT_APP_URL, requestOptions)
        const response_json = await response.json()
        console.log(response_json)
        return response_json
            // .then(response => response.json())
            // .then(data => {
            //     console.log(data)
            //     return data
            // })
            // .catch(error => console.log(error))
        
    }

    const constructFormData = (fields, file) => {
        console.log("construct form data")
        // console.log(fields)
        // console.log(file)
        let data = new FormData()
        
        for(let field in fields) {
            data.append(field, fields[field])
        }
        data.append("file", file)
        // console.log(data)

        return data
    }

    const handleClick = async event => {
        event.preventDefault();
        console.log(fileInput.current.files[0]);
        const file = fileInput.current.files[0];
        const filename = fileInput.current.files[0].name;
        const s3_config = await presignedUrl(filename)
        
        const post_url = s3_config.url
        
        const config = constructFormData(s3_config.fields, file)
        
        console.log(config)
        console.log(post_url)

        const requestOptions = {
            method: 'POST',
            // mode: 'no-cors',
            body: config
        }

        const response = await fetch(post_url, requestOptions)
        console.log(response.status)
        console.log(response.body)
    }

    return (
        <>
            <form className = 'upload-steps' onSubmit={handleClick}>
                <label>
                    Upload file:
                    <input type='file' ref={fileInput} />
                </label>
                <br/>
                <button type='submit'>Upload</button>
            </form>
        </>
    )
}

export default Upload;