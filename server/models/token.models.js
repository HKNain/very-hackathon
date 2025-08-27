import {Schema , model} from  "mongoose"


const tokenSchema = new Schema ({
    tokenSchemaId  : {
        type :String ,
    }
})

const tokenStoredToBeBlackListed = new model( "tokenSchema" , tokenSchema );

export default tokenStoredToBeBlackListed;