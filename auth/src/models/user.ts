import mongoose from 'mongoose';
import { Password } from '../services/password';

// An interface that describes the properties
// that are requried to create a new User (for typescript)
interface UserAttrs {
    email: string;
    password: string;
}

// An interface that describes the properties
// that a User Model has
interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
interface UserDoc extends mongoose.Document {
    email: string;
    password: string;
}

// Schema is how we tell mongoose about all the properties of user
// the second arg transforms the response structure received from the
// MongoDb database to like a common db response: { "_id": "...", "email": "..."}
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.password;
            delete ret.__v;
        }
    }
});

userSchema.pre('save', async function (done) {
    if (this.isModified('password')) {
        const hashed = await Password.toHash(this.get('password'));
        this.set('password', hashed);
    }
    done();
});

// we add a custom function 'build' to a model
userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
};

// definition of mongoose.model:
// function model<T extends Document, U extends Model<T>> (...): U;
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export { User };