import * as hre from 'hardhat';

export async function verify(address: string, constructorArguments: any[],networkName:string) {

  if (networkName === "hardhat" || networkName === "localhost") {
    console.log(`Current network is "${networkName}", skip verification flag`);
    return;
  }

  try {
    console.log(`verifying contract at address: ${address}...`);
    await hre.run("verify:verify", {
      address,
      constructorArguments,
      noCompile: true, 
    });
    console.log(`contract verified: ${address}`);
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log(`contract already verified: ${address}`);
    } else {
      console.error(`contract verification failed for address: ${address}`);
      console.error(error);
    }
  }
}