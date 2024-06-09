import { GetRequest } from "../plugins/http"

export const APIRegister =()=>{
    return GetRequest('api/register');
}
// export const APIUploadImage =()=>{
//     return GetRequest('category/upload-image');
// }
// export const APIGetImage =()=>{
//     return GetRequest('image/get-image');
// }