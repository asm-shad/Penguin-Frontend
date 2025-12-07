import NoAccess from "@/components/modules/Cart/NoAccess";
import WishListProducts from "@/components/modules/Cart/WishListProducts";
import { getUserInfo } from "@/services/auth/getUserInfo";

const WishListPage = async () => {
  const user = await getUserInfo();
  
  // Check if user is authenticated (has an ID and email)
  const isAuthenticated = user && user.id && user.email;
  
  return (
    <>
      {isAuthenticated ? (
        <WishListProducts />
      ) : (
        <NoAccess details="Log in to view your wishlist items. Don't miss out on your cart products to make the payment!" />
      )}
    </>
  );
};

export default WishListPage;