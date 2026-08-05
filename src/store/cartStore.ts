import {create} from "zustand";
import { CartItem, Product } from "../types/product";

interface CartStore{
    cartItems:CartItem[];
    addToCart:(product:Product)=>void;
    increaseQuantity: (id:number)=>void;
    decreaseQuantity: (id:number)=>void;
    removeFromCart:(id:number)=>void;
    clearCart:()=>void;
}

const  useCartStore = create<CartStore>((set)=>({
    cartItems: [],
    addToCart: (product) => {
        set((state)=>{
            const existingItem = state.cartItems.find((item)=>item.id===product.id);


            if(existingItem){
                return state; 
            }
            
            return {
                cartItems:[
                    ...state.cartItems,
                    {
                        ...product,
                        quantity:1
                    }
                ]
            };
        });
    },
    increaseQuantity: (id) => {
        set((state)=>{
            return {
                cartItems:state.cartItems.map((item)=>item.id===id?{
                        ...item,
                        quantity:item.quantity+1,
                    }:
                    item
                ),
            };
        });
    },
    decreaseQuantity:(id)=>{
        set((state)=>{
            const item= state.cartItems.find((item)=>item.id===id);

            if(!item){
                return state;
            }

            if(item?.quantity===1){
                return {
                    cartItems:state.cartItems.filter((item)=>item.id!==id)
                }
            }

            return {
                cartItems:state.cartItems.map((item)=>item.id===id?{
                        ...item,
                        quantity:item.quantity-1,
                    }:
                    item
                ),
            };
        });
    },
    removeFromCart:(id)=>{
        set((state)=>{
            return {
                cartItems:state.cartItems.filter((item)=>item.id!==id)
            }
        })
    },
    clearCart:()=>{
        set({
            cartItems:[]
        });
    }
}));

export default useCartStore;