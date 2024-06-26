
import { PRODUCT_CATAGORIES } from "../../config";
import { Access, CollectionConfig } from "payload/types";
import { stripe } from "../../lib/stripe";
import { Product, User } from "../../payload-types";
import { AfterChangeHook, BeforeChangeHook } from "payload/dist/collections/config/types";



 const addUser : BeforeChangeHook<Product> = async ({req , data}) => {
       
    const {user} = req.user

    return {
       ...data, user: user?.id
    }
 }

 const syncUser: AfterChangeHook<Product> = async ({
    req,
    doc,
  }) => {
    const fullUser = await req.payload.findByID({
      collection: 'users',
      id: req.user.id,
    })
  
    if (fullUser && typeof fullUser === 'object') {
      const  {products}  = fullUser
  
      const allIDs = [
        ...(products?.map((product) =>
          typeof product === 'object' ? product.id : product
        ) || []),
      ]
  
      const createdProductIDs = allIDs.filter(
        (id, index) => allIDs.indexOf(id) === index
      )
  
      const dataToUpdate = [...createdProductIDs, doc.id]
  
      await req.payload.update({
        collection: 'users',
        id: fullUser.id,
        data: {
          products: dataToUpdate,
        },
      })
    }
  }
  const isAdminOrHasAccess =
  (): Access =>
  ({ req: { user: _user } }) => {
    const user = _user as User | undefined

    if (!user) return false
    if (user.role === 'admin') return true

    const userProductIDs = (user.products || []).reduce<
      Array<string>
    >((acc, product) => {
      if (!product) return acc
      if (typeof product === 'string') {
        acc.push(product)
      } else {
        acc.push(product.id)
      }

      return acc
    }, [])

    return {
      id: {
        in: userProductIDs,
      },
    }
  }



export const Products: CollectionConfig = {

    slug: "products",
    admin: {
        useAsTitle: 'name'
    },
    access: {
        read : isAdminOrHasAccess(),
        update : isAdminOrHasAccess(),
        delete : isAdminOrHasAccess(),

    },
    hooks : {
        afterChange : [syncUser],
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