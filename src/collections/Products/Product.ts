import { PRODUCT_CATAGORIES } from "../../config";
import { CollectionConfig } from "payload/types";


export const Products: CollectionConfig = {

    slug: "products",
    admin: {
        useAsTitle: 'name'
    },
    access: {},
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
    // {
    //     name: 'product_files',
    //     label: 'product_file(s)',
    //     type: 'relationship',
    //     relationTo: 'product_files',
    //     required: true,
    //     hasMany: false,

    // },
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