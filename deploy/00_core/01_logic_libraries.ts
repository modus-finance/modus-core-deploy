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

  const supplyLogicArtifact = await deploy("SupplyLogic", {
    from: deployer,
    args: [],
    ...COMMON_DEPLOY_PARAMS,
  });

  await verify(supplyLogicArtifact.address, [], hre.network.name);

  const borrowLogicArtifact = await deploy("BorrowLogic", {
    from: deployer,
    args: [],
    ...COMMON_DEPLOY_PARAMS,
  });
  await verify(borrowLogicArtifact.address, [], hre.network.name);

  const liquidationLogicArtifact = await deploy("LiquidationLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });

  await verify(liquidationLogicArtifact.address, [], hre.network.name);

  const eModeLogicArtifact = await deploy("EModeLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });
  await verify(eModeLogicArtifact.address, [], hre.network.name);

  const bridgeLogicArtifact = await deploy("BridgeLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });
  await verify(bridgeLogicArtifact.address, [], hre.network.name);

  const configuratorLogicArtifact = await deploy("ConfiguratorLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });
  await verify(configuratorLogicArtifact.address, [], hre.network.name);

  const flashLoanLogicArtifact = await deploy("FlashLoanLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
    libraries: {
      BorrowLogic: borrowLogicArtifact.address,
    },
  });
  await verify(flashLoanLogicArtifact.address, [], hre.network.name);

  const poolLogicArtifact =await deploy("PoolLogic", {
    from: deployer,
    ...COMMON_DEPLOY_PARAMS,
  });
  await verify(poolLogicArtifact.address, [], hre.network.name);

  return true;
};

func.id = "LogicLibraries";
func.tags = ["core", "logic"];

export default func;
