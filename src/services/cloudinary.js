import axios from "axios";
import sha1 from 'crypto-js/sha1';

export const uploadFile = async (file) => {
  const data = new FormData();
  const urlUpload = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`;

  data.append("file", file);
  data.append("upload_preset",process.env.REACT_APP_PRESET_NAME);
  data.append("cloud_name",process.env.REACT_APP_CLOUD_NAME );

  try{
    const resp = await axios.post(urlUpload ,data);  
    const response = {url: resp.data.url, public_id: resp.data.public_id}; 
    console.log(response);
    return response;
  }catch(err){
    console.log("err : ",err);
    return {url: null, public_id: null}
  }
}

export const deleteFile = async (publicId) => {
  let formdata = new FormData();
  const timestamp = new Date().getTime();
  const string = `public_id=${publicId}&timestamp=${timestamp}${process.env.REACT_APP_API_SECRET}`; 
  const signature = sha1(string);
  const urlDestroy = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/destroy`;

  formdata.append("api_key", process.env.REACT_APP_API_KEY);
  formdata.append("public_id", publicId);
  formdata.append("signature", signature);
  formdata.append("timestamp", timestamp);

  try {
    const res = await axios.post(urlDestroy, formdata);
    console.log('res: ', res);
    return res;
  } catch(error) {
    console.log('error: ', error);
    return error;    
  }
}
