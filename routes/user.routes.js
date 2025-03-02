import express from 'express';
import checkToken from '../middlewares/jwtverify.js';
import { registerUser, loginUser, authUser, updateUserImage} from '../controllers/user.controller.js';
import { uploadUserImage } from '../middlewares/uploadImage.js';

const routerUser = express.Router();

routerUser.post('/login', loginUser);
routerUser.post('/register', registerUser);
routerUser.get('/auth', checkToken, authUser);  
routerUser.post('/update-image', checkToken, uploadUserImage, updateUserImage);   

export default routerUser; 
