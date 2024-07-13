import {getDeadmanSwitch, getDeadmanSwitchValidatorMockSignature} from "@rhinestone/module-sdk";
import { privateKeyToAccount } from "viem/accounts";
import {pimlicoBundlerClient, publicClient, safeAccount, smartAccountClient} from "./smart-account.js";
import {abi} from "./abi.js";
import {encodePacked} from "viem";

const beneficiary = privateKeyToAccount("0x1b1bccdc91b3e3ef7252ad94bbbfe5fb749072fe863981efba7c727dffa1cc9f");
const timeout = 100; //in seconds

async function installModule({smartClient, beneficiary, timeout, moduleType, hook, account, bundlerClient, moduleAddress}) {
    const isInitialized = (await smartClient.readContract({
        address: moduleAddress,
        abi,
        functionName: 'isInitialized',
        args: [account.address],
    }))

    const module = {
        module: "<module contract address>",
        initData: isInitialized
            ? '0x'
            : encodePacked(['address', 'uint48'], [beneficiary, timeout]),
        deInitData: '0x',
        additionalContext: '0x',
        type: moduleType,
        hook,
    }


    const opHash = await smartClient.installModule({
        type: module.type,
        address: module.module,
        context: module.initData,
    });

    const receipt = await bundlerClient.waitForUserOperationReceipt({ hash: userOpHash })
}

installModule({
    smartClient: smartAccountClient,
    beneficiary,
    timeout,
    moduleType: "validator",
    hook: '0x',
    account: safeAccount,
    bundlerClient: pimlicoBundlerClient,
    moduleAddress: "<module contract address>"
})
