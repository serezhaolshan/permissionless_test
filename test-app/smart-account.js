import {
    ENTRYPOINT_ADDRESS_V07,
    createSmartAccountClient,
} from "permissionless";
import { signerToSafeSmartAccount } from "permissionless/accounts";
import {
    createPimlicoBundlerClient,
} from "permissionless/clients/pimlico";
import { createPublicClient, getContract, http, parseEther } from "viem";
import { sepolia } from "viem/chains";
import { privateKeyToAccount } from "viem/accounts";
import {erc7579Actions} from "permissionless/actions/erc7579.js";
import {pimlicoPaymasterActions} from "permissionless/actions/pimlico";

export const apiKey = ""

const privateKey = ""

export const bundlerUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`

const signer = privateKeyToAccount(privateKey);


export const publicClient = createPublicClient({
    transport: http("https://rpc.ankr.com/eth_sepolia"),
})

export const pimlicoBundlerClient = createPimlicoBundlerClient({
    transport: http(bundlerUrl),
    entryPoint: ENTRYPOINT_ADDRESS_V07,
}).extend(pimlicoPaymasterActions(ENTRYPOINT_ADDRESS_V07));

export const safeAccount = await signerToSafeSmartAccount(publicClient, {
    signer,
    safeVersion: "1.4.1",
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    safe4337ModuleAddress: "0x3Fdb5BC686e861480ef99A6E3FaAe03c0b9F32e2",
    erc7579LaunchpadAddress: "0xEBe001b3D534B9B6E2500FB78E67a1A137f561CE",
})

export const smartAccountClient = createSmartAccountClient({
    account: safeAccount,
    entryPoint: ENTRYPOINT_ADDRESS_V07,
    chain: sepolia,
    bundlerTransport: http(bundlerUrl),
    middleware: {
        gasPrice: async () => {
            return (await pimlicoBundlerClient.getUserOperationGasPrice()).fast
        },
        sponsorUserOperation: pimlicoBundlerClient.sponsorUserOperation

    },
}).extend(erc7579Actions({ entryPoint: ENTRYPOINT_ADDRESS_V07 }))
