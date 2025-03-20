import {
  isTestnetMarket,
  loadPoolConfig,
} from "./../helpers/market-config-helpers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MARKET_NAME } from "../helpers/env";
import { getPoolConfiguratorProxy, waitForTx, getAaveOracle, 
  getMintableERC20, getMockAggregator, TESTNET_PRICE_AGGR_PREFIX, 
  TESTNET_TOKEN_PREFIX, ATOKEN_PREFIX} from "../helpers";

/**
 * The following script runs after the deployment starts
 */

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  console.log("=== Post deployment hook ===");
  const poolConfig = loadPoolConfig(MARKET_NAME);

  console.log("- Enable stable borrow in selected assets");
  await hre.run("review-stable-borrow", { fix: true, vvv: true });

  console.log("- Review rate strategies");
  await hre.run("review-rate-strategies");

  console.log("- Setup Debt Ceiling");
  await hre.run("setup-debt-ceiling");

  console.log("- Setup Borrowable assets in Isolation Mode");
  await hre.run("setup-isolation-mode");

  console.log("- Setup E-Modes");
  await hre.run("setup-e-modes");

  console.log("- Setup Liquidation protocol fee");
  await hre.run("setup-liquidation-protocol-fee");

  if (isTestnetMarket(poolConfig)) {
    // Disable faucet minting and borrowing of wrapped native token
    await hre.run("disable-faucet-native-testnets");
    console.log("- Minting and borrowing of wrapped native token disabled");

    // Unpause pool
    const poolConfigurator = await getPoolConfiguratorProxy();
    await waitForTx(await poolConfigurator.setPoolPause(false));
    console.log("- Pool unpaused and accepting deposits.");

    const aaveOracle = await getAaveOracle();
    const daiToken = await getMintableERC20((await deployments.get(`DAI${TESTNET_TOKEN_PREFIX}`)).address);
    const daiAggregator = await getMockAggregator((await deployments.get(`DAI${TESTNET_PRICE_AGGR_PREFIX}`)).address);
    const nativeToken = await getMintableERC20((await deployments.get(`${poolConfig.WrappedNativeTokenSymbol}${TESTNET_TOKEN_PREFIX}`)).address);
    const daiAToken = await getMintableERC20((await deployments.get(`DAI${ATOKEN_PREFIX}`)).address);
    const decimal = await daiAToken.decimals();
    console.log("daiAToken decimal:",decimal);

    console.log("dai price",daiToken.address);
    console.log("aaveOracle address", aaveOracle.address)
    console.log("dai price before",await aaveOracle.getAssetPrice(daiToken.address));
    console.log("native token  price",await aaveOracle.getAssetPrice(nativeToken.address));
    // await daiAggregator.updatePrice("130000000");
    // console.log("dai price after",await aaveOracle.getAssetPrice(daiToken.address));

  }

  if (process.env.TRANSFER_OWNERSHIP === "true") {
    await hre.run("transfer-protocol-ownership");
    await hre.run("renounce-pool-admin");
    await hre.run("view-protocol-roles");
  }

  await hre.run("print-deployments");
};

func.tags = ["after-deploy"];
func.runAtTheEnd = true;
export default func;
