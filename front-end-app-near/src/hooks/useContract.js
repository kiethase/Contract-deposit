// import { connect, Contract, keyStores, WalletConnection } from "near-api-js";
// import { useNear } from "./useNear";

// const UseContract = () => {
//   const { getNear } = useNear();
//   const getContract = async (config) => {
//     const contract = new Contract(getNear.account(), "kei13.testnet", {
//       // View methods are read only. They don't modify the state, but usually return some value.
//       viewMethods: ["get_deposits"],
//       // Change methods can modify the state. But you don't receive the returned value when called.
//       changeMethods: ["new", "create_new_pool", "add_liquidity"],
//     });
//   };

// //   const getToken = async () => {};
// //   return { contract, token };
// };

// export default UseContract;
