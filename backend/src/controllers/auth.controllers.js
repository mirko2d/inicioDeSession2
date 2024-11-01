
import { UserModel } from '../models/user.models.js'
import { compare } from 'bcrypt'
import { createJwt } from '../helpers/createJwt.js'


export const loginUser = async (req, res) => {
try {
    const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        console.log(user)
        if (!user) return res.status(404).json({ message: "User not found" });

        const validPassword = await compare(password, user.password);

        if (!validPassword) {
            throw new Error("La contraseña es incorrecta")
        }
        
        const token = await createJwt(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000
        })

        res.status(200).json({ message: "Login successful" });
        return user
} catch (error) {
    console.log(error)
}}

export const Logout = (_req, res) => {
try {
    res.clearCookie("token")
    res.status(200).json('Deslogueado correctamente')
} catch (error) {
    console.log(error)
}}


export const getSession = async (req, res) => {
    try {
        res.status(200).json({message: "Session Activa", user: req.user})
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
};
