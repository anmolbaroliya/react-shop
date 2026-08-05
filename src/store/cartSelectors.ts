import useCartStore from "./cartStore"

export const useTotalItems = () =>{
    return useCartStore((state)=>
        state.cartItems.reduce((total,item)=>total+item.quantity,0)
    );
}

export const useTotalPrice = () =>{
    return useCartStore((state)=>
        state.cartItems.reduce((total,item)=>total+ item.price * item.quantity,0)
    );
}

export const useIsProductInCart=(productId:number) => {
    return useCartStore((state)=>
        state.cartItems.some((item)=>item.id===productId)
    );
}