import { POOL_ADMIN } from "./../../helpers/constants";
import { getProxyImplementationBySlot } from "./../../helpers/utilities/tx";
import { getFirstSigner } from "./../../helpers/utilities/signer";
import { eNetwork } from "./../../helpers/types";
import { MARKET_NAME } from "./../../helpers/env";
import {
  loadPoolConfig,
  getParamPerNetwork,
  isTestnetMarket,
} from "./../../helpers/market-config-helpers";
import { ZERO_ADDRESS } from "../../helpers/constants";
import {
  TREASURY_CONTROLLER_ID,
  TREASURY_IMPL_ID,
} from "../../helpers/deploy-ids";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { COMMON_DEPLOY_PARAMS } from "../../helpers/env";
import { TREASURY_PROXY_ID } from "../../helpers/deploy-ids";
import {
  InitializableAdminUpgradeabilityProxy,
  waitForTx,
} from "../../helpers";
import {
  AaveEcosystemReserveController__factory,
  AaveEcosystemReserveV2,
  AaveEcosystemReserveV2__factory,
  InitializableAdminUpgradeabilityProxy__factory,
} from "../../typechain";
import { getAddress } from "ethers/lib/utils";
import { verify } from "../../helpers/verify";

/**
 * @notice A treasury proxy can be deployed per network or per market.
 * You need to take care to upgrade this proxy to the desired implementation.
 */

const func: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  ...hre
}: HardhatRuntimeEnvironment) {
  const { deploy, save } = deployments;
  const { deployer } = await getNamedAccounts();
  const { ReserveFactorTreasuryAddress } = await loadPoolConfig(MARKET_NAME);

  const network = (process.env.FORK || hre.network.name) as eNetwork;
  const treasuryAddress = getParamPerNetwork(
    ReserveFactorTreasuryAddress,
    network
  );
  let treasuryOwner = POOL_ADMIN[network];

  if (isTestnetMarket(await loadPoolConfig(MARKET_NAME))) {
    treasuryOwner = deployer;
  }

  if (treasuryAddress && getAddress(treasuryAddress) !== ZERO_ADDRESS) {
    const treasuryContract = await AaveEcosystemReserveV2__factory.connect(
      treasuryAddress,
      await getFirstSigner()
    );
    const controller = await treasuryContract.getFundsAdmin();
    const impl = await getProxyImplementationBySlot(treasuryAddress);

    await save(TREASURY_PROXY_ID, {
      address: treasuryAddress,
      abi: InitializableAdminUpgradeabilityProxy__factory.abi as any,
    });
    await save(TREASURY_CONTROLLER_ID, {
      address: controller,
      abi: AaveEcosystemReserveController__factory.abi as any,
    });
    await save(TREASURY_IMPL_ID, {
      address: impl,
      abi: AaveEcosystemReserveV2__factory.abi as any,
    });

    return true;
  }

  // Deploy Treasury proxy
  const treasuryProxyArtifact = await deploy(TREASURY_PROXY_ID, {
    from: deployer,
    contract: "InitializableAdminUpgradeabilityProxy",
    args: [],
  });
  await verify(treasuryProxyArtifact.address, [], hre.network.name);

  // Deploy Treasury Controller
  const treasuryController = await deploy(TREASURY_CONTROLLER_ID, {
    from: deployer,
    contract: "AaveEcosystemReserveController",
    args: [treasuryOwner],
    ...COMMON_DEPLOY_PARAMS,
  });
  console.log("Treasury Controller arg", treasuryOwner);
  await verify(treasuryController.address, [treasuryOwner], hre.network.name);


  // Deploy Treasury implementation and initialize proxy
  const treasuryImplArtifact = await deploy(TREASURY_IMPL_ID, {
    from: deployer,
    contract: "AaveEcosystemReserveV2",
    args: [],
    ...COMMON_DEPLOY_PARAMS,
  });
  await verify(treasuryImplArtifact.address, [], hre.network.name);


  const treasuryImpl = (await hre.ethers.getContractAt(
    treasuryImplArtifact.abi,
    treasuryImplArtifact.address
  )) as AaveEcosystemReserveV2;

  // Call to initialize at implementation contract to prevent other calls.
  await waitForTx(await treasuryImpl.initialize(ZERO_ADDRESS));

  // Initialize proxy
  const proxy = (await hre.ethers.getContractAt(
    treasuryProxyArtifact.abi,
    treasuryProxyArtifact.address
  )) as InitializableAdminUpgradeabilityProxy;

  const initializePayload = treasuryImpl.interface.encodeFunctionData(
    "initialize",
    [treasuryController.address]
  );

  await waitForTx(
    await proxy["initialize(address,address,bytes)"](
      treasuryImplArtifact.address,
      treasuryOwner,
      initializePayload
    )
  );

  return true;
};

func.tags = ["periphery-pre", "TreasuryProxy"];
func.dependencies = [];
func.id = "Treasury";

export default func;
