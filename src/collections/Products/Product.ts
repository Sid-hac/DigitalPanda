
import { PRODUCT_CATAGORIES } from "../../config";
import { CollectionConfig } from "payload/types";
import { stripe } from "../../lib/stripe";
import update from "payload/dist/collections/operations/update";
import { Product } from "../../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";


 const addUser : BeforeChangeHook<Product> = async ({req , data}) => {
       
    const {user} = req.user

    return {
       ...data, user: user?.id
    }
 }


export const Products: CollectionConfig = {

    slug: "products",
    admin: {
        useAsTitle: 'name'
    },
    access: {},
    hooks : {
       beforeChange : [ addUser , async(args) => {
               
            if(args.operation === 'create'){

                const data  = args.data as Product ;

                const createProduct = await stripe.products.create({

                    name : data.name,
                    default_price_data : {
                        currency : 'INR',
                        unit_amount : Math.round(data.price * 100)
                    }
                })

                const updated:Product = {

                    ...data,
                    stripeId : createProduct.id,
                    priceId : createProduct.default_price as string
                }

                return updated

            } else if (args.operation === 'update'){

                const data  = args.data as Product;

                const updatedProduct = await stripe.products.update(
                    data.stripeId!,{
                    default_price : data.priceId!
                })

                const updated : Product = {

                    ...data,
                    stripeId : updatedProduct.id,
                    priceId : updatedProduct.default_price as string
                }

                return updated
                 

            }
        }
       ]
    },
    fields: [{

        name: 'user',
        type: 'relationship',
        relationTo: 'users',
        required: true,
        hasMany: false,
        admin: {
            condition: () => false
        }
    },
    {
        name: 'name',
        label: 'name',
        type: 'text',
        required: true,

    },
    {
        name: 'description',
        label: 'Product details',
        type: 'textarea',
        required: true,
    },
    {
        name: 'price',
        label: 'price',
        type: 'number',
        min: 0,
        max: 1000,
        required: true,
    },
    {
        name: 'catagory',
        label: 'catagory',
        type: 'select',
        options: PRODUCT_CATAGORIES.map(
            ({ lable, value }) => ({ label: lable, value: value })
        ),
        required: true,
    },
    {
        name: 'product_files',
        label: 'product_file(s)',
        type: 'relationship',
        required: true,
        relationTo: 'product_files',
        hasMany: false,
        
    },
    {
        name: 'approvedForSale',
        label: 'product status',
        type: 'select',
        defaultValue: 'pending',
        access: {
            create: ({ req }) => req.user.role === 'admin',
            read: ({ req }) => req.user.role === 'admin',
            update: ({ req }) => req.user.role === 'admin'
        },
        options: [
            { label: 'Pending Verification', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Rejected', value: 'rejected' },
        ],
    },
    {
        name: 'priceId',
        access: {
            create: () => false,
            read: () => false,
            update: () => false
        },
        type: 'text',
        admin: {
            hidden: true
        }
    },
    {
        name: 'stripeId',
        access: {
            create: () => false,
            read: () => false,
            update: () => false
        },
        type: 'text',
        admin: {
            hidden: true
        }
    },
    {
        name: 'images',
        type: 'array',
        label: 'product images',
        minRows: 1,
        maxRows: 4,
        required: true,
        labels: {
            singular: 'image',
            plural: 'images'
        },
        fields: [{
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            required: true,

        }]
    }

    ]
}