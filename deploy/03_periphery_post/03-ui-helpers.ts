import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS, MARKET_NAME} from "../../helpers/env";
import {
  chainlinkAggregatorProxy,
  chainlinkEthUsdAggregatorProxy,
} from "../../helpers/constants";
import { eNetwork, TESTNET_PRICE_AGGR_PREFIX } from "../../helpers";
import { verify } from "../../helpers/verify";
import {
  ConfigNames,
  loadPoolConfig,
} from "./../../helpers/market-config-helpers";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const network = (
    process.env.FORK ? process.env.FORK : hre.network.name
  ) as eNetwork;

  const poolConfig = loadPoolConfig(MARKET_NAME as ConfigNames);

  let chainlinkAggregatorProxyAddress;
  let chainlinkEthUsdAggregatorProxyAddress;
  if (hre.network.name =="monad-testnet" || hre.network.name =="hardhat") {
    chainlinkAggregatorProxyAddress = (await deployments.get(`${poolConfig.WrappedNativeTokenSymbol}${TESTNET_PRICE_AGGR_PREFIX}`)).address;
    chainlinkEthUsdAggregatorProxyAddress = (await deployments.get(`${poolConfig.WrappedNativeTokenSymbol}${TESTNET_PRICE_AGGR_PREFIX}`)).address;
  }else {
    chainlinkAggregatorProxyAddress = chainlinkAggregatorProxy[network];
    chainlinkEthUsdAggregatorProxyAddress = chainlinkEthUsdAggregatorProxy[network];
  }
  console.log("chainlinkAggregatorProxyAddress", chainlinkAggregatorProxyAddress);
  console.log("chainlinkEthUsdAggregatorProxyAddress", chainlinkEthUsdAggregatorProxyAddress);

  // if (!chainlinkAggregatorProxy[network]) {
  //   console.log(
  //     '[Deployments] Skipping the deployment of UiPoolDataProvider due missing constant "chainlinkAggregatorProxy" configuration at ./helpers/constants.ts'
  //   );
  //   return;
  // }

  // Deploy UiIncentiveDataProvider getter helper
  const uiIncentiveDataProviderV3 = await deploy("UiIncentiveDataProviderV3", {
    from: deployer,
  });
  await verify(uiIncentiveDataProviderV3.address, [], hre.network.name);


  // Deploy UiPoolDataProvider getter helper
  const uiPoolDataProviderV3 = await deploy("UiPoolDataProviderV3", {
    from: deployer,
    args: [
      chainlinkAggregatorProxyAddress,
      chainlinkEthUsdAggregatorProxyAddress,
    ],
    ...COMMON_DEPLOY_PARAMS,
  });
  await verify(uiPoolDataProviderV3.address, [
    chainlinkAggregatorProxyAddress,
    chainlinkEthUsdAggregatorProxyAddress,
  ], hre.network.name);
};

func.tags = ["periphery-post", "ui-helpers"];

export default func;
