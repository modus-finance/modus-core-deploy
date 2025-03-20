import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { verify } from "../../helpers/verify";

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const walletBalanceProvider = await deploy("WalletBalanceProvider", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });
  await verify(walletBalanceProvider.address, [], hre.network.name);
};

func.tags = ["periphery-post", "walletProvider"];

export default func;
