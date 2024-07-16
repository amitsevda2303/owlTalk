import { body } from "express-validator"; 

export const createUserValidator = [
    body('name').custom((value)=>{
        if (value.length <  0) {
            throw new Error("Please enter a valid name");            
        }
    }),
    body('email').custom((value) =>{
        if (value && !value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            throw new Error('Invalid email address');
        }
        return true;
    }),
    body("password").custom((value)=>{
        if (value != null && value.length < 7) {
            throw new Error ('Password is too small plese enter atleast 8 characters');
        }
        return true;
    })
]


export const loginValidator = [
    body('email').custom((value) =>{
        if (value && !value.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
            throw new Error('Invalid email address');
        }
        return true;
    }),
    body("password").custom((value)=>{
        if (value != null && value.length < 7) {
            throw new Error ('Password is too small plese enter atleast 8 characters');
        }
        return true;
    })
]