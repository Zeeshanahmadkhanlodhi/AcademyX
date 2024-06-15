import mongoose, {Document , Model , Schema} from "mongoose";
import bcrypt from "bcryptjs";

 const emailRegexPattern:RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document{
    name:string;
    email:string;
    password:string;
    avatar:{
        public_id:string;
        url:string;
    },
    role:string;
    isVerified:boolean;
    courses:Array<{courseId:string}>;
    comparePassword: (password: string) => Promise<boolean>;
};

const userSchema:Schema<IUser> = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter a username"],
    },
    email:{
        type:String,
        required:[true, "Please enter a email"],
        unique:true,
        validate: {
            validator: (value:string) => {
                return emailRegexPattern.test(value);
            },
            message: "Please enter a valid email",
        },
    },
    password:{
        type:String,
        required:[true,"Please Enter your password"],
        minlength:[6,"Password must be at least 6 characters"],
        select:false,
    },
    avatar:{
        public_id:{
            type:String,
        },
        url:{
            type:String,
        }
    },
    role:{
        type:String,
        default:'user'
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    courses:[{
        courseId:{
            type:String,
        }
    }]},
    {
        timestamps:true,
    },
);

userSchema.pre<IUser>('save',async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password,10);
    next();
});

// compare Password

userSchema.methods.comparePassword = async function(password:string) : Promise<boolean>{
    return await bcrypt.compare(password,this.password);
}

const UserModel:Model<IUser> = mongoose.model<IUser>('User',userSchema);

export default UserModel;